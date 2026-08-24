---
n: 57
title: "Reserved Instances y Savings Plans explicados"
slug: "reserved-instances-savings-plans-aws"
description: "Reserved Instances vs Savings Plans: cuál conviene, cómo calcular la cobertura óptima y por qué comprometerte antes de right-sizing es un error caro."
category: "Cloud"
keyword: "savings plans aws"
tipo: "satelite"
tags: ["aws","finops","costos","savings plans"]
---


**Son mecanismos de descuento a cambio de comprometerte a un nivel de uso durante uno o tres años.** El descuento es sustancial, pero el compromiso es real: pagas lo pactado uses o no uses.

Y hay una regla que domina todas las demás: **nunca te comprometas antes de haber redimensionado tu infraestructura.**

---

### La diferencia entre los dos mecanismos

**Instancias Reservadas (RI).** Te comprometes a un tipo específico de recurso: familia de instancia, región y, según la modalidad, tamaño y sistema operativo. A cambio, un descuento importante sobre el precio bajo demanda.

**Planes de Ahorro (Savings Plans).** Te comprometes a un **gasto por hora** en dólares, no a un recurso concreto. Mientras consumas ese gasto en servicios elegibles, aplica el descuento.

| | Instancias Reservadas | Planes de Ahorro |
|---|---|---|
| Compromiso | Un tipo de recurso | Un gasto por hora |
| Flexibilidad | Baja a media | Alta |
| Se puede revender | En algunos casos | No |
| Cobertura entre servicios | No | Sí, en las variantes amplias |
| Complejidad de gestión | Alta con muchos tipos | Baja |

**Para la mayoría de las empresas, los planes de ahorro flexibles son la mejor opción**, porque la flexibilidad de poder cambiar de tipo de instancia sin perder el descuento vale más que el porcentaje adicional de un compromiso rígido.

---

### El error que cuesta más caro

Las herramientas de recomendación de la consola calculan el ahorro potencial **sobre tu configuración actual**.

Si tu base de datos está sobredimensionada al doble de lo que necesita, la recomendación te dirá: "comprométete a este tamaño durante un año y ahorra un 40%".

Y es cierto: ahorras 40% sobre un gasto que **no deberías tener**. Además, quedas atado a esa configuración excesiva durante todo el plazo.

**El orden correcto, sin excepciones:**

```
1. Eliminar recursos no usados
2. Ajustar tipos de almacenamiento
3. Redimensionar cómputo según uso real
4. Estabilizar y monitorear 4-8 semanas
5. AHORA calcular compromisos
```

Comprometerse en el paso 1 en lugar del paso 5 es el error de FinOps más común y más caro que existe.

---

### Cómo calcular la cobertura correcta

**Paso 1 — Identifica tu carga base.**

Grafica tu consumo por hora durante 60 a 90 días. Vas a ver un patrón: un piso que nunca baja, y picos por encima.

Tu carga base es ese piso, medido con el percentil 10 o 20 de tu consumo horario. Es lo que consumes prácticamente siempre.

**Paso 2 — Cubre solo la base, no los picos.**

Los picos se pagan bajo demanda o con capacidad puntual. Comprometerte al nivel de tus picos significa pagar por capacidad ociosa la mayor parte del tiempo.

**Paso 3 — Deja margen.**

Una cobertura razonable para empezar está entre el **60% y el 75% de la carga base**, no el 100%. Razones:

- Tu arquitectura puede cambiar (migrar a serverless, optimizar más, cambiar de servicio).
- Puedes reducir plantilla de infraestructura.
- Los precios bajan con el tiempo, y estar sobrecomprometido te impide beneficiarte.

**Paso 4 — Escalona los compromisos.**

En lugar de comprar todo de una vez, compra en tramos cada trimestre. Así:
- Tus vencimientos no coinciden todos en la misma fecha
- Puedes ajustar según cómo evolucione tu consumo
- Reduces el riesgo de un compromiso mal calculado

---

### Plazo y forma de pago

**Un año vs. tres años.** Tres años da mayor descuento, pero es mucho tiempo en infraestructura. Si tu arquitectura está estable y no prevés cambios grandes, tres años puede convenir para la porción más estable de tu carga base. Para todo lo demás, un año.

**Sin pago inicial / parcial / total.** El pago total por adelantado da el mayor descuento pero inmoviliza capital. Para una empresa donde el flujo de efectivo importa, el pago sin adelanto o parcial suele ser mejor decisión financiera aunque el descuento sea menor. Haz el cálculo con tu costo de capital, no solo con el porcentaje.

---

### Cómo monitorear después de comprar

Dos métricas, revisadas mensualmente:

**Cobertura.** Qué porcentaje de tu uso elegible está cubierto por compromisos. Si baja mucho, estás pagando bajo demanda de más. Si sube al 100%, considera si podrías haber comprometido más.

**Utilización.** Qué porcentaje de tu compromiso estás usando. **Debe estar cerca del 100%.** Si baja, estás pagando por capacidad que no consumes: es dinero perdido directo.

Una utilización por debajo del 95% de forma sostenida significa que sobrecompraste. Aprende para el siguiente ciclo.

---

### Qué hacer si te sobrecomprometiste

Opciones, en orden de preferencia:

1. **Consolida cargas** hacia los recursos cubiertos por el compromiso.
2. **Mueve entornos de desarrollo y pruebas** a los tipos cubiertos para consumir el compromiso.
3. **Revende**, si el tipo de compromiso lo permite. Hay un mercado secundario para ciertas modalidades de instancias reservadas, con descuento.
4. **Absórbelo** y ajusta el cálculo en la renovación.

No hay cancelación. Por eso el paso 3 del cálculo —dejar margen— importa tanto.

---

### Preguntas frecuentes

**¿Cuánto se ahorra realmente?**
Los descuentos varían por servicio, plazo y modalidad de pago. Consulta los porcentajes vigentes en la documentación oficial. Lo relevante es que el ahorro es significativo y que se aplica sobre una base que primero debe estar bien dimensionada.

**¿Aplican a servicios serverless?**
Algunas modalidades de planes de ahorro cubren cómputo serverless y contenedores. Verifica la elegibilidad del servicio específico antes de calcular.

**¿Debo comprometerme si mi carga crece rápido?**
Sí, pero solo sobre la porción que ya es estable. El crecimiento se cubre bajo demanda y se comprometerá cuando se estabilice.

**¿Y si migro a otra región?**
Algunas modalidades tienen flexibilidad regional, otras no. Si prevés una migración, elige la modalidad flexible o pospón el compromiso.
