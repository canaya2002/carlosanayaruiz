---
n: 70
title: "Stripe y RevenueCat: cobros en web y móvil sin dolor"
slug: "stripe-revenuecat-cobros-web-movil"
description: "Cómo combinar Stripe en web y RevenueCat en móvil para un solo estado de suscripción, con manejo de webhooks y reconciliación."
category: "SaaS"
keyword: "stripe vs revenuecat"
tipo: "satelite"
tags: ["stripe","revenuecat","suscripciones","pagos"]
---


**No compiten: resuelven problemas distintos.** Stripe procesa pagos en web. RevenueCat gestiona las compras dentro de la aplicación en iOS y Android, que obligatoriamente pasan por las tiendas.

Si tu producto está en ambos canales, vas a usar los dos. Y el problema real no es integrarlos: es que tu aplicación tenga **un solo estado de suscripción** sin importar por dónde pagó el usuario.

---

### Por qué necesitas los dos

En web puedes cobrar directamente con Stripe. Comisión razonable, control total del flujo, cobros recurrentes gestionados.

En aplicaciones móviles, si vendes contenido o funcionalidad digital consumida dentro de la app, las políticas de las tiendas exigen usar su sistema de compras. La comisión es sustancialmente mayor y la implementación es notoriamente compleja: recibos, renovaciones, periodos de gracia, reembolsos, cambios de plan, y dos plataformas con comportamientos distintos.

RevenueCat existe para abstraer esa complejidad. No cobra en lugar de las tiendas: se sitúa encima y te da una API unificada más el estado de suscripción normalizado.

---

### La arquitectura correcta

El principio central: **tu base de datos es la fuente de verdad del acceso, no el proveedor de pagos.**

```
[Stripe]        →  webhook  →┐
                              ├→ [Tu backend] → tabla `suscripciones`
[RevenueCat]    →  webhook  →┘                        ↓
                                              [Tu aplicación consulta
                                               solo tu tabla]
```

Tu aplicación nunca pregunta a Stripe si el usuario tiene acceso. Pregunta a tu propia tabla, que se mantiene actualizada por webhooks.

Razones:
- Latencia: una consulta local es inmediata
- Disponibilidad: si el proveedor tiene una caída, tu producto sigue funcionando
- Unificación: un solo lugar donde vive el estado, sin importar el canal

---

### El modelo de datos

```sql
CREATE TABLE suscripciones (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organizacion_id   uuid NOT NULL REFERENCES organizaciones(id),
  proveedor         text NOT NULL,     -- 'stripe' | 'revenuecat'
  id_externo        text NOT NULL,     -- id de la suscripción en el proveedor
  plan              text NOT NULL,
  estado            text NOT NULL,     -- 'activa'|'periodo_gracia'|'cancelada'|'vencida'
  periodo_fin       timestamptz NOT NULL,
  cancela_al_final  boolean DEFAULT false,
  actualizado_en    timestamptz DEFAULT now(),
  UNIQUE (proveedor, id_externo)
);

CREATE INDEX ON suscripciones (organizacion_id, estado);
```

Y una función única para consultar acceso:

```ts
export async function tieneAcceso(orgId: string, funcionalidad: string) {
  const sus = await db.suscripcion.findFirst({
    where: {
      organizacionId: orgId,
      estado: { in: ['activa', 'periodo_gracia'] },
      periodoFin: { gt: new Date() },
    },
  })

  if (!sus) return false
  return PLANES[sus.plan].incluye(funcionalidad)
}
```

**Una sola función de verificación en todo el código.** Si la comprobación de acceso está dispersa en veinte lugares, tarde o temprano uno queda desactualizado y regalas funcionalidad de pago.

---

### Webhooks: donde se rompe todo

**Regla 1 — Verifica la firma.** Siempre. Un webhook sin verificar es un endpoint donde cualquiera puede declararse suscriptor.

```ts
export async function POST(req: Request) {
  const cuerpo = await req.text()      // Texto crudo, no JSON parseado
  const firma = req.headers.get('stripe-signature')!

  let evento
  try {
    evento = stripe.webhooks.constructEvent(cuerpo, firma, SECRETO_WEBHOOK)
  } catch {
    return new Response('Firma inválida', { status: 400 })
  }
  // ...
}
```

