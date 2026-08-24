# LOTE 01 — ARTÍCULOS COMPLETOS 005–008
**Autor:** Carlos Anaya Ruiz · Listos para publicar

---
---

# ARTÍCULO 005

```yaml
title: "Cuánto cuesta implementar IA en tu empresa: números reales"
slug: "cuanto-cuesta-implementar-ia-empresa"
description: "Costos reales de implementar IA: licencias, tokens, infraestructura y desarrollo. Con tres presupuestos completos de proyectos reales."
author: "Carlos Anaya Ruiz"
category: "Inteligencia Artificial"
tags: ["costos ia", "presupuesto tecnología", "roi", "implementación"]
keyword_principal: "cuánto cuesta implementar ia"
```

## Cuánto cuesta implementar IA en tu empresa: números reales

**Implementar IA cuesta entre 5,000 y 400,000 pesos mexicanos según el nivel, más una operación mensual que casi nadie presupuesta correctamente.** La mayoría de las cotizaciones que circulan omiten tres partidas que después explican por qué el proyecto se pasó del presupuesto.

Aquí van los números con los que trabajo, desglosados, y las tres partidas que se olvidan.

---

### Las cinco partidas de costo

**1. Licencias de herramientas (recurrente)**
Suscripciones de asistentes de IA para tu equipo. De 350 a 800 pesos por usuario al mes en planes empresariales. Es el costo más predecible y el más fácil de justificar.

**2. Consumo de API por tokens (recurrente y variable)**
Si desarrollas algo propio, pagas por uso. Se cobra por millón de tokens de entrada y de salida, con precios distintos. Un token equivale más o menos a tres cuartos de una palabra en español.

Para dimensionar: un asistente interno con RAG que atiende 2,000 consultas al mes, enviando unos 8,000 tokens de contexto por consulta, consume alrededor de 16 millones de tokens de entrada mensuales. Con un modelo de gama media eso ronda entre 800 y 3,000 pesos al mes. Con un modelo tope de gama y sin caching, puede multiplicarse por cinco.

**3. Infraestructura (recurrente)**
Base de datos, alojamiento, colas de procesamiento, almacenamiento de archivos, monitoreo. Para un sistema interno de tamaño medio: entre 1,200 y 8,000 pesos mensuales.

**4. Desarrollo (único, o por fases)**
El bloque grande cuando construyes a la medida. Depende del alcance, no del modelo de IA.

**5. Preparación de datos (único, subestimado siempre)**
Digitalizar, limpiar, deduplicar, estructurar y clasificar la información que el sistema va a usar. Entre el 30% y el 60% del esfuerzo total de un proyecto RAG.

---

### Tres presupuestos completos

#### Presupuesto A — Adopción básica (empresa de 15 personas)

| Concepto | Costo |
|---|---|
| 12 licencias empresariales de IA | 7,200 MXN/mes |
| Capacitación inicial (2 sesiones) | 18,000 MXN único |
| Política interna de uso y privacidad | 12,000 MXN único |
| **Primer año total** | **116,400 MXN** |

Sin desarrollo, sin infraestructura. Es donde debe empezar cualquier empresa. Retorno típico: entre 4 y 8 horas semanales recuperadas por usuario activo.

---

#### Presupuesto B — Automatización de un proceso (nivel intermedio)

Caso: clasificación y respuesta asistida de solicitudes entrantes, 1,500 al mes.

| Concepto | Costo |
|---|---|
| Diagnóstico y diseño de proceso | 45,000 MXN único |
| Desarrollo de la integración | 95,000 MXN único |
| Preparación de datos y plantillas | 30,000 MXN único |
| Infraestructura | 2,000 MXN/mes |
| Consumo de API | 1,800 MXN/mes |
| Mantenimiento y ajustes | 6,000 MXN/mes |
| **Inversión inicial** | **170,000 MXN** |
| **Operación mensual** | **9,800 MXN** |
| **Primer año total** | **287,600 MXN** |

Si ese proceso consumía 180 horas mensuales a 200 pesos la hora cargada, el costo previo era de 36,000 pesos al mes. Con una reducción del 65%, el ahorro es de 23,400 mensuales. Punto de equilibrio: mes 12 aproximadamente, y a partir de ahí ahorro neto sostenido.

---

#### Presupuesto C — Asistente interno con conocimiento propio (RAG completo)

