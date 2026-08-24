# LOTE 14 — ARTÍCULOS COMPLETOS 087–090
**Autor:** Carlos Anaya Ruiz · Listos para publicar

---
---

# ARTÍCULO 087

```yaml
title: "Herramientas gratuitas que reemplazan software caro"
slug: "herramientas-gratuitas-reemplazan-software-caro"
description: "Herramientas gratuitas y open source que sustituyen software de pago, con la comparación honesta de qué pierdes en cada cambio."
author: "Carlos Anaya Ruiz"
category: "Desarrollo"
tags: ["herramientas", "open source", "costos", "productividad"]
keyword_principal: "herramientas gratuitas para desarrolladores"
```

## Herramientas gratuitas que reemplazan software caro

**Casi toda herramienta de pago tiene una alternativa gratuita viable. Lo que cambia es qué pierdes.** Este artículo es honesto sobre eso: cada sustitución tiene un costo, y a veces ese costo es mayor que la licencia.

---

### El criterio de decisión

Antes de cambiar cualquier herramienta, calcula:

```
Costo real = Precio (0 si es gratuita)
           + Horas de configuración × tu costo por hora
           + Horas de mantenimiento mensual × 12 × tu costo
           + Costo de la funcionalidad que pierdes
```

Una herramienta gratuita que te consume tres horas mensuales de mantenimiento cuesta más que una suscripción de 30 dólares si tu hora vale algo.

**La regla:** gratis tiene sentido cuando el mantenimiento es cercano a cero o cuando el control te aporta algo concreto.

---

### Desarrollo

| De pago | Alternativa gratuita | Qué pierdes |
|---|---|---|
| IDEs comerciales | VS Code / VSCodium | Refactorizaciones avanzadas en lenguajes específicos |
| Postman de pago | Bruno, Hoppscotch | Colaboración en equipo, algunas automatizaciones |
| Clientes SQL de pago | DBeaver, pgAdmin | Pulido de interfaz, algunas visualizaciones |
| Clientes Git de pago | Interfaz de VS Code, línea de comandos | Visualización de historiales muy complejos |
| Herramientas de API | Insomnia (versión libre), curl | Sincronización en la nube |

**Bruno merece mención aparte:** guarda las colecciones como archivos en tu repositorio, versionables con Git. Es una ventaja real sobre las alternativas que las guardan en la nube.

---

### Infraestructura y operación

| De pago | Alternativa | Qué pierdes |
|---|---|---|
| Plataformas de automatización | n8n autohospedado | Operación del servidor es tuya |
| Herramientas de monitoreo | Grafana + Prometheus | Configuración considerable, mantenimiento continuo |
| Captura de errores comercial | GlitchTip, Sentry autohospedado | Escalabilidad, hay que operarlo |
| Almacenamiento de objetos comercial | MinIO autohospedado | Alta disponibilidad, respaldos son tuyos |
| Análisis web comercial | Umami, Plausible autohospedado | Funcionalidades avanzadas de atribución |

**Advertencia importante en esta categoría:** autohospedar herramientas de infraestructura significa que ahora tú eres responsable de su disponibilidad, sus actualizaciones de seguridad y sus respaldos. Es exactamente el trabajo operativo que querías evitar.

**Cuándo sí compensa:** cuando tienes requisitos de privacidad que lo exigen, o cuando el volumen hace que la versión comercial sea desproporcionadamente cara.

---

### Diseño y contenido

| De pago | Alternativa | Qué pierdes |
|---|---|---|
| Suites de diseño gráfico | GIMP, Krita | Curva de aprendizaje mayor, flujos menos pulidos |
| Ilustración vectorial | Inkscape | Interoperabilidad con formatos propietarios |
| Edición de video | DaVinci Resolve (versión libre), Kdenlive | Algunas funciones avanzadas |
| Diseño de interfaz | Penpot | Ecosistema de plugins más pequeño |
| Bancos de imágenes | Unsplash, Pexels | Especificidad, y todos usan las mismas imágenes |

