---
n: 60
title: "Observabilidad: logs, métricas y trazas explicados"
slug: "observabilidad-logs-metricas-trazas"
description: "Los tres pilares de la observabilidad explicados con ejemplos, qué instrumentar primero y cómo evitar pagar fortunas en ingesta de logs."
category: "DevOps"
keyword: "observabilidad software"
tipo: "satelite"
tags: ["observabilidad","monitoreo","opentelemetry","logs"]
---


**Monitoreo responde "¿está funcionando?". Observabilidad responde "¿por qué no está funcionando?".** La diferencia importa: puedes tener todos los tableros en verde y usuarios que no pueden completar una compra.

---

### Los tres pilares

**Métricas.** Números agregados en el tiempo: peticiones por segundo, latencia percentil 95, uso de CPU, tasa de error. Baratas de almacenar, excelentes para detectar que algo cambió. Malas para saber por qué.

**Logs.** Registros de eventos con contexto. Caros de almacenar en volumen, excelentes para el detalle de un caso concreto.

**Trazas.** El recorrido completo de una petición a través de todos tus servicios, con el tiempo de cada tramo. Es lo que te dice **dónde** se fue el tiempo.

**Cómo se usan juntos:** la métrica te avisa que la latencia subió. La traza te dice que el 80% del tiempo está en una llamada a un servicio externo. El log te dice que ese servicio está devolviendo errores de límite de tasa.

---

### Qué instrumentar primero

En orden de valor:

**1. Tasa de error por endpoint.** Si solo puedes medir una cosa, mide esto.

**2. Latencia en percentiles, no en promedio.** El promedio esconde el problema. Si tu latencia promedio es de 200 ms pero el percentil 99 es de 8 segundos, el 1% de tus usuarios tiene una experiencia horrible y tu tablero se ve bien.

Mide siempre p50, p95 y p99.

**3. Métricas de negocio.** Registros creados, pagos completados, sesiones iniciadas. Una caída en estas métricas detecta problemas que ninguna métrica técnica revela: si tu formulario de registro se rompe visualmente, tu tasa de error es cero y tus registros son cero.

**4. Saturación de recursos.** CPU, memoria, conexiones de base de datos, profundidad de colas.

**5. Dependencias externas.** Latencia y tasa de error de cada API de terceros de la que dependes.

---

### Logs que sirven

**Estructurados, siempre.**

```ts
// Inútil para buscar y agregar
console.log(`Error al procesar pedido ${id} del usuario ${userId}`)

// Consultable
logger.error('pedido.procesamiento.fallido', {
  pedidoId: id,
  usuarioId,
  organizacionId,
  motivo: error.code,
  intentos: 3,
  duracionMs: 1240,
})
```

Con logs estructurados puedes preguntar "cuántos pedidos fallaron por este motivo en esta organización esta semana". Con logs de texto libre, no.

**Identificador de correlación en todo.**

Genera un identificador único por petición y propágalo por todos los servicios y trabajos en background. Sin eso, reconstruir qué pasó en una petición que atravesó cuatro servicios es imposible.

**Niveles con criterio.**
- `error`: algo falló y requiere atención
- `warn`: algo inesperado pero manejado
- `info`: eventos de negocio significativos
- `debug`: solo en desarrollo

**Nunca registres:** contraseñas, tokens, números de tarjeta, datos personales sensibles. El sistema de logs suele tener acceso más amplio que la base de datos, y si registras datos personales, ese sistema entra en el alcance de tus obligaciones de protección de datos.

---

### Cómo no arruinarte con la factura de logs

Este es el problema práctico número uno de la observabilidad. Las plataformas cobran por volumen ingerido, y el volumen crece sin que nadie lo note.

**1. Muestreo en lo de alto volumen.** No necesitas el 100% de los logs de peticiones exitosas. Registra el 100% de los errores y una muestra del 1-10% del tráfico normal.

**2. Muestreo dirigido en trazas.** Conserva siempre las trazas con error o con latencia alta; muestrea el resto.

**3. Retención escalonada.** Detalle completo por 7 días, agregados por 90, métricas por un año. La mayoría de las investigaciones ocurren en las primeras 48 horas.

**4. Elimina el ruido en el origen.** Un log por cada iteración de un bucle que procesa 10,000 registros genera 10,000 líneas inútiles. Registra el resumen.

**5. Presupuesto con alerta.** Igual que con infraestructura.

---

### Alertas que no se ignoran

El fracaso más común de la observabilidad es la fatiga de alertas: tantas notificaciones que el equipo deja de mirarlas.

**Reglas:**

**Alerta sobre síntomas, no sobre causas.** "La tasa de error del checkout superó el 2%" es accionable. "La CPU está al 85%" puede ser normal.

**Toda alerta debe requerir acción humana.** Si la respuesta correcta es "esperar a ver si se arregla", no debería haber alertado.

**Umbral con duración.** "Tasa de error > 5% durante 5 minutos" evita el ruido de picos momentáneos.

**Severidad diferenciada.** Solo lo que justifica despertar a alguien va al canal de guardia. El resto, a un canal que se revisa en horario laboral.

**Cada alerta con su guía de respuesta.** Un enlace a qué hacer cuando se dispara. Sin eso, quien la recibe a las 3 de la mañana empieza desde cero.

**Métrica de salud del sistema de alertas:** porcentaje de alertas que resultaron en una acción. Si baja del 50%, tienes ruido y hay que recalibrar.

---

### Sobre el estándar abierto

Instrumentar con un estándar abierto y neutral —en lugar de con el SDK propietario de un proveedor— tiene una ventaja práctica: si cambias de plataforma de observabilidad, cambias la configuración de exportación, no toda tu instrumentación.

Dado que los costos de estas plataformas escalan rápido y que la competencia es activa, esa portabilidad vale la pena.

---

### Preguntas frecuentes

**¿Por dónde empiezo si no tengo nada?**
Captura de errores en producción con alertas. Es lo que da más valor en menos tiempo. Después métricas de latencia, después trazas.

**¿Cuánto debería costar?**
Como referencia, entre el 3% y el 8% de tu gasto en infraestructura. Si supera el 15%, tienes un problema de volumen que hay que atacar con muestreo y retención.

**¿Observabilidad para una aplicación pequeña?**
Captura de errores y métricas básicas, sí, desde el día uno. Trazas distribuidas, solo cuando tengas varios servicios.
