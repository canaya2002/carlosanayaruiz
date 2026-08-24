---
n: 43
title: "Cómo orquestar múltiples agentes de IA"
slug: "orquestar-multiples-agentes-ia"
description: "Patrones de orquestación multiagente: supervisor, pipeline y enjambre. Cuál usar según la tarea y cómo controlar el costo en tokens."
category: "Inteligencia Artificial"
keyword: "orquestación de agentes de ia"
tipo: "satelite"
tags: ["multiagente","orquestación","arquitectura ia","agentes"]
---


**Un sistema multiagente divide un problema entre varios agentes especializados en lugar de darle todas las herramientas a uno solo.** Se justifica cuando un agente único empieza a fallar por exceso de herramientas o de contexto, no antes.

**Advertencia de entrada:** la mayoría de los problemas que la gente intenta resolver con multiagente se resuelven mejor con un agente bien diseñado y menos herramientas. Empieza por ahí.

---

### Cuándo un solo agente deja de servir

Señales concretas:

- **Más de 15 o 20 herramientas.** La selección se degrada notablemente.
- **El contexto acumulado no cabe** o cuesta demasiado en cada iteración.
- **Necesitas modelos distintos** para partes distintas de la tarea: uno rápido y barato para clasificar, uno potente para razonar.
- **Requisitos de permisos incompatibles.** Un componente necesita acceso amplio de lectura y otro necesita escritura restringida.
- **Las tareas son paralelizables** y la latencia importa.

Si ninguna de estas aplica, no dividas.

---

### Patrón 1 — Supervisor

Un agente coordinador recibe el objetivo, decide qué subagente debe actuar, le pasa una tarea acotada y recibe su resultado. Repite hasta terminar.

```
        [Supervisor]
       /      |      \
[Investigador] [Analista] [Redactor]
```

**Cuándo usarlo:** cuando el camino no está predefinido y depende de lo que se encuentre.

**Ventajas:** flexible, fácil de razonar, permite agregar especialistas sin rediseñar.

**Riesgos:** el supervisor puede entrar en bucles. Necesita límite duro de iteraciones y de presupuesto.

**Detalle clave:** el supervisor **no debe recibir el contexto completo de cada subagente**. Recibe resúmenes. Si le pasas todo, el contexto crece sin control y el costo se dispara.

---

### Patrón 2 — Pipeline

Etapas fijas en secuencia. La salida de una es la entrada de la siguiente.

```
[Extraer] → [Normalizar] → [Enriquecer] → [Validar] → [Publicar]
```

**Cuándo usarlo:** cuando el flujo es conocido y estable.

**Ventajas:** predecible, barato, fácil de depurar, fácil de medir por etapa.

**Riesgos:** rígido. Si el caso no encaja en el flujo, falla.

**Este es el patrón infravalorado.** Mucha gente construye un supervisor complejo para un problema que era un pipeline de cuatro pasos. Si conoces las etapas, no le pidas a un modelo que las descubra en cada ejecución.

---

### Patrón 3 — Paralelo con agregación

Varios agentes trabajan simultáneamente sobre la misma entrada desde ángulos distintos, y un agregador combina resultados.

```
         Entrada
        /   |    \
  [Legal] [Técnico] [Comercial]
        \   |    /
        [Agregador]
```

**Cuándo usarlo:** revisión desde múltiples perspectivas, análisis de un documento por distintos criterios, generación de opciones diversas.

**Ventajas:** rápido, obtiene diversidad real de enfoques.

**Riesgos:** costo multiplicado por el número de agentes. Y el agregador puede quedarse sin espacio de contexto si los resultados son largos.

---

### Patrón 4 — Generador y crítico

Un agente produce, otro evalúa contra criterios, y se itera un número limitado de veces.

**Cuándo usarlo:** cuando la calidad importa más que la latencia y puedes definir criterios de evaluación claros.

**Detalle crítico:** el crítico debe tener **criterios explícitos y verificables**, no "evalúa si está bien". Y necesitas un límite de iteraciones: dos o tres. Más allá de eso, las mejoras son marginales y el costo se acumula.

---

### Control de costo: la parte que decide si esto es viable

Un sistema multiagente puede costar entre cinco y veinte veces lo que una llamada simple. Sin control, se vuelve inviable.

**1. Modelo por tarea, no un modelo para todo.**
Clasificar, extraer y enrutar: modelo pequeño y barato. Razonar, sintetizar y decidir: modelo potente. Esta sola decisión suele reducir el costo total entre 50% y 70%.

**2. Presupuesto duro por ejecución.**
Un límite de tokens y de iteraciones por tarea. Al alcanzarlo, se detiene y reporta. Sin esto, un bucle te puede costar mucho dinero en una noche.

**3. Resúmenes, no contexto completo.**
Entre agentes se pasan conclusiones estructuradas, no transcripciones. Define un formato de traspaso.

**4. Caching de prefijo.**
Las instrucciones estables al inicio del prompt, lo variable al final. Los proveedores que ofrecen caché de contexto pueden reducir sustancialmente el costo de la parte repetida.

**5. Etapas deterministas donde sea posible.**
Si un paso puede hacerlo un script, que lo haga un script. No todo tiene que pasar por un modelo.

---

### Observabilidad: no opcional

Cuando un sistema multiagente falla, sin trazas no tienes forma de saber dónde. Necesitas, por ejecución:

- Árbol completo de llamadas: qué agente, qué herramienta, qué argumentos
- Entrada y salida de cada paso
- Tokens y costo por agente
- Latencia por etapa
- Punto exacto donde se desvió

**Regla práctica:** si no puedes reconstruir por qué el sistema tomó una decisión, no lo pongas en producción.

---

### Los errores más comunes

**Multiagente cuando bastaba un agente.** El más frecuente y el más caro.

**Sin criterio de terminación.** El sistema itera indefinidamente porque nadie definió cuándo declarar que no se puede.

**Contexto compartido sin control.** Cada agente añade al historial y el costo crece de forma cuadrática.

**Especialización artificial.** Crear cinco agentes que en realidad hacen lo mismo con prompts ligeramente distintos. La especialización debe corresponder a herramientas o permisos distintos, no a matices de instrucción.

**Sin evaluación.** Necesitas un conjunto de tareas con resultado esperado. Sin eso, cada cambio en la orquestación es una apuesta.

---

### Preguntas frecuentes

**¿Cuántos agentes son demasiados?**
Si no puedes dibujar el sistema en una hoja y explicárselo a alguien en dos minutos, son demasiados.

**¿Conviene un framework o construirlo a mano?**
Para pipelines y supervisores simples, construirlo a mano da más control y es más fácil de depurar. Los frameworks ayudan en orquestaciones complejas, a costa de abstracción que a veces estorba al depurar.

**¿Cómo pruebo un sistema multiagente?**
Cada agente por separado con sus propios casos, y después el sistema completo con casos de extremo a extremo. Probar solo el conjunto hace imposible localizar la causa de un fallo.
