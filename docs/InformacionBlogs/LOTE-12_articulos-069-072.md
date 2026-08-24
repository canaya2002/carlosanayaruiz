# LOTE 12 — ARTÍCULOS COMPLETOS 069–072
**Autor:** Carlos Anaya Ruiz · Listos para publicar

---
---

# ARTÍCULO 069

```yaml
title: "Arquitectura multi-tenant: cuál elegir"
slug: "arquitectura-multi-tenant-saas"
description: "Las 3 arquitecturas multi-tenant comparadas en aislamiento, costo y complejidad operativa, con la que conviene según tu tipo de cliente."
author: "Carlos Anaya Ruiz"
category: "SaaS"
tags: ["multi-tenant", "arquitectura", "saas", "base de datos"]
keyword_principal: "arquitectura multi tenant"
```

## Arquitectura multi-tenant: cuál elegir

**Multi-tenant significa que varios clientes comparten la misma instancia de tu aplicación.** La decisión de cuánto comparten —y dónde se traza la frontera de aislamiento— determina tu costo, tu complejidad operativa y tu capacidad de vender a clientes con requisitos estrictos.

Y es una decisión difícil de cambiar después.

---

### Las tres arquitecturas

**1. Base de datos compartida, esquema compartido.**
Todos los clientes en las mismas tablas, separados por una columna de identificador de organización.

**2. Base de datos compartida, esquema por cliente.**
Una instancia de base de datos, pero cada cliente tiene su propio esquema con sus propias tablas.

**3. Base de datos por cliente.**
Cada cliente tiene su propia base de datos, o incluso su propia infraestructura completa.

---

### La comparación

| Dimensión | Esquema compartido | Esquema por cliente | Base por cliente |
|---|---|---|---|
| Aislamiento de datos | Lógico | Fuerte | Máximo |
| Costo por cliente | El más bajo | Bajo-medio | Alto |
| Complejidad de migraciones | Baja | Media | Alta |
| Consultas entre clientes | Trivial | Complicada | Muy complicada |
| Riesgo de fuga entre clientes | **Alto si hay error** | Bajo | Casi nulo |
| Restaurar un solo cliente | Difícil | Media | Trivial |
| Límite práctico de clientes | Miles | Cientos | Decenas o cientos |
| Personalización por cliente | Difícil | Posible | Total |

---

### Esquema compartido: la opción por defecto

**Cuándo elegirla:** productos con muchos clientes de tamaño pequeño y mediano, sin requisitos regulatorios de aislamiento físico. Es lo correcto para la mayoría de los SaaS.

**Ventaja decisiva:** el costo por cliente tiende a cero. Un cliente adicional es una fila más.

**Riesgo decisivo:** una consulta sin el filtro correcto expone datos de un cliente a otro. Es el incidente más grave que puede tener un SaaS multi-tenant, y ha terminado con empresas.

**Cómo mitigarlo correctamente:** no confíes en que cada consulta incluya el filtro. Mueve la decisión a la base de datos con seguridad a nivel de fila.

```sql
ALTER TABLE proyectos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "aislamiento por organización"
ON proyectos
USING (organizacion_id IN (SELECT mis_organizaciones()));
```

Con eso, aunque un desarrollador olvide el `WHERE`, la base de datos filtra. Es la diferencia entre depender de la disciplina del equipo y depender del motor.

**Y prueba el aislamiento explícitamente.** Toda tabla nueva necesita una prueba automatizada que confirme que el cliente A no ve datos del cliente B. Es la prueba de seguridad con mejor retorno que puedes escribir.

---

### Esquema por cliente: el punto medio

**Cuándo elegirla:** clientes de tamaño medio-grande, número moderado (decenas a bajos cientos), necesidad de aislamiento demostrable sin el costo de infraestructura separada.

**Ventajas:**
- Aislamiento real: un error de consulta no puede cruzar esquemas
- Restaurar un cliente concreto es factible
- Permite variaciones de estructura por cliente si es necesario

**Costos:**
- Las migraciones se ejecutan N veces. Con 200 esquemas, una migración es un proceso, no un comando.
- El pool de conexiones se complica: hay que cambiar de esquema por petición.
- Las consultas agregadas para tus propios reportes internos requieren recorrer todos los esquemas.

**El punto de dolor real** es la migración. Necesitas un proceso robusto que aplique cambios a todos los esquemas, maneje fallos parciales y sea reintentable.

