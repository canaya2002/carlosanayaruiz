---
n: 6
title: "Fine-tuning, RAG o prompt engineering: cuál necesitas realmente"
slug: "fine-tuning-vs-rag-vs-prompt-engineering"
seoTitle: "Fine-tuning, RAG o prompt engineering: cuál necesitas"
description: "El 90% de las empresas que quieren fine-tuning en realidad necesitan RAG o mejores prompts. Cómo decidir con un árbol de decisión claro."
category: "Inteligencia Artificial"
keyword: "fine tuning vs rag"
tipo: "satelite"
tags: ["fine tuning","rag","prompt engineering","arquitectura ia"]
---


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