Caso: asistente sobre 12,000 documentos internos, 60 usuarios.

| Concepto | Costo |
|---|---|
| Descubrimiento y arquitectura | 60,000 MXN único |
| Ingesta, OCR y limpieza documental | 110,000 MXN único |
| Desarrollo de la plataforma | 220,000 MXN único |
| Evaluación y conjunto de pruebas | 40,000 MXN único |
| Infraestructura y base vectorial | 5,500 MXN/mes |
| Consumo de API | 6,000 MXN/mes |
| Soporte y evolución | 18,000 MXN/mes |
| **Inversión inicial** | **430,000 MXN** |
| **Operación mensual** | **29,500 MXN** |
| **Primer año total** | **784,000 MXN** |

Este nivel se justifica cuando el conocimiento disperso es un cuello de botella real del negocio y hay 50 o más personas perdiendo tiempo buscando información.

---

### Las tres partidas que casi nadie presupuesta

**1. El costo de la revisión humana durante los primeros meses.**
Los primeros 60 a 90 días necesitas que alguien valide las salidas del sistema. Eso es tiempo pagado que no aparece en la cotización del proveedor. Presupuesta entre 10 y 20 horas semanales de una persona con criterio.

**2. La deuda de datos.**
Si tu información está en carpetas compartidas sin estructura, con versiones duplicadas y PDFs escaneados, ordenar eso es un proyecto en sí mismo. Cuando el diagnóstico revela esto, el presupuesto suele crecer entre 30% y 50%.

**3. El costo de no cambiar.**
Es el que nunca aparece y el que más pesa. Si tu competencia responde cotizaciones en 20 minutos y tú en 6 horas, ese diferencial tiene un precio en ventas perdidas.

---

### Cómo bajar el costo sin bajar la calidad

- **Caching de contexto.** Si envías el mismo contexto repetidamente, el descuento por caching puede reducir el costo de entrada hasta un 90%.
- **Enrutamiento por modelo.** No todas las tareas necesitan el modelo más caro. Clasificar un correo puede hacerlo un modelo pequeño a una fracción del precio; solo el análisis complejo va al modelo grande.
- **Procesamiento por lotes.** Para tareas que no requieren respuesta inmediata, las APIs de lote cuestan aproximadamente la mitad.
- **Recorte de contexto.** Enviar 20 fragmentos cuando 6 bastan multiplica tu factura por tres sin mejorar la respuesta.
- **Empieza en nivel A.** El 60% del valor de la IA en una empresa mediana se captura solo con licencias y capacitación, sin una línea de código.

---

### Preguntas frecuentes

**¿Cuál es el mínimo para empezar con algo serio?**
Alrededor de 100,000 pesos al año en licencias y capacitación para un equipo pequeño. Por debajo de eso, usa herramientas individuales y mide.

**¿Los precios de la API van a bajar?**
Históricamente sí, de forma bastante agresiva por unidad de capacidad. Pero el consumo tiende a crecer más rápido que la baja de precio. No planees tu presupuesto asumiendo que se abaratará solo.

**¿Conviene contratar una agencia o desarrollar interno?**
Para el primer proyecto, externo con transferencia de conocimiento. Para el tercero, ya deberías tener capacidad interna o quedarás dependiendo de terceros en algo central de tu operación.

---

**Escrito por Carlos Anaya Ruiz** — Consultor tecnológico. Los rangos de este artículo provienen de proyectos reales implementados en México.

---

### PROMPT DE PORTADA — Artículo 005

> Una balanza de precisión abstracta hecha de líneas de neón violeta eléctrico, con un platillo sosteniendo un cubo de datos luminoso y el otro sosteniendo monedas geométricas apiladas, en equilibrio tenso. Estilo isométrico limpio sobre fondo negro carbón. Luz lateral dramática, reflejo sutil en el suelo.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.

---
---

# ARTÍCULO 006

```yaml
title: "Fine-tuning, RAG o prompt engineering: cuál necesitas realmente"
slug: "fine-tuning-vs-rag-vs-prompt-engineering"
description: "El 90% de las empresas que quieren fine-tuning en realidad necesitan RAG o mejores prompts. Cómo decidir con un árbol de decisión claro."
author: "Carlos Anaya Ruiz"
category: "Inteligencia Artificial"
tags: ["fine tuning", "rag", "prompt engineering", "arquitectura ia"]
keyword_principal: "fine tuning vs rag"
```