---

### Base por cliente: aislamiento máximo

**Cuándo elegirla:** pocos clientes grandes, requisitos regulatorios de aislamiento, o exigencia contractual de residencia de datos por cliente.

**Ventajas:**
- Aislamiento máximo, fácil de demostrar en una auditoría
- Un cliente ruidoso no afecta a los demás
- Se puede alojar cada cliente en la región que exija
- Restaurar o exportar un cliente es trivial

**Costos:**
- Costo de infraestructura por cliente, alto
- Operación multiplicada: monitoreo, respaldos, actualizaciones
- No viable con precios bajos

**Regla práctica:** si tu precio por cliente no llega a varios miles de pesos mensuales, esta arquitectura no se sostiene económicamente.

---

### El modelo híbrido

Es lo que hacen muchos productos maduros y suele ser la respuesta correcta a mediano plazo:

- **Clientes pequeños y medianos** en esquema compartido con seguridad a nivel de fila.
- **Clientes empresariales** que lo exigen y lo pagan, en base de datos dedicada.

Requiere que tu aplicación pueda resolver la conexión según el cliente:

```ts
async function obtenerConexion(organizacionId: string) {
  const org = await registro.obtener(organizacionId)

  return org.baseDatosDedicada
    ? poolDedicado(org.cadenaConexion)
    : poolCompartido()
}
```

La clave es que esa lógica esté centralizada desde el inicio, aunque al principio siempre devuelva el pool compartido. Añadir el modelo dedicado después es fácil si la abstracción existe; muy caro si hay que introducirla.

---

### Decisiones que hay que tomar desde el día uno

Estas son difíciles de cambiar después:

**1. Identificador de organización en toda tabla de datos de cliente.** Aunque uses esquema separado. Facilita cualquier migración futura.

**2. Nunca confíes en el identificador enviado por el cliente.** Se deriva siempre de la sesión autenticada.

**3. Un usuario puede pertenecer a varias organizaciones.** Suena a caso raro y ocurre constantemente: consultores, agencias, holdings. Modelarlo después es doloroso.

**4. Identificadores globalmente únicos.** Usa UUID en lugar de enteros autoincrementales. Facilita mover datos entre bases y evita que se pueda enumerar tu base de clientes.

**5. Separación entre datos de plataforma y datos de cliente.** Tu tabla de organizaciones, planes y facturación no es dato de cliente. Manténla separada conceptualmente.

---

### Los errores que causan incidentes

**Filtrar solo en la capa de aplicación.** Un endpoint nuevo sin el filtro y tienes fuga.

**Usar la llave de servicio en el cliente.** Si tu aplicación frontend tiene una credencial que omite las políticas de seguridad, no tienes aislamiento.

**Cachés sin clave de organización.** Un caché compartido cuya clave no incluye el identificador de organización sirve datos de un cliente a otro. Es un error sutil y grave.

**Trabajos en background sin contexto de cliente.** Un proceso programado que procesa "todos los pedidos" sin filtrar puede cruzar datos.

**Archivos sin aislamiento.** Si guardas documentos en almacenamiento de objetos, la ruta debe incluir el identificador de organización y los permisos deben validarse. El aislamiento de la base de datos no protege los archivos.

---

### Preguntas frecuentes

**¿Puedo migrar de esquema compartido a base por cliente después?**
Sí, y es el camino habitual. Por eso conviene tener el identificador de organización en todo desde el inicio: la extracción de un cliente se vuelve una consulta.

**¿Cuántos clientes aguanta el esquema compartido?**
Miles, con índices adecuados sobre la columna de organización. El límite suele ser el volumen de datos, no el número de clientes.

**¿Cómo demuestro aislamiento a un cliente que lo exige?**
Documenta la arquitectura, muestra las políticas de seguridad y las pruebas automatizadas de acceso cruzado, y considera una auditoría externa si el contrato lo justifica.

---

**Escrito por Carlos Anaya Ruiz** — Desarrollador full-stack. Construyo plataformas SaaS multi-tenant sobre Postgres con aislamiento en el motor de datos.

---

### PROMPT DE PORTADA — Artículo 069

> Un edificio tridimensional mostrado en corte transversal donde cada piso es un compartimento completamente sellado e independiente, iluminado en magenta, todos compartiendo una única columna central de servicios que los atraviesa verticalmente. Vista isométrica limpia. Fondo negro carbón, iluminación magenta desde el interior de cada compartimento.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.

