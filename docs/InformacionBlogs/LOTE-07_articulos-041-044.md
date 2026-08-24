# LOTE 07 — ARTÍCULOS COMPLETOS 041–044
**Autor:** Carlos Anaya Ruiz · Listos para publicar

---
---

# ARTÍCULO 041

```yaml
title: "Atención a clientes por WhatsApp con IA: arquitectura real"
slug: "whatsapp-business-api-ia-atencion-clientes"
description: "Cómo montar atención al cliente por WhatsApp con IA: WhatsApp Business API, plantillas, ventana de 24 horas y escalamiento a humano."
author: "Carlos Anaya Ruiz"
category: "Automatización"
tags: ["whatsapp", "atención a clientes", "ia", "integraciones"]
keyword_principal: "whatsapp business api ia"
```

## Atención a clientes por WhatsApp con IA: arquitectura real

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

---

**Escrito por Carlos Anaya Ruiz** — Desarrollador full-stack. He construido plataformas de gestión de leads por WhatsApp para operaciones multi-sucursal.

---

### PROMPT DE PORTADA — Artículo 041

> Un flujo de burbujas de mensaje abstractas y geométricas ascendiendo en espiral hacia un nodo de procesamiento hexagonal iluminado en ámbar, con algunas burbujas desviándose por una ruta lateral marcada con luz cálida más intensa. Sin texto ni símbolos dentro de las burbujas. Fondo negro carbón, iluminación ámbar volumétrica, profundidad con niebla.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.

---
---

# ARTÍCULO 042

```yaml
title: "Human-in-the-loop: cuándo NO automatizar con IA"
slug: "human-in-the-loop-cuando-no-automatizar"
description: "Cómo decidir qué automatizar y qué dejar en manos humanas: matriz de riesgo, puntos de aprobación y el costo real de un error automatizado."
author: "Carlos Anaya Ruiz"
category: "Automatización"
tags: ["human in the loop", "gobernanza", "riesgo", "automatización"]
keyword_principal: "human in the loop ia"
```

## Human-in-the-loop: cuándo NO automatizar con IA

**La pregunta no es si automatizar, sino dónde poner a la persona.** Toda automatización con IA tiene un punto donde el juicio humano debe intervenir. Diseñar bien ese punto es lo que separa un sistema confiable de un incidente esperando a ocurrir.

---

### La matriz de decisión

Dos ejes: **reversibilidad** del error y **frecuencia** de la tarea.

| | Error reversible | Error irreversible |
|---|---|---|
| **Alta frecuencia** | **Automatizar** con muestreo de control | **Automatizar con aprobación** por lote o por umbral |
| **Baja frecuencia** | Automatizar si el volumen lo justifica | **No automatizar.** Asistir, no decidir |

**Reversible** significa: si sale mal, ¿puedo deshacerlo en minutos sin daño permanente?

Clasificar mal un correo interno es reversible. Enviar una comunicación a 5,000 clientes no lo es. Borrar un registro con respaldo es reversible. Ejecutar una transferencia no lo es.

---

### Los cuatro modos de intervención humana

**Modo 1 — Aprobación previa.**
Nada se ejecuta sin que una persona apruebe. Máximo control, mínimo ahorro de tiempo. Correcto para operaciones irreversibles de alto impacto.

**Modo 2 — Revisión posterior por muestreo.**
Se ejecuta automáticamente; una persona revisa un porcentaje. Buen equilibrio para alto volumen con error reversible. El porcentaje se ajusta según la tasa de error observada: empieza en 100% y baja conforme la confianza aumenta.

**Modo 3 — Excepción por umbral.**
Se ejecuta automáticamente salvo que se cruce una condición: monto alto, cliente importante, confianza baja del modelo, patrón inusual. Es el modo más eficiente cuando puedes definir bien los umbrales.

**Modo 4 — Asistencia sin ejecución.**
El sistema prepara y recomienda; la persona decide y ejecuta. Es lo correcto para decisiones que afectan a personas: contratación, crédito, sanciones, diagnósticos.

---

### Dónde NO automatizar, sin discusión

