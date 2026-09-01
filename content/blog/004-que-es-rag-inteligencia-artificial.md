---
n: 4
title: "RAG explicado: cómo darle a la IA el conocimiento de tu empresa"
slug: "que-es-rag-inteligencia-artificial"
seoTitle: "RAG: cómo darle a la IA el conocimiento de tu empresa"
description: "RAG explicado sin jerga: cómo conectar tus documentos a un modelo de IA para que responda con información real de tu empresa."
category: "Inteligencia Artificial"
keyword: "qué es rag inteligencia artificial"
tipo: "satelite"
tags: ["rag","embeddings","base de conocimiento","arquitectura ia"]
---


**RAG (Retrieval Augmented Generation) es una técnica que busca información relevante en tus documentos y se la entrega al modelo de IA justo antes de que responda.** El modelo no aprende nada nuevo: simplemente recibe el contexto correcto en el momento correcto.

Es, con diferencia, la arquitectura más útil y más malentendida de la IA empresarial. La mayoría de las empresas que creen necesitar entrenar un modelo propio, en realidad necesitan RAG bien hecho.

---

### El problema que resuelve

Un modelo de lenguaje sabe lo que había en internet hasta su fecha de corte de entrenamiento. No sabe:

- Cuál es tu política de devoluciones.
- Qué dice la cláusula 14 del contrato con tu proveedor.
- Cuántos días de vacaciones tiene un empleado con 6 años de antigüedad en tu empresa.
- Qué se acordó en la junta del martes.

Si le preguntas, va a inventar algo plausible. Con seguridad absoluta. Esa es la trampa.

RAG cierra esa brecha sin tocar el modelo.

---

### Cómo funciona, paso por paso

**Fase de preparación (una vez, y luego cada vez que cambien los documentos):**

1. **Ingesta.** Se recolectan los documentos: PDFs, manuales, contratos, tickets, páginas web internas, transcripciones.
2. **Extracción.** Se convierte todo a texto plano. Aquí mueren muchos proyectos: un PDF escaneado sin OCR no aporta nada, y una tabla mal extraída genera respuestas incorrectas.
3. **Fragmentación (chunking).** Los documentos se parten en trozos manejables, típicamente de 300 a 800 palabras, con solapamiento entre ellos para no cortar ideas a la mitad.
4. **Vectorización (embeddings).** Cada fragmento se convierte en una lista de números que representa su significado. Textos con significado parecido quedan cerca en ese espacio matemático.
5. **Almacenamiento.** Los vectores se guardan en una base de datos vectorial.

**Fase de consulta (cada vez que alguien pregunta):**

6. **La pregunta se vectoriza** con el mismo método.
7. **Se buscan los fragmentos más cercanos** a esa pregunta. Típicamente entre 5 y 20.
8. **Se re-ordenan** por relevancia real con un modelo especializado (reranking). Este paso es opcional y mejora mucho la calidad.
9. **Se arma el prompt final:** instrucciones + fragmentos recuperados + pregunta del usuario.
10. **El modelo responde** usando solo ese contexto, y cita de dónde salió cada afirmación.

---

### Por qué RAG casi siempre gana sobre fine-tuning

| | RAG | Fine-tuning |
|---|---|---|
| Actualizar información | Reindexas el documento, minutos | Reentrenas el modelo, días y dinero |
| Costo inicial | Bajo a medio | Alto |
| Citar fuentes | Nativo | No lo hace |
| Controlar permisos por usuario | Sí, filtras en la búsqueda | No |
| Enseñar formato o estilo | Regular | Excelente |
| Enseñar conocimiento nuevo | Excelente | Poco eficiente |

**La regla:** RAG para conocimiento. Fine-tuning para comportamiento y formato. Si tu problema es "el modelo no sabe X", es RAG. Si es "el modelo no escribe como yo quiero", puede ser fine-tuning, pero primero prueba con mejores instrucciones.

---

### Los seis errores que hunden un proyecto RAG

**1. Fragmentar mal.** Cortar por número fijo de caracteres parte tablas, listas y cláusulas a la mitad. Fragmenta respetando la estructura del documento: por sección, por encabezado, por cláusula.

**2. No limpiar los datos.** Si tu carpeta tiene el manual de 2019, el de 2022 y el vigente, el sistema recuperará cualquiera de los tres. Y responderá con seguridad la versión equivocada. La curaduría documental no es opcional.

**3. Recuperar demasiado o demasiado poco.** Con 3 fragmentos te falta contexto. Con 50 el modelo se pierde y pagas mucho más. Ajusta con pruebas reales.

**4. Ignorar los permisos.** Si un becario pregunta por sueldos y el sistema recupera el tabulador de dirección, tienes un incidente. Los permisos se aplican en el filtro de búsqueda, antes de que el modelo vea nada.

**5. No medir la calidad.** Necesitas un conjunto de 50 a 100 preguntas con respuesta conocida para evaluar cada cambio. Sin eso, estás ajustando a ciegas.

**6. No manejar el "no sé".** El sistema debe estar instruido para responder que no encontró información cuando los fragmentos recuperados no contienen la respuesta. Un RAG que nunca dice "no sé" es un RAG que inventa.

---

### Stack típico para montarlo

- **Base vectorial:** pgvector sobre PostgreSQL si ya tienes Postgres (recomendado para la mayoría), o una base especializada si tu volumen lo exige.
- **Embeddings:** modelos de OpenAI, Voyage o Cohere. Elige uno con buen rendimiento en español.
- **Reranking:** Cohere Rerank o un modelo abierto equivalente.
- **Orquestación:** puedes usar un framework o escribirlo directo. Para casos simples, escribirlo directo es más fácil de mantener.
- **Modelo generador:** cualquiera de los principales.

Un RAG funcional sobre unos cuantos miles de documentos se monta en dos o tres semanas de trabajo. Uno que funcione bien, con evaluación, permisos y actualización automática, toma de dos a cuatro meses.

---

### Cuándo NO usar RAG

- Cuando la respuesta está en una base de datos estructurada. Ahí quieres que el modelo genere una consulta SQL, no que busque en texto.
- Cuando el corpus es tan pequeño que cabe entero en el contexto del modelo. Si son 30 páginas, mándalas completas.
- Cuando la pregunta requiere agregación sobre todo el corpus ("¿cuántos contratos vencen este trimestre?"). RAG recupera fragmentos, no cuenta.

---

### Preguntas frecuentes

**¿Cuánto cuesta operar un RAG?**
El almacenamiento vectorial es barato. El costo real está en los tokens de cada consulta, porque envías fragmentos largos. Con caching de contexto puedes bajar ese costo de forma significativa.

**¿Mis documentos se quedan en el proveedor de IA?**
Los documentos viven en tu base de datos. Solo los fragmentos relevantes viajan al modelo en cada consulta. Con un plan empresarial y retención cero, no se almacenan del otro lado.

**¿RAG elimina las alucinaciones?**
Las reduce mucho, no las elimina. Por eso el sistema debe citar fuentes: para que el usuario pueda verificar.