---
---

# ARTÍCULO 070

```yaml
title: "Stripe y RevenueCat: cobros en web y móvil sin dolor"
slug: "stripe-revenuecat-cobros-web-movil"
description: "Cómo combinar Stripe en web y RevenueCat en móvil para un solo estado de suscripción, con manejo de webhooks y reconciliación."
author: "Carlos Anaya Ruiz"
category: "SaaS"
tags: ["stripe", "revenuecat", "suscripciones", "pagos"]
keyword_principal: "stripe vs revenuecat"
```

## Stripe y RevenueCat: cobros en web y móvil sin dolor

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

---

**Escrito por Carlos Anaya Ruiz** — Desarrollador full-stack. Implemento suscripciones en web y móvil con estado unificado.

---

### PROMPT DE PORTADA — Artículo 070

> Dos flujos de partículas magenta procedentes de direcciones opuestas convergiendo en un único nodo de reconciliación hecho de cristal facetado, del que sale un solo hilo de luz unificado. Vista frontal simétrica. Fondo negro carbón, iluminación magenta volumétrica, reflejos en el cristal del nodo central.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.

---
---

# ARTÍCULO 071

```yaml
title: "Web2App: cómo cobrar sin la comisión de la App Store"
slug: "web2app-checkout-comision-app-store"
description: "Cómo funciona el flujo web2app para cobrar fuera de la tienda, qué permiten hoy las reglas y cómo medir la conversión."
author: "Carlos Anaya Ruiz"
category: "SaaS"
tags: ["web2app", "monetización", "app store", "conversión"]
keyword_principal: "web2app checkout"
```

## Web2App: cómo cobrar sin la comisión de la App Store

**Web2app es un embudo donde el usuario descubre tu producto en la web, se suscribe en tu propio sitio con tu procesador de pagos, y después descarga la app ya con su cuenta activa.** La comisión de la tienda no aplica porque la transacción nunca ocurre dentro de la app.

Es legítimo. Y también es un terreno con reglas que cambian y que conviene entender bien antes de invertir.

---

### El marco de reglas: qué está permitido

Este es el punto donde más desinformación circula. Los puntos estables:

**1. Vender en tu propio sitio web siempre ha estado permitido.** Nadie te impide tener una web donde la gente se suscriba con tu procesador de pagos.

**2. Lo que ha sido restringido históricamente es promocionar esa alternativa desde dentro de la app.** Enlaces, botones o menciones dirigiendo al pago externo.

**3. Ese punto está en evolución.** Diversas decisiones regulatorias y judiciales en distintos mercados han obligado a las tiendas a permitir enlaces externos en determinadas condiciones, y las reglas específicas varían por región y siguen cambiando.

**4. Las reglas de "reader apps" y ciertas categorías tienen tratamiento particular.**

**Recomendación práctica:** las reglas de las tiendas cambian y difieren por país. **Verifica las directrices vigentes de cada tienda para tu categoría y tu mercado antes de diseñar tu embudo**, y revísalas periódicamente. No construyas una estrategia entera sobre una interpretación que puede quedar obsoleta.

**Lo que es seguro en cualquier escenario:** adquirir usuarios fuera de la app, convertirlos en tu web, y que la app sea el lugar donde consumen el producto ya pagado.

---

### El embudo, paso por paso

```
[Anuncio / contenido / búsqueda]
        ↓
[Página de destino móvil optimizada]
        ↓
[Cuestionario o demostración de valor]   ← el paso que más convierte
        ↓
[Muro de pago web]
        ↓
[Pago con tu procesador]
        ↓
[Creación de cuenta + envío de credenciales]
        ↓
[Descarga de la app]
        ↓
[Inicio de sesión: cuenta ya activa]
```

**El punto de fuga crítico es el último tramo.** Entre pagar y tener la app funcionando hay tres pasos donde se pierde gente: descargar, encontrar cómo iniciar sesión, y recordar la contraseña.

---

### Cómo reducir la fuga post-pago

**1. Enlace directo tras el pago.** Un botón que abre directamente la tienda con el enlace de tu app, no una instrucción de "busca nuestra app".

**2. Enlaces diferidos.** Tecnologías que permiten que, tras instalar, la app sepa de dónde vino el usuario y complete el inicio de sesión automáticamente. Es la solución técnica correcta al problema.

