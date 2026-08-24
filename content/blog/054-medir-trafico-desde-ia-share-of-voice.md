---
n: 54
title: "Cómo medir el tráfico que llega desde IA (AI Share of Voice)"
slug: "medir-trafico-desde-ia-share-of-voice"
description: "Cómo montar medición de AI Share of Voice: identificar referidos de asistentes, monitorear citaciones y reportarlo a dirección."
category: "SEO"
keyword: "medir tráfico de inteligencia artificial"
tipo: "satelite"
tags: ["analítica","geo","medición","ia"]
---


**AI Share of Voice mide con qué frecuencia apareces en las respuestas que los asistentes de IA dan sobre tu sector, y en qué contexto.** Es el equivalente al seguimiento de posiciones, pero para un canal donde no hay una lista de resultados que consultar.

Y es una medición que casi nadie tiene montada, lo cual la convierte en una ventaja mientras dure.

---

### Las dos mitades del problema

**Mitad 1 — Tráfico de referencia.** Visitas que llegan a tu sitio desde plataformas de IA. Se mide con analítica convencional, con algunos ajustes.

**Mitad 2 — Citaciones sin clic.** Apariciones en respuestas que no generan visita. Es la parte mayoritaria y la que requiere instrumentación propia.

La segunda es la que importa más y la que nadie mide.

---

### Medir el tráfico de referencia

**Paso 1 — Identifica los dominios de referencia.**

En tu analítica, filtra el tráfico de referencia buscando dominios de las plataformas de asistentes de IA y buscadores generativos. Los principales asistentes conversacionales, los buscadores con respuesta generativa y las herramientas de investigación con IA aparecen como referentes cuando el usuario hace clic en una cita.

**Paso 2 — Crea un segmento o canal personalizado.**

Agrupa esos referentes en un canal propio para poder analizarlos en conjunto y compararlos contra orgánico, directo y social.

**Paso 3 — Analiza el comportamiento, no solo el volumen.**

Lo interesante de este tráfico no es cuánto es —suele ser poco— sino cómo se comporta. Compara contra tu tráfico orgánico:
- Tiempo en página
- Páginas por sesión
- Tasa de conversión
- Profundidad de scroll

En muchos sitios este tráfico convierte notablemente mejor, porque el usuario llega con una recomendación contextualizada, no con una lista de opciones.

**Paso 4 — Identifica qué páginas reciben ese tráfico.**

Te dice qué contenido tuyo está siendo citado. Es información directamente accionable: replica el formato de esas páginas.

**Limitaciones que debes conocer:** no todo el tráfico desde IA llega etiquetado. Si el usuario copia tu nombre y busca por su cuenta, o teclea tu dominio, aparece como orgánico o directo. Estás midiendo un piso, no el total.

---

### Medir citaciones: la instrumentación propia

Aquí está el trabajo real y la parte valiosa.

**Paso 1 — Define tu conjunto de consultas.**

De 30 a 100 preguntas que tu cliente potencial haría. Divididas en categorías:

- **Consultas de categoría:** "mejores herramientas para X", "quién ofrece Y en México"
- **Consultas de problema:** "cómo resolver Z", "qué hacer cuando W"
- **Consultas de comparación:** "A vs B", "alternativas a C"
- **Consultas de marca:** "qué es [tu marca]", "opiniones sobre [tu marca]"

**Paso 2 — Automatiza la consulta periódica.**

Usando las APIs de los distintos proveedores, ejecuta el conjunto completo con una frecuencia definida —semanal o quincenal— y guarda las respuestas.

```ts
// Estructura de lo que guardas por cada consulta
{
  fecha: '2026-08-21',
  proveedor: 'proveedor-a',
  consulta: 'mejores herramientas de auditoría de costos en la nube',
  respuestaCompleta: '...',
  meMencionan: true,
  posicionMencion: 2,          // Orden de aparición en el texto
  contexto: 'positivo',        // positivo / neutral / negativo
  competidoresMencionados: ['Competidor A', 'Competidor B'],
  fuentesCitadas: ['https://...'],
}
```

**Paso 3 — Calcula las métricas.**

| Métrica | Cómo se calcula |
|---|---|
| **Share of Voice** | Consultas donde apareces / total de consultas |
| **Posición media de mención** | Promedio del orden en que apareces |
| **Sentimiento de la mención** | Distribución positivo/neutral/negativo |
| **SoV competitivo** | Tus menciones / menciones totales de todas las marcas |
| **Tasa de citación de fuente** | Cuántas veces citan tu URL como fuente |

Esa última métrica es la más accionable: te dice exactamente qué páginas tuyas están funcionando como fuente.

**Paso 4 — Segmenta por proveedor.**

Los distintos asistentes tienen índices y comportamientos diferentes. Puedes tener 40% de Share of Voice en uno y 5% en otro. Saberlo te dice dónde enfocar.

---

### El costo de medir esto

Es razonable. Cien consultas × cuatro proveedores × cuatro veces al mes son 1,600 llamadas mensuales. Con modelos de gama media y respuestas moderadas, el costo mensual es de decenas o pocos cientos de pesos.

Si quieres abaratarlo: reduce la frecuencia a quincenal y usa un modelo económico para la parte de clasificación de sentimiento y extracción de menciones.

---

### Cómo reportarlo a dirección

Una página, con esta estructura:

**1. El número principal.** Share of Voice global y su variación respecto al periodo anterior.

**2. Posición competitiva.** Tu porcentaje frente a los tres competidores principales. Este gráfico es el que genera conversación.

**3. Qué contenido está funcionando.** Las cinco URLs más citadas como fuente.

**4. Huecos.** Consultas relevantes donde no apareces y sí aparece la competencia. Es tu mapa de contenido a producir.

**5. Tráfico de referencia.** Volumen y calidad comparada contra otros canales.

**6. Decisión solicitada.** Qué se propone hacer y qué recursos requiere.

Sin capturas de conversaciones, sin explicaciones técnicas. El dato y la decisión.

---

### Qué hacer con los resultados

**Si no apareces en una consulta relevante:** revisa quién sí aparece y qué formato tiene su contenido. Normalmente encontrarás una respuesta directa y estructurada que tú no tienes.

**Si apareces pero en última posición:** tu contenido es recuperable pero menos citable. Suele faltar especificidad: datos, números, condiciones concretas.

**Si te mencionan con información incorrecta o desactualizada:** publica contenido claro y fechado que corrija el punto, y asegúrate de que sea la fuente más recuperable para esa consulta.

**Si tu competencia domina una categoría:** analiza qué tienen. Casi siempre es presencia distribuida —comparativas, comunidades, menciones de terceros— más que mejor contenido propio.

---

### Preguntas frecuentes

**¿Vale la pena si mi tráfico desde IA es mínimo?**
Sí, precisamente por eso. Estás midiendo una tendencia temprana. Cuando el volumen sea significativo, ya tendrás un año de datos y una posición construida.

**¿Existen herramientas comerciales para esto?**
Están apareciendo. Vale la pena evaluarlas, aunque montar tu propia medición con las APIs no es complicado y te da control total sobre el conjunto de consultas.

**¿Con qué frecuencia debo medir?**
Quincenal es suficiente para ver tendencias sin generar ruido. Semanal si estás en una fase activa de optimización.
