# LOTE 14 — ARTÍCULOS COMPLETOS 083–086
**Autor:** Carlos Anaya Ruiz · Listos para publicar

---
---

# ARTÍCULO 083

```yaml
title: "El stack completo de un desarrollador solo"
slug: "stack-desarrollador-solo-completo"
description: "El stack completo con el que una sola persona puede construir y operar varios productos: cada herramienta, su costo y por qué está ahí."
author: "Carlos Anaya Ruiz"
category: "Desarrollo"
tags: ["stack", "herramientas", "indie", "productividad"]
keyword_principal: "stack para desarrollador solo"
tipo: "pillar"
```

## El stack completo de un desarrollador solo

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

---

**Escrito por Carlos Anaya Ruiz** — Desarrollador full-stack. Construyo y opero varios productos en paralelo con este stack.

---

### PROMPT DE PORTADA — Artículo 083

> Un banco de trabajo tridimensional flotante con doce herramientas abstractas y geométricas dispuestas en orden preciso sobre su superficie, todas iluminadas en verde azulado y conectadas entre sí por finas líneas de luz. Vista cenital ligeramente inclinada. Fondo negro carbón, iluminación verde azulado, reflejo en la superficie del banco.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.

---
---

# ARTÍCULO 084

```yaml
title: "Cómo trabajar con IA de código sin romper producción"
slug: "trabajar-con-ia-codigo-sin-romper-produccion"
description: "Reglas de trabajo con agentes de código: ramas, permisos, revisión obligatoria y los tipos de tarea donde nunca conviene dejar suelta a la IA."
author: "Carlos Anaya Ruiz"
category: "Desarrollo"
tags: ["ia para programar", "buenas prácticas", "agentes de código", "calidad"]
keyword_principal: "programar con ia buenas prácticas"
```

## Cómo trabajar con IA de código sin romper producción

**Un agente de código puede modificar decenas de archivos, ejecutar comandos y hacer commits. Esa capacidad es lo que lo hace útil y lo que lo hace peligroso.** La diferencia entre acelerar y acumular deuda técnica está en el proceso, no en el modelo.

---

### Las cinco reglas no negociables

**1. Rama por tarea. Nunca directo a main.**

Es la regla más importante y la más fácil de saltarse "porque es un cambio pequeño". Protección de rama activada, incluso si trabajas solo.

**2. Revisar el diff, no la explicación.**

La descripción de lo que hizo puede sonar impecable y el código estar mal. Lee el cambio línea por línea. Si el diff es demasiado grande para revisarlo, la tarea era demasiado grande.

**3. Verificaciones automáticas antes de considerar terminada una tarea.**

Tipos, linter y pruebas. Que el agente las ejecute como parte del flujo. Código que compila y pasa pruebas es el piso mínimo, no el techo.

**4. Aprobación explícita para operaciones destructivas.**

Migraciones, borrado de archivos, cambios de configuración de infraestructura, cualquier cosa que toque producción. Sin excepciones.

**5. Tareas acotadas.**

"Refactoriza el módulo de autenticación" produce resultados impredecibles. "Extrae la validación de sesión de estas tres rutas a una función en lib/sesion.ts" es una tarea.

---

### Dónde la IA de código es excelente

- **Código repetitivo con patrón claro.** Endpoints CRUD, formularios, adaptadores.
- **Escribir pruebas para código existente.** Es tediosos para humanos y la IA lo hace bien.
- **Migraciones mecánicas.** Cambiar de biblioteca, actualizar una API, renombrar en todo el proyecto.
- **Explorar código desconocido.** "¿Cómo funciona el flujo de autenticación aquí?" en un repositorio que no conoces.
- **Depuración con contexto.** Pegar un error y dejar que rastree la causa.
- **Documentación.** Comentarios, README, documentación de API.

---

### Dónde NO conviene dejarla suelta

**Decisiones de arquitectura.** Puede proponer opciones; la decisión es tuya. Un modelo optimiza el problema que le planteas, no el negocio que tienes detrás.

**Código de seguridad.** Autenticación, autorización, criptografía, manejo de secretos. Puede escribirlo, pero la revisión aquí es más estricta y no delegable.

**Reglas de negocio complejas.** El modelo no sabe por qué esa comisión se calcula así, ni qué caso extremo te costó dinero el año pasado.

**Optimización de rendimiento sin datos.** Puede optimizar lo que no era el cuello de botella. Mide primero.

**Migraciones de base de datos.** Genera el SQL, tú lo lees. Un `DROP COLUMN` generado sin querer no se deshace.