**DaVinci Resolve** es un caso donde la versión gratuita es genuinamente profesional. No es una alternativa de segunda.

---

### Productividad y gestión

| De pago | Alternativa | Qué pierdes |
|---|---|---|
| Notion, Confluence | Obsidian, Logseq | Colaboración en tiempo real |
| Gestores de proyecto comerciales | Vikunja, Plane, Focalboard | Integraciones, pulido |
| Almacenamiento en la nube | Nextcloud autohospedado | Fiabilidad sin trabajo, sincronización impecable |
| Gestores de contraseñas comerciales | Bitwarden (nivel gratuito), Vaultwarden | Funciones de administración empresarial |
| Firma electrónica | Documenso | Validez jurídica según jurisdicción — **verifícalo** |

**Sobre firma electrónica:** la validez legal de una firma depende del marco de cada país. En México hay requisitos específicos según el tipo de acto. **No sustituyas una solución con validez jurídica reconocida por una alternativa sin verificar con asesoría legal.**

---

### Servicios en la nube: los niveles gratuitos

Muchos servicios tienen niveles gratuitos suficientes para proyectos pequeños:

- **Alojamiento de aplicaciones:** varias plataformas tienen nivel gratuito para proyectos personales
- **Base de datos:** niveles gratuitos con límites de tamaño y de conexiones
- **Correo transaccional:** volúmenes mensuales gratuitos razonables
- **Repositorios y CI:** minutos incluidos generosos
- **CDN:** planes gratuitos muy capaces

**Advertencia sobre los niveles gratuitos:** casi todos tienen condiciones de uso no comercial o límites que se alcanzan con tráfico real. Léelas antes de construir un negocio encima. Y ten un plan de qué haces cuando los superes.

---

### Cuándo NO cambiar a la alternativa gratuita

Sé honesto en estos casos:

**Cuando el mantenimiento recae en ti y ya vas corto de tiempo.**

**Cuando la herramienta es central a tu operación diaria.** El costo de una interrupción supera la licencia.

**Cuando el equipo ya domina la de pago.** El costo de retraining es real.

**Cuando hay requisitos de cumplimiento o soporte contractual.** Muchos clientes empresariales exigen proveedores con soporte formal y acuerdos de nivel de servicio.

**Cuando la diferencia de precio es trivial frente al valor.** Discutir una suscripción de 15 dólares mensuales mientras pierdes horas es mala asignación de atención.

---

### La estrategia que uso

**Pago sin dudar por:** lo que evita trabajo operativo (base de datos gestionada, despliegue, orquestación), lo que uso todos los días varias horas, y lo que si falla me cuesta dinero.

**Uso gratuito para:** herramientas de uso ocasional, entornos de desarrollo y pruebas, proyectos experimentales, y todo donde el nivel gratuito cubre mi uso real sin trucos.

**Nunca autohospedo:** bases de datos de producción, correo, y nada que si se cae interrumpa el servicio a un cliente.

---

### Preguntas frecuentes

**¿Open source siempre es gratis?**
No. Muchos proyectos open source tienen versiones comerciales alojadas. Y "gratis" en licencia no significa gratis en operación.

**¿Es seguro usar software gratuito en producción?**
Buena parte de la infraestructura de internet corre sobre software libre. Lo importante es la madurez del proyecto, la actividad de mantenimiento y la velocidad con que atiende vulnerabilidades, no el precio.

**¿Cómo evalúo un proyecto open source antes de adoptarlo?**
Frecuencia de commits, número de mantenedores activos, tiempo de respuesta a incidencias, historial de atención a vulnerabilidades, y si hay una empresa detrás con modelo de negocio sostenible.

---

**Escrito por Carlos Anaya Ruiz** — Desarrollador full-stack. Combino herramientas comerciales y libres según el costo total, no según el precio de lista.

---

### PROMPT DE PORTADA — Artículo 087