## Fine-tuning, RAG o prompt engineering: cuál necesitas realmente

**Empieza siempre por prompt engineering. Si falla por falta de información, usa RAG. Solo considera fine-tuning cuando falle por comportamiento y ya agotaste las dos anteriores.** Ese orden resuelve la mayoría de las discusiones técnicas antes de que empiecen.

La confusión es cara: cotizar un fine-tuning cuando el problema era una instrucción mal escrita cuesta cien veces más y produce peores resultados.

---

### Qué hace cada técnica

**Prompt engineering** — Cambias las instrucciones que le das al modelo. No modificas nada del modelo. Costo: tu tiempo. Iteración: minutos.

**RAG** — Le entregas información relevante en el momento de la consulta. No modificas el modelo. Costo: infraestructura y desarrollo. Iteración: horas o días.

**Fine-tuning** — Ajustas los pesos del modelo con ejemplos propios para que adopte un comportamiento o formato específico. Costo: datos etiquetados, cómputo y mantenimiento. Iteración: días.

---

### El árbol de decisión

**Empieza aquí: ¿el modelo da una respuesta incorrecta o inadecuada?**

**→ ¿Es porque no conoce información que no estaba en su entrenamiento?**
(Políticas internas, contratos, catálogo, datos posteriores a su corte)
**Sí → RAG.** Ninguna cantidad de prompting va a hacer que un modelo sepa algo que nunca vio.

**→ ¿Es porque no entiende bien qué le pides?**
(Responde algo distinto, se salta condiciones, formato inconsistente)
**Sí → Prompt engineering.** Instrucciones más explícitas, ejemplos, estructura, división de la tarea en pasos.

**→ ¿Es porque el estilo, el tono o el formato no son los tuyos, y ya lo intentaste con ejemplos en el prompt?**
**Sí → Aquí sí puede tener sentido fine-tuning.** Pero antes verifica: ¿probaste con 5 ejemplos completos en el prompt? ¿Probaste con un modelo más capaz? Muchos casos se resuelven ahí.

**→ ¿Es porque la tarea es muy repetitiva, de alto volumen, y quieres reducir costo por consulta?**
**Sí → fine-tuning de un modelo pequeño puede salir a cuenta.** Este es el caso económicamente más sólido: entrenas un modelo chico para hacer una tarea estrecha muy bien y muy barato.

---

### Por qué fine-tuning casi nunca es la respuesta

**No enseña conocimiento de forma confiable.** Es una intuición equivocada muy extendida. Ajustar un modelo con tus documentos no hace que los "recuerde" con precisión: hace que imite su estilo. Preguntarle un dato específico seguirá produciendo alucinaciones.

**Se desactualiza.** Cada vez que cambia tu información tienes que reentrenar. Con RAG reindexas un archivo en minutos.

**No cita fuentes.** Un modelo ajustado no puede decirte de dónde salió una afirmación. Para uso legal, financiero o médico, eso es descalificante.

**Requiere datos de calidad.** Necesitas de cientos a miles de ejemplos de entrada y salida deseada, consistentes entre sí. Producirlos es trabajo humano caro. Si tus ejemplos son inconsistentes, el modelo aprende la inconsistencia.

**Te ata a una versión.** Cuando salga un modelo base mejor, tu ajuste no se transfiere. Vuelves a empezar.

---

### Cuándo fine-tuning sí gana

Hay cuatro escenarios legítimos:

1. **Formato de salida muy estricto y repetitivo.** Necesitas un JSON con una estructura peculiar en el 100% de los casos, y el prompting deja un 3% de errores que no puedes tolerar.
2. **Tono de marca muy particular.** Tienes miles de textos publicados con una voz distintiva y quieres replicarla sin escribir instrucciones de dos páginas.
3. **Reducción de costo a escala.** Millones de consultas de una tarea estrecha. Un modelo pequeño ajustado puede igualar a uno grande en esa tarea específica a una fracción del costo.
4. **Dominio con lenguaje muy especializado.** Nomenclatura técnica, jerga sectorial o formatos de documento que el modelo base maneja mal incluso con buenos ejemplos.

Fuera de esos cuatro, la respuesta es RAG o mejores prompts.

---