**Código que toca dinero.** Cobros, cálculos de saldo, conciliación. Revisión doble.

---

### El archivo de contexto: la inversión con mejor retorno

Un documento en la raíz del repositorio que el agente lee al inicio de cada sesión. Es la diferencia entre una herramienta que adivina tus convenciones y una que las conoce.

Debe contener:

- **Stack y versiones.** Qué se usa y qué no.
- **Comandos.** Cómo se compila, se prueba, se verifica.
- **Convenciones.** Estilo de commits, estructura de carpetas, patrones a seguir.
- **Reglas duras.** Lo que nunca se hace, en negativo y explícito.
- **Contexto de dominio.** Por qué existen las decisiones raras.

**Cómo construirlo:** empieza corto. Cada vez que corrijas lo mismo dos veces, esa corrección se vuelve una línea del documento. Crece por uso, no por planeación.

---

### El anti-patrón principal: aceptar sin entender

La forma más rápida de terminar con una base de código que nadie comprende es aceptar cambios que funcionan sin entender por qué.

**Síntomas de que estás cayendo:**
- No podrías explicar qué hace un archivo que "escribiste" la semana pasada
- Cuando algo falla, tu primera reacción es pedirle al agente que lo arregle, sin mirar
- Los pull requests son de 800 líneas
- Nadie ha leído el código de un módulo completo

**El antídoto:** si no entiendes un cambio, no lo fusiones. Pide que lo explique, o divídelo en partes que sí puedas revisar.

**Esto importa especialmente trabajando solo.** No tienes a nadie que note que la base de código se está volviendo incomprensible.

---

### Permisos: dónde poner la línea

**Sin aprobación:** leer archivos, editar archivos dentro del proyecto, comandos de solo lectura.

**Con aprobación:** instalar dependencias, hacer push, ejecutar migraciones, desplegar, cualquier comando que toque servicios externos.

**El modo sin aprobaciones** existe y acelera mucho. Úsalo solo donde el peor caso sea aceptable: rama desechable, contenedor aislado, proyecto experimental. En un repositorio con credenciales de producción activas, no.

---

### Lo que cambia en tu trabajo

Menos tiempo escribiendo, más tiempo en:

- **Definir bien el problema.** La calidad de la tarea determina la calidad del resultado.
- **Revisar.** Es ahora la habilidad crítica.
- **Diseñar la arquitectura.** Lo que el modelo no puede decidir por ti.
- **Entender el dominio.** Lo que ninguna herramienta sabe.

La habilidad que sube de valor no es escribir código: es saber si el código que tienes enfrente es correcto para el problema que tienes.

---

### Preguntas frecuentes

**¿Puedo usarlo en código propietario de un cliente?**
Revisa el contrato con tu cliente y los términos del proveedor de la herramienta. Muchos contratos de consultoría tienen cláusulas sobre a quién se puede exponer el código. Resuélvelo antes.

**¿Cómo evito que la calidad se degrade con el tiempo?**
Pruebas automatizadas, revisión real de cada diff, y una auditoría periódica de módulos que nadie ha leído completo.

**¿Es más rápido de verdad?**
En tareas repetitivas y exploración, mucho. En decisiones de diseño, no. La ganancia neta es real pero menor de lo que la gente reporta, porque el tiempo de revisión es tiempo.

---

**Escrito por Carlos Anaya Ruiz** — Desarrollador full-stack. Construyo productos completos usando agentes de código con controles de permisos y revisión obligatoria.

---

### PROMPT DE PORTADA — Artículo 084

> Un brazo robótico abstracto y minimalista operando sobre un bloque de código luminoso, contenido dentro de una jaula de luz verde azulado que delimita claramente su alcance de movimiento. Vista lateral. Fondo negro carbón, iluminación verde azulado, contraste entre el área permitida iluminada y el exterior oscuro.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.

---
---

# ARTÍCULO 085

```yaml
title: "Flujo de trabajo con Git para equipos pequeños"
slug: "flujo-git-equipos-pequenos"
description: "El flujo de Git que funciona para equipos de 1 a 6 personas: ramas cortas, conventional commits, PRs pequeños y despliegue continuo."
author: "Carlos Anaya Ruiz"
category: "Desarrollo"
tags: ["git", "workflow", "colaboración", "buenas prácticas"]
keyword_principal: "git workflow"
```

## Flujo de trabajo con Git para equipos pequeños

