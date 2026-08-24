---
n: 11
title: "Ciberseguridad para PyMEs: guía completa"
slug: "ciberseguridad-para-pymes-guia"
description: "Guía completa de ciberseguridad para PyMEs: las 12 medidas que cubren el 90% del riesgo real, ordenadas por impacto y costo."
category: "Ciberseguridad"
keyword: "ciberseguridad para pymes"
tipo: "pillar"
tags: ["ciberseguridad","pymes","seguridad informática","prevención"]
---


**Las PyMEs no son atacadas por ser interesantes: son atacadas por ser fáciles.** La inmensa mayoría de los incidentes que veo en empresas medianas no involucran técnicas sofisticadas. Involucran una contraseña reutilizada, un correo bien redactado y la ausencia total de respaldos verificados.

La buena noticia es que doce medidas cubren la enorme mayoría del riesgo real, y ocho de ellas son gratuitas o casi.

---

### El modelo de amenaza real de una PyME

Olvida las películas. Estos son los cuatro escenarios que de verdad ocurren:

1. **Fraude por correo comprometido.** Alguien accede al correo de un directivo o del área de pagos y desvía una transferencia. Es el que más dinero mueve.
2. **Ransomware.** Cifran tus archivos y piden rescate. Suele entrar por correo o por un acceso remoto expuesto.
3. **Robo de credenciales por reutilización.** Filtraron la contraseña de un servicio cualquiera, y esa misma contraseña abría el correo corporativo.
4. **Empleado saliente con accesos vivos.** No siempre es malicioso, pero el riesgo es idéntico.

Nota lo que no está en la lista: hackers atravesando firewalls. Eso es raro. Lo común es humano y aburrido.

---

### Las 12 medidas, ordenadas por retorno

#### Nivel 1 — Hazlo esta semana (costo casi nulo)

**1. MFA en todo lo que lo soporte.**
Correo, banca, sistemas administrativos, accesos remotos. Es la medida individual que más ataques detiene. Prioriza aplicaciones autenticadoras o llaves físicas sobre SMS.

**2. Gestor de contraseñas para todo el equipo.**
Elimina de un golpe la reutilización y las contraseñas en post-its y hojas de cálculo. Cuesta poco por usuario y resuelve el vector de ataque más común.

**3. Revisión de accesos.**
Lista todos los sistemas y quién entra a cada uno. Vas a encontrar cuentas de gente que ya no trabaja ahí. Ciérralas hoy.

**4. Actualizaciones automáticas activadas.**
Sistemas operativos, navegadores, aplicaciones críticas. La mayoría de los ataques usan fallas conocidas y parcheadas hace meses.

#### Nivel 2 — Este mes (costo bajo)

**5. Respaldos con la regla 3-2-1.**
Tres copias, en dos medios distintos, una fuera de sitio. Y al menos una **inmutable**: que no se pueda borrar ni cifrar aunque el atacante tenga credenciales de administrador.

**6. Prueba de restauración.**
Un respaldo que nunca has restaurado no es un respaldo, es una esperanza. Restaura algo real cada trimestre y cronometra cuánto tardas.

**7. Separación de la cuenta de administrador.**
Nadie navega ni lee correo con una cuenta administrativa. Cuentas separadas: una para trabajo diario, otra para tareas administrativas.

**8. Protocolo de verificación de pagos.**
Toda instrucción de transferencia o cambio de datos bancarios se confirma por un canal distinto al que llegó, con una persona conocida, por voz. Esta sola regla frena el fraude de correo comprometido.

#### Nivel 3 — Este trimestre (costo medio)

**9. Cierre de servicios expuestos a internet.**
Escritorio remoto, bases de datos y paneles de administración no deben ser accesibles desde cualquier IP del mundo. Acceso por VPN o lista blanca.

**10. Protección de endpoints con detección.**
Un antivirus tradicional ya no basta. Necesitas una solución que detecte comportamiento anómalo, no solo firmas conocidas.

**11. Capacitación con simulacros.**
Una plática anual no sirve. Envía simulacros de correo malicioso cada trimestre, mide quién hace clic, y capacita sin castigar. El objetivo es que reporten, no que se escondan.

**12. Plan de respuesta a incidentes escrito.**
Quién decide, a quién se llama, qué se desconecta primero, cómo se comunica. Una hoja, impresa, accesible sin acceso a la red. Nadie improvisa bien a las 2 de la mañana.

---

### Lo que no necesitas todavía

Para una empresa de menos de 200 personas, estas cosas suelen ser gasto prematuro:

- Centro de operaciones de seguridad propio
- Herramientas de correlación de eventos de gama alta
- Certificaciones internacionales, salvo que un cliente te las exija por contrato
- Pruebas de intrusión anuales, antes de tener las 12 medidas anteriores cubiertas

Contratar una prueba de intrusión sin haber activado MFA es como poner una alarma en una casa con la puerta abierta.

---

### Presupuesto orientativo (empresa de 40 personas)

| Concepto | Costo anual aproximado (MXN) |
|---|---|
| Gestor de contraseñas | 20,000 – 35,000 |
| MFA | Incluido en la mayoría de las suites |
| Protección de endpoints | 45,000 – 90,000 |
| Respaldo en la nube con inmutabilidad | 25,000 – 70,000 |
| Capacitación y simulacros | 20,000 – 50,000 |
| Consultoría de diagnóstico inicial | 40,000 – 100,000 |
| **Total** | **150,000 – 345,000** |

Compáralo con el costo de un solo incidente de ransomware, que en una empresa mediana rara vez baja de los cientos de miles considerando días de operación detenida.

---

### Qué hacer si ya te pasó algo

1. **Aísla, no apagues.** Desconecta de la red los equipos afectados, pero no los apagues: se pierde evidencia en memoria.
2. **Cambia credenciales** desde un equipo limpio, empezando por correo y banca.
3. **Documenta todo** con hora y detalle desde el minuto uno.
4. **Llama a alguien con experiencia** antes de tomar decisiones irreversibles.
5. **Evalúa obligaciones de notificación.** Si hubo datos personales comprometidos, hay deberes legales que atender.
6. **No pagues antes de agotar tus respaldos.** Y si consideras pagar, entiende que no hay garantía de recuperación y que puede haber implicaciones legales.

---

### Preguntas frecuentes

**¿Necesito contratar a alguien de seguridad de tiempo completo?**
Por debajo de 150 empleados, casi nunca. Un responsable interno con apoyo de consultoría externa periódica funciona mejor y cuesta menos.

**¿El seguro cibernético vale la pena?**
Puede ayudar, pero léelo con cuidado: la mayoría de las pólizas exigen controles mínimos —MFA, respaldos— y no pagan si no los tenías activos.

**¿Por dónde empiezo si solo puedo hacer una cosa?**
MFA en el correo corporativo. Es la medida con mejor relación entre esfuerzo y riesgo eliminado.
