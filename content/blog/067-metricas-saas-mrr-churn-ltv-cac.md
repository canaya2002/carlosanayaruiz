---
n: 67
title: "Métricas SaaS que importan: MRR, churn, LTV y CAC"
slug: "metricas-saas-mrr-churn-ltv-cac"
description: "Las métricas SaaS que de verdad predicen supervivencia, con las fórmulas exactas, los errores de cálculo comunes y los benchmarks reales."
category: "SaaS"
keyword: "métricas saas"
tipo: "satelite"
tags: ["métricas","mrr","churn","saas"]
---


**Cuatro métricas te dicen si tu SaaS va a sobrevivir: cuánto ingresas de forma recurrente, cuánto se te van los clientes, cuánto vale un cliente y cuánto cuesta conseguirlo.** El resto son métricas de apoyo.

Aquí van las fórmulas exactas y —más importante— los errores de cálculo que hacen que la mayoría de los tableros mientan.

---

### MRR: ingreso mensual recurrente

```
MRR = Suma de todas las suscripciones normalizadas a valor mensual
```

**Normalizar es la parte que se hace mal.** Un plan anual de 12,000 pesos aporta 1,000 de MRR, no 12,000 en el mes de cobro. Si sumas el cobro completo, tu gráfica tendrá picos que no significan nada.

**Descomponer el MRR es donde está la información real:**

```
MRR Nuevo        + de clientes nuevos
MRR Expansión    + de clientes que subieron de plan
MRR Contracción  − de clientes que bajaron de plan
MRR Cancelado    − de clientes que se fueron
─────────────────────────────────────
MRR Neto Nuevo   = el número que importa
```

**MRR Neto Nuevo** es la métrica de salud más honesta que existe. Si es negativo, estás perdiendo terreno aunque el MRR total suba por inercia.

**No incluyas en el MRR:** cobros únicos, servicios de implementación, consultoría. No son recurrentes.

---

### Churn: la métrica que te mata

Hay dos, y confundirlas es un error frecuente.

**Churn de clientes:**
```
Clientes perdidos en el mes / Clientes al inicio del mes
```

**Churn de ingresos:**
```
MRR perdido en el mes / MRR al inicio del mes
```

**Por qué necesitas los dos:** puedes perder muchos clientes pequeños (churn de clientes alto) sin que afecte mucho tus ingresos, o perder un cliente grande (churn de ingresos alto) con churn de clientes bajo. Ambas situaciones requieren respuestas distintas.

**La métrica más completa: Retención Neta de Ingresos (NRR).**

```
NRR = (MRR inicial + Expansión − Contracción − Cancelado) / MRR inicial
```

Solo considera clientes existentes, sin contar nuevos.

**Si tu NRR supera el 100%**, tu base de clientes crece en ingresos aunque no consigas ninguno nuevo. Es la característica de los mejores negocios SaaS.

**Errores comunes al calcular churn:**
- Mezclar clientes mensuales y anuales en el mismo cálculo. Sepáralos.
- No excluir cancelaciones de la prueba gratuita.
- Calcular churn anual multiplicando el mensual por 12. Es incorrecto matemáticamente; usa la fórmula compuesta.
- No segmentar. El churn global esconde que un segmento se va y otro se queda.

---

### LTV: valor del tiempo de vida

```
LTV = (Ingreso mensual promedio por cliente × Margen bruto) / Churn mensual
```

**El margen bruto es obligatorio en la fórmula.** Si ingresas 1,000 pesos por cliente pero te cuesta 300 servirlo, tu LTV se calcula sobre 700, no sobre 1,000. Omitirlo infla el número entre 30% y 50%.

**Advertencia sobre el LTV:** con churn bajo, la fórmula produce números enormes y poco realistas. Un churn del 1% mensual da un tiempo de vida teórico de 100 meses, o más de 8 años. ¿De verdad crees que tu cliente promedio seguirá 8 años?

**Solución práctica:** calcula el LTV con un horizonte acotado, típicamente 36 meses. Es más conservador y más útil para decisiones.

---

### CAC: costo de adquisición

```
CAC = (Gasto total en marketing + ventas del periodo) / Clientes nuevos del periodo
```

**Lo que casi nadie incluye y debería:**
- Salarios del equipo de marketing y ventas, con carga social
- Herramientas de marketing y ventas
- Costo del contenido producido
- Comisiones
- Tiempo del fundador dedicado a vender, valorado a costo de mercado

Ese último punto es el que más distorsiona el CAC en empresas pequeñas. Si el fundador dedica media jornada a vender y eso no está en el cálculo, tu CAC real es mucho mayor que el reportado.

**Calcula el CAC por canal.** El promedio es inútil: puedes tener un canal con CAC excelente y otro que quema dinero, y el promedio los oculta.

---

### Las dos relaciones que resumen todo

**Relación LTV:CAC**

```
LTV / CAC
```

| Valor | Interpretación |
|---|---|
| < 1 | Pierdes dinero con cada cliente. Detente. |
| 1 – 3 | Marginal. Sostenible pero sin margen para crecer. |
| 3 – 5 | Saludable. La zona objetivo. |
| > 5 | Puede indicar que estás invirtiendo poco en crecimiento |

**Periodo de recuperación del CAC**

```
CAC / (Ingreso mensual × Margen bruto)
```

Cuántos meses tardas en recuperar lo que gastaste en conseguir al cliente.

**Menos de 12 meses es sano** para la mayoría de los SaaS. Por encima de 18, tienes un problema de flujo de efectivo: cada cliente nuevo te descapitaliza a corto plazo aunque sea rentable a largo.

Esta métrica es más importante que el LTV:CAC cuando no tienes financiamiento, porque determina cuánto puedes crecer con tu propio flujo.

---

### Métricas de apoyo que sí valen

**Tasa de activación.** Porcentaje de registros que llegan al primer momento de valor. Predice el churn futuro mejor que ninguna otra métrica temprana.

**Ingreso promedio por cuenta (ARPA).** Y su tendencia: si sube, estás vendiendo mejor o subiendo precios con éxito.

**Concentración de ingresos.** Qué porcentaje de tu MRR viene de tus cinco clientes más grandes. Por encima del 30%, tienes riesgo de concentración serio.

**Tiempo hasta el primer valor.** Cuántos días desde el registro hasta que el usuario obtiene el resultado que buscaba.

---

### Las métricas que engañan

**Usuarios registrados.** Sin actividad, es un número decorativo.

**Descargas o visitas.** No son negocio.

**MRR total sin descomponer.** Puede subir mientras el negocio se deteriora, si el crecimiento viene solo de clientes nuevos que sustituyen a los que se van.

**LTV con churn muy bajo y sin horizonte acotado.** Produce números fantásticos y sin significado.

**CAC sin salarios ni tiempo de fundadores.** El más común y el más peligroso, porque hace parecer rentable algo que no lo es.

---

### Preguntas frecuentes

**¿Cada cuánto reviso estas métricas?**
MRR y churn, mensualmente. LTV:CAC y periodo de recuperación, trimestralmente. Activación, semanalmente si estás iterando el onboarding.

**¿Cuál miro primero si solo puedo elegir una?**
MRR Neto Nuevo. Combina crecimiento, expansión y pérdida en un solo número.

**¿Y si mi producto es muy nuevo y no tengo datos suficientes?**
Concéntrate en activación y en conversaciones con los usuarios que se van. Con menos de 50 clientes, las métricas de cohorte tienen demasiado ruido para ser confiables.
