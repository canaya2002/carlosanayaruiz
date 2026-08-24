---
n: 75
title: "LFPDPPP: guía de la ley de datos personales en México"
slug: "lfpdppp-ley-datos-personales-mexico"
description: "Guía práctica de la ley mexicana de datos personales para empresas y desarrolladores: qué obliga, qué documentar y qué riesgos hay."
category: "Cumplimiento"
keyword: "lfpdppp"
tipo: "pillar"
tags: ["lfpdppp","datos personales","méxico","cumplimiento"]
---


**Si tu empresa privada trata datos personales de personas en México, la Ley Federal de Protección de Datos Personales en Posesión de los Particulares te aplica.** No importa si eres una empresa de tres personas o si tus servidores están en otro país.

Este artículo es una guía práctica de lo que exige, escrita desde el lado de quien construye sistemas. **No es asesoría legal**: para decisiones concretas, especialmente en sectores regulados o ante un incidente, consulta con un abogado especializado.

**Nota importante sobre el marco vigente:** el régimen mexicano de protección de datos ha sido objeto de reformas y de cambios en el diseño institucional de la autoridad garante. Verifica cuál es la normativa y la autoridad vigentes al momento de aplicar esto, porque los procedimientos y plazos concretos pueden haber cambiado.

---

### Los conceptos que hay que tener claros

**Dato personal.** Cualquier información concerniente a una persona física identificada o identificable. Nombre, correo, teléfono, dirección, IP en muchos contextos, identificadores de dispositivo, historial de compras asociado a una persona.

**Datos sensibles.** Los que pueden dar origen a discriminación o conllevan riesgo grave: origen racial o étnico, estado de salud, información genética, creencias religiosas o filosóficas, afiliación sindical, opiniones políticas, preferencia sexual. **Requieren consentimiento expreso y por escrito**, y un nivel de protección más alto.

**Titular.** La persona a quien pertenecen los datos.

**Responsable.** Quien decide sobre el tratamiento. Normalmente tu empresa.

**Encargado.** Quien trata datos por cuenta del responsable. Tus proveedores: la nube, el CRM, la herramienta de correo, el proveedor de IA.

---

### Los principios que rigen todo

El tratamiento debe cumplir con estos principios. Traducidos a decisiones de producto:

**Licitud.** Tratas datos conforme a la ley.

**Consentimiento.** Necesitas el consentimiento del titular, con las excepciones que la ley prevé. Para datos sensibles, expreso y por escrito.

**Información.** El titular debe conocer, a través del aviso de privacidad, qué datos tratas y para qué. Este es el deber más visible y el que más se incumple.

**Calidad.** Los datos deben ser exactos y actualizados, y suprimirse cuando dejen de ser necesarios para las finalidades.

**Finalidad.** Solo para las finalidades declaradas en el aviso. **Si quieres usar los datos para algo nuevo, necesitas actualizar el aviso y, según el caso, obtener nuevo consentimiento.**

**Lealtad.** Sin engaño. No obtener datos por medios fraudulentos o de forma que el titular no espera razonablemente.

**Proporcionalidad.** Solo los datos necesarios para la finalidad. Pedir la CURP para suscribir a un boletín no es proporcional.

**Responsabilidad.** Debes poder demostrar que cumples, incluso cuando los datos están con un tercero.

---

### Traducción a decisiones técnicas

Esto es lo que significa en la práctica cuando construyes:

**Minimización de datos.** Cada campo de tu formulario debe tener una finalidad declarada. Si no puedes explicar para qué necesitas el dato, no lo pidas.

**Retención definida.** Cada tipo de dato necesita un periodo de conservación y un mecanismo de supresión. "Lo guardamos todo por si acaso" incumple el principio de calidad.

**Registro de consentimiento.** Necesitas poder demostrar cuándo y cómo obtuviste el consentimiento. Guarda: momento, versión del aviso aceptada, mecanismo, e identificador del titular.

**Control de acceso.** Solo quien necesita ver un dato debe poder verlo. Aplica también a tu equipo interno y a tus registros de sistema.

