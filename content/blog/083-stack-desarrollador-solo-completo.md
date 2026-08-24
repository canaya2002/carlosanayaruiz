---
n: 83
title: "El stack completo de un desarrollador solo"
slug: "stack-desarrollador-solo-completo"
description: "El stack completo con el que una sola persona puede construir y operar varios productos: cada herramienta, su costo y por qué está ahí."
category: "Desarrollo"
keyword: "stack para desarrollador solo"
tipo: "pillar"
tags: ["stack","herramientas","indie","productividad"]
---


**El criterio para elegir herramientas cuando trabajas solo no es cuál es la mejor: es cuál te quita más trabajo operativo.** Cada servicio que administras tú es tiempo que no dedicas al producto.

Este es el stack con el que opero varios productos en paralelo, con el razonamiento de por qué está cada pieza.

---

### El principio: minimizar superficie operativa

Trabajando solo, tu recurso escaso no es el dinero: es la atención. Una herramienta que cuesta 800 pesos al mes y te ahorra cuatro horas mensuales de operación es barata. Una gratuita que te obliga a mantenerla es cara.

**Regla:** paga por lo que no es tu producto. Construye solo lo que te diferencia.

---

### La base: monorepo

**pnpm + Turborepo.**

Todos los productos en un monorepo, con paquetes compartidos. La razón no es elegancia: es que cuando trabajas solo, el costo de mantener cinco repositorios con código duplicado te alcanza rápido.

`apps/` consume, `packages/` provee. Un cambio en el cliente de base de datos se propaga a las cuatro aplicaciones sin publicar nada.

---

### Aplicación: Next.js con TypeScript estricto

**Next.js App Router.** Frontend y backend en el mismo proyecto. Para una persona sola, eliminar la separación entre repositorio de API y de cliente es una reducción de complejidad enorme.

**TypeScript con `strict: true` desde el primer commit.** Trabajando solo no tienes a nadie que revise tu código. El compilador es tu revisor.

**Validación en la frontera con un esquema.** Todo lo que entra de fuera se valida. Es la otra mitad de la seguridad de tipos.

---

### Datos: Postgres gestionado

**Supabase o cualquier Postgres gestionado.**

Por qué Postgres y no una base de documentos: porque los datos de negocio tienen relaciones, y modelarlas en documentos significa mantener consistencia a mano para siempre.

Por qué gestionado: respaldos, actualizaciones, alta disponibilidad y monitoreo son trabajo continuo. No es tu producto.

**Seguridad a nivel de fila activada en todas las tablas** desde el inicio. Es la diferencia entre depender de que nunca olvides un filtro y depender del motor.

---

### Orquestación: trabajo en background

**Inngest.**

El problema clásico del stack serverless: qué haces con lo que tarda más que una petición HTTP. Colas, reintentos, flujos de varios días, crons.

La alternativa —Redis más un worker en un contenedor— es infraestructura que administras tú. No compensa.

---

### Despliegue

**Vercel para las aplicaciones web.** Despliegue por rama con vista previa automática. Trabajando solo, poder mandarle una URL funcional a un cliente antes de fusionar vale mucho.

**Con límite de gasto configurado desde antes del primer despliegue.** No es opcional.

**Almacenamiento de objetos con CDN para archivos pesados.** Es el ahorro más grande y el que más gente omite.

---

### Móvil: Expo

Si el producto necesita app, Expo dentro del mismo monorepo. Compartes tipos, cliente de API y lógica de negocio. La interfaz se rehace, pero eso es entre el 40% y el 60% del trabajo, no el 100%.

Compilación en la nube: sin necesidad de Mac para iOS.

---

### Pagos

**Stripe en web. RevenueCat si hay app móvil.**

Con una tabla propia de suscripciones como fuente de verdad, alimentada por webhooks. Tu aplicación nunca pregunta al proveedor si el usuario tiene acceso: pregunta a tu base de datos.

---

### IA

**API de un proveedor principal**, con la capa de aplicación diseñada para que cambiar de modelo sea configuración, no reescritura.

Con enrutamiento por tarea: modelo pequeño para clasificar y extraer, modelo grande para razonar. Y contexto estable al inicio del prompt para aprovechar el caching.

**Registro de consumo de tokens por operación** desde el primer día. Sin eso no puedes optimizar ni saber si tu modelo de negocio cierra.

---

### Observabilidad

**Captura de errores en producción con alertas.** Si solo pudieras tener una herramienta de observabilidad, sería esta.

**Analítica de producto** para saber qué se usa y qué no.

**Registro de métricas de negocio propias** en tu base de datos. Registros creados, conversiones, activación. Es lo que te dice si el producto funciona, y ninguna herramienta externa lo sabe mejor que tú.

---

### Desarrollo

**Agentes de código con reglas claras.** Un archivo de contexto en el repositorio con stack, comandos, convenciones y reglas duras. Rama por tarea, revisión del diff, verificaciones automáticas antes de terminar.

**Integración continua con GitHub Actions.** Lint, tipos, pruebas y compilación en cada pull request. En monorepo, con filtro para ejecutar solo lo afectado.

**Protección de rama activada.** Trabajando solo es tentador saltárselo. No lo hagas: es la única red que tienes.

---

### El costo mensual real

| Categoría | Rango (USD/mes) |
|---|---|
| Alojamiento de aplicaciones | 20 – 60 |
| Base de datos gestionada | 25 – 100 |
| Orquestación de trabajos | 0 – 50 |
| Almacenamiento y CDN | 5 – 40 |
| Correo transaccional | 0 – 20 |
| Observabilidad | 0 – 50 |
| Agentes de código | 20 – 200 |
| API de IA (según uso) | 20 – 300 |
| Dominios y varios | 10 – 30 |
| **Total** | **100 – 850** |

Un producto en fase temprana con tráfico bajo vive cómodamente en el extremo inferior. Con usuarios de verdad, en el medio.

---

### Lo que NO tengo y por qué

**Kubernetes.** No tengo el problema que resuelve.

**Infraestructura propia.** Cada máquina que administro es tiempo que no programo.

**Microservicios.** Un monolito modular es más fácil de operar para una persona. Los microservicios resuelven problemas organizacionales que no tengo.

**Sistema de diseño propio.** Componentes existentes ajustados. El diseño diferenciador se aplica encima, no se construye desde cero.

**CMS separado.** El contenido vive en archivos markdown en el repositorio o en la misma base de datos.

---

### Preguntas frecuentes

**¿No es demasiada dependencia de proveedores?**
Es una decisión consciente. La mitigación es que la lógica de negocio no dependa de APIs propietarias, que la base de datos sea Postgres estándar y que las aplicaciones sean contenedorizables. Con eso, migrar es un proyecto, no una reescritura.

**¿Empiezo con todo esto desde el día uno?**
No. Empieza con aplicación, base de datos y despliegue. Añade orquestación cuando tengas trabajo en background, observabilidad cuando tengas usuarios, y móvil cuando el producto lo justifique.

**¿Funciona para un equipo pequeño?**
Sí, hasta seis u ocho personas sin cambios. Más allá, empiezas a necesitar procesos que este stack no impone.