**Regla 2 — Idempotencia.** Los webhooks se reintentan y llegan duplicados. Guarda el identificador del evento y descarta los repetidos.

```ts
const yaProcesado = await db.eventoWebhook.findUnique({
  where: { proveedorId: `stripe:${evento.id}` },
})
if (yaProcesado) return new Response('OK', { status: 200 })
```

**Regla 3 — Responde rápido, procesa después.** Devuelve 200 en cuanto guardes el evento y procésalo en una cola. Si tardas en responder, el proveedor considera fallo y reintenta.

**Regla 4 — Los eventos pueden llegar desordenados.** No asumas que "suscripción actualizada" llega después de "suscripción creada". Usa la marca de tiempo del evento y descarta los más antiguos que tu estado actual.

**Regla 5 — Maneja los estados intermedios.** Un pago fallido no es una cancelación inmediata: hay periodo de gracia y reintentos. Si cortas el acceso al primer fallo, pierdes clientes que solo necesitaban actualizar su tarjeta.

---

### Los eventos que importan

**De Stripe:**
- Sesión de pago completada → activar
- Suscripción creada, actualizada, eliminada → sincronizar estado
- Pago de factura fallido → periodo de gracia y notificar
- Prueba a punto de terminar → recordatorio al usuario

**De RevenueCat:** su webhook unificado emite eventos normalizados de compra inicial, renovación, cancelación, cambio de producto, entrada en periodo de gracia y reembolso, sin que tengas que interpretar los formatos de cada tienda por separado.

---

### El caso incómodo: el mismo usuario paga dos veces

Ocurre. Un usuario se suscribe en web, después descarga la app y se suscribe otra vez porque no encontró cómo iniciar sesión.

**Cómo prevenirlo:**
- Al abrir la app, verifica primero si ya hay suscripción activa asociada a ese usuario antes de mostrar el muro de pago.
- Vincula la identidad entre plataformas: el identificador de usuario de tu sistema se pasa a ambos proveedores.
- Si detectas doble suscripción, notifica al usuario y ayúdalo a cancelar la duplicada. Que lo descubra él en su estado de cuenta es un reembolso y una mala reseña.

---

### Reconciliación

Los webhooks fallan. Un endpoint caído, un despliegue en mal momento, un error no capturado. Necesitas un proceso de reconciliación.

**Trabajo diario:** consulta el estado de las suscripciones activas en cada proveedor y compáralo con tu tabla. Corrige discrepancias y alerta si hay muchas.

Es aburrido y es lo que evita que un cliente pierda acceso porque se perdió un webhook, o que alguien mantenga acceso después de cancelar.

---

### Errores frecuentes

**Consultar al proveedor en cada verificación de acceso.** Lento y frágil.

**No manejar reembolsos.** Un reembolso debe revocar acceso.

**No probar con transacciones reales.** El modo de prueba no cubre todo. Haz al menos una compra real y un reembolso real antes de lanzar.

**Olvidar los impuestos.** Según dónde vendas, puede haber obligaciones de recaudación. Los proveedores ofrecen soluciones de cálculo de impuestos; evalúalas antes de que sea un problema.

**No guardar el histórico de eventos.** Cuando haya una disputa, el registro completo de qué pasó y cuándo es tu evidencia.

---

### Preguntas frecuentes

**¿Necesito RevenueCat o implemento las compras directo?**
Puedes implementarlo directo, pero es notablemente más trabajo del que parece: recibos, validación, renovaciones, dos plataformas con comportamientos distintos. Para la mayoría de los equipos, la abstracción vale su costo.

**¿Puedo cobrar solo con Stripe y no tener app?**
Sí, y es lo más simple. Si tu producto funciona bien en web, evitas toda esta complejidad y la comisión de las tiendas.

**¿Qué pasa si el usuario cancela en la tienda?**
Recibes el evento correspondiente. El acceso se mantiene hasta el fin del periodo pagado y después expira. No cortes al recibir la cancelación.