### La combinación que funciona en producción

En sistemas reales rara vez usas una sola técnica. La arquitectura habitual:

- **Prompt engineering** define el rol, las reglas, el formato y el comportamiento ante casos límite.
- **RAG** aporta el conocimiento específico y actualizado.
- **Fine-tuning** (opcional) ajusta un modelo pequeño para una subtarea de alto volumen, como clasificar o extraer.

El prompt es la constitución. RAG es la biblioteca. Fine-tuning es entrenar a un especialista para una sola cosa.

---

### Cómo probar antes de decidir

Antes de aprobar cualquier presupuesto de fine-tuning, exige esta secuencia:

1. **Semana 1:** el mejor prompt posible, con ejemplos, sobre 50 casos reales. Mide tasa de acierto.
2. **Semana 2:** el mismo prompt sobre el modelo más capaz disponible. Mide otra vez.
3. **Semana 3:** si el problema era de información, monta un RAG mínimo. Mide.
4. **Solo si después de eso sigue fallando**, y falla por comportamiento y no por conocimiento, evalúa fine-tuning.

En mi experiencia, el 80% de los casos se resuelve en la semana 1 o 2.

---

### Preguntas frecuentes

**¿Cuánto cuesta un fine-tuning?**
El entrenamiento en sí puede costar desde unos cientos hasta varios miles de dólares según el tamaño del modelo y del conjunto de datos. Lo caro es producir y mantener los datos de entrenamiento.

**¿Puedo hacer fine-tuning y RAG al mismo tiempo?**
Sí, y es una combinación válida: el modelo ajustado maneja el formato y el estilo, RAG le da los hechos.

**¿Y el "entrenamiento continuo" con las conversaciones de mis usuarios?**
Es técnicamente posible y operativamente peligroso. Sin curaduría, el modelo aprende también los errores. Y si hay datos personales, tienes un problema de cumplimiento.

---

**Escrito por Carlos Anaya Ruiz** — Arquitecto de sistemas con IA. He recomendado no hacer fine-tuning muchas más veces de las que lo he implementado.

---

### PROMPT DE PORTADA — Artículo 006

> Tres caminos de luz violeta eléctrico divergiendo desde un mismo punto de origen en el primer plano y perdiéndose en la oscuridad, cada uno con distinta densidad y grosor: uno delgado y brillante, uno medio, uno ancho y tenue. Vista a ras de suelo, perspectiva profunda de un punto. Niebla volumétrica entre los caminos, fondo negro absoluto.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.

---
---

# ARTÍCULO 007

```yaml
title: "15 casos de uso reales de IA en empresas de servicios"
slug: "casos-de-uso-ia-empresas-servicios"
description: "15 casos de uso de IA implementados de verdad en empresas de servicios, con el resultado medible de cada uno y qué se necesitó para montarlo."
author: "Carlos Anaya Ruiz"
category: "Inteligencia Artificial"
tags: ["casos de uso ia", "automatización", "empresas de servicios", "productividad"]
keyword_principal: "casos de uso de inteligencia artificial en empresas"
```

## 15 casos de uso reales de IA en empresas de servicios

**Estos son casos de uso implementados en producción, no ideas de presentación.** Para cada uno indico qué resuelve, qué nivel de complejidad tiene y qué se necesita realmente para montarlo.

Los ordeno por dificultad de implementación, de menor a mayor. Los primeros cinco los puede montar cualquier empresa este mes.

---

### Nivel 1 — Sin desarrollo, solo herramientas y proceso

**1. Redacción de propuestas y cotizaciones**
Se carga la plantilla, los datos del cliente y el histórico de propuestas similares. El asistente produce un borrador; la persona ajusta y envía.
*Reducción típica de tiempo: 60-75%. Requiere: licencia y plantillas ordenadas.*

**2. Resumen de reuniones con compromisos extraídos**
Transcripción de la llamada, resumen estructurado y lista de acuerdos con responsable y fecha.
*Elimina la tarea de "quién toma notas". Requiere: herramienta de transcripción con IA.*

**3. Respuesta a reseñas y comentarios públicos**
Borrador de respuesta personalizada según el contenido y el tono de la reseña, con aprobación humana antes de publicar.
*Sube la tasa de respuesta del 20% al 95% sin contratar a nadie. Requiere: proceso de aprobación definido.*

