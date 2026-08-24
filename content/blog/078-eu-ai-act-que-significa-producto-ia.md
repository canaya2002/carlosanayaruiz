---
n: 78
title: "EU AI Act: qué significa para tu producto con IA"
slug: "eu-ai-act-que-significa-producto-ia"
description: "El reglamento europeo de IA explicado por niveles de riesgo, qué obligaciones caen sobre productos con IA y cómo prepararte."
category: "Cumplimiento"
keyword: "eu ai act"
tipo: "satelite"
tags: ["eu ai act","regulación ia","cumplimiento","gobernanza"]
---


**El reglamento europeo de inteligencia artificial clasifica los sistemas de IA por nivel de riesgo e impone obligaciones proporcionales a ese nivel.** Como el GDPR, tiene alcance extraterritorial: puede aplicarte aunque estés fuera de Europa si tu sistema se usa allá o sus resultados se utilizan allá.

**Advertencia importante:** este reglamento tiene un calendario de aplicación escalonado, con distintas obligaciones entrando en vigor en momentos diferentes, y con normativa técnica de desarrollo que sigue elaborándose. **Verifica el estado y los plazos vigentes** antes de tomar decisiones basadas en este artículo, que es informativo y no constituye asesoría legal.

---

### La estructura por niveles de riesgo

**Riesgo inaceptable — prohibido.**
Prácticas que se consideran incompatibles con los derechos fundamentales. Entre ellas: manipulación subliminal que cause daño, explotación de vulnerabilidades de grupos específicos, puntuación social por parte de autoridades públicas, y determinados usos de identificación biométrica remota.

**Alto riesgo — obligaciones estrictas.**
Sistemas usados en ámbitos con impacto significativo sobre las personas: empleo y selección de personal, acceso a educación, evaluación crediticia, servicios esenciales, aplicación de la ley, migración, administración de justicia, y componentes de seguridad de productos regulados.

**Riesgo limitado — obligaciones de transparencia.**
Sistemas que interactúan con personas, generan contenido sintético o reconocen emociones. La obligación central es informar.

**Riesgo mínimo — sin obligaciones específicas.**
La mayoría de las aplicaciones: filtros de spam, recomendadores de contenido, herramientas de productividad.

---

### Dónde cae probablemente tu producto

Sé realista: **la gran mayoría de los productos con IA caen en riesgo limitado o mínimo.**

**Riesgo limitado si:**
- Tu producto es un asistente conversacional
- Genera texto, imágenes, audio o video sintéticos
- El usuario interactúa directamente con el sistema

**Obligación principal en ese nivel:** informar de forma clara que la persona está interactuando con un sistema de IA, y marcar el contenido generado artificialmente de forma detectable.

**Riesgo alto si tu producto se usa para:**
- Filtrar currículums o evaluar candidatos
- Decidir sobre promociones o terminaciones laborales
- Evaluar solvencia crediticia de personas físicas
- Determinar acceso a servicios esenciales
- Evaluar estudiantes o determinar admisiones

**Este es el punto que sorprende a muchos:** una herramienta de recursos humanos que clasifica candidatos con IA puede ser un sistema de alto riesgo, con obligaciones considerablemente más exigentes.

---

### Qué implica ser de alto riesgo

Las obligaciones incluyen, en términos generales:

- **Sistema de gestión de riesgos** documentado y mantenido durante todo el ciclo de vida
- **Gobernanza de datos:** calidad, representatividad y examen de sesgos en los conjuntos de entrenamiento
- **Documentación técnica** detallada del sistema
- **Registro automático de eventos** durante el funcionamiento
- **Transparencia** e instrucciones de uso para el implementador
- **Supervisión humana** efectiva, con capacidad real de intervenir
- **Precisión, robustez y ciberseguridad** apropiadas
- **Evaluación de conformidad** antes de la puesta en el mercado

Es un régimen exigente. Si tu producto cae aquí, necesitas asesoría especializada y presupuesto para cumplimiento.

---

### Modelos de propósito general

Hay un régimen específico para los modelos de IA de propósito general —los modelos fundacionales grandes— con obligaciones de documentación técnica, información para quienes construyen encima, política de cumplimiento en materia de derechos de autor y resumen del contenido de entrenamiento. Los modelos con riesgo sistémico tienen obligaciones adicionales.

**Si tú construyes sobre un modelo de un tercero, la mayor parte de esas obligaciones recae en el proveedor del modelo, no en ti.** Pero conviene verificar que tu proveedor las cumple, porque tú dependes de su documentación.

---

### Qué hacer ahora, aunque no vendas en Europa

Tres razones para prepararte igual:

**1. Efecto de arrastre normativo.** Como pasó con el GDPR, otras jurisdicciones tienden a adoptar marcos similares. Prepararte ahora es prepararte para lo que viene.

**2. Exigencia de clientes.** Empresas grandes empiezan a pedir a sus proveedores documentación de gobernanza de IA, aunque no haya obligación legal directa.

**3. Buenas prácticas.** Casi todo lo que exige el reglamento es lo que deberías hacer de todos modos para tener un sistema confiable.

---

### La lista de preparación mínima

Independientemente de tu nivel de riesgo, esto vale la pena:

```
□ Inventario de sistemas de IA en tu producto
□ Clasificación preliminar de nivel de riesgo por sistema
□ Documentación de qué modelo usas, para qué y con qué datos
□ Declaración visible al usuario cuando interactúa con IA
□ Marcado de contenido generado artificialmente
□ Registro de decisiones automatizadas con impacto en personas
□ Punto de supervisión humana en decisiones significativas
□ Proceso para que un usuario impugne una decisión automatizada
□ Evaluación de sesgo si el sistema clasifica o evalúa personas
□ Verificación de que tu proveedor de modelo cumple sus obligaciones
```

---

### La transparencia: lo mínimo que casi todos deben hacer

Si tu producto tiene un asistente conversacional o genera contenido:

**Declara que es IA.** No de forma escondida en los términos: visible en la interacción. "Estás hablando con un asistente automatizado" al inicio de la conversación.

**Marca el contenido generado.** Si tu producto produce imágenes, texto o audio sintético, debe ser identificable como tal.

**No finjas ser humano.** Además de ser requisito, es lo correcto. Se descubre siempre y destruye la confianza.

---

### Preguntas frecuentes

**¿Me aplica si soy una empresa mexicana?**
Puede aplicarte si tu sistema se comercializa o utiliza en la UE, o si sus resultados se usan allá. Evalúa tu caso concreto.

**¿Qué pasa si uso un modelo de un tercero?**
Buena parte de las obligaciones sobre el modelo recaen en su proveedor. Tú tienes obligaciones como implementador o proveedor del sistema que construiste encima, que varían según el nivel de riesgo de tu aplicación.

**¿Cuándo entra en vigor cada obligación?**
El calendario es escalonado y las distintas obligaciones aplican en momentos diferentes. **Verifica los plazos vigentes**, porque este es el punto donde la información desactualizada causa más problemas.

**¿Necesito abogado?**
Si tu producto puede caer en alto riesgo, sí, sin duda. Si es riesgo limitado, las obligaciones de transparencia son manejables internamente, pero una revisión inicial vale la pena.