> Una estantería modular flotante donde módulos pesados, ornamentados y opacos son sustituidos uno a uno por módulos ligeros y luminosos en verde azulado, con la transición ocurriendo de izquierda a derecha. Vista frontal en perspectiva. Fondo negro carbón, iluminación verde azulado, contraste entre lo pesado y lo ligero.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.

---
---

# ARTÍCULO 088

```yaml
title: "Cuánto cobrar como consultor tecnológico en México"
slug: "cuanto-cobrar-consultor-tecnologico-mexico"
description: "Cómo calcular tu tarifa como consultor tecnológico en México: rangos reales, modelos de cobro y cómo justificar precio sin regatear."
author: "Carlos Anaya Ruiz"
category: "Negocio"
tags: ["tarifas", "freelance", "consultoría", "méxico"]
keyword_principal: "cuánto cobrar desarrollador méxico"
```

## Cuánto cobrar como consultor tecnológico en México

**Tu tarifa no se calcula desde tu sueldo anterior: se calcula desde tus costos reales, tu capacidad facturable y el valor que entregas.** El error más común entre quienes empiezan es tomar el sueldo mensual, dividirlo entre 160 horas y cobrar eso. Ese cálculo omite entre el 40% y el 60% de la realidad.

---

### El cálculo correcto

**Paso 1 — Tu costo real anual.**

```
Gastos personales (12 meses)
+ Impuestos y contribuciones
+ Seguro médico (ya no lo paga un patrón)
+ Equipo y software
+ Formación
+ Colchón para meses sin ingresos
+ Ahorro para retiro
+ Vacaciones (nadie te las paga)
= COSTO ANUAL
```

**Paso 2 — Tus horas facturables reales.**

Este es el número que casi nadie calcula bien.

```
52 semanas
− 4 de vacaciones
− 2 de días festivos y enfermedad
= 46 semanas trabajables

46 semanas × 40 horas = 1,840 horas

PERO: solo entre el 50% y el 65% son facturables.
El resto: ventas, propuestas, administración, cobranza,
formación, trabajo no facturado.

1,840 × 0.55 ≈ 1,000 horas facturables al año
```

**Mil horas, no 1,920.** Ese es el número real.

**Paso 3 — La tarifa base.**

```
Tarifa base = (Costo anual × (1 + margen deseado)) / 1,000
```

Si tu costo anual es de 900,000 pesos y quieres un margen del 25%:

```
(900,000 × 1.25) / 1,000 = 1,125 pesos/hora
```

Ese es tu **piso**, no tu precio.

---

### Rangos de referencia en México

Con la advertencia de que varían mucho por especialidad, tipo de cliente y ciudad:

| Perfil | Rango por hora (MXN) |
|---|---|
| Desarrollador junior freelance | 300 – 600 |
| Desarrollador con experiencia sólida | 700 – 1,400 |
| Especialista en un área concreta | 1,200 – 2,500 |
| Consultor con perfil estratégico | 2,000 – 5,000+ |

**Clientes extranjeros pagan en otro rango.** El mismo trabajo cotizado en dólares a un cliente en Estados Unidos suele estar bastante por encima. No es injusto ni es aprovecharse: es que compites en un mercado con otra estructura de costos.

---

### Los modelos de cobro

**Por hora.**
*Ventaja:* simple, cubre alcance variable.
*Problema:* tu ingreso tiene techo duro, y penalizas tu propia eficiencia. Si te vuelves el doble de rápido, ganas la mitad.
*Usa cuando:* el alcance es genuinamente incierto o es soporte continuo.

**Por proyecto (precio fijo).**
*Ventaja:* la eficiencia te beneficia, el cliente sabe qué va a pagar.
*Problema:* el riesgo de alcance es tuyo. Un proyecto mal estimado te puede costar dinero.
*Usa cuando:* el alcance está bien definido y tienes experiencia estimando ese tipo de trabajo.