**Decisiones que afectan derechos o acceso a servicios.**
Contratación, despido, aprobación de crédito, admisión, sanciones. Además del riesgo ético, hay riesgo regulatorio creciente: varios marcos normativos exigen supervisión humana significativa en decisiones automatizadas que afectan de forma relevante a las personas.

**Comunicación de malas noticias.**
Rechazos, cancelaciones, incidentes. La eficiencia no compensa el daño relacional.

**Contenido que compromete legalmente.**
Contratos, dictámenes, declaraciones ante autoridad, comunicaciones con implicaciones regulatorias.

**Operaciones financieras irreversibles.**
Transferencias, pagos, movimientos de fondos. Doble autorización humana por encima de un umbral, siempre.

**Cualquier cosa donde un error tenga consecuencias físicas o de salud.**

---

### Cómo diseñar un buen punto de aprobación

La calidad del control depende de que la revisión sea real, no ceremonial.

**1. Da contexto suficiente para decidir en menos de 30 segundos.**
Si aprobar requiere abrir tres sistemas, la persona va a aprobar sin mirar. Un mal control es peor que ninguno, porque genera falsa confianza.

**2. Muestra el nivel de confianza.**
Si el sistema puede indicar qué tan seguro está, muéstralo. Ayuda a priorizar la atención.

**3. Haz visible lo que va a cambiar.**
No "¿apruebas esta acción?" sino "se enviará este mensaje exacto a estas 47 personas". Muestra el diff.

**4. Permite rechazar con motivo.**
El motivo del rechazo es tu principal fuente de mejora del sistema. Captúralo de forma estructurada.

**5. Pon un plazo y un comportamiento por defecto.**
¿Qué pasa si nadie aprueba en 24 horas? Define si expira, escala o se ejecuta. Sin esto, tienes tareas colgadas indefinidamente.

**6. Registra todo.**
Quién aprobó, cuándo, qué vio. Es tu evidencia ante una auditoría o una reclamación.

---

### El fenómeno del sello de goma

Es el riesgo principal de este diseño: cuando el 98% de las propuestas son correctas, la persona deja de revisar y aprueba en automático. El control existe en el papel y no en la práctica.

**Cómo combatirlo:**

- **Inserta casos de control.** Propuestas deliberadamente incorrectas de vez en cuando. Si se aprueban, sabes que la revisión no está ocurriendo.
- **Mide el tiempo de revisión.** Si el tiempo promedio baja a dos segundos, tienes sello de goma.
- **Rota a los revisores.** La fatiga de atención es real y se acumula.
- **Reduce el volumen de aprobaciones.** Si alguien aprueba 200 cosas al día, ninguna se revisa bien. Sube los umbrales para que solo lleguen los casos que de verdad requieren juicio.

Este último punto es el más importante y el menos aplicado: **menos aprobaciones y mejor revisadas vale más que muchas aprobaciones superficiales.**

---

### Cómo reducir la supervisión con el tiempo

No fijes el nivel de control para siempre. Debe evolucionar con los datos:

**Fase 1 (mes 1-2):** aprobación previa en el 100% de los casos. Registra tasa de aprobación sin cambios.

**Fase 2 (mes 3-4):** si la tasa supera el 90% de forma estable, pasa a revisión por muestreo del 30% en los casos de bajo riesgo. Los de alto riesgo siguen en aprobación previa.

**Fase 3 (mes 5+):** muestreo del 10% en bajo riesgo, umbrales definidos para excepciones, aprobación previa solo en alto riesgo.

**Nunca llegues a cero supervisión en operaciones con impacto externo.** El sistema se degrada, los datos cambian, los modelos se actualizan. Un muestreo mínimo permanente es tu sistema de alarma.

---

### Preguntas frecuentes

**¿Cuánta gente necesito para revisar?**
Depende del volumen y del tiempo por revisión. Calcula: casos que requieren aprobación × minutos por revisión. Si el número no cabe en la jornada de nadie, tus umbrales están mal calibrados.

**¿Y si el humano se equivoca más que la IA?**
Ocurre en tareas de alto volumen y baja complejidad. Ahí conviene invertir la relación: la IA ejecuta y verifica, la persona interviene solo ante excepciones señaladas.

