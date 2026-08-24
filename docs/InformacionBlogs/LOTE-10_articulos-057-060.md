# LOTE 10 — ARTÍCULOS COMPLETOS 057–060
**Autor:** Carlos Anaya Ruiz · Listos para publicar

---
---

# ARTÍCULO 057

```yaml
title: "Reserved Instances y Savings Plans explicados"
slug: "reserved-instances-savings-plans-aws"
description: "Reserved Instances vs Savings Plans: cuál conviene, cómo calcular la cobertura óptima y por qué comprometerte antes de right-sizing es un error caro."
author: "Carlos Anaya Ruiz"
category: "Cloud"
tags: ["aws", "finops", "costos", "savings plans"]
keyword_principal: "savings plans aws"
```

## Reserved Instances y Savings Plans explicados

**Son mecanismos de descuento a cambio de comprometerte a un nivel de uso durante uno o tres años.** El descuento es sustancial, pero el compromiso es real: pagas lo pactado uses o no uses.

Y hay una regla que domina todas las demás: **nunca te comprometas antes de haber redimensionado tu infraestructura.**

---

### La diferencia entre los dos mecanismos

**Instancias Reservadas (RI).** Te comprometes a un tipo específico de recurso: familia de instancia, región y, según la modalidad, tamaño y sistema operativo. A cambio, un descuento importante sobre el precio bajo demanda.

**Planes de Ahorro (Savings Plans).** Te comprometes a un **gasto por hora** en dólares, no a un recurso concreto. Mientras consumas ese gasto en servicios elegibles, aplica el descuento.

| | Instancias Reservadas | Planes de Ahorro |
|---|---|---|
| Compromiso | Un tipo de recurso | Un gasto por hora |
| Flexibilidad | Baja a media | Alta |
| Se puede revender | En algunos casos | No |
| Cobertura entre servicios | No | Sí, en las variantes amplias |
| Complejidad de gestión | Alta con muchos tipos | Baja |

**Para la mayoría de las empresas, los planes de ahorro flexibles son la mejor opción**, porque la flexibilidad de poder cambiar de tipo de instancia sin perder el descuento vale más que el porcentaje adicional de un compromiso rígido.

---

### El error que cuesta más caro

Las herramientas de recomendación de la consola calculan el ahorro potencial **sobre tu configuración actual**.

Si tu base de datos está sobredimensionada al doble de lo que necesita, la recomendación te dirá: "comprométete a este tamaño durante un año y ahorra un 40%".

Y es cierto: ahorras 40% sobre un gasto que **no deberías tener**. Además, quedas atado a esa configuración excesiva durante todo el plazo.

**El orden correcto, sin excepciones:**

```
1. Eliminar recursos no usados
2. Ajustar tipos de almacenamiento
3. Redimensionar cómputo según uso real
4. Estabilizar y monitorear 4-8 semanas
5. AHORA calcular compromisos
```

Comprometerse en el paso 1 en lugar del paso 5 es el error de FinOps más común y más caro que existe.

---

### Cómo calcular la cobertura correcta

**Paso 1 — Identifica tu carga base.**

Grafica tu consumo por hora durante 60 a 90 días. Vas a ver un patrón: un piso que nunca baja, y picos por encima.

Tu carga base es ese piso, medido con el percentil 10 o 20 de tu consumo horario. Es lo que consumes prácticamente siempre.

**Paso 2 — Cubre solo la base, no los picos.**

Los picos se pagan bajo demanda o con capacidad puntual. Comprometerte al nivel de tus picos significa pagar por capacidad ociosa la mayor parte del tiempo.

**Paso 3 — Deja margen.**

Una cobertura razonable para empezar está entre el **60% y el 75% de la carga base**, no el 100%. Razones:

- Tu arquitectura puede cambiar (migrar a serverless, optimizar más, cambiar de servicio).
- Puedes reducir plantilla de infraestructura.
- Los precios bajan con el tiempo, y estar sobrecomprometido te impide beneficiarte.

