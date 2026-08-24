---
n: 39
title: "Prompt engineering avanzado: 20 técnicas que sí funcionan"
slug: "prompt-engineering-avanzado-tecnicas"
description: "20 técnicas de prompt engineering, de básicas a avanzadas, con ejemplos de la instrucción concreta y una sección de lo que no funciona."
category: "Inteligencia Artificial"
keyword: "prompt engineering"
tipo: "satelite"
tags: ["prompt engineering","ia","productividad","técnicas"]
---


**El prompt engineering no es magia de palabras clave: es especificación.** La mayoría de los prompts malos fallan porque no dicen qué se quiere, para quién, en qué formato y bajo qué restricciones.

Estas veinte técnicas están ordenadas de más básicas a más avanzadas. Las primeras diez resuelven el 80% de los casos.

---

### Fundamentos

**1. Da contexto de rol y audiencia.**
No "explica Kubernetes", sino "explica Kubernetes a un director financiero que necesita decidir si aprobar la migración".

**2. Especifica el formato de salida.**
"Responde con una tabla de tres columnas: opción, costo estimado, riesgo principal." La ambigüedad de formato genera respuestas que hay que reformatear a mano.

**3. Define la extensión.**
"En máximo 150 palabras" o "tres párrafos". Sin esto, obtienes lo que el modelo considere apropiado, que rara vez coincide.

**4. Da ejemplos (few-shot).**
Uno o dos ejemplos de entrada y salida deseada valen más que un párrafo de descripción. Es la técnica con mejor relación esfuerzo/resultado que existe.

**5. Estructura el prompt con delimitadores.**
Separa instrucciones, contexto y datos con etiquetas claras. Reduce mucho la confusión entre "esto es una instrucción" y "esto es material a procesar".

```
<instrucciones>
Resume el documento en 5 viñetas.
</instrucciones>

<documento>
...
</documento>
```

**6. Di qué hacer, no solo qué evitar.**
"Escribe en frases cortas" funciona mejor que "no escribas frases largas". Los modelos siguen mejor las instrucciones afirmativas.

**7. Pide razonamiento antes de la conclusión.**
"Analiza primero los tres factores y después da tu recomendación." Invertir el orden —conclusión primero— degrada la calidad del análisis.

**8. Divide tareas complejas en pasos.**
Una tarea con cinco objetivos distintos produce peores resultados que cinco intercambios enfocados.

**9. Da criterios de calidad explícitos.**
"Una buena respuesta incluye cifras concretas y menciona al menos un riesgo." El modelo puede optimizar contra criterios que conoce.

**10. Itera sobre el prompt, no sobre la respuesta.**
Si corriges la misma cosa tres veces, esa corrección pertenece al prompt.

---

### Intermedias

**11. Prefill de la respuesta.**
Empieza tú la respuesta para forzar el formato:

```
Asistente: {
  "categoria":
```

Elimina preámbulos y garantiza que la salida sea JSON válido.

**12. Pide que declare su incertidumbre.**
"Si no tienes información suficiente para responder algo, dilo explícitamente en lugar de estimar." Reduce mucho la invención.

**13. Separa generación de evaluación.**
Primero pide tres opciones. Después, en un intercambio distinto, pide que las evalúe contra criterios. Mezclarlo hace que defienda su primera idea.

**14. Usa el prompt de sistema para lo permanente.**
Rol, restricciones duras y formato van en el prompt de sistema. La tarea concreta va en el mensaje. Mezclarlo hace que las reglas se diluyan.

**15. Ancla con datos, no con adjetivos.**
"Un texto profesional" es vago. "Frases de máximo 20 palabras, sin adverbios de intensidad, en tercera persona" es especificable y verificable.

**16. Pide autocrítica en un segundo paso.**
"Revisa la respuesta anterior y señala sus tres debilidades más importantes." Suele encontrar problemas reales.

**17. Controla la temperatura según la tarea.**
Baja para extracción, clasificación y datos estructurados. Alta para lluvia de ideas y variantes creativas. Usar el mismo valor para todo es dejar calidad sobre la mesa.

---

### Avanzadas

**18. Cadena de prompts especializados.**
En lugar de un prompt gigante, encadena: extracción → normalización → análisis → redacción. Cada paso con su prompt afinado. Más costoso en tokens, mucho mejor en calidad y mucho más fácil de depurar.

**19. Estructura para aprovechar el caching de contexto.**
Coloca lo estable —instrucciones largas, documentos de referencia— al **inicio** del prompt, y lo variable al final. Los proveedores que ofrecen caché de prefijo pueden reutilizar esa parte y reducir el costo de forma sustancial. Es una decisión de arquitectura de prompt con impacto económico directo.

**20. Evalúa con un conjunto de pruebas, no con impresiones.**
Ten de 30 a 100 casos con resultado esperado. Cada cambio de prompt se mide contra ese conjunto. Sin esto, "el prompt nuevo se siente mejor" es todo lo que tienes, y suele estar equivocado.

---

### Lo que no funciona (aunque circule mucho)

**Prometer recompensas o amenazar.** No mejora los resultados de forma consistente y ensucia el prompt.

**Insistir en mayúsculas.** Un "IMPORTANTE" ocasional ayuda a jerarquizar. Diez instrucciones en mayúsculas se anulan entre sí.

**Prompts de 3,000 palabras con reglas contradictorias.** Más largo no es mejor. Si tu prompt tiene reglas que se contradicen, el modelo elegirá una y no sabrás cuál.

**Copiar plantillas sin adaptarlas.** Un prompt afinado para un dominio suele funcionar peor en otro que uno simple escrito para el tuyo.

---

### El proceso que uso

1. Escribe la versión más simple que podría funcionar.
2. Pruébala en 10 casos reales.
3. Anota cada fallo y su categoría.
4. Ataca la categoría más frecuente con una técnica concreta.
5. Vuelve a medir sobre los mismos 10 casos.
6. Cuando esté estable, amplía a 50 casos y repite.

**Nunca cambies dos cosas a la vez.** No sabrás cuál funcionó.

---

### Preguntas frecuentes

**¿Los prompts son transferibles entre modelos?**
Los principios sí, los detalles no. Un prompt muy afinado para un modelo suele necesitar ajuste en otro. Prueba antes de migrar.

**¿Vale la pena versionar los prompts?**
Sí. Guárdalos en el repositorio, con su conjunto de pruebas. Un prompt en producción es código.

**¿Cuándo un prompt deja de ser suficiente?**
Cuando el problema es de información que el modelo no tiene: ahí necesitas RAG, no un mejor prompt.