**4. Traducción y adaptación de materiales**
Contratos, propuestas y contenido de marketing entre español e inglés con registro adecuado.
*Requiere: revisión de un hablante nativo para material contractual.*

**5. Filtrado inicial de currículums**
Clasificación contra criterios definidos, con justificación por candidato.
*Cuidado: define criterios objetivos y documenta el proceso. El sesgo algorítmico en contratación es un riesgo legal y ético real.*

---

### Nivel 2 — Requiere automatización, no desarrollo pesado

**6. Clasificación y enrutamiento de correos entrantes**
Cada mensaje se etiqueta por tipo, urgencia y departamento, y se dirige al responsable con una respuesta sugerida.
*Reduce el tiempo de primera respuesta de horas a minutos. Requiere: plataforma de automatización e integración con el correo.*

**7. Extracción estructurada de documentos**
De una factura, remisión o identificación en PDF a campos estructurados listos para el sistema administrativo.
*Uno de los casos con mejor retorno. Requiere: OCR de calidad y validación de campos críticos.*

**8. Seguimiento automatizado de cobranza**
Mensajes personalizados según antigüedad del saldo, historial del cliente y tono adecuado a la relación.
*Requiere: cuidado normativo. En México hay reglas sobre prácticas de cobranza y sobre uso de datos personales.*

**9. Publicación en redes sociales asistida**
Generación de variantes de contenido por canal, calendarización y aprobación previa.
*Requiere: aprobación humana obligatoria. Publicar sin revisión es cómo se generan crisis de marca.*

**10. Análisis de encuestas y comentarios abiertos**
Miles de respuestas de texto libre convertidas en temas, sentimiento y hallazgos accionables.
*Sustituye semanas de trabajo manual de análisis cualitativo.*

---

### Nivel 3 — Requiere desarrollo e integración

**11. Asistente interno sobre documentación propia**
El equipo pregunta en lenguaje natural sobre políticas, procesos, precios o expedientes, y obtiene respuestas con cita de la fuente.
*Arquitectura RAG. Requiere: curaduría documental seria y control de permisos por usuario.*

**12. Atención a clientes por WhatsApp con escalamiento**
Bot que resuelve consultas frecuentes, califica al prospecto y transfiere a un humano cuando detecta complejidad o intención de compra.
*Requiere: WhatsApp Business API, plantillas aprobadas y un buen diseño del punto de escalamiento.*

**13. Análisis de llamadas de ventas y atención**
Transcripción, detección de objeciones, cumplimiento del guion y señales de riesgo de pérdida del cliente.
*Requiere: consentimiento de grabación documentado. Es obligación legal, no formalidad.*

**14. Monitoreo de visibilidad en motores de IA**
Consultas programadas a los principales modelos para detectar si tu empresa aparece en respuestas sobre tu sector, y cómo.
*Categoría nueva. Es el equivalente al seguimiento de posiciones en buscadores, pero para respuestas generativas.*

**15. Agentes con acceso a sistemas internos**
El sistema no solo responde: consulta el CRM, actualiza un registro, agenda una cita, genera un documento.
*El nivel más alto. Requiere: permisos granulares, registro de auditoría de cada acción y aprobación humana en operaciones irreversibles.*

---

### Los tres patrones que se repiten en los casos exitosos

**El humano decide, la IA prepara.** Los proyectos que fallan son los que intentan eliminar al humano. Los que funcionan lo mueven de "producir el borrador" a "revisar y decidir".

**Hay una métrica definida desde el día uno.** Tiempo por unidad, tasa de respuesta, costo por transacción. Si no hay número, no hay proyecto.

**Empiezan estrecho.** Un tipo de documento, un canal, un departamento. Extender es fácil; arrancar demasiado ancho es como se muere un piloto.

---

### Preguntas frecuentes

**¿Cuál conviene implementar primero?**
El que tenga mayor volumen y menor riesgo. Casi siempre eso lleva al número 1, 6 o 7.

**¿Cuánto tarda cada uno?**
Nivel 1: días. Nivel 2: de 3 a 8 semanas. Nivel 3: de 2 a 6 meses.

**¿Y si mi sector es muy específico?**
La especificidad casi nunca está en el tipo de tarea, sino en el vocabulario y los documentos. La arquitectura se reutiliza; lo que cambia es el conocimiento que cargas.