**Paso 4 — Escalona los compromisos.**

En lugar de comprar todo de una vez, compra en tramos cada trimestre. Así:
- Tus vencimientos no coinciden todos en la misma fecha
- Puedes ajustar según cómo evolucione tu consumo
- Reduces el riesgo de un compromiso mal calculado

---

### Plazo y forma de pago

**Un año vs. tres años.** Tres años da mayor descuento, pero es mucho tiempo en infraestructura. Si tu arquitectura está estable y no prevés cambios grandes, tres años puede convenir para la porción más estable de tu carga base. Para todo lo demás, un año.

**Sin pago inicial / parcial / total.** El pago total por adelantado da el mayor descuento pero inmoviliza capital. Para una empresa donde el flujo de efectivo importa, el pago sin adelanto o parcial suele ser mejor decisión financiera aunque el descuento sea menor. Haz el cálculo con tu costo de capital, no solo con el porcentaje.

---

### Cómo monitorear después de comprar

Dos métricas, revisadas mensualmente:

**Cobertura.** Qué porcentaje de tu uso elegible está cubierto por compromisos. Si baja mucho, estás pagando bajo demanda de más. Si sube al 100%, considera si podrías haber comprometido más.

**Utilización.** Qué porcentaje de tu compromiso estás usando. **Debe estar cerca del 100%.** Si baja, estás pagando por capacidad que no consumes: es dinero perdido directo.

Una utilización por debajo del 95% de forma sostenida significa que sobrecompraste. Aprende para el siguiente ciclo.

---

### Qué hacer si te sobrecomprometiste

Opciones, en orden de preferencia:

1. **Consolida cargas** hacia los recursos cubiertos por el compromiso.
2. **Mueve entornos de desarrollo y pruebas** a los tipos cubiertos para consumir el compromiso.
3. **Revende**, si el tipo de compromiso lo permite. Hay un mercado secundario para ciertas modalidades de instancias reservadas, con descuento.
4. **Absórbelo** y ajusta el cálculo en la renovación.

No hay cancelación. Por eso el paso 3 del cálculo —dejar margen— importa tanto.

---

### Preguntas frecuentes

**¿Cuánto se ahorra realmente?**
Los descuentos varían por servicio, plazo y modalidad de pago. Consulta los porcentajes vigentes en la documentación oficial. Lo relevante es que el ahorro es significativo y que se aplica sobre una base que primero debe estar bien dimensionada.

**¿Aplican a servicios serverless?**
Algunas modalidades de planes de ahorro cubren cómputo serverless y contenedores. Verifica la elegibilidad del servicio específico antes de calcular.

**¿Debo comprometerme si mi carga crece rápido?**
Sí, pero solo sobre la porción que ya es estable. El crecimiento se cubre bajo demanda y se comprometerá cuando se estabilice.

**¿Y si migro a otra región?**
Algunas modalidades tienen flexibilidad regional, otras no. Si prevés una migración, elige la modalidad flexible o pospón el compromiso.

---

**Escrito por Carlos Anaya Ruiz** — Consultor tecnológico. Audito y optimizo costos de infraestructura en cuentas de producción.

---

### PROMPT DE PORTADA — Artículo 057

> Un contrato representado como una placa de vidrio azul sólido descendiendo y cerrándose sobre un bloque de cómputo geométrico, con una línea de tiempo de luz azul extendiéndose desde el bloque hacia un horizonte lejano. Perspectiva profunda con punto de fuga. Fondo negro carbón, iluminación azul fría, reflejo en la superficie del vidrio.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.

---
---

# ARTÍCULO 058

```yaml
title: "Vercel vs AWS vs Railway: dónde desplegar tu producto"
slug: "vercel-vs-aws-vs-railway"
description: "Vercel, AWS y Railway comparados por costo real a distintas escalas, control operativo, velocidad de despliegue y facilidad de migración."
author: "Carlos Anaya Ruiz"
category: "Cloud"
tags: ["vercel", "aws", "railway", "despliegue"]
keyword_principal: "vercel vs aws"
```

