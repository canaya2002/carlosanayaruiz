---
n: 14
title: "Autenticación multifactor (MFA): guía de implementación"
slug: "autenticacion-multifactor-mfa-guia"
description: "Guía de implementación de MFA en empresa: qué factores usar, por qué el SMS ya no basta y cómo desplegarlo sin que el equipo se rebele."
category: "Ciberseguridad"
keyword: "autenticación multifactor"
tipo: "satelite"
tags: ["mfa","autenticación","control de acceso","seguridad"]
---


**La autenticación multifactor exige dos o más pruebas de identidad de categorías distintas antes de dar acceso.** Es, sin discusión, la medida de seguridad con mejor relación entre esfuerzo y riesgo eliminado que existe para una empresa.

Si solo puedes hacer una cosa este mes, haz esta.

---

### Los tres tipos de factor

| Categoría | Qué es | Ejemplos |
|---|---|---|
| **Algo que sabes** | Conocimiento | Contraseña, PIN |
| **Algo que tienes** | Posesión | Aplicación autenticadora, llave física, tarjeta |
| **Algo que eres** | Inherencia | Huella, rostro |

Multifactor real significa combinar categorías **distintas**. Contraseña más pregunta de seguridad no es MFA: son dos cosas que sabes, y ambas son igual de robables.

---

### Los factores, ordenados de mejor a peor

**1. Llaves de seguridad físicas (el estándar más alto).**
Un dispositivo físico que se conecta por USB o NFC. Su ventaja decisiva: está vinculado criptográficamente al dominio real del sitio, así que **no funciona en una página falsa**. Es el único factor que resiste phishing por diseño, no por atención del usuario.
Costo: entre 500 y 1,200 pesos por llave. Recomiéndalo para directivos, finanzas, sistemas y cualquiera con acceso administrativo.

**2. Claves de acceso sin contraseña (passkeys).**
Misma resistencia criptográfica al phishing, pero guardadas en el dispositivo o en el gestor de contraseñas. Sin costo de hardware. Es hacia donde va todo.

**3. Aplicación autenticadora con notificación y número coincidente.**
Recibes una notificación y debes escribir un número que aparece en la pantalla donde estás iniciando sesión. El número coincidente es clave: evita que apruebes por reflejo una solicitud que no iniciaste.

**4. Aplicación autenticadora con código de 6 dígitos.**
Sólido y gratuito. Vulnerable a que alguien te convenza de dictarle el código, pero muy superior al SMS.

**5. SMS (el mínimo aceptable, no el objetivo).**
Vulnerable al secuestro de línea telefónica y a la interceptación. Sigue siendo mejor que nada, pero no lo elijas si puedes evitarlo. Nunca lo uses para cuentas administrativas o bancarias corporativas.

---

### Dónde activarlo, en orden de prioridad

1. **Correo corporativo.** Es la llave maestra: con acceso al correo se recuperan casi todas las demás cuentas.
2. **Banca en línea y sistemas de pago.**
3. **Accesos administrativos**: consola de nube, servidores, VPN, sistema administrativo.
4. **Gestor de contraseñas.**
5. **Repositorios de código y herramientas de despliegue.**
6. **CRM y sistemas con datos personales de clientes.**
7. **Resto de aplicaciones de negocio.**

---

### Plan de despliegue en 4 semanas

**Semana 1 — Preparación.**
Inventario de sistemas y de quién accede a cada uno. Decide el factor por grupo: llaves físicas para el grupo crítico, aplicación autenticadora para el resto. Define el proceso de recuperación **antes** de empezar. Compra las llaves.

**Semana 2 — Piloto con el equipo técnico.**
Diez o quince personas. Documenta cada fricción que aparezca. Ajusta el instructivo con capturas reales de tus sistemas, no genéricas.

**Semana 3 — Despliegue por olas.**
Departamento por departamento, con sesión de 20 minutos y acompañamiento en vivo el día de la activación. Que alguien esté disponible en el momento en que la gente lo activa: ahí es donde se pierde o se gana la adopción.

**Semana 4 — Obligatoriedad y cierre.**
Se vuelve requisito. Se desactivan los métodos de acceso que lo evaden. Se revisa quién quedó fuera y por qué.

---

### El proceso de recuperación: lo que hay que resolver antes

Alguien va a perder el teléfono. Es seguro. Si no tienes proceso, tendrás a una persona sin poder trabajar y a soporte improvisando —que es exactamente la situación que un atacante busca provocar.

Define por escrito:

- **Códigos de respaldo** generados en el alta, guardados en el gestor de contraseñas o impresos en un sobre cerrado.
- **Un segundo factor registrado** desde el inicio (por ejemplo, llave física más aplicación).
- **Verificación de identidad para reinicios**: por videollamada con una persona conocida, nunca solo por correo o mensaje. El fraude de "perdí mi teléfono, resetéame el MFA" es un clásico.
- **Registro de auditoría** de todo reinicio de factor.

---

### La resistencia interna y cómo manejarla

Las tres objeciones que vas a escuchar, y su respuesta:

**"Me hace perder tiempo."**
Con notificación en aplicación son tres segundos. Además, configura sesiones de confianza en dispositivos gestionados: no se pide en cada inicio, se pide en contextos nuevos.

**"No quiero usar mi teléfono personal."**
Objeción legítima. Ofrece llave física como alternativa. Es la solución limpia y elimina la discusión.

**"A nosotros no nos va a pasar."**
No discutas con estadísticas. Muestra los intentos de acceso fallidos de tu propio sistema del último mes. Ese dato existe y suele ser suficiente.

El argumento que mejor funciona no es de miedo, es de responsabilidad: si tu cuenta se compromete, el daño no es tuyo, es de tus compañeros y de tus clientes.

---

### Preguntas frecuentes

**¿MFA en la nube protege también contra empleados internos?**
Parcialmente. Impide suplantación, pero un empleado con acceso legítimo sigue teniendo acceso legítimo. Para eso necesitas mínimo privilegio y registros de auditoría.

**¿Se puede saltar el MFA?**
Existen técnicas de intermediario que capturan la sesión en tiempo real. Contra eso solo protegen los factores vinculados al dominio: llaves físicas y passkeys. Por eso son la recomendación para cuentas críticas.

**¿Y los proveedores externos que acceden a mis sistemas?**
Mismo estándar, sin excepción. Los accesos de terceros son una vía de entrada frecuente y suelen ser los peor controlados.