**Retención mensual.**
*Ventaja:* ingreso predecible, la mejor base para planificar.
*Problema:* requiere definir bien qué incluye para no convertirse en disponibilidad ilimitada.
*Usa cuando:* hay necesidad continua. **Es el modelo que más deberías buscar.**

**Por valor.**
*Ventaja:* el mayor potencial de ingreso.
*Problema:* requiere poder cuantificar el impacto y que el cliente lo acepte.
*Usa cuando:* el resultado es medible en dinero y tienes credibilidad demostrable.

**Servicio productizado.**
Alcance fijo, precio fijo, proceso repetible. "Auditoría de costos de nube: 25,000 pesos, entrega en 10 días hábiles."
*Es el punto intermedio más subestimado.* Ingreso predecible, sin negociación de alcance, y te obliga a documentar tu proceso.

---

### Cómo cotizar sin regatear

**1. Nunca des precio en la primera llamada.**
Escucha, entiende el problema, pregunta por el impacto. Cotiza después.

**2. Cuantifica el problema antes de hablar de tu precio.**
"Entonces esto les está costando aproximadamente 45,000 pesos al mes en horas del equipo." Cuando el cliente acepta ese número, tu propuesta de 90,000 pesos tiene un marco de referencia.

**3. Presenta tres opciones.**
No una. Tres niveles: mínimo, recomendado, completo. La conversación deja de ser "sí o no" y pasa a ser "cuál". Y la mayoría elige el intermedio.

**4. Precio total, no desglose de horas.**
Si desglosas horas, invitas a discutir cuántas horas debería tomarte. Vendes un resultado.

**5. Si te piden descuento, reduce alcance.**
Nunca bajes el precio manteniendo el alcance: enseña que tu precio era inflado. "Puedo hacerlo por ese monto quitando X." El cliente decide.

**6. Ten un precio mínimo y respétalo.**
Un proyecto por debajo de tu mínimo cuesta más de lo que aporta, porque consume la atención que necesitabas para conseguir uno bueno.

---

### Las señales de que cobras poco

- Aceptan tu cotización sin ninguna objeción, siempre
- Trabajas más de 45 horas semanales y no te alcanza
- No puedes rechazar un proyecto malo
- No tienes tiempo para vender, así que aceptas lo que llega
- Tu cliente te trata como recurso desechable

**Si tu tasa de aceptación de propuestas supera el 80%, tu precio está bajo.** Una tasa saludable ronda entre el 40% y el 60%.

---

### Cómo subir tu tarifa

**Con clientes nuevos:** simplemente cotiza más alto. Es el camino más fácil y nadie se entera.

**Con clientes existentes:**
- Avisa con anticipación, mínimo 60 días
- Justifica con valor entregado, no con tus costos
- Ofrece congelar el precio si firman un compromiso más largo
- Acepta que puedes perder alguno. **Perder al cliente que menos paga suele ser una mejora neta**, porque libera capacidad para uno mejor.

**Ritmo razonable:** revisión anual, incrementos del 10% al 20% mientras estés por debajo del mercado.

---

### Lo administrativo que hay que resolver

- **Régimen fiscal adecuado** para tu nivel de ingresos. Consúltalo con un contador: la diferencia entre regímenes es significativa.
- **Contrato escrito siempre.** Alcance, entregables, plazos, condiciones de pago, propiedad intelectual, cláusula de cambios.
- **Anticipo del 30% al 50%.** Filtra clientes no serios y protege tu flujo.
- **Penalización por pago tardío** en el contrato.
- **Aviso de privacidad propio** si tratas datos personales de tus clientes o de sus usuarios.

---

### Preguntas frecuentes

**¿Cobro distinto a clientes grandes que a pequeños?**
Es común y defendible: el trabajo con una empresa grande implica más reuniones, más requisitos y más riesgo. Pero ten claro tu piso para todos.

**¿Y si el cliente pide ver mi desglose de horas?**
En modelo por proyecto, explicas que vendes un resultado con alcance definido, no horas. Si insiste mucho, probablemente quiere un contratista por hora, no un consultor.