## Vercel vs AWS vs Railway: dónde desplegar tu producto

**La pregunta correcta no es cuál es mejor, sino cuánto vale tu tiempo de operación frente a tu factura de infraestructura.** Esa relación cambia según el tamaño de tu equipo y la escala de tu producto, y por eso la respuesta cambia con el tiempo.

---

### La comparación honesta

| Dimensión | Vercel | AWS | Railway |
|---|---|---|---|
| Tiempo hasta el primer despliegue | Minutos | Horas o días | Minutos |
| Curva de aprendizaje | Baja | Alta | Baja |
| Control de la infraestructura | Bajo | Total | Medio |
| Costo a escala pequeña | Bajo | Bajo | Bajo |
| Costo a escala grande | Alto | El más bajo posible | Medio |
| Trabajo operativo requerido | Casi nulo | Alto | Bajo |
| Procesos de larga duración | Limitado | Sin límite | Sí |
| Facilidad de migrar fuera | Media | Alta | Alta |

---

### Vercel: velocidad de entrega

**Dónde gana:**
- Despliegue por rama con vista previa automática. Cada pull request genera una URL funcional. Para equipos que iteran rápido, es transformador.
- Cero configuración de infraestructura.
- Red de distribución global incluida.
- Integración muy afinada con frameworks de frontend modernos.

**Dónde duele:**
- El costo escala con el uso y puede sorprender. Un pico de tráfico sobre rutas dinámicas se traduce en factura.
- Límites de duración en funciones: no es el lugar para procesamiento pesado.
- Poco control sobre la infraestructura subyacente.
- Depuración de problemas de rendimiento con menos visibilidad de la que tendrías en infraestructura propia.

**Para quién:** equipos pequeños y medianos donde la velocidad de entrega es el cuello de botella, con productos mayormente web y cargas que caben en el modelo serverless.

---

### AWS: control y costo a escala

**Dónde gana:**
- Costo por unidad de cómputo, el más bajo posible si sabes optimizar.
- Control total: tipo de instancia, red, almacenamiento, todo.
- Catálogo enorme de servicios gestionados.
- Sin límites artificiales de duración ni de recursos.
- Compromisos de capacidad para reducir el costo de la carga base.

**Dónde duele:**
- La complejidad es real. Necesitas conocimiento de redes, permisos, seguridad y monitoreo.
- El tiempo de configuración inicial es alto.
- Es fácil dejar recursos huérfanos y acumular gasto silencioso.
- Requiere alguien que se ocupe de la operación de forma continua.

**Para quién:** productos con escala significativa, requisitos de infraestructura específicos, o equipos con capacidad operativa. También cuando la factura mensual ya justifica el salario de quien la optimiza.

---

### Railway: el punto medio

**Dónde gana:**
- Despliegue casi tan simple como Vercel, pero con contenedores reales.
- Soporta procesos de larga duración, workers, y servicios que no encajan en serverless.
- Bases de datos y servicios adicionales provisionados en un clic.
- Precio más predecible que el modelo por invocación.

**Dónde duele:**
- Ecosistema más pequeño.
- Menos opciones de configuración fina que en infraestructura propia.
- A escala muy grande, el costo por unidad es mayor que administrar tú mismo.

**Para quién:** productos que necesitan más que funciones serverless pero cuyo equipo no quiere —ni debe— dedicar tiempo a administrar infraestructura.

---

### El cálculo que realmente decide

Compara el **costo total**, no solo la factura:

```
Costo total = Factura de infraestructura
            + (Horas de operación mensual × costo por hora del equipo)
            + Costo de oportunidad de lo que no se construyó
```

Un equipo de tres personas donde una dedica 20 horas mensuales a operar infraestructura está gastando el equivalente a un salario parcial. Si mover eso a una plataforma gestionada sube la factura en 8,000 pesos pero libera esas 20 horas, la decisión es obvia.

