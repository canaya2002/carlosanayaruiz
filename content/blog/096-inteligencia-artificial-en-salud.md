---
n: 96
title: "Inteligencia artificial en salud: promesas y límites"
slug: "inteligencia-artificial-en-salud"
description: "Dónde la IA ya aporta valor clínico real, dónde todavía no, y qué exige la regulación antes de tocar decisiones médicas."
category: "Tendencias"
keyword: "inteligencia artificial en salud"
tipo: "satelite"
tags: ["healthtech","ia","salud","regulación"]
---


**El sector salud combina el mayor potencial de impacto con el mayor costo de un error, y por eso es donde la distancia entre demostración y aplicación clínica es más grande.** Un modelo con excelentes métricas en un conjunto de prueba puede fallar de forma peligrosa en una población distinta.

Este artículo es informativo. No constituye asesoría médica, regulatoria ni legal.

---

### Dónde aporta valor demostrado

**1. Apoyo al diagnóstico por imagen.**
Detección de hallazgos en radiología, dermatología y oftalmología. Es el área con más evidencia acumulada. **Como apoyo al criterio del especialista, no como sustituto.**

**2. Carga administrativa.**
Transcripción de consultas, generación de notas clínicas, codificación, gestión de citas. Es donde el retorno es más claro y el riesgo más bajo, y donde probablemente está el mayor beneficio a corto plazo: reduce el tiempo que el personal clínico dedica a documentar en lugar de atender.

**3. Triaje y priorización.**
Ordenar la cola según urgencia detectada. Con supervisión, y con criterios de seguridad que garanticen que un caso grave no se despriorice.

**4. Investigación y descubrimiento.**
Predicción de estructuras de proteínas, cribado de compuestos, análisis de literatura científica. Aquí el impacto ha sido considerable y bien documentado.

**5. Monitoreo y detección temprana.**
Análisis de señales continuas de dispositivos para detectar deterioro antes de que sea evidente.

---

### Dónde todavía no

**Diagnóstico autónomo.**
Los sistemas rinden bien en las poblaciones con las que fueron evaluados y peor fuera de ellas. La generalización sigue siendo el problema abierto principal.

**Modelos de lenguaje general como fuente clínica.**
Un modelo de propósito general puede producir información médica incorrecta con total seguridad. No es una herramienta de consulta clínica y no debe usarse como tal.

**Decisiones de tratamiento.**
La responsabilidad clínica no es delegable a un sistema.

**Sustitución de la relación clínica.**
Buena parte del acto médico es escuchar, explorar e interpretar señales que no están en los datos.

---

### El problema del sesgo, que aquí es crítico

Un sistema entrenado predominantemente con datos de una población puede rendir sensiblemente peor en otras. Se ha documentado en múltiples contextos: diferencias de rendimiento por tono de piel en dermatología, por sexo en cardiología, por grupo poblacional en distintas especialidades.

**Consecuencia práctica:** un sistema validado en una población no está validado para la tuya hasta que se demuestre.

**Qué exigir antes de adoptar cualquier herramienta:**
- En qué población fue entrenada y validada
- Rendimiento desglosado por subgrupos, no solo global
- Si existe validación en población similar a la tuya
- Qué pasa con los casos fuera de distribución

Si el proveedor no puede responder estas preguntas, no está listo para uso clínico en tu contexto.

---

### El marco regulatorio

Los sistemas de IA destinados a diagnóstico, tratamiento o prevención suelen calificar como **dispositivos médicos** y estar sujetos a autorización regulatoria antes de su comercialización y uso.

**En México**, la regulación de dispositivos médicos corresponde a la autoridad sanitaria correspondiente, con requisitos de registro sanitario. **Verifica los requisitos vigentes y el proceso aplicable con asesoría especializada.**

**A nivel internacional**, distintas agencias han desarrollado marcos para software como dispositivo médico, incluyendo consideraciones sobre sistemas que se actualizan con el tiempo.

**Y el marco europeo de IA** clasifica varios usos sanitarios como de alto riesgo, con obligaciones específicas.

**Regla práctica:** si el sistema influye en decisiones diagnósticas o terapéuticas, asume que hay requisitos regulatorios y consúltalo antes de construir, no después.

---

### Protección de datos de salud

Los datos de salud son **datos sensibles** en prácticamente todos los marcos de protección de datos. Eso implica:

- Consentimiento expreso, y en México por escrito según el caso
- Medidas de seguridad reforzadas
- Evaluación cuidadosa de si el procesamiento en la nube es defensible o si requiere procesamiento local
- Documentación exhaustiva

**Enviar datos clínicos identificables a una API de IA sin resolver esto es un problema serio**, no un detalle de cumplimiento.

**La alternativa práctica en muchos casos:** procesamiento local o en infraestructura controlada para lo que contiene datos clínicos, y servicios en la nube solo para lo que no.

---

### Cómo evaluar una herramienta clínica

Preguntas antes de adoptar:

```
□ ¿Tiene autorización regulatoria para el uso previsto en mi jurisdicción?
□ ¿En qué población fue validada?
□ ¿Hay rendimiento desglosado por subgrupos?
□ ¿Qué pasa con casos fuera de su distribución de entrenamiento?
□ ¿Es apoyo al criterio o pretende sustituirlo?
□ ¿Cómo se documenta cada decisión asistida?
□ ¿Quién responde ante un error?
□ ¿Cómo se manejan y dónde residen los datos?
□ ¿Con qué frecuencia se revalida el modelo?
□ ¿Qué formación necesita el personal para usarla correctamente?
```

Esa penúltima pregunta se olvida siempre: los modelos se degradan cuando cambia la población o la práctica clínica.

---

### El riesgo del exceso de confianza

Hay un fenómeno documentado en varios contextos: cuando un sistema automatizado tiene buen rendimiento la mayor parte del tiempo, el operador humano deja de verificar. El control existe formalmente y no en la práctica.

En salud, ese fenómeno es especialmente peligroso porque los errores del sistema pueden ser sistemáticos, no aleatorios: falla siempre en el mismo tipo de caso, que es justo el que nadie está revisando.

**Mitigaciones:** rotación de revisores, casos de control, medición del tiempo de revisión, y volumen de casos revisables por persona que permita revisión real.

---

### Preguntas frecuentes

**¿Puede un paciente usar IA para autodiagnóstico?**
Los modelos de propósito general no son herramientas diagnósticas y pueden dar información incorrecta con apariencia de certeza. Como apoyo para formular mejores preguntas al médico puede tener valor; como sustituto de la consulta, no.

**¿Los datos de salud pueden salir del país?**
Depende del marco aplicable y del sector. En México hay que analizar la transferencia bajo la normativa de protección de datos y las reglas sanitarias aplicables. Consúltalo con especialistas.

**¿Cuál es el uso con mejor retorno hoy?**
La reducción de carga administrativa. Menos riesgo, beneficio inmediato, y devuelve tiempo clínico al paciente.