**¿Cuánto cobro por una junta de exploración?**
La primera conversación de 30 minutos, gratis. A partir de ahí, si estás resolviendo problemas, estás trabajando y se cobra.

---

**Escrito por Carlos Anaya Ruiz** — Consultor tecnológico en México. Trabajo con modelos de retención y servicios productizados.

---

### PROMPT DE PORTADA — Artículo 088

> Una balanza asimétrica donde un platillo sostiene un reloj geométrico pequeño y el otro sostiene un bloque de valor sólido mucho más grande iluminado en verde azulado, inclinándose claramente hacia el lado del valor. Vista frontal. Fondo negro carbón, iluminación verde azulado, sombras largas proyectadas.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.

---
---

# ARTÍCULO 089

```yaml
title: "Productividad para desarrolladores: un sistema que aguanta"
slug: "productividad-para-desarrolladores-sistema"
description: "Sistema de productividad para desarrolladores que manejan varios proyectos: bloques de foco, gestión de contexto y prevención del agotamiento."
author: "Carlos Anaya Ruiz"
category: "Productividad"
tags: ["productividad", "foco", "gestión del tiempo", "desarrollo"]
keyword_principal: "productividad para programadores"
```

## Productividad para desarrolladores: un sistema que aguanta

**El recurso escaso de un desarrollador no es el tiempo: es el estado de concentración profunda.** Cuatro horas fragmentadas en bloques de veinte minutos producen mucho menos que dos horas continuas, y cualquiera que haya programado lo sabe.

Todo sistema de productividad para este trabajo se reduce a proteger ese estado.

---

### El costo real de la interrupción

Recuperar el contexto de un problema complejo toma tiempo. No es solo el minuto de la interrupción: es reconstruir en tu cabeza el modelo mental del sistema en el que estabas trabajando.

**Traducción práctica:** un día con seis interrupciones puede tener cero trabajo profundo aunque hayas estado ocho horas frente a la pantalla.

**Lo que esto implica:**
- Las reuniones no cuestan su duración; cuestan la duración más el tiempo de recuperación
- Una reunión a media mañana puede partir el día en dos mitades improductivas
- Las notificaciones activas son incompatibles con el trabajo profundo

---

### La estructura de día que funciona

**Bloque de foco: 2-4 horas, sin interrupciones.**

En tu mejor momento cognitivo, que para la mayoría es la mañana pero no para todos. Averigua cuál es el tuyo observando dos semanas.

Durante ese bloque:
- Notificaciones apagadas, todas
- Correo cerrado
- Teléfono en otra habitación o en modo concentración
- Un solo problema

**Bloque de comunicación: 1-2 horas.**

Correo, mensajes, revisión de pull requests, respuestas. Concentrado, no disperso.

**Bloque de reuniones: agrupadas.**

Todas el mismo día o en la misma franja. Un día con tres reuniones separadas por dos horas cada una es un día perdido; un día con tres reuniones seguidas deja el resto libre.

**Bloque de mantenimiento: 1 hora.**

Actualizaciones, tareas administrativas, limpieza de pendientes pequeños.

---

### Gestión de varios proyectos

Este es el problema específico de quien trabaja con varios clientes o productos.

**Lotes por día, no por hora.**

Cambiar de proyecto tiene un costo de contexto alto. Un día completo en un proyecto produce más que cuatro días con dos horas cada uno.

Si tienes tres proyectos activos: lunes y martes uno, miércoles y jueves otro, viernes el tercero más administración. No perfecto, pero mucho mejor que alternar.

**Un archivo de estado por proyecto.**

Al terminar una sesión de trabajo, escribe tres líneas:
- Dónde quedé exactamente
- Qué sigue
- Qué me estaba bloqueando

Retomar el proyecto tres días después pasa de 40 minutos de reconstrucción a cinco.

**Limita el trabajo en curso.**

Tres proyectos activos como máximo. Un cuarto no significa 33% más producción: significa que los cuatro avanzan mal.