**¿Esto no anula el ahorro de la automatización?**
No, si está bien diseñado. Pasar de redactar a revisar sigue siendo una reducción grande de tiempo. Lo que anula el ahorro es una revisión mal diseñada que obliga a rehacer el trabajo.

---

**Escrito por Carlos Anaya Ruiz** — Consultor tecnológico. Diseño sistemas automatizados con puntos de control humano proporcionales al riesgo.

---

### PROMPT DE PORTADA — Artículo 042

> Una cadena de engranajes automatizados en movimiento continuo, interrumpida en el centro exacto del encuadre por un espacio vacío con la forma de una mano abstracta y geométrica hecha de luz ámbar sólida que detiene el mecanismo. Vista lateral, tensión mecánica visible en los engranajes detenidos. Fondo negro carbón, iluminación cálida focalizada en el punto de interrupción.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.

---
---

# ARTÍCULO 043

```yaml
title: "Cómo orquestar múltiples agentes de IA"
slug: "orquestar-multiples-agentes-ia"
description: "Patrones de orquestación multiagente: supervisor, pipeline y enjambre. Cuál usar según la tarea y cómo controlar el costo en tokens."
author: "Carlos Anaya Ruiz"
category: "Inteligencia Artificial"
tags: ["multiagente", "orquestación", "arquitectura ia", "agentes"]
keyword_principal: "orquestación de agentes de ia"
```

## Cómo orquestar múltiples agentes de IA

**Un sistema multiagente divide un problema entre varios agentes especializados en lugar de darle todas las herramientas a uno solo.** Se justifica cuando un agente único empieza a fallar por exceso de herramientas o de contexto, no antes.

**Advertencia de entrada:** la mayoría de los problemas que la gente intenta resolver con multiagente se resuelven mejor con un agente bien diseñado y menos herramientas. Empieza por ahí.

---

### Cuándo un solo agente deja de servir

Señales concretas:

- **Más de 15 o 20 herramientas.** La selección se degrada notablemente.
- **El contexto acumulado no cabe** o cuesta demasiado en cada iteración.
- **Necesitas modelos distintos** para partes distintas de la tarea: uno rápido y barato para clasificar, uno potente para razonar.
- **Requisitos de permisos incompatibles.** Un componente necesita acceso amplio de lectura y otro necesita escritura restringida.
- **Las tareas son paralelizables** y la latencia importa.

Si ninguna de estas aplica, no dividas.

---

### Patrón 1 — Supervisor

Un agente coordinador recibe el objetivo, decide qué subagente debe actuar, le pasa una tarea acotada y recibe su resultado. Repite hasta terminar.

```
        [Supervisor]
       /      |      \
[Investigador] [Analista] [Redactor]
```

**Cuándo usarlo:** cuando el camino no está predefinido y depende de lo que se encuentre.

**Ventajas:** flexible, fácil de razonar, permite agregar especialistas sin rediseñar.

**Riesgos:** el supervisor puede entrar en bucles. Necesita límite duro de iteraciones y de presupuesto.

**Detalle clave:** el supervisor **no debe recibir el contexto completo de cada subagente**. Recibe resúmenes. Si le pasas todo, el contexto crece sin control y el costo se dispara.

---

### Patrón 2 — Pipeline

Etapas fijas en secuencia. La salida de una es la entrada de la siguiente.

```
[Extraer] → [Normalizar] → [Enriquecer] → [Validar] → [Publicar]
```

**Cuándo usarlo:** cuando el flujo es conocido y estable.

**Ventajas:** predecible, barato, fácil de depurar, fácil de medir por etapa.

**Riesgos:** rígido. Si el caso no encaja en el flujo, falla.

**Este es el patrón infravalorado.** Mucha gente construye un supervisor complejo para un problema que era un pipeline de cuatro pasos. Si conoces las etapas, no le pidas a un modelo que las descubra en cada ejecución.

---

### Patrón 3 — Paralelo con agregación

Varios agentes trabajan simultáneamente sobre la misma entrada desde ángulos distintos, y un agregador combina resultados.