**Y al revés:** si tu factura de plataforma gestionada es de 60,000 pesos mensuales y administrarlo tú mismo costaría 20,000 más 30 horas de operación, ahí el cálculo cambia.

**El punto de inflexión típico** ronda cuando la factura mensual de la plataforma gestionada supera lo que costaría la infraestructura equivalente más el tiempo de una persona a tiempo parcial.

---

### La arquitectura híbrida: lo que hago en la práctica

No es una decisión de todo o nada. La combinación que funciona bien:

- **Frontend y aplicación web** en la plataforma con mejor experiencia de despliegue.
- **Trabajo en background y procesos largos** en un servicio de orquestación o en contenedores.
- **Base de datos** en un servicio gestionado especializado.
- **Archivos y multimedia** en almacenamiento de objetos con CDN. Esto solo suele ser el mayor ahorro, porque el ancho de banda de archivos pesados es caro en plataformas de aplicación.
- **Cargas pesadas específicas** donde tengan sentido.

Esta arquitectura te da velocidad donde importa y costo controlado donde el volumen es alto.

---

### Cómo evitar quedarte atrapado

Independientemente de dónde despliegues:

**Mantén la lógica de negocio fuera de las APIs específicas de la plataforma.** Si tu código depende profundamente de funciones propietarias, migrar es una reescritura.

**Contenedoriza lo que puedas.** Un contenedor corre en cualquier lado.

**Base de datos portable.** Postgres estándar corre en todas partes. Una base de datos propietaria no.

**Infraestructura como código.** Aunque uses una plataforma gestionada, documenta la configuración.

**Prueba la migración antes de necesitarla.** Levanta tu aplicación en un entorno alternativo una vez. Descubrirás los amarres reales.

---

### Preguntas frecuentes

**¿Cuál elijo si estoy empezando?**
La que te permita lanzar más rápido. A escala pequeña la diferencia de costo es de cientos de pesos; la diferencia de velocidad puede ser de semanas. Optimizas después, cuando tengas usuarios.

**¿Cuándo debo migrar?**
Cuando tengas un problema medido: costo desproporcionado, límite técnico que te bloquea, o requisito de cumplimiento. No por preferencia arquitectónica.

**¿Puedo usar varias a la vez?**
Sí, y es lo más común en productos maduros. Cada carga donde mejor encaje.

---

**Escrito por Carlos Anaya Ruiz** — Desarrollador full-stack. Opero productos en producción en arquitecturas híbridas.

---

### PROMPT DE PORTADA — Artículo 058

> Tres plataformas flotantes de escala y complejidad crecientes alineadas en profundidad: una minimalista y pequeña en primer plano, una intermedia en el centro, una enorme y llena de estructura al fondo. Todas unidas por un mismo raíl de luz azul que las atraviesa. Fondo negro carbón, iluminación azul fría, profundidad de campo que desenfoca la más lejana.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.

---
---

# ARTÍCULO 059

```yaml
title: "CI/CD con GitHub Actions: pipeline completo"
slug: "ci-cd-github-actions-pipeline"
description: "Pipeline completo de CI/CD con GitHub Actions listo para copiar: tests, lint, build cacheado, entornos y despliegue con aprobación."
author: "Carlos Anaya Ruiz"
category: "DevOps"
tags: ["ci cd", "github actions", "automatización", "despliegue"]
keyword_principal: "ci cd github actions"
```

## CI/CD con GitHub Actions: pipeline completo

**Un pipeline de CI/CD verifica automáticamente cada cambio y lo despliega sin intervención manual cuando pasa las verificaciones.** Su valor real no es la automatización del despliegue: es que nadie pueda meter a producción código que no compila, no pasa pruebas o tiene vulnerabilidades conocidas.

---