---

### Empezar y terminar

**El ritual de arranque.**

Antes de abrir el editor, escribe en una línea qué vas a lograr en este bloque. No "trabajar en el módulo de pagos", sino "hacer que el webhook de pago fallido marque la suscripción en periodo de gracia".

Objetivo específico y terminable. Sin él, el bloque se disuelve en tareas pequeñas.

**El ritual de cierre.**

Al terminar el día:
- Actualiza el archivo de estado
- Anota el primer paso de mañana
- Cierra todo

**El primer paso anotado es lo más valioso.** Empezar el día sabiendo exactamente qué tocar elimina los 30 minutos de "¿por dónde iba?".

---

### El descanso no es tiempo perdido

Contraintuitivo para muchos: **la calidad del trabajo cae notablemente después de cierto punto.**

- Pausas reales entre bloques. Levantarse, no cambiar de pantalla.
- Un día completo a la semana sin trabajo. Sin revisar correo.
- Vacaciones de verdad, desconectado.

**Trabajar 60 horas semanales de forma sostenida produce menos que 40 bien enfocadas.** Y produce errores que cuestan más tiempo del que se "ganó".

---

### El agotamiento: reconocerlo antes de que te alcance

Señales tempranas, en orden de aparición:

1. Cinismo hacia el trabajo o los clientes
2. Dificultad para empezar tareas que antes eran fáciles
3. Trabajar más horas produciendo menos
4. Irritabilidad ante interrupciones normales
5. Sensación de que nada avanza aunque objetivamente sí
6. Problemas de sueño

**Si reconoces tres o más de forma sostenida durante semanas, no es un problema de sistema de productividad: es una señal de que necesitas reducir carga y probablemente hablar con alguien.**

Nada en este artículo sustituye ese paso. Los sistemas de productividad ayudan con la organización, no con el agotamiento sostenido.

**Qué ayuda en concreto:**
- Reducir el número de proyectos activos, aunque implique renunciar a ingresos
- Recuperar límites de horario, escritos y respetados
- Tiempo real de desconexión
- Y si persiste, apoyo profesional. Es una respuesta razonable, no una señal de debilidad

---

### Herramientas: pocas y simples

**Una lista de tareas.** Cualquiera. La herramienta importa mucho menos que el hábito de revisarla.

**Un archivo de notas por proyecto.** Markdown en el repositorio funciona perfectamente.

**Un calendario con bloques.** Los bloques de foco van en el calendario como si fueran reuniones. Si no están ahí, se los come otra cosa.

**Bloqueador de distracciones.** Para los bloques de foco, si te cuesta.

**Lo que no ayuda:** cambiar de sistema de productividad cada tres meses. Reorganizar el sistema es una forma cómoda de procrastinar.

---

### Preguntas frecuentes

**¿Cómo protejo los bloques de foco si mi trabajo es reactivo?**
Negocia. Un canal de urgencias real y separado, y el acuerdo de que lo demás espera. La mayoría de las "urgencias" no lo son, y cuando defines el canal, el volumen baja solo.

**¿Y si tengo un trabajo con muchas reuniones?**
Agrúpalas. Propón que las reuniones sean solo en ciertos días o franjas. La mayoría de los equipos acepta cuando se explica el costo de la fragmentación.

**¿Cuántas horas de trabajo profundo son realistas?**
Entre tres y cinco al día es un techo realista para la mayoría de las personas. Quien afirme ocho horas diarias de concentración sostenida probablemente está contando otra cosa.

---

**Escrito por Carlos Anaya Ruiz** — Desarrollador y consultor. Opero varios proyectos en paralelo con bloques de foco y límites de trabajo en curso.

---

### PROMPT DE PORTADA — Artículo 089

> Un calendario tridimensional donde bloques de tiempo grandes, sólidos y luminosos en verde azulado desplazan y dispersan a decenas de fragmentos diminutos que se disuelven en polvo al ser empujados. Vista frontal elevada. Fondo negro carbón, iluminación verde azulado, contraste entre lo compacto y lo fragmentado.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.