**Para equipos de una a seis personas, el flujo correcto es ramas cortas desde main, pull requests pequeños y despliegue frecuente.** Los flujos elaborados con ramas de desarrollo, de release y de hotfix resuelven problemas de organizaciones grandes con ciclos de lanzamiento planificados. En un equipo pequeño, solo añaden ceremonia.

---

### El flujo

```
main  ────●────●────●────●────●────→  (siempre desplegable)
           \    /      \    /
            ●──●        ●──●          (ramas de 1-3 días)
```

**Reglas:**

1. `main` siempre está en estado desplegable.
2. Todo cambio va en una rama corta creada desde `main`.
3. Las ramas viven de uno a tres días. Más allá, los conflictos se multiplican.
4. Pull request obligatorio, con verificaciones automáticas.
5. Al fusionar, se despliega.

Es todo. La simplicidad es la característica, no una limitación.

---

### Nombres de rama

```
feat/exportacion-csv
fix/calculo-impuesto-redondeo
chore/actualizar-dependencias
docs/guia-instalacion
```

Prefijo del tipo, descripción en kebab-case. Si tu equipo usa un sistema de tickets, incluye el identificador: `feat/PROJ-142-exportacion-csv`.

---

### Conventional Commits

Un formato de mensaje que permite generar changelogs automáticamente y comunica la intención de un vistazo.

```
<tipo>(<ámbito opcional>): <descripción>

[cuerpo opcional]

[pie opcional]
```

**Tipos:**

| Tipo | Cuándo |
|---|---|
| `feat` | Funcionalidad nueva |
| `fix` | Corrección de error |
| `refactor` | Cambio interno sin alterar comportamiento |
| `perf` | Mejora de rendimiento |
| `test` | Pruebas |
| `docs` | Documentación |
| `chore` | Mantenimiento, dependencias |
| `ci` | Pipeline |

**Ejemplos:**

```
feat(auth): agregar inicio de sesión con enlace mágico

fix(billing): corregir redondeo en cálculo de IVA

El cálculo redondeaba antes de sumar en lugar de después,
generando diferencias de centavos en facturas con muchas líneas.

Fixes #234
```

**Cambios que rompen compatibilidad:**

```
feat(api)!: cambiar formato de respuesta de /pedidos

BREAKING CHANGE: el campo `total` ahora es un objeto con
`monto` y `moneda` en lugar de un número.
```

**Idioma:** en inglés si el proyecto puede tener colaboradores externos o es open source. En español si es interno y el equipo lo prefiere. **Lo importante es consistencia**, no cuál elijas.

---

### Pull requests que se revisan de verdad

**Pequeños.** Un pull request de 200 líneas se revisa. Uno de 1,500 se aprueba sin leer. Si tu cambio es grande, divídelo en varios secuenciales.

**Con descripción útil.** Qué problema resuelve, cómo se probó, qué mirar con atención. No repitas lo que el diff ya muestra.

**Con verificaciones pasando antes de pedir revisión.** No hagas que otra persona descubra que tus pruebas fallan.

**Autorevisión primero.** Lee tu propio diff antes de pedir revisión. Vas a encontrar código de depuración olvidado, comentarios sin sentido y cosas fuera de alcance.

---

### Protección de rama

En `main`:

```
□ Requiere pull request antes de fusionar
□ Requiere que las verificaciones pasen
□ Requiere que la rama esté actualizada respecto a main
□ Prohíbe force push
□ Prohíbe eliminación
```

**Trabajando solo, actívalo igual.** Es la única red que tienes, y "solo esta vez" es exactamente como se rompe producción un viernes.

---

### Merge, squash o rebase

**Squash and merge** es la opción por defecto correcta para equipos pequeños:
- Un commit limpio por funcionalidad en el historial
- El historial de `main` es legible
- Los commits de trabajo en progreso desaparecen

**Merge commit** cuando quieres preservar el historial detallado de una rama compleja.

**Rebase and merge** para historial lineal sin commits de fusión. Requiere disciplina y entender rebase bien.

**Nunca hagas rebase de ramas compartidas.** Reescribe el historial y rompe el trabajo de quien la tenga descargada.

---

### El comando que salva

```bash
git reflog
```

Registra todos los movimientos de HEAD, incluidos los que "perdiste". Un reset agresivo, un rebase mal hecho, una rama borrada por error: casi siempre se recupera desde aquí.

```bash
git reflog                    # Encuentra el hash del estado bueno
git reset --hard <hash>       # Vuelve ahí
```

**Casi nada se pierde de verdad en Git** si el commit existió alguna vez. Vale la pena saberlo antes de necesitarlo.

---

### Errores frecuentes