**3. Enlace mágico por correo.** El usuario recibe un correo con un enlace que, al abrirlo desde el móvil con la app instalada, inicia sesión sin contraseña. Elimina el punto de fricción más grande.

**4. Código de acceso corto.** Un código de seis dígitos que se muestra tras el pago y se introduce en la app. Funciona bien y es fácil de implementar.

**5. Recordatorios.** Si a las 24 horas no ha iniciado sesión en la app, un correo. Si a las 72 horas tampoco, otro. Recuperas un porcentaje relevante.

---

### El cuestionario: la pieza que más convierte

Muchos productos de consumo con embudo web2app usan un cuestionario de entre 8 y 15 preguntas antes del muro de pago. Funciona por razones concretas:

- **Personalización percibida.** El resultado se siente hecho para el usuario.
- **Compromiso progresivo.** Quien invirtió dos minutos respondiendo está más dispuesto a pagar.
- **Segmentación.** Puedes ajustar la oferta según las respuestas.
- **Datos.** Aprendes sobre tu audiencia desde antes de que sea cliente.

**Cómo hacerlo bien:**
- Preguntas fáciles y visuales al principio, para generar impulso
- Barra de progreso visible
- El resultado debe sentirse específico, no genérico
- Máximo 15 preguntas; más allá, la fuga se dispara

---

### La economía: haz el cálculo completo

Web2app no es automáticamente mejor. Compara:

**Vía tienda:**
```
Ingreso neto = Precio − Comisión de la tienda
Costo de adquisición: puede ser menor (descubrimiento orgánico en la tienda)
Fricción de compra: mínima (pago con un toque)
```

**Vía web2app:**
```
Ingreso neto = Precio − Comisión del procesador − Costo de la pasarela
Costo de adquisición: mayor (tienes que pagar por el tráfico)
Fricción de compra: mayor (formulario, tarjeta, descarga posterior)
Costo adicional: desarrollo y mantenimiento del embudo
```

**La pregunta correcta:** ¿la comisión que ahorras compensa la conversión que pierdes por fricción más el costo de adquirir el tráfico?

En productos con precio alto y buen margen, normalmente sí. En productos de precio bajo donde el descubrimiento orgánico en la tienda es tu principal canal, muchas veces no.

**Haz el cálculo con tus números reales antes de construir el embudo.**

---

### Qué medir

| Métrica | Por qué importa |
|---|---|
| Conversión de página de destino a inicio del cuestionario | Calidad del tráfico y del mensaje |
| Finalización del cuestionario | Fuga en el compromiso |
| Cuestionario a muro de pago | Calidad de la propuesta |
| Muro de pago a pago completado | Precio y fricción de checkout |
| **Pago a app instalada** | **El tramo más crítico** |
| **App instalada a sesión iniciada** | **El segundo más crítico** |
| Retención a 7 y 30 días | Si el producto entrega lo prometido |
| Tasa de reembolso | Si el embudo prometió de más |

**Esa última métrica es la señal de alarma.** Un embudo optimizado agresivamente puede generar conversión alta y reembolsos altos, lo cual además daña tu relación con el procesador de pagos.

---

### Cumplimiento del checkout

No es solo diseño de conversión. Vender suscripciones en web tiene obligaciones:

- **Precio total claro antes del pago**, incluyendo impuestos aplicables.
- **Renovación automática declarada de forma visible**, con periodicidad e importe. Varios marcos de protección al consumidor exigen consentimiento expreso e informado para la renovación automática.
- **Cancelación fácil.** Debe poder cancelarse con facilidad comparable a la de contratar.
- **Recibo y confirmación** por correo.
- **Aviso de privacidad y términos** accesibles antes de pagar.
- **Patrones oscuros prohibidos.** Casillas premarcadas, cuentas regresivas falsas, botones de cancelar ocultos. Además de ser mala práctica, en varios marcos regulatorios constituyen práctica engañosa.

---

### Preguntas frecuentes

**¿Es esto arriesgado para mi app en las tiendas?**
Vender en tu web no lo es. Lo que puede serlo es cómo lo promocionas dentro de la app. Verifica las reglas vigentes de tu categoría y mercado.

**¿Funciona para B2B?**
Para B2B casi siempre vendes en web de todos modos y la app es un complemento. El embudo web2app tal como se describe aquí es más propio de productos de consumo.

