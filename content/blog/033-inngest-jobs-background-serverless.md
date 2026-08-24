---
n: 33
title: "Inngest: jobs en background sin administrar servidores"
slug: "inngest-jobs-background-serverless"
description: "Cómo usar Inngest para tareas en background, workflows durables y crons sin montar Redis ni workers. Con patrones de reintento y concurrencia."
category: "Desarrollo"
keyword: "inngest background jobs"
tipo: "satelite"
tags: ["inngest","background jobs","serverless","workflows"]
---


**Inngest ejecuta trabajo en segundo plano definido como funciones normales de tu proyecto, con reintentos, pasos durables y concurrencia controlada, sin que tengas que montar una cola ni mantener procesos worker.** Resuelve el problema clásico del stack serverless: qué haces con el trabajo que tarda más de lo que dura una petición HTTP.

---

### El problema que resuelve

En un entorno serverless, una función tiene límite de tiempo. Si tu proceso de alta de cliente implica crear el registro, enviar tres correos, generar un PDF, notificar a un sistema externo y actualizar un panel, no cabe en una petición. Y si algo falla a la mitad, quedas en un estado inconsistente.

Las soluciones tradicionales —Redis con una biblioteca de colas, un worker en un contenedor, un cron externo— funcionan pero implican infraestructura que hay que operar, monitorear y pagar.

---

### El concepto central: pasos durables

Una función de Inngest se divide en pasos. **Cada paso ejecuta una sola vez y su resultado se guarda.** Si el paso 4 falla y se reintenta, los pasos 1 al 3 no se vuelven a ejecutar: se recuperan sus resultados almacenados.

```ts
import { inngest } from './cliente'

export const altaCliente = inngest.createFunction(
  { id: 'alta-cliente', retries: 3 },
  { event: 'cliente/registrado' },
  async ({ event, step }) => {

    const cliente = await step.run('crear-registro', async () => {
      return db.cliente.create({ data: event.data })
    })

    await step.run('correo-bienvenida', async () => {
      return enviarCorreo(cliente.email, 'bienvenida')
    })

    // Esperar 3 días sin mantener nada corriendo
    await step.sleep('espera-seguimiento', '3d')

    await step.run('correo-seguimiento', async () => {
      return enviarCorreo(cliente.email, 'seguimiento')
    })
  }
)
```

Ese `step.sleep('3d')` es lo que hace especial a Inngest. No hay proceso esperando tres días. La función se suspende y se retoma en el momento correcto. Puedes escribir flujos de días o semanas como si fuera código secuencial normal.

---

### Los primitivos que más se usan

**`step.run`** — ejecuta y persiste el resultado. La unidad básica.

**`step.sleep` / `step.sleepUntil`** — pausa por duración o hasta una fecha concreta.

**`step.waitForEvent`** — pausa hasta que llegue un evento específico o venza un plazo:

```ts
const pago = await step.waitForEvent('esperar-pago', {
  event: 'pago/confirmado',
  timeout: '24h',
  match: 'data.pedidoId',
})

if (!pago) {
  await step.run('cancelar-pedido', () => cancelar(event.data.pedidoId))
  return
}
```

**`step.sendEvent`** — dispara otro evento y encadena funciones.

**`step.invoke`** — llama a otra función de Inngest y espera su resultado.

---

### Control de concurrencia y límites

Esta es la parte que evita que tu integración con una API externa te bloquee por exceso de peticiones:

```ts
export const procesarDocumento = inngest.createFunction(
  {
    id: 'procesar-documento',
    concurrency: [
      { limit: 10 },                                    // Global
      { key: 'event.data.organizacionId', limit: 2 },   // Por cliente
    ],
    throttle: { limit: 100, period: '1m' },             // Ritmo máximo
    retries: 4,
  },
  { event: 'documento/subido' },
  async ({ event, step }) => { /* ... */ }
)
```

El límite por clave es especialmente útil en SaaS multi-tenant: evita que un cliente con un volumen enorme monopolice el procesamiento y deje esperando a todos los demás.

---

### Crons

```ts
export const reporteDiario = inngest.createFunction(
  { id: 'reporte-diario' },
  { cron: 'TZ=America/Mexico_City 0 7 * * *' },
  async ({ step }) => {
    const datos = await step.run('reunir-datos', () => calcularMetricas())
    await step.run('enviar', () => enviarReporte(datos))
  }
)
```

Con zona horaria explícita, que es un detalle que evita muchos dolores de cabeza.

---

### Cancelación y deduplicación

```ts
export const recordatorio = inngest.createFunction(
  {
    id: 'recordatorio-carrito',
    cancelOn: [{ event: 'pedido/completado', match: 'data.usuarioId' }],
    idempotency: 'event.data.usuarioId',
  },
  { event: 'carrito/abandonado' },
  async ({ event, step }) => {
    await step.sleep('espera', '2h')
    await step.run('enviar-recordatorio', () => enviarRecordatorio(event.data))
  }
)
```

`cancelOn` cancela el flujo si el usuario completa la compra durante la espera. `idempotency` evita que se dispare dos veces por el mismo usuario.

---

### Errores conceptuales frecuentes

**Meter todo en un solo `step.run`.** Si tu función es un único paso gigante, pierdes toda la durabilidad. Divide por operación con efecto externo.

**Efectos secundarios fuera de un paso.** Código entre pasos puede ejecutarse varias veces durante los reintentos. Toda escritura, todo envío, toda llamada externa va dentro de `step.run`.

**Pasar objetos no serializables entre pasos.** El resultado de un paso se guarda como JSON. Devuelve datos planos, no instancias de clase ni funciones.

**No hacer idempotentes las operaciones externas.** Inngest garantiza que el paso se ejecute, pero ante ciertos fallos puede reintentarlo. Si envías un cobro, usa una clave de idempotencia del lado del proveedor.

**Confundir reintentos con manejo de errores.** Un error de validación no debe reintentarse cuatro veces. Usa `NonRetriableError` para fallos que no van a resolverse solos.

---

### Cuándo NO usar Inngest

- Trabajo que debe completarse en milisegundos dentro de la misma petición.
- Procesamiento de volúmenes masivos de datos continuos, donde un sistema de streaming es más apropiado.
- Si ya tienes infraestructura de colas operando bien y con gente que la mantiene. La migración tiene que justificarse con algo más que comodidad.

---

### Preguntas frecuentes

**¿Cómo se prueba en local?**
Con el servidor de desarrollo local, que ofrece un panel donde ves eventos, ejecuciones y pasos. Es de lo mejor de la herramienta: depurar un flujo de varios días es tan simple como ver la línea de tiempo.

**¿Qué pasa si mi despliegue cambia mientras hay funciones en vuelo?**
Los pasos ya completados conservan su resultado. Si cambias la estructura de pasos de una función con ejecuciones activas, puede haber inconsistencias. Para cambios estructurales grandes, versiona el `id` de la función.

**¿Es caro?**
El modelo es por número de ejecuciones y pasos. Para cargas moderadas suele ser más barato que mantener infraestructura propia, considerando el tiempo de operación. A gran volumen, haz el cálculo.