---
---

# ARTÍCULO 090

```yaml
title: "Portafolio de desarrollador que sí consigue clientes"
slug: "portafolio-desarrollador-consigue-clientes"
description: "Qué debe tener un portafolio para atraer clientes de verdad: casos de estudio con números, prueba técnica visible y llamada a la acción clara."
author: "Carlos Anaya Ruiz"
category: "Negocio"
tags: ["portafolio", "marca personal", "clientes", "freelance"]
keyword_principal: "portafolio de desarrollador"
```

## Portafolio de desarrollador que sí consigue clientes

**Un portafolio para conseguir empleo y uno para conseguir clientes son documentos distintos.** El primero demuestra que sabes programar. El segundo demuestra que resuelves problemas de negocio.

Si tu portafolio es una lista de proyectos con capturas de pantalla y logos de tecnologías, está optimizado para el primer objetivo.

---

### Lo que un cliente potencial busca

Cuando alguien con presupuesto llega a tu sitio, tiene tres preguntas en la cabeza:

1. **¿Esta persona ha resuelto un problema como el mío?**
2. **¿Puedo confiar en que va a terminar?**
3. **¿Cómo empiezo a hablar con ella?**

Todo lo demás es secundario. Tu stack, tus certificaciones y tu diseño elegante solo importan en la medida en que respondan a esas tres preguntas.

---

### La estructura que funciona

```
1. Encabezado: qué haces y para quién, en una frase
2. Prueba social breve: logos o cifra de proyectos
3. Casos de estudio (3-5, con números)
4. Servicios: qué se puede contratar exactamente
5. Sobre ti: por qué eres tú y no otro
6. Llamada a la acción clara y única
7. Contenido: artículos que demuestran criterio
```

---

### El encabezado: la parte que más se equivoca

**Mal:** "Desarrollador full-stack apasionado por la tecnología."

Eso no dice nada. Describe a cientos de miles de personas.

**Bien:** "Construyo plataformas internas para despachos y empresas multi-sucursal en México. Diez años, más de treinta proyectos entregados."

**La fórmula:** [qué construyes] para [quién] en [dónde o en qué contexto].

**La especificidad no reduce tu mercado: aumenta tu tasa de conversión.** Un cliente que busca exactamente lo que haces te elige de inmediato. Uno genérico se va a comparar con otros veinte perfiles idénticos.

---

### Casos de estudio: la pieza central

Tres o cinco casos bien hechos valen más que veinte proyectos listados.

**Estructura de cada caso:**

```
## [Cliente o tipo de cliente] — [resultado en una línea]

**El problema.**
Qué estaba mal, en términos de negocio. Con números si puedes.

**Lo que hicimos.**
El enfoque, no el detalle técnico. Dos o tres párrafos.
Las decisiones importantes y por qué.

**El resultado.**
NÚMEROS. Antes y después.

**Stack.**
Breve, al final. Es lo que menos le importa al cliente.
```

**Ejemplo del tipo de resultado que convence:**

- "El tiempo de respuesta a solicitudes pasó de 6 horas a 12 minutos"
- "Reducimos la factura mensual de infraestructura en un 38% sin degradar el servicio"
- "El equipo pasó de 4 a 22 artículos publicados al mes con la misma gente"

**Sin números, no es un caso de estudio: es una descripción.**

**Si no tienes permiso para nombrar al cliente:** "Un despacho jurídico con veinte oficinas en Estados Unidos" comunica perfectamente sin violar confidencialidad. Pide permiso siempre antes de nombrar.

---

### Prueba técnica visible

Un cliente no técnico no va a leer tu código. Pero uno técnico sí, y en muchas empresas hay alguien técnico en la decisión.

**Lo que funciona:**
- Un repositorio público bien mantenido, aunque sea de un proyecto pequeño
- Un producto propio en funcionamiento, con URL visitable
- Artículos técnicos que demuestran profundidad
- Contribuciones a proyectos abiertos