---

**Escrito por Carlos Anaya Ruiz** — Desarrollador y consultor. Estos casos provienen de implementaciones en empresas de servicios profesionales y multi-sucursal.

---

### PROMPT DE PORTADA — Artículo 007

> Una cuadrícula isométrica de quince módulos cúbicos flotantes en el aire, cada uno conteniendo una micro-escena geométrica abstracta distinta iluminada en violeta eléctrico, conectados entre sí por finos hilos de luz. Vista en ángulo tres cuartos, algunos módulos del fondo desenfocados por profundidad de campo. Fondo negro carbón con grid tenue.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.

---
---

# ARTÍCULO 008

```yaml
title: "Cómo medir el ROI de un proyecto de inteligencia artificial"
slug: "roi-proyecto-inteligencia-artificial"
description: "Fórmulas y KPIs concretos para medir el ROI de un proyecto de IA, incluyendo los costos ocultos que casi nadie mete al cálculo."
author: "Carlos Anaya Ruiz"
category: "Inteligencia Artificial"
tags: ["roi", "métricas", "gestión de proyectos", "inteligencia artificial"]
keyword_principal: "roi inteligencia artificial"
```

## Cómo medir el ROI de un proyecto de inteligencia artificial

**El ROI de un proyecto de IA se calcula igual que cualquier otro: beneficio neto entre inversión total. Lo que cambia es que tanto el beneficio como la inversión tienen componentes que la mayoría omite.** Por eso circulan tantos proyectos que "funcionaron" y no se notaron en el estado de resultados.

Esta es la metodología que uso, con las partidas que se olvidan de los dos lados.

---

### La fórmula base

```
ROI = (Beneficio total − Inversión total) / Inversión total × 100
```

Simple. El problema está en llenar los dos números correctamente.

---

### Cómo calcular el beneficio (los cuatro tipos)

**Tipo 1 — Ahorro de tiempo convertido a dinero**

```
Ahorro mensual = Volumen × (Tiempo antes − Tiempo después) × Costo por hora cargado
```

El error frecuente: usar el sueldo bruto por hora. Debes usar el costo cargado, que incluye prestaciones, impuestos patronales y tiempo no productivo. En México suele ser entre 1.4 y 1.6 veces el sueldo nominal.

Segundo error: contar el tiempo de la IA como cero. Si el sistema tarda 6 minutos pero requiere 4 minutos de revisión humana, el tiempo después es 10, no 6.

**Tipo 2 — Ingresos adicionales**

Aplica cuando la IA aumenta capacidad de venta o velocidad de respuesta.

```
Ingreso adicional = Δ(Conversión) × Volumen de oportunidades × Ticket promedio × Margen
```

Ojo con la atribución: si al mismo tiempo cambiaste de campaña publicitaria, no puedes atribuir el aumento a la IA. Necesitas un grupo de control o un periodo comparable limpio.

**Tipo 3 — Costo evitado**

La contratación que no hiciste, la licencia que cancelaste, la penalización que no pagaste por responder a tiempo. Es beneficio real pero requiere documentar la contrafactual: hay que dejar por escrito, antes de implementar, que se iba a contratar a esas dos personas.

**Tipo 4 — Reducción de errores**

```
Ahorro = Volumen × (Tasa error antes − Tasa error después) × Costo promedio por error
```

Este es el más difícil de medir y a menudo el más grande. Requiere que sepas cuánto te cuesta hoy un error, cosa que casi nadie tiene medida.

---

### Cómo calcular la inversión (incluyendo lo invisible)

| Partida | Frecuente que se omita |
|---|---|
| Licencias y suscripciones | No |
| Desarrollo e integración | No |
| Consumo de API por tokens | A veces |
| Infraestructura | A veces |
| **Preparación y limpieza de datos** | **Casi siempre** |
| **Tiempo interno del equipo en el proyecto** | **Casi siempre** |
| **Revisión humana durante la validación** | **Casi siempre** |
| **Capacitación y curva de aprendizaje** | **Casi siempre** |
| Mantenimiento y ajustes continuos | A menudo |
| Costo de la caída de productividad inicial | Siempre |

Ese último punto merece atención: durante las primeras semanas, el equipo produce menos, no más. Está aprendiendo. Presupuesta entre 2 y 6 semanas de productividad reducida.

---