**Ramas de dos semanas.** Los conflictos crecen exponencialmente con el tiempo. Fusiona `main` a tu rama a diario, o mejor, haz ramas más cortas.

**Commits de "wip" y "arreglos".** Con squash al fusionar no importan tanto, pero mientras trabajas, commits con mensaje real te ayudan a ti.

**Commitear secretos.** Una vez en el historial, quitarlo requiere reescribirlo. Usa detección de secretos en el pipeline y un `.gitignore` bien configurado desde el inicio.

**Archivos generados versionados.** `node_modules`, artefactos de compilación, archivos de entorno.

**No usar `.gitattributes`.** En equipos mixtos Windows/Mac, los finales de línea generan diffs falsos enormes.

---

### Preguntas frecuentes

**¿Necesito una rama de desarrollo?**
Con despliegue continuo y verificaciones automáticas, no. Añade un paso de fusión sin beneficio real en equipos pequeños.

**¿Y las versiones de producción?**
Etiquetas en `main`. Si necesitas mantener versiones antiguas con parches, ahí sí una rama de mantenimiento por versión.

**¿Cómo manejo un cambio urgente en producción?**
Igual que cualquier cambio: rama, PR, verificaciones, fusión, despliegue. Si tu pipeline tarda tanto que no puedes hacer esto en una urgencia, arregla el pipeline.

---

**Escrito por Carlos Anaya Ruiz** — Desarrollador full-stack. Trabajo con conventional commits y ramas cortas en todos mis proyectos.

---

### PROMPT DE PORTADA — Artículo 085

> Un río de luz verde azulado visto desde arriba, con varias corrientes cortas que se separan del cauce principal y regresan a él rápidamente formando pequeños arcos. Estilo topográfico abstracto sobre terreno oscuro. Vista cenital. Fondo negro carbón, iluminación verde azulado, terreno con textura sutil.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.

---
---

# ARTÍCULO 086

```yaml
title: "Cómo documentar tu proyecto para que la IA lo entienda"
slug: "documentar-proyecto-para-ia"
description: "Cómo escribir documentación que un agente de IA pueda usar: estructura de archivos de contexto, convenciones y qué nunca omitir."
author: "Carlos Anaya Ruiz"
category: "Desarrollo"
tags: ["documentación", "agentes de código", "contexto", "productividad"]
keyword_principal: "documentar proyecto para ia"
```

## Cómo documentar tu proyecto para que la IA lo entienda

**La documentación que sirve a un agente de código es distinta de la que sirve a un humano nuevo: es más explícita, más operativa y contiene reglas negativas.** Un humano infiere convenciones leyendo el código. Un agente también, pero comete menos errores si se las dices.

Y hay un efecto colateral valioso: la documentación que hace productivo a un agente también hace productivo a un desarrollador nuevo.

---

### La jerarquía de documentos

```
proyecto/
├── CLAUDE.md              ← contexto operativo para agentes
├── README.md              ← qué es esto y cómo arrancarlo
├── docs/
│   ├── arquitectura.md    ← decisiones estructurales y su porqué
│   ├── dominio.md         ← conceptos de negocio
│   └── adr/               ← registros de decisión
└── packages/
    └── db/
        └── CLAUDE.md      ← contexto específico del paquete
```

**Los archivos de contexto anidados funcionan.** Uno en la raíz con lo general, y uno en cada paquete con sus particularidades.

---

### El archivo de contexto: qué debe contener

Cinco bloques, en este orden:

**1. Stack y versiones.**

```markdown
## Stack
- Monorepo: pnpm 9 + Turborepo
- Web: Next.js App Router, React 19, TypeScript strict
- Datos: Postgres vía Supabase, RLS activo en todas las tablas
- Background: Inngest
- Validación: Zod en toda frontera de entrada
- Estilos: Tailwind, sin CSS-in-JS
```

Incluye lo que **no** se usa. "Sin CSS-in-JS" evita que el agente lo introduzca.

**2. Comandos.**

```markdown
## Comandos
- `pnpm dev` — desarrollo
- `pnpm typecheck` — verificación de tipos. EJECUTAR SIEMPRE antes de terminar
- `pnpm test` — pruebas
- `pnpm db:migrate` — aplicar migraciones (requiere aprobación)
```

Que un agente pueda verificar su propio trabajo cambia por completo la calidad del resultado.

**3. Convenciones.**

```markdown
## Convenciones
- Server Components por defecto; 'use client' solo en componentes hoja
- Toda Server Action valida entrada con Zod y verifica sesión
- Toda tabla nueva requiere política RLS + prueba de acceso cruzado
- Nombres de archivo en kebab-case
- Commits convencionales en inglés
- Errores de negocio con clases propias, no strings
```