```
         Entrada
        /   |    \
  [Legal] [Técnico] [Comercial]
        \   |    /
        [Agregador]
```

**Cuándo usarlo:** revisión desde múltiples perspectivas, análisis de un documento por distintos criterios, generación de opciones diversas.

**Ventajas:** rápido, obtiene diversidad real de enfoques.

**Riesgos:** costo multiplicado por el número de agentes. Y el agregador puede quedarse sin espacio de contexto si los resultados son largos.

---

### Patrón 4 — Generador y crítico

Un agente produce, otro evalúa contra criterios, y se itera un número limitado de veces.

**Cuándo usarlo:** cuando la calidad importa más que la latencia y puedes definir criterios de evaluación claros.

**Detalle crítico:** el crítico debe tener **criterios explícitos y verificables**, no "evalúa si está bien". Y necesitas un límite de iteraciones: dos o tres. Más allá de eso, las mejoras son marginales y el costo se acumula.

---

### Control de costo: la parte que decide si esto es viable

Un sistema multiagente puede costar entre cinco y veinte veces lo que una llamada simple. Sin control, se vuelve inviable.

**1. Modelo por tarea, no un modelo para todo.**
Clasificar, extraer y enrutar: modelo pequeño y barato. Razonar, sintetizar y decidir: modelo potente. Esta sola decisión suele reducir el costo total entre 50% y 70%.

**2. Presupuesto duro por ejecución.**
Un límite de tokens y de iteraciones por tarea. Al alcanzarlo, se detiene y reporta. Sin esto, un bucle te puede costar mucho dinero en una noche.

**3. Resúmenes, no contexto completo.**
Entre agentes se pasan conclusiones estructuradas, no transcripciones. Define un formato de traspaso.

**4. Caching de prefijo.**
Las instrucciones estables al inicio del prompt, lo variable al final. Los proveedores que ofrecen caché de contexto pueden reducir sustancialmente el costo de la parte repetida.

**5. Etapas deterministas donde sea posible.**
Si un paso puede hacerlo un script, que lo haga un script. No todo tiene que pasar por un modelo.

---

### Observabilidad: no opcional

Cuando un sistema multiagente falla, sin trazas no tienes forma de saber dónde. Necesitas, por ejecución:

- Árbol completo de llamadas: qué agente, qué herramienta, qué argumentos
- Entrada y salida de cada paso
- Tokens y costo por agente
- Latencia por etapa
- Punto exacto donde se desvió

**Regla práctica:** si no puedes reconstruir por qué el sistema tomó una decisión, no lo pongas en producción.

---

### Los errores más comunes

**Multiagente cuando bastaba un agente.** El más frecuente y el más caro.

**Sin criterio de terminación.** El sistema itera indefinidamente porque nadie definió cuándo declarar que no se puede.

**Contexto compartido sin control.** Cada agente añade al historial y el costo crece de forma cuadrática.

**Especialización artificial.** Crear cinco agentes que en realidad hacen lo mismo con prompts ligeramente distintos. La especialización debe corresponder a herramientas o permisos distintos, no a matices de instrucción.

**Sin evaluación.** Necesitas un conjunto de tareas con resultado esperado. Sin eso, cada cambio en la orquestación es una apuesta.

---

### Preguntas frecuentes

**¿Cuántos agentes son demasiados?**
Si no puedes dibujar el sistema en una hoja y explicárselo a alguien en dos minutos, son demasiados.

**¿Conviene un framework o construirlo a mano?**
Para pipelines y supervisores simples, construirlo a mano da más control y es más fácil de depurar. Los frameworks ayudan en orquestaciones complejas, a costa de abstracción que a veces estorba al depurar.

**¿Cómo pruebo un sistema multiagente?**
Cada agente por separado con sus propios casos, y después el sistema completo con casos de extremo a extremo. Probar solo el conjunto hace imposible localizar la causa de un fallo.

---

**Escrito por Carlos Anaya Ruiz** — Desarrollador y consultor. Construyo sistemas agénticos con presupuesto controlado y trazabilidad completa.

---

### PROMPT DE PORTADA — Artículo 043

