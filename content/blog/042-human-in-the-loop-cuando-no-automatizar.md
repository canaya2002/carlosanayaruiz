---
n: 42
title: "Human-in-the-loop: cuándo NO automatizar con IA"
slug: "human-in-the-loop-cuando-no-automatizar"
description: "Cómo decidir qué automatizar y qué dejar en manos humanas: matriz de riesgo, puntos de aprobación y el costo real de un error automatizado."
category: "Automatización"
keyword: "human in the loop ia"
tipo: "satelite"
tags: ["human in the loop","gobernanza","riesgo","automatización"]
---


**La pregunta no es si automatizar, sino dónde poner a la persona.** Toda automatización con IA tiene un punto donde el juicio humano debe intervenir. Diseñar bien ese punto es lo que separa un sistema confiable de un incidente esperando a ocurrir.

---

### La matriz de decisión

Dos ejes: **reversibilidad** del error y **frecuencia** de la tarea.

| | Error reversible | Error irreversible |
|---|---|---|
| **Alta frecuencia** | **Automatizar** con muestreo de control | **Automatizar con aprobación** por lote o por umbral |
| **Baja frecuencia** | Automatizar si el volumen lo justifica | **No automatizar.** Asistir, no decidir |

**Reversible** significa: si sale mal, ¿puedo deshacerlo en minutos sin daño permanente?

Clasificar mal un correo interno es reversible. Enviar una comunicación a 5,000 clientes no lo es. Borrar un registro con respaldo es reversible. Ejecutar una transferencia no lo es.

---

### Los cuatro modos de intervención humana

**Modo 1 — Aprobación previa.**
Nada se ejecuta sin que una persona apruebe. Máximo control, mínimo ahorro de tiempo. Correcto para operaciones irreversibles de alto impacto.

**Modo 2 — Revisión posterior por muestreo.**
Se ejecuta automáticamente; una persona revisa un porcentaje. Buen equilibrio para alto volumen con error reversible. El porcentaje se ajusta según la tasa de error observada: empieza en 100% y baja conforme la confianza aumenta.

**Modo 3 — Excepción por umbral.**
Se ejecuta automáticamente salvo que se cruce una condición: monto alto, cliente importante, confianza baja del modelo, patrón inusual. Es el modo más eficiente cuando puedes definir bien los umbrales.

**Modo 4 — Asistencia sin ejecución.**
El sistema prepara y recomienda; la persona decide y ejecuta. Es lo correcto para decisiones que afectan a personas: contratación, crédito, sanciones, diagnósticos.

---

### Dónde NO automatizar, sin discusión

**Decisiones que afectan derechos o acceso a servicios.**
Contratación, despido, aprobación de crédito, admisión, sanciones. Además del riesgo ético, hay riesgo regulatorio creciente: varios marcos normativos exigen supervisión humana significativa en decisiones automatizadas que afectan de forma relevante a las personas.

**Comunicación de malas noticias.**
Rechazos, cancelaciones, incidentes. La eficiencia no compensa el daño relacional.

**Contenido que compromete legalmente.**
Contratos, dictámenes, declaraciones ante autoridad, comunicaciones con implicaciones regulatorias.

**Operaciones financieras irreversibles.**
Transferencias, pagos, movimientos de fondos. Doble autorización humana por encima de un umbral, siempre.

**Cualquier cosa donde un error tenga consecuencias físicas o de salud.**

---

### Cómo diseñar un buen punto de aprobación

La calidad del control depende de que la revisión sea real, no ceremonial.

**1. Da contexto suficiente para decidir en menos de 30 segundos.**
Si aprobar requiere abrir tres sistemas, la persona va a aprobar sin mirar. Un mal control es peor que ninguno, porque genera falsa confianza.

**2. Muestra el nivel de confianza.**
Si el sistema puede indicar qué tan seguro está, muéstralo. Ayuda a priorizar la atención.

**3. Haz visible lo que va a cambiar.**
No "¿apruebas esta acción?" sino "se enviará este mensaje exacto a estas 47 personas". Muestra el diff.

**4. Permite rechazar con motivo.**
El motivo del rechazo es tu principal fuente de mejora del sistema. Captúralo de forma estructurada.

**5. Pon un plazo y un comportamiento por defecto.**
¿Qué pasa si nadie aprueba en 24 horas? Define si expira, escala o se ejecuta. Sin esto, tienes tareas colgadas indefinidamente.

**6. Registra todo.**
Quién aprobó, cuándo, qué vio. Es tu evidencia ante una auditoría o una reclamación.

---

### El fenómeno del sello de goma

Es el riesgo principal de este diseño: cuando el 98% de las propuestas son correctas, la persona deja de revisar y aprueba en automático. El control existe en el papel y no en la práctica.

**Cómo combatirlo:**

- **Inserta casos de control.** Propuestas deliberadamente incorrectas de vez en cuando. Si se aprueban, sabes que la revisión no está ocurriendo.
- **Mide el tiempo de revisión.** Si el tiempo promedio baja a dos segundos, tienes sello de goma.
- **Rota a los revisores.** La fatiga de atención es real y se acumula.
- **Reduce el volumen de aprobaciones.** Si alguien aprueba 200 cosas al día, ninguna se revisa bien. Sube los umbrales para que solo lleguen los casos que de verdad requieren juicio.

Este último punto es el más importante y el menos aplicado: **menos aprobaciones y mejor revisadas vale más que muchas aprobaciones superficiales.**

---

### Cómo reducir la supervisión con el tiempo

No fijes el nivel de control para siempre. Debe evolucionar con los datos:

**Fase 1 (mes 1-2):** aprobación previa en el 100% de los casos. Registra tasa de aprobación sin cambios.

**Fase 2 (mes 3-4):** si la tasa supera el 90% de forma estable, pasa a revisión por muestreo del 30% en los casos de bajo riesgo. Los de alto riesgo siguen en aprobación previa.

**Fase 3 (mes 5+):** muestreo del 10% en bajo riesgo, umbrales definidos para excepciones, aprobación previa solo en alto riesgo.

**Nunca llegues a cero supervisión en operaciones con impacto externo.** El sistema se degrada, los datos cambian, los modelos se actualizan. Un muestreo mínimo permanente es tu sistema de alarma.

---

### Preguntas frecuentes

**¿Cuánta gente necesito para revisar?**
Depende del volumen y del tiempo por revisión. Calcula: casos que requieren aprobación × minutos por revisión. Si el número no cabe en la jornada de nadie, tus umbrales están mal calibrados.

**¿Y si el humano se equivoca más que la IA?**
Ocurre en tareas de alto volumen y baja complejidad. Ahí conviene invertir la relación: la IA ejecuta y verifica, la persona interviene solo ante excepciones señaladas.

**¿Esto no anula el ahorro de la automatización?**
No, si está bien diseñado. Pasar de redactar a revisar sigue siendo una reducción grande de tiempo. Lo que anula el ahorro es una revisión mal diseñada que obliga a rehacer el trabajo.