**Lo que no funciona:**
- Repositorios de tutoriales seguidos
- Proyectos abandonados hace tres años
- Un perfil sin actividad reciente

**Un solo producto propio funcionando vale más que quince repositorios de práctica.**

---

### La sección de servicios

Aquí conviertes visitantes en conversaciones.

**Sé específico sobre qué se puede contratar:**

```
## Cómo trabajo

**Auditoría técnica** — 2 a 3 semanas
Revisión de arquitectura, costos e infraestructura, con
informe priorizado por impacto. Desde $X.

**Desarrollo de producto** — proyectos de 2 a 6 meses
Construcción completa: arquitectura, desarrollo, despliegue.
Cotización según alcance.

**Retención mensual** — mínimo 3 meses
Disponibilidad continua para evolución y mantenimiento.
Desde $X al mes.
```

**Sobre mostrar precios:** mostrar un "desde" filtra a quien no tiene presupuesto y ahorra llamadas inútiles. Muchos consultores no lo hacen por miedo; en la práctica mejora la calidad de las consultas que recibes.

---

### La llamada a la acción

**Una sola, repetida.** No cinco opciones distintas.

**Lo que convierte mejor:** un enlace directo a agendar una llamada corta. Elimina el intercambio de correos para coordinar.

**Lo que no convierte:** un formulario de contacto genérico con seis campos.

**Y hazla visible sin hacer scroll.** Si el visitante tiene que buscar cómo contactarte, se va.

---

### El contenido: lo que multiplica todo

Un portafolio estático recibe visitas cuando alguien te busca por tu nombre. Un portafolio con contenido recibe visitas de gente que ni sabía que existías.

**Qué escribir:** lo que resolviste. Problemas concretos de tu especialidad, con la solución real. No teoría general.

**Efecto secundario valioso:** ese contenido es lo que hace que los sistemas de búsqueda —y cada vez más, los asistentes de IA— te recomienden cuando alguien pregunta por tu área.

**Cadencia sostenible sobre volumen.** Dos artículos buenos al mes durante un año construyen más autoridad que veinte en un mes y luego silencio.

---

### Los errores que cuestan clientes

**Portafolio como galería de capturas.** Bonito e inútil.

**Listar tecnologías sin contexto.** Un muro de logos no dice qué problemas resuelves.

**Sin números en ningún lado.** El cliente no puede evaluar tu impacto.

**Diseño sobre sustancia.** Un sitio impresionante sin casos de estudio con resultados convierte peor que uno simple con tres casos sólidos.

**Sin actualizar.** Un portafolio cuyo último proyecto es de hace dos años genera dudas.

**Difícil de contactar.** Suena obvio y ocurre constantemente.

---

### Preguntas frecuentes

**¿Y si estoy empezando y no tengo casos?**
Construye algo propio y documéntalo como caso de estudio: el problema que identificaste, cómo lo resolviste, qué aprendiste. Es más convincente que una lista de tutoriales completados.

**¿Dominio propio o una plataforma de perfiles?**
Dominio propio, siempre. Es tu activo. Los perfiles en plataformas de terceros son complementos que apuntan a él.

**¿En español o en inglés?**
Según tu mercado. Si buscas clientes en México y LATAM, español. Si buscas internacionales, inglés. Si ambos, dos versiones, no una mezcla.

---

**Escrito por Carlos Anaya Ruiz** — Consultor tecnológico. Mi trabajo llega por contenido y casos documentados, no por publicidad.

---

### PROMPT DE PORTADA — Artículo 090

> Una galería abstracta de tres marcos flotantes de vidrio, cada uno conteniendo en su interior una estructura de datos tridimensional distinta iluminada en verde azulado, con el marco central adelantado respecto a los otros dos y notablemente más brillante. Fondo negro carbón, iluminación verde azulado, los marcos laterales ligeramente desenfocados.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.