**¿Qué hago si un usuario ya pagó en la tienda y quiere pasar a web?**
No lo fuerces. Mantén ambos caminos y unifica el estado de suscripción en tu backend, sin importar por dónde pagó.

---

**Escrito por Carlos Anaya Ruiz** — Desarrollador full-stack. Diseño embudos de conversión y arquitecturas de suscripción multicanal.

---

### PROMPT DE PORTADA — Artículo 071

> Un puente de luz magenta conectando una plataforma rectangular ancha y horizontal con una plataforma vertical estrecha, pasando por debajo de un arco de peaje oscuro, macizo y completamente apagado. Vista lateral, composición clara. Fondo negro carbón, iluminación magenta que recorre el puente, sombra del arco proyectada.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.

---
---

# ARTÍCULO 072

```yaml
title: "Onboarding de SaaS que reduce el churn"
slug: "onboarding-saas-reducir-churn"
description: "Cómo diseñar un onboarding que lleva al usuario a su primer valor rápido: métricas de activación, patrones que funcionan y los que estorban."
author: "Carlos Anaya Ruiz"
category: "SaaS"
tags: ["onboarding", "activación", "churn", "producto"]
keyword_principal: "onboarding saas"
```

## Onboarding de SaaS que reduce el churn

**El churn no empieza el día que el cliente cancela: empieza la primera semana, cuando no logró obtener valor del producto.** Un usuario que nunca llegó a su primer resultado útil ya está perdido, aunque siga pagando dos meses más.

El onboarding es la parte del producto con mayor impacto en retención y la que menos atención recibe.

---

### Define tu momento de activación

**Antes de diseñar nada, responde:** ¿cuál es la acción concreta después de la cual un usuario tiene muchas más probabilidades de quedarse?

No es "completó el registro". Es algo específico de tu producto:
- Un gestor de proyectos: creó su primer proyecto **e invitó a un compañero**
- Una herramienta de facturación: emitió y envió su primera factura
- Un analizador de datos: conectó una fuente y vio su primer reporte
- Una herramienta de contenido: publicó su primera pieza

**Cómo encontrarlo con datos:** compara el comportamiento de la primera semana entre usuarios que siguen a los 90 días y usuarios que se fueron. La acción que más los separa es tu momento de activación.

Con menos de 100 usuarios no tendrás señal estadística. Usa tu criterio y valídalo después.

---

### La métrica central: tasa de activación

```
Tasa de activación = Usuarios que alcanzaron el momento de activación / Registros totales
```

**Y su compañera: tiempo hasta el primer valor.** Cuántos minutos, horas o días transcurren entre el registro y esa acción.

**Objetivo:** que el tiempo hasta el primer valor se mida en minutos, no en días. Cada hora que pasa sin que el usuario obtenga valor, la probabilidad de que vuelva cae.

---

### Los principios que funcionan

**1. Valor antes que configuración.**

El error más común: pedir que configure todo antes de mostrar nada. El usuario llegó por un resultado, no por un formulario.

Invierte el orden. Muéstrale el resultado con datos de ejemplo o con lo mínimo indispensable, y pide configuración cuando ya vio para qué sirve.

**2. Reduce a lo esencial.**

Cada campo, cada paso y cada clic entre el registro y el primer valor es un punto de fuga. Elimina todo lo que puedas pedir después.

- ¿Necesitas el teléfono ahora? Casi nunca.
- ¿Necesitas el nombre de la empresa? Puede esperar.
- ¿Necesitas verificación de correo antes de entrar? Deja entrar y verifica después.

**3. Elimina la pantalla vacía.**

Un producto recién abierto sin nada dentro es el peor momento de la experiencia. El usuario no sabe qué hacer.

Soluciones, de mejor a peor:
- **Importar datos reales del usuario.** Lo ideal.
- **Generar contenido inicial** basado en lo que sabes de él.
- **Datos de ejemplo claramente marcados** que puede borrar.
- **Estado vacío con una acción única y evidente.** Un botón grande, no seis opciones.

**4. Una sola acción siguiente, siempre clara.**

En cada momento del onboarding debe ser obvio qué hacer ahora. Si hay tres botones del mismo peso visual, la mayoría no hace ninguno.

**5. Progreso visible.**