### El pipeline base

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  verificar:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'

      - name: Instalar dependencias
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: Verificación de tipos
        run: pnpm typecheck

      - name: Pruebas
        run: pnpm test -- --coverage

      - name: Auditoría de dependencias
        run: pnpm audit --audit-level=high

      - name: Compilar
        run: pnpm build
```

**El bloque `concurrency` es de lo más útil y menos usado.** Cancela ejecuciones anteriores de la misma rama cuando llega un commit nuevo. Ahorra minutos de ejecución y evita que se acumule una cola de compilaciones obsoletas.

**`--frozen-lockfile` es obligatorio.** Falla si el archivo de bloqueo no coincide con el manifiesto, en lugar de actualizarlo silenciosamente. Sin eso, tu CI puede instalar versiones distintas a las de tu máquina.

---

### Despliegue con entornos y aprobación

```yaml
  desplegar-staging:
    needs: verificar
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment:
      name: staging
      url: https://staging.midominio.com
    steps:
      - uses: actions/checkout@v4
      - name: Desplegar
        run: ./scripts/deploy.sh staging
        env:
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN_STAGING }}

  desplegar-produccion:
    needs: desplegar-staging
    runs-on: ubuntu-latest
    environment:
      name: production          # Con revisores requeridos configurados
      url: https://midominio.com
    steps:
      - uses: actions/checkout@v4
      - name: Desplegar
        run: ./scripts/deploy.sh production
        env:
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN_PROD }}
```

**Los entornos de GitHub son la pieza clave.** Configurados en el repositorio, permiten:
- Requerir aprobación humana antes de ejecutar el trabajo
- Restringir qué ramas pueden desplegar a ese entorno
- Aislar secretos por entorno
- Imponer un tiempo de espera antes del despliegue

Es la forma correcta de tener despliegue automático a staging y aprobado a producción.

---

### Monorepo: ejecutar solo lo afectado

```yaml
      - uses: actions/checkout@v4
        with:
          fetch-depth: 2      # Necesario para comparar contra el commit anterior

      - name: Verificar solo lo afectado
        run: pnpm turbo run lint typecheck test build --filter=...[HEAD^1]
        env:
          TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
          TURBO_TEAM: ${{ vars.TURBO_TEAM }}
```

En un monorepo con seis aplicaciones, esto es la diferencia entre esperar dos minutos y quince.

---

### Seguridad del pipeline

Esta parte se ignora con frecuencia y es donde se producen incidentes reales.

**1. Fija las acciones de terceros por hash de commit, no por etiqueta.**

```yaml
# Frágil: la etiqueta puede reapuntarse
- uses: alguna-org/alguna-accion@v3

# Seguro: hash inmutable
- uses: alguna-org/alguna-accion@a1b2c3d4e5f6...
```

Una acción de terceros ejecuta código en tu pipeline con acceso a tus secretos. Si la etiqueta se reapunta a código malicioso, ya está dentro.

**2. Permisos mínimos por trabajo.**

```yaml
permissions:
  contents: read
  pull-requests: write   # Solo si lo necesita