### Los KPIs que debes seguir mes a mes

**Métricas de proceso (indican si funciona):**
- Tiempo promedio por unidad procesada
- Tasa de aprobación sin corrección
- Volumen procesado por persona
- Tasa de escalamiento a humano

**Métricas de calidad (indican si no lo estás rompiendo):**
- Tasa de error detectado en salidas
- Satisfacción del cliente final
- Reclamaciones o retrabajos

**Métricas económicas (indican si vale la pena):**
- Costo por unidad procesada
- Costo mensual de operación del sistema
- Ahorro neto acumulado

**Métricas de adopción (predicen el fracaso antes de que ocurra):**
- Usuarios activos semanales sobre usuarios con licencia
- Frecuencia de uso por usuario

Esta última es la señal temprana más confiable. Si a los dos meses menos del 40% del equipo con licencia lo usa cada semana, el proyecto va a fallar aunque los números técnicos se vean bien.

---

### El horizonte correcto de medición

- **Mes 1:** no midas ROI. Mide adopción y calidad. El ROI será negativo y eso es normal.
- **Mes 3:** primera lectura seria. Compara contra la línea base.
- **Mes 6:** punto de decisión. Si el ahorro proyectado a 12 meses no supera la inversión, ajusta el alcance o apaga.
- **Mes 12:** ROI real del primer año.

Un proyecto de IA sano en una empresa de servicios suele alcanzar el punto de equilibrio entre el mes 8 y el mes 14.

---

### Las cuatro trampas de medición más comunes

**1. Medir contra un antes que nunca documentaste.** Si no tienes números previos, cualquier resultado es narrativa. Documenta la línea base antes de tocar nada.

**2. Contar el tiempo ahorrado como dinero automáticamente.** Si liberas 30 horas al mes pero nadie las reasigna a trabajo de valor, el ahorro es contable, no real. El ahorro se materializa cuando reduces contrataciones, aumentas volumen sin crecer, o el equipo hace algo que antes no se hacía.

**3. Ignorar el costo de mantenimiento.** Los sistemas de IA se degradan: cambian los documentos, cambian los modelos, cambian los procesos. Presupuesta entre 15% y 25% anual del costo de desarrollo solo para mantenerlo funcionando.

**4. Atribuir a la IA mejoras que vinieron del rediseño del proceso.** Muchos proyectos mejoran porque, al automatizar, alguien por fin documentó y ordenó el proceso. Eso es valioso, pero es otra causa. Sé honesto en el reporte: fortalece tu credibilidad para el siguiente proyecto.

---

### Plantilla de reporte para dirección

Una página. Cuatro bloques:

1. **Qué se automatizó y para quién.** Dos líneas.
2. **Números.** Antes, después, delta. Costo del sistema. Ahorro neto mensual. ROI acumulado.
3. **Riesgos activos.** Qué está fallando y qué se está haciendo.
4. **Decisión solicitada.** Extender, ajustar o cerrar. Con el monto asociado.

Sin capturas de pantalla, sin explicaciones de cómo funciona el modelo. A dirección le importa el número y la decisión.

---

### Preguntas frecuentes

**¿Qué ROI es bueno para un proyecto de IA?**
En el primer año, cualquier cosa por encima de 0% ya es sólido considerando la curva de aprendizaje. A 24 meses, los proyectos que funcionan suelen estar entre 150% y 400%.

**¿Y si el beneficio es estratégico y no financiero?**
Existe, pero exige disciplina: define qué señal observable esperas ver y en qué plazo. "Posicionamiento" sin métrica es una excusa.

**¿Cómo justifico un proyecto cuyo beneficio es evitar un riesgo?**
Cuantifica la probabilidad y el costo del evento que evitas. Es el mismo cálculo que usa un seguro.

---

**Escrito por Carlos Anaya Ruiz** — Consultor tecnológico. Mido proyectos de IA con los mismos criterios con los que mediría cualquier inversión de capital.

---

### PROMPT DE PORTADA — Artículo 008

> Una curva ascendente hecha de luz violeta eléctrico sólida elevándose sobre un terreno de datos abstracto compuesto por barras verticales oscuras de distintas alturas, con el punto de inflexión de la curva brillando con intensidad. Vista lateral baja y cinematográfica. Reflejo difuso en un suelo negro húmedo, bruma volumétrica al fondo.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.
