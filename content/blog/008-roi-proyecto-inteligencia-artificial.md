---
n: 8
title: "Cómo medir el ROI de un proyecto de inteligencia artificial"
slug: "roi-proyecto-inteligencia-artificial"
description: "Fórmulas y KPIs concretos para medir el ROI de un proyecto de IA, incluyendo los costos ocultos que casi nadie mete al cálculo."
category: "Inteligencia Artificial"
keyword: "roi inteligencia artificial"
tipo: "satelite"
tags: ["roi","métricas","gestión de proyectos","inteligencia artificial"]
---


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