```

Por defecto, los tokens pueden tener más permisos de los necesarios. Restríngelos explícitamente.

**3. Cuidado con los disparadores sobre pull requests de forks.**

El disparador `pull_request_target` ejecuta con permisos elevados y acceso a secretos, con código que puede venir de un fork no confiable. Es un vector de ataque conocido. Si no sabes exactamente por qué lo necesitas, no lo uses.

**4. Nunca imprimas secretos.**

GitHub enmascara los valores conocidos, pero si transformas un secreto (lo decodificas, lo concatenas) el enmascaramiento puede fallar.

**5. Detección de secretos en el código.**

Añade un paso que escanee el repositorio buscando credenciales committeadas. Es de las verificaciones con mejor retorno.

---

### Optimizar el tiempo de ejecución

**Caché de dependencias.** El `cache: 'pnpm'` del paso de configuración de Node ya lo hace. Verifica que esté funcionando revisando los tiempos.

**Caché de compilación.** Con Turborepo y caché remoto, las compilaciones sin cambios son casi instantáneas.

**Paralelización.** Trabajos independientes corren en paralelo por defecto. Solo usa `needs` cuando haya dependencia real.

**Matrices con criterio.** Probar en cinco versiones de Node multiplica por cinco el tiempo. Prueba en las que realmente soportas.

**Ejecutores más grandes.** Para compilaciones pesadas, los ejecutores de mayor capacidad cuestan más por minuto pero pueden salir a cuenta si reducen el tiempo lo suficiente.

---

### Los errores más comunes

**Pipeline lento que la gente evita.** Si tarda 20 minutos, el equipo empieza a saltárselo. Objetivo: menos de 5 minutos para la verificación de un pull request.

**Pruebas inestables (flaky).** Una prueba que falla aleatoriamente enseña al equipo a reintentar sin mirar. Arréglala o elimínala; una prueba en la que nadie confía es peor que no tenerla.

**Sin verificaciones obligatorias.** Configura la protección de rama para que no se pueda fusionar sin que el pipeline pase. Sin eso, el pipeline es decorativo.

**Migraciones de base de datos automáticas en el despliegue.** Un cambio destructivo generado sin querer no se deshace. Migraciones con revisión y ejecución controlada.

**Sin plan de reversión.** Ten un camino probado para volver a la versión anterior en minutos.

---

### Preguntas frecuentes

**¿Cuánto cuesta GitHub Actions?**
Los repositorios públicos tienen ejecución gratuita. Los privados tienen minutos incluidos según el plan y facturación por encima. Los ejecutores de mayor capacidad y otros sistemas operativos consumen a tarifas distintas. Consulta los detalles vigentes en la documentación.

**¿Ejecutores propios o los de GitHub?**
Los de GitHub para la mayoría de los casos. Ejecutores propios cuando necesitas acceso a red privada, hardware específico, o tienes tanto volumen que el costo lo justifica. Ten en cuenta que un ejecutor propio requiere que tú lo mantengas y lo asegures.

**¿Despliegue continuo a producción?**
Solo con cobertura de pruebas seria, monitoreo de errores y reversión rápida. Sin esas tres cosas, mantén la aprobación manual.

---

**Escrito por Carlos Anaya Ruiz** — Desarrollador full-stack. Diseño pipelines de integración y despliegue continuo en monorepos.

---

### PROMPT DE PORTADA — Artículo 059

> Una cinta transportadora tridimensional por la que un bloque de código luminoso atraviesa cinco compuertas de verificación consecutivas, cada una emitiendo un destello azul en el momento exacto de validarlo. Vista lateral en perspectiva con el movimiento congelado. Fondo negro carbón, iluminación azul fría, materiales industriales de metal oscuro.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.

---
---

# ARTÍCULO 060

```yaml
title: "Observabilidad: logs, métricas y trazas explicados"
slug: "observabilidad-logs-metricas-trazas"
description: "Los tres pilares de la observabilidad explicados con ejemplos, qué instrumentar primero y cómo evitar pagar fortunas en ingesta de logs."
author: "Carlos Anaya Ruiz"
category: "DevOps"
tags: ["observabilidad", "monitoreo", "opentelemetry", "logs"]
keyword_principal: "observabilidad software"
```

## Observabilidad: logs, métricas y trazas explicados

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

---

**Escrito por Carlos Anaya Ruiz** — Desarrollador full-stack. Instrumento sistemas en producción con métricas de negocio y técnicas.

---

### PROMPT DE PORTADA — Artículo 060

> Tres flujos de luz azul de texturas claramente distintas —uno granular y discontinuo, uno continuo y liso, uno ramificado en árbol— entrelazándose en una trenza que asciende hacia un ojo geométrico abstracto hecho de cristal facetado. Fondo negro carbón, iluminación azul fría volumétrica, partículas suspendidas.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.
