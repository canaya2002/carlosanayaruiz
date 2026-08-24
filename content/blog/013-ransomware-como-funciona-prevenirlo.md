---
n: 13
title: "Ransomware: cómo funciona y cómo prevenirlo"
slug: "ransomware-como-funciona-prevenirlo"
description: "Cómo funciona un ataque de ransomware paso a paso, por qué pagar casi nunca funciona y las 7 defensas que sí detienen la cadena."
category: "Ciberseguridad"
keyword: "ransomware qué es"
tipo: "satelite"
tags: ["ransomware","prevención","respaldos","continuidad"]
---


**El ransomware es software malicioso que cifra tus archivos y exige un pago para devolverlos.** Hoy además roban los datos antes de cifrarlos, así que aunque restaures tus respaldos, siguen teniendo con qué presionarte. A eso se le llama doble extorsión, y cambió por completo el cálculo de riesgo.

Lo importante es esto: el cifrado es el **último** paso. Antes hay días o semanas de actividad dentro de tu red. Ahí es donde se puede detener.

---

### La cadena de ataque, paso por paso

**Día 0 — Acceso inicial.** Entra por una de tres puertas: un correo con adjunto o enlace malicioso, un servicio de acceso remoto expuesto a internet con contraseña débil, o credenciales robadas compradas en el mercado negro.

**Días 1 a 3 — Persistencia.** Se asegura de sobrevivir a un reinicio. Crea cuentas, tareas programadas, servicios.

**Días 2 a 10 — Reconocimiento y escalamiento.** Explora tu red. Busca credenciales guardadas, unidades compartidas, servidores de archivos y —muy importante— **tus respaldos**. Intenta obtener privilegios de administrador de dominio.

**Días 5 a 20 — Robo de datos.** Copia información sensible hacia fuera. Contratos, nóminas, datos de clientes, propiedad intelectual.

**Día X — Destrucción de respaldos.** Borra o cifra las copias de seguridad accesibles desde la red. Este paso ocurre **antes** del cifrado, precisamente para que no tengas salida.

**Día X — Cifrado.** Casi siempre de madrugada, en fin de semana o en un puente. Cuando llegas el lunes, ya está todo hecho.

**Día X+1 — Extorsión.** Nota de rescate, cronómetro, amenaza de publicación.

**La ventana de detección es de días o semanas.** La mayoría de las empresas no detectan nada hasta la última fase porque no están mirando.

---

### Por qué pagar casi nunca es la salida

- **No garantiza recuperación.** La herramienta de descifrado que entregan suele ser lenta, incompleta y a veces sencillamente no funciona con todos los archivos.
- **No borra los datos robados.** Su promesa de eliminación no es verificable de ninguna manera.
- **Te marca como pagador.** Una proporción significativa de las víctimas que pagan vuelve a ser atacada.
- **Puede tener implicaciones legales.** Dependiendo de a quién se pague, hay marcos regulatorios que lo complican seriamente.
- **No elimina el problema.** Sigues teniendo comprometida la red por la que entraron.

Pagar es una decisión de negocio en una situación desesperada, no una solución técnica. Y la desesperación se evita con preparación previa.

---

### Las 7 defensas que sí cortan la cadena

**1. MFA en todos los accesos remotos.**
Corta el acceso inicial por credenciales robadas, que es la vía más común hoy. Sin excepciones para directivos ni para proveedores externos.

**2. Nada de escritorio remoto expuesto a internet.**
Si necesitas acceso remoto, que sea a través de VPN con MFA o de un servicio gestionado con acceso condicional. Un puerto de escritorio remoto abierto al mundo es una invitación con la dirección puesta.

**3. Respaldos inmutables y fuera de línea.**
Esta es la defensa decisiva. Necesitas al menos una copia que **no se pueda borrar ni sobrescribir** aunque el atacante tenga credenciales de administrador. Almacenamiento con bloqueo de objetos, o cintas fuera de sitio.

**4. Principio de mínimo privilegio.**
Los usuarios no son administradores locales. Las cuentas de servicio tienen solo lo que necesitan. Las cuentas de administrador de dominio no se usan para el trabajo diario. Esto corta la fase de escalamiento.

**5. Segmentación de red.**
Que un equipo comprometido en administración no tenga camino directo al servidor de producción. La segmentación convierte un desastre total en un incidente contenido.

**6. Detección de comportamiento en endpoints.**
Un antivirus por firmas no ve una herramienta legítima siendo usada con malicia. Necesitas detección que note el comportamiento anómalo: cifrado masivo de archivos, borrado de instantáneas, movimiento lateral.

**7. Parcheo con calendario.**
Sistemas operativos, servidores, dispositivos de red y, especialmente, cualquier cosa expuesta a internet. La mayoría de las intrusiones usan fallas conocidas y ya corregidas.

---

### La prueba que casi nadie hace y que decide todo

Restaurar un servidor completo desde respaldo, cronometrado, con la red del entorno de producción simulada.

Vas a descubrir cosas incómodas:
- Que el respaldo tarda 30 horas y tu tolerancia era de 4.
- Que falta la clave de cifrado del respaldo.
- Que nadie sabe el orden correcto de levantar los sistemas.
- Que el respaldo de la base de datos estaba corrupto desde hace tres meses.

Mejor descubrirlo un martes de prueba que un lunes de crisis. Hazlo cada seis meses como mínimo.

---

### Las primeras dos horas de un incidente

1. **Aísla, no apagues.** Desconecta de la red los equipos afectados. Apagarlos destruye evidencia en memoria que puede ser clave.
2. **Corta el acceso remoto** de toda la organización mientras evalúas.
3. **Aísla los respaldos** para que no alcancen a llegar a ellos.
4. **Activa el plan escrito.** Quién decide, quién comunica, a quién se llama.
5. **Documenta con hora exacta** desde el primer minuto.
6. **No negocies solo.** Si se llega a ese punto, hay especialistas que lo hacen a diario.
7. **Evalúa obligaciones legales de notificación.** Si hay datos personales comprometidos, hay deberes que cumplir y plazos que correr.

---

### Preguntas frecuentes

**¿El respaldo en la nube me protege?**
Solo si es inmutable. Una carpeta sincronizada automáticamente replica los archivos cifrados y destruye tu copia buena. Sincronización no es respaldo.

**¿Cuánto tarda una recuperación real?**
En empresas medianas sin preparación, de una a tres semanas hasta la operación normal. Con respaldos probados y plan escrito, de uno a tres días.

**¿Me pueden atacar si soy chico?**
Buena parte de los ataques son oportunistas: escanean internet buscando puertos abiertos y credenciales débiles, sin saber ni a quién están atacando. El tamaño no te protege.