**4. Reglas duras, en negativo.**

```markdown
## NUNCA
- Hacer push directo a main
- Modificar archivos de migración ya aplicados
- Usar `any` sin comentario justificando
- Commitear archivos .env
- Consultar la base de datos desde componentes cliente
- Registrar datos personales en logs
```

**Este bloque es el que más previene desastres.** Las reglas negativas explícitas funcionan mejor que esperar que se infieran.

**5. Contexto de dominio.**

```markdown
## Dominio
- Una "organización" es el tenant. Todo dato pertenece a una.
- Un usuario puede pertenecer a varias organizaciones.
- Los "expedientes" tienen estados que solo avanzan hacia adelante.
- El campo `legacy_id` existe por la migración de 2024. No usar en código nuevo.
```

Ese último tipo de nota —explicar la rareza histórica— es la que más tiempo ahorra y la que nadie escribe.

---

### Registros de decisión arquitectónica

Un documento corto por cada decisión estructural:

```markdown
# ADR-007: Usar RLS en lugar de filtrado en aplicación

## Estado
Aceptada — 2026-03-14

## Contexto
El aislamiento entre organizaciones dependía de que cada consulta
incluyera el filtro correcto. En dos ocasiones se olvidó.

## Decisión
Activar Row Level Security en todas las tablas de datos de cliente,
con políticas basadas en la membresía del usuario.

## Consecuencias
- El aislamiento deja de depender de la disciplina del equipo
- Requiere índices sobre organizacion_id
- Las operaciones administrativas requieren service role, solo en servidor
- Toda tabla nueva necesita su política + prueba
```

**Por qué importa:** en seis meses nadie recuerda por qué se tomó una decisión. Sin el contexto, alguien la revierte por parecer innecesariamente compleja.

---

### El código como documentación

**Nombres que explican.** `calcularTotalConImpuestos` no necesita comentario. `calc2` sí, y el comentario se desactualiza.

**Tipos como contrato.** Un tipo bien definido comunica más que un párrafo.

**Comentarios que explican el porqué, no el qué.**

```ts
// Mal: repite lo que el código dice
// Incrementa el contador
contador++

// Bien: explica lo que el código no puede decir
// El proveedor rechaza más de 3 reintentos en 60s con un bloqueo
// temporal de 15 minutos. Mantener el límite en 3.
const MAX_REINTENTOS = 3
```

**Ejemplos ejecutables.** Las pruebas son documentación que no puede mentir: si se desactualizan, fallan.

---

### Lo que se debe evitar

**Documentación duplicada.** Si el stack está en el README y en el archivo de contexto, se van a contradecir. Una fuente por dato.

**Documentos gigantes.** Un archivo de contexto de 500 líneas consume espacio de contexto sin aportar proporcionalmente. Sé denso.

**Documentar lo obvio.** No expliques qué es React.

**Documentación desactualizada.** Peor que ninguna, porque genera confianza injustificada. Si no vas a mantenerla, no la escribas.

---

### Cómo mantenerlo vivo

**La regla de las dos correcciones:** si corriges lo mismo dos veces, se convierte en una línea del archivo de contexto.

**Revisión trimestral.** Lee el archivo completo y borra lo que ya no aplica.

**Actualízalo en el mismo pull request** que cambia la convención. Si el cambio de convención y su documentación van separados, la documentación no llega.

---

### Preguntas frecuentes

**¿Qué tan largo debe ser el archivo de contexto?**
Entre 100 y 250 líneas para un proyecto mediano. Si crece mucho, divide por paquete.

**¿Esto sirve también para humanos nuevos?**
Sí, y ese es el mejor argumento para escribirlo. La misma información que hace productivo a un agente reduce el tiempo de incorporación de una persona.

**¿Debo documentar cada función?**
No. Documenta las decisiones, las convenciones y lo que no es evidente. El código bien escrito documenta el resto.

---

**Escrito por Carlos Anaya Ruiz** — Desarrollador full-stack. Mantengo archivos de contexto en todos mis repositorios.

---

### PROMPT DE PORTADA — Artículo 086

> Un mapa tridimensional desplegándose en el aire por capas superpuestas, cada capa revelando más detalle estructural que la anterior, mientras un haz de luz verde azulado lo recorre verticalmente de arriba abajo leyéndolo. Sin ningún texto ni símbolo legible. Fondo negro carbón, iluminación verde azulado volumétrica.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.
