---
n: 41
title: "Atención a clientes por WhatsApp con IA: arquitectura real"
slug: "whatsapp-business-api-ia-atencion-clientes"
description: "Cómo montar atención al cliente por WhatsApp con IA: WhatsApp Business API, plantillas, ventana de 24 horas y escalamiento a humano."
category: "Automatización"
keyword: "whatsapp business api ia"
tipo: "satelite"
tags: ["whatsapp","atención a clientes","ia","integraciones"]
---


**WhatsApp es el canal donde te escriben tus clientes en México y LATAM, y automatizarlo bien exige entender tres reglas de la plataforma que definen toda la arquitectura: la ventana de 24 horas, las plantillas aprobadas y la calificación de calidad.**

Ignorar cualquiera de las tres es cómo terminan las cuentas bloqueadas.

---

### Las tres reglas que definen el diseño

**1. La ventana de servicio de 24 horas.**
Cuando un usuario te escribe, se abre una ventana durante la cual puedes responderle con mensajes libres. Fuera de esa ventana, **solo puedes iniciar conversación con una plantilla previamente aprobada**. No hay forma de rodear esto.

Consecuencia de arquitectura: tu sistema debe saber en todo momento si la ventana está abierta para cada contacto, y decidir el tipo de mensaje en función de eso.

**2. Plantillas aprobadas para mensajes iniciados por el negocio.**
Cada plantilla se envía a revisión y puede tardar. Se clasifican por categoría —utilidad, marketing, autenticación— y la categoría afecta el costo y las restricciones.

Consecuencia: planea tus plantillas con semanas de anticipación. Descubrir que necesitas una plantilla el día del lanzamiento es un retraso garantizado.

**3. Calificación de calidad.**
Si los usuarios bloquean o reportan tus mensajes, tu calificación baja. Si baja demasiado, se reducen tus límites de envío y eventualmente se restringe el número.

Consecuencia: **la calidad no es una métrica de marketing, es un límite operativo.** Un envío masivo mal segmentado puede dejarte sin canal.

---

### La arquitectura

```
Usuario escribe por WhatsApp
        ↓
[Webhook] → recibe y responde 200 INMEDIATAMENTE
        ↓
[Cola] → procesa de forma asíncrona
        ↓
[Identificación] → ¿contacto conocido? ¿conversación en curso?
        ↓
[Clasificador] → intención, urgencia, sentimiento
        ↓
[¿Escalar a humano?] ── sí ──→ [Bandeja de agentes] + notificación
        ↓ no
[Generador con RAG] → respuesta con catálogo/políticas propias
        ↓
[Envío] → registro en CRM + actualización de ventana
```

**El detalle que rompe implementaciones:** el webhook debe responder con éxito en pocos segundos. Si procesas la respuesta de IA dentro del webhook, la plataforma considera que fallaste y reintenta, generando mensajes duplicados. Recibe, encola, responde, y procesa aparte.

---

### Idempotencia: obligatoria, no opcional

Los webhooks se reintentan. Vas a recibir el mismo mensaje más de una vez.

```ts
export async function POST(req: Request) {
  const cuerpo = await req.json()
  const mensaje = extraerMensaje(cuerpo)

  if (mensaje) {
    // Clave única del mensaje: si ya existe, se ignora
    await db.mensajeRecibido.upsert({
      where: { wamid: mensaje.id },
      create: { wamid: mensaje.id, payload: cuerpo, estado: 'pendiente' },
      update: {},   // Ya procesado: no hacer nada
    })

    await cola.enviar({ nombre: 'whatsapp/mensaje', datos: { wamid: mensaje.id } })
  }

  return new Response('OK', { status: 200 })
}
```

Sin esto, un cliente recibe la misma respuesta tres veces y tu calificación de calidad sufre.

---

### Cuándo escalar a un humano

Estas condiciones deben estar codificadas, no dejadas al criterio del modelo:

- **Petición explícita.** "Quiero hablar con una persona" se respeta de inmediato, sin insistir ni intentar retener.
- **Intención de compra clara.** No dejes que un bot cierre una venta consultiva.
- **Frustración detectada.** Repetición de la misma pregunta, mayúsculas, groserías.
- **Reclamación formal o mención de temas legales.**
- **Tres turnos sin resolver.** Se acabó el intento.
- **Fuera de la base de conocimiento.** Si la respuesta no está en tus documentos, no la inventes: escala.

Y el traspaso debe ser limpio: el agente humano recibe el historial completo, no empieza preguntando "¿en qué le puedo ayudar?".

---

### Manejo de la ventana de 24 horas

```ts
async function responder(contactoId: string, texto: string) {
  const ventana = await obtenerVentana(contactoId)

  if (ventana.abierta) {
    return enviarMensajeLibre(contactoId, texto)
  }

  // Fuera de ventana: solo plantilla aprobada
  return enviarPlantilla(contactoId, 'seguimiento_conversacion', {
    parametros: [nombreContacto],
  })
}
```

**Diseña tus plantillas pensando en reabrir conversación**, no en vender. Una plantilla de utilidad que informa del estado de un trámite tiene mucho mejor recepción —y mejor efecto sobre tu calidad— que una promocional.

---

### Cumplimiento: la parte que no puedes saltarte

**Consentimiento previo.** Necesitas que el usuario haya aceptado recibir mensajes por este canal, con registro de cuándo y cómo lo dio. Esto es requisito de la plataforma y también obligación bajo la normativa mexicana de protección de datos.

**Aviso de privacidad.** Debe declarar el tratamiento de datos por este canal y las finalidades reales.

**Baja simple.** Un mecanismo claro para dejar de recibir mensajes, respetado de inmediato. Ignorar una baja es la vía rápida a los reportes.

**Declarar que es un asistente automatizado.** No finjas ser humano. Se descubre siempre y destruye la confianza.

**Retención de conversaciones.** Define cuánto tiempo guardas los mensajes y por qué. Los historiales de WhatsApp contienen datos personales.

---

### Métricas que importan

| Métrica | Por qué importa |
|---|---|
| Tiempo hasta primera respuesta útil | No solo hasta primera respuesta |
| Tasa de escalamiento | Muy baja puede significar que estás atrapando gente |
| Calificación de calidad | Es un límite operativo, vigílala a diario |
| Tasa de bloqueo y reporte | Señal temprana de que algo va mal |
| Leads calificados por cada 100 conversaciones | La métrica de negocio real |
| Tasa de resolución sin escalar, **medida por satisfacción posterior** | No basta con no escalar: hay que resolver |

---

### Errores frecuentes

**Enviar promociones masivas sin segmentar.** El camino más rápido a perder el número.

**Procesar la IA dentro del webhook.** Mensajes duplicados garantizados.

**No manejar los estados de entrega.** Necesitas saber si el mensaje se entregó, se leyó o falló.

**Un solo número para todo.** Si mezclas soporte, ventas y cobranza en el mismo número, el volumen de reportes de un área afecta a las demás.

**No probar el flujo de baja.** Es el que más rápido genera reportes si falla.

---

### Preguntas frecuentes

**¿Puedo usar WhatsApp Business normal en vez de la API?**
Para volúmenes pequeños y atención manual, sí. Para automatización, integración con sistemas y varios agentes, necesitas la API.

**¿Cuánto cuesta?**
Se cobra por conversación, con precios distintos según la categoría y el país. Verifica las tarifas vigentes: cambian con cierta frecuencia.

**¿Cuánto tarda montarlo?**
De 4 a 10 semanas: verificación de negocio, aprobación de plantillas, desarrollo e integración con tus sistemas. La verificación y las aprobaciones son el camino crítico, no el código.
