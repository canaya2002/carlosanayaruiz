---
n: 44
title: "Costos de tokens: cómo no quebrar usando APIs de IA"
slug: "costos-tokens-api-ia"
description: "Cómo se cobran los tokens, por qué tu factura se dispara y 11 técnicas (caching, batching, routing) para bajarla de forma sustancial."
category: "Inteligencia Artificial"
keyword: "costos api de ia"
tipo: "satelite"
tags: ["costos ia","tokens","optimización","api"]
---


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