Una lista de comprobación con tres o cuatro pasos y progreso visual aprovecha el impulso de completar. Funciona bien si los pasos son realmente valiosos, no relleno.

**6. Celebra el primer resultado.**

Cuando el usuario alcanza el momento de activación, reconócelo. Un mensaje que confirme que hizo algo importante, y que le indique el siguiente paso natural.

---

### Onboarding por segmento

No todos tus usuarios buscan lo mismo. Una pregunta al inicio —"¿qué quieres lograr?"— con tres o cuatro opciones te permite ramificar hacia el camino más corto para cada intención.

Es una de las mejoras con mejor retorno y de las menos implementadas.

---

### Los patrones que estorban

**Recorridos guiados de doce pasos.** Nadie los lee. La gente cierra el modal y se queda igual de perdida, pero ahora además molesta.

**Videos obligatorios.** Si tu producto necesita un video de cinco minutos para entenderse, el problema está en el producto.

**Solicitar tarjeta antes de mostrar valor.** Legítimo como estrategia de calificación, pero acepta que reduce mucho el volumen de prueba.

**Pedir invitar a compañeros antes de que el usuario entienda el producto.** Nadie recomienda algo que no ha probado.

**Múltiples ventanas emergentes en la primera sesión.** Cookies, notificaciones, encuesta, recorrido guiado. El usuario cierra todo por reflejo, incluido lo importante.

---

### Los correos del onboarding

Los primeros siete días son los que cuentan. Una secuencia que funciona:

**Día 0 — Bienvenida.** Breve. Una sola acción sugerida: la que lleva al momento de activación. Escrito en primera persona, no como comunicado corporativo.

**Día 1 — Si NO activó:** ayuda concreta para superar el obstáculo más común. **Si SÍ activó:** el siguiente paso natural.

**Día 3 — Caso de uso.** Cómo alguien parecido a él usa el producto para resolver algo concreto.

**Día 5 — Pregunta abierta.** "¿Qué te ha costado más trabajo?" Con respuesta directa a una persona real. Genera respuestas útiles y detecta problemas que la analítica no muestra.

**Día 7 — Si sigue sin activar:** ofrece una llamada corta. En productos con precio medio o alto, esa llamada convierte y además te enseña dónde está el problema.

**Segmenta siempre por comportamiento.** Enviar "empieza creando tu primer proyecto" a alguien que ya creó tres es la forma más rápida de que te ignoren.

---

### Cómo encontrar dónde falla tu onboarding

**1. Embudo por paso.** Registro → paso 1 → paso 2 → activación. El paso con mayor caída es tu prioridad.

**2. Grabaciones de sesión.** Ver a diez personas usar tu onboarding por primera vez es más revelador que cualquier tablero.

**3. Entrevistas a quien no activó.** Escribe a diez usuarios que se registraron y no volvieron. Pregunta qué esperaban y qué pasó. Una tasa de respuesta baja es normal; con tres respuestas ya aprendes algo.

**4. Prueba con cinco personas nuevas.** Sin explicar nada, observando en silencio. Vas a sufrir viéndolos, y ahí está toda tu lista de mejoras.

---

### Preguntas frecuentes

**¿Prueba gratuita o freemium?**
Prueba gratuita si el valor se demuestra rápido y el producto es para uso profesional. Freemium si tienes efecto de red o costo marginal casi nulo.

**¿Cuánto debe durar la prueba?**
Lo suficiente para llegar al momento de activación y usar el producto un par de veces. Catorce días funciona para la mayoría. Si tu ciclo de uso es mensual, catorce días no alcanza.

**¿Onboarding asistido por una persona?**
En productos con precio medio o alto, una llamada de 20 minutos con los primeros cientos de clientes es la mejor inversión que puedes hacer. Aprendes más que con cualquier herramienta y la retención mejora notablemente.

---

**Escrito por Carlos Anaya Ruiz** — Desarrollador y consultor. Diseño flujos de activación medidos por comportamiento, no por opinión.

---

### PROMPT DE PORTADA — Artículo 072

> Un sendero de losas luminosas magenta que van apareciendo en el aire justo antes de cada paso de una figura geométrica abstracta que avanza hacia una puerta de luz al fondo, mientras las losas ya pisadas se apagan detrás. Vista trasera en perspectiva profunda. Fondo negro carbón, iluminación magenta, sin ninguna figura humana reconocible.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.