> Una estructura jerárquica tridimensional: un nodo superior grande y brillante en ámbar del que descienden hilos de luz hacia seis nodos subordinados más pequeños, cada uno trabajando sobre su propia micro-estructura geométrica. Vista frontal elevada, estilo constelación técnica. Fondo negro absoluto, iluminación ámbar volumétrica, algunos nodos desenfocados por profundidad.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.

---
---

# ARTÍCULO 044

```yaml
title: "Costos de tokens: cómo no quebrar usando APIs de IA"
slug: "costos-tokens-api-ia"
description: "Cómo se cobran los tokens, por qué tu factura se dispara y 11 técnicas (caching, batching, routing) para bajarla de forma sustancial."
author: "Carlos Anaya Ruiz"
category: "Inteligencia Artificial"
tags: ["costos ia", "tokens", "optimización", "api"]
keyword_principal: "costos api de ia"
```

## Costos de tokens: cómo no quebrar usando APIs de IA

**Se cobra por token de entrada y por token de salida, con precios distintos, y la salida suele costar bastante más que la entrada.** Un token equivale aproximadamente a tres cuartos de una palabra en español. Con eso ya puedes estimar cualquier cosa.

Lo que dispara las facturas no es el precio unitario: es la arquitectura.

---

### Por qué se dispara la factura

**1. Contexto reenviado en cada llamada.**
En una conversación, cada turno reenvía todo el historial. Un intercambio de veinte turnos no cuesta veinte llamadas: cuesta la suma acumulada, que crece de forma cuadrática.

**2. RAG con demasiados fragmentos.**
Recuperar 20 fragmentos de 800 palabras son unos 21,000 tokens de entrada por consulta. Con 3,000 consultas mensuales son 63 millones de tokens. Ahí está tu factura.

**3. Sistema de agentes sin límite.**
Cada iteración del bucle es una llamada con todo el contexto acumulado. Diez iteraciones cuestan mucho más que diez veces una llamada simple.

**4. El modelo más caro para todo.**
Usar el modelo tope de gama para clasificar correos es como contratar a un especialista para contestar el teléfono.

**5. Reintentos sin control.**
Un fallo que reintenta cinco veces multiplica el costo de esa operación por cinco.

---

### Las 11 técnicas, ordenadas por impacto

**1. Caching de contexto (el mayor ahorro disponible).**
Si envías repetidamente el mismo prefijo —instrucciones largas, documentos de referencia, definiciones de herramientas—, los proveedores que ofrecen caché de prefijo pueden cobrarlo mucho más barato en las llamadas siguientes.

**El requisito arquitectónico:** lo estable va **al inicio** del prompt, lo variable **al final**. Si intercalas contenido variable en medio de tu contexto estable, rompes el caché y pierdes el descuento.

```
[Instrucciones del sistema]      ← estable, se cachea
[Definiciones de herramientas]   ← estable, se cachea
[Documentos de referencia]       ← estable, se cachea
─────────────────────────────
[Historial de conversación]      ← variable
[Consulta actual]                ← variable
```

Este solo cambio de orden puede reducir el costo de entrada de forma dramática en sistemas con contexto grande.

**2. Enrutamiento por modelo.**
Clasifica la dificultad de la tarea y envíala al modelo adecuado. Un modelo pequeño resuelve clasificación, extracción y enrutamiento a una fracción del precio. Solo lo que requiere razonamiento complejo va al modelo grande.

Ahorro típico en sistemas mixtos: entre 50% y 75%.

**3. Procesamiento por lotes.**
Para tareas que no necesitan respuesta inmediata —análisis nocturno, generación masiva, clasificación de históricos—, las APIs de lote suelen costar aproximadamente la mitad. Si tu tarea tolera esperar horas, es dinero regalado no usarlo.

**4. Recortar el contexto de RAG.**
Prueba con menos fragmentos. Muchas veces 5 fragmentos bien seleccionados con reranking superan a 20 sin ordenar, y cuestan la cuarta parte. Mide la calidad; casi siempre puedes bajar.

**5. Ventana deslizante en conversaciones.**
No reenvíes los 40 turnos anteriores. Mantén los últimos 6 completos y un resumen de lo anterior.