**Cifrado.** En tránsito siempre, en reposo para datos sensibles.

**Registro de tratamiento.** Un inventario de qué datos tratas, para qué, dónde viven, quién accede y cuánto tiempo se conservan. Es la base de todo lo demás.

**Contratos con encargados.** Cada proveedor que trata datos por ti necesita estar vinculado contractualmente con las obligaciones correspondientes. Esto incluye a tu proveedor de nube, tu CRM y tu proveedor de IA.

---

### Transferencias internacionales

Este es el punto que más preocupa a quien aloja fuera de México.

**La ley no prohíbe alojar datos en el extranjero.** Lo que exige es que:
- La transferencia esté informada en el aviso de privacidad
- Exista la base de licitud correspondiente
- El receptor asuma las mismas obligaciones que el responsable

En la práctica, esto se resuelve declarando las transferencias en el aviso y teniendo los contratos adecuados con tus proveedores.

**Sectores regulados** pueden tener requisitos adicionales sobre residencia de datos. Verifícalo si operas en finanzas, salud o contratación pública.

---

### Vulneraciones de seguridad

Si ocurre una vulneración que afecte de forma significativa los derechos patrimoniales o morales de los titulares, **tienes deber de notificarles sin dilación** para que puedan tomar medidas.

**Qué necesitas tener preparado antes:**
- Un proceso documentado de detección y evaluación
- Criterios para determinar si la vulneración es significativa
- Plantillas de notificación
- Registro de todo lo actuado

Improvisar esto durante un incidente es como sale mal.

---

### Consecuencias del incumplimiento

El régimen sancionador contempla multas que pueden ser considerables, con agravantes cuando se trata de datos sensibles. Los montos concretos y los procedimientos dependen del marco vigente, así que verifícalos.

**Y más allá de la multa:** el daño reputacional de un incidente mal manejado suele costar más que la sanción.

---

### Lista de verificación práctica

```
□ Aviso de privacidad publicado, completo y accesible
□ Aviso simplificado en cada punto de captación de datos
□ Registro de consentimiento con fecha y versión
□ Inventario de datos personales tratados
□ Finalidades declaradas para cada tipo de dato
□ Periodos de retención definidos y aplicados
□ Mecanismo funcional para atender solicitudes de derechos
□ Contratos con todos los encargados (nube, CRM, IA, correo)
□ Transferencias internacionales declaradas
□ Control de acceso por rol
□ Cifrado en tránsito y en reposo para datos sensibles
□ Proceso escrito de respuesta a vulneraciones
□ Responsable de protección de datos designado
□ Capacitación al equipo que maneja datos
```

---

### Los errores más comunes en empresas mexicanas

**1. Aviso de privacidad copiado.** Con las finalidades de otra empresa. No sirve y además es evidencia de que no se hizo el análisis.

**2. Recopilar "por si acaso".** Cada dato que guardas sin finalidad declarada es un incumplimiento y un riesgo.

**3. Sin proceso para atender derechos.** Cuando llega la primera solicitud, nadie sabe qué hacer y se vencen los plazos.

**4. Proveedores sin contrato adecuado.** Especialmente los de IA. Enviar datos de clientes a un servicio sin verificar sus condiciones de tratamiento es un riesgo directo.

**5. Registros de sistema con datos personales.** Los logs suelen tener acceso más amplio que la base de datos y raramente se consideran en el análisis de cumplimiento.

**6. Sin registro de consentimiento.** Tener el consentimiento pero no poder demostrarlo equivale a no tenerlo.

---

### Preguntas frecuentes

**¿Aplica si mi empresa es muy pequeña?**
Sí. La ley no distingue por tamaño, aunque las medidas de seguridad deben ser proporcionales al riesgo y a los recursos.

**¿Y si mis clientes son empresas y no personas?**
Los datos de contacto de las personas que trabajan en esas empresas son datos personales. Aplica.

**¿Necesito un oficial de protección de datos?**
Debes designar a una persona o departamento responsable de atender las solicitudes de derechos y fomentar la protección de datos. No requiere ser un puesto de tiempo completo en organizaciones pequeñas.