**6. Límite duro de tokens por operación.**
Presupuesto máximo por tarea. Al alcanzarlo, se detiene y reporta. Es tu protección contra bucles.

**7. `max_tokens` ajustado.**
Si esperas una clasificación de una palabra, no permitas 4,000 tokens de salida. La salida es la parte cara.

**8. Salida estructurada y compacta.**
Pide JSON con nombres de campo cortos en lugar de prosa explicativa. Menos tokens de salida por resultado útil.

**9. Deduplicación de solicitudes.**
Si la misma pregunta se hace muchas veces sobre datos que no cambian, cachéala en tu propia capa. Un caché de respuestas frecuentes con clave por consulta normalizada puede eliminar un porcentaje sorprendente del tráfico.

**10. Preprocesamiento determinista.**
Todo lo que puede resolver una expresión regular, una consulta SQL o una función, que lo resuelva. No mandes al modelo lo que un `if` decide.

**11. Reintentos con criterio.**
Distingue errores transitorios (reintentar con espera exponencial) de errores permanentes (no reintentar). Un error de validación reintentado cuatro veces es dinero tirado.

---

### Cómo medir para poder optimizar

No puedes optimizar lo que no mides. Registra por cada llamada:

```ts
await db.usoIA.create({
  data: {
    operacion: 'resumen_documento',
    modelo: respuesta.model,
    tokensEntrada: respuesta.usage.input_tokens,
    tokensEntradaCache: respuesta.usage.cache_read_input_tokens ?? 0,
    tokensSalida: respuesta.usage.output_tokens,
    latenciaMs: Date.now() - inicio,
    organizacionId,
    usuarioId,
  },
})
```

Con eso puedes responder las preguntas que importan:
- ¿Qué operación consume más presupuesto?
- ¿Qué cliente genera más costo? (relevante para tu pricing)
- ¿Qué porcentaje de entrada está saliendo del caché?
- ¿El costo por operación sube o baja con el tiempo?

**Y pon alertas de presupuesto.** Diaria y mensual, con umbral y con corte automático si es posible.

---

### Estimación antes de construir

Antes de comprometerte con una arquitectura, haz este cálculo:

```
Costo mensual ≈
  (consultas/mes × tokens_entrada_promedio × precio_entrada)
+ (consultas/mes × tokens_salida_promedio × precio_salida)
```

Y contrástalo con lo que puedes cobrar. Si tu plan cuesta 300 pesos al mes por usuario y un usuario activo genera 400 pesos de costo de inferencia, tienes un problema de modelo de negocio, no de optimización.

**Regla práctica para SaaS con IA:** el costo de inferencia no debería superar el 20-30% del precio del plan. Si lo supera, o subes el precio, o pones límites de uso, o cambias la arquitectura.

---

### Preguntas frecuentes

**¿Los precios van a bajar?**
Históricamente el precio por unidad de capacidad ha bajado de forma agresiva. Pero el consumo tiende a crecer más rápido. No construyas tu modelo económico asumiendo que se abaratará solo.

**¿Conviene autohospedar un modelo abierto?**
El punto de equilibrio depende de tu volumen y de si tu carga es constante o con picos. Con volumen alto y sostenido puede convenir; con volumen irregular, casi nunca, porque pagas el servidor esté o no trabajando.

**¿Cómo cobro esto a mis clientes?**
Tres opciones: incluirlo con límites de uso claros, cobrar por consumo, o un híbrido con cuota incluida y excedente facturado. La segunda es la más justa y la más difícil de explicar en la venta.

---

**Escrito por Carlos Anaya Ruiz** — Desarrollador y consultor. Optimizo costos de inferencia en productos SaaS con IA en producción.

---

### PROMPT DE PORTADA — Artículo 044

> Un flujo denso de micro-partículas ámbar descendiendo y atravesando un embudo de vidrio grueso que las comprime drásticamente, saliendo por la parte inferior convertidas en un hilo delgado, ordenado y luminoso. Vista macro con profundidad de campo extrema. Fondo negro carbón, iluminación cálida contrastada, reflejos en el vidrio del embudo.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.
