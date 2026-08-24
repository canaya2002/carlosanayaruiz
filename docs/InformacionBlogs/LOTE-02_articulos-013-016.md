# LOTE 02 — ARTÍCULOS COMPLETOS 013–016
**Autor:** Carlos Anaya Ruiz · Listos para publicar

---
---

# ARTÍCULO 013

```yaml
title: "Ransomware: cómo funciona y cómo prevenirlo"
slug: "ransomware-como-funciona-prevenirlo"
description: "Cómo funciona un ataque de ransomware paso a paso, por qué pagar casi nunca funciona y las 7 defensas que sí detienen la cadena."
author: "Carlos Anaya Ruiz"
category: "Ciberseguridad"
tags: ["ransomware", "prevención", "respaldos", "continuidad"]
keyword_principal: "ransomware qué es"
```

## Ransomware: cómo funciona y cómo prevenirlo

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

---

**Escrito por Carlos Anaya Ruiz** — Consultor tecnológico. Trabajo en infraestructura, respaldos y continuidad para empresas multi-sucursal.

---

### PROMPT DE PORTADA — Artículo 013

> Una retícula ordenada de archivos representados como cubos de cristal que se van sellando progresivamente con capas de cristal rojo opaco, de izquierda a derecha, hasta quedar completamente cerrados. Un candado geométrico rojo de gran tamaño domina el lado derecho del encuadre. Iluminación de alerta roja tenue sobre fondo negro carbón, atmósfera densa, reflejo en suelo oscuro.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.

---
---

# ARTÍCULO 014

```yaml
title: "Autenticación multifactor (MFA): guía de implementación"
slug: "autenticacion-multifactor-mfa-guia"
description: "Guía de implementación de MFA en empresa: qué factores usar, por qué el SMS ya no basta y cómo desplegarlo sin que el equipo se rebele."
author: "Carlos Anaya Ruiz"
category: "Ciberseguridad"
tags: ["mfa", "autenticación", "control de acceso", "seguridad"]
keyword_principal: "autenticación multifactor"
```

## Autenticación multifactor (MFA): guía de implementación

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

---

**Escrito por Carlos Anaya Ruiz** — Consultor tecnológico. He desplegado MFA en organizaciones distribuidas de varios cientos de usuarios.

---

### PROMPT DE PORTADA — Artículo 014

> Tres llaves geométricas abstractas de formas distintas —una placa rectangular, una onda, una espiral estilizada— alineándose en el aire para atravesar simultáneamente tres cerraduras concéntricas hechas de luz cian. Estilo isométrico de alta precisión mecánica, materiales de metal oscuro pulido y vidrio. Fondo negro con reflejos suaves y bruma azul fría.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.

---
---

# ARTÍCULO 015

```yaml
title: "Política de contraseñas que la gente sí cumple"
slug: "politica-de-contrasenas-empresa"
description: "Cómo escribir una política de contraseñas basada en NIST que la gente cumpla: sin cambios forzados cada 90 días y con gestor obligatorio."
author: "Carlos Anaya Ruiz"
category: "Ciberseguridad"
tags: ["contraseñas", "políticas", "nist", "gestión de accesos"]
keyword_principal: "política de contraseñas"
```

## Política de contraseñas que la gente sí cumple

**La política de contraseñas de la mayoría de las empresas está basada en recomendaciones que los propios organismos que las emitieron ya retiraron.** Cambio obligatorio cada 90 días, reglas de complejidad de símbolos, prohibición de pegar en el campo: todo eso empeora la seguridad en la práctica, porque empuja a la gente a patrones predecibles.

Esta es una política moderna, alineada con las guías vigentes, que reduce el riesgo real y genera menos resistencia.

---

### Qué cambió y por qué

Las guías actuales de referencia internacional se movieron en esta dirección:

| Práctica antigua | Práctica actual | Por qué |
|---|---|---|
| Cambio obligatorio cada 90 días | Cambio solo ante indicio de compromiso | El cambio forzado produce `Empresa2026!` → `Empresa2027!` |
| Exigir mayúscula, número y símbolo | Exigir longitud, no composición | La complejidad forzada genera patrones predecibles |
| Mínimo 8 caracteres | Mínimo 12–14, idealmente frases | La longitud aporta mucha más resistencia que los símbolos |
| Preguntas de seguridad | Eliminarlas | Las respuestas suelen ser públicas o adivinables |
| Prohibir pegar la contraseña | Permitirlo | Prohibirlo bloquea el uso de gestores, que es lo que quieres fomentar |
| Sin lista de bloqueo | Bloquear contraseñas filtradas conocidas | Es la medida con mayor impacto real |

---

### La política, lista para adaptar

**1. Longitud mínima: 14 caracteres.**
Sin exigencias de composición. Una frase de cuatro palabras al azar es más fuerte y más memorable que `P@ssw0rd!23`.

**2. Verificación contra listas de contraseñas comprometidas.**
En el momento de crearla, se compara contra bases de credenciales filtradas. Si aparece, se rechaza. Esta única medida elimina la mayoría de los ataques automatizados.

**3. Gestor de contraseñas obligatorio y provisto por la empresa.**
No es opcional ni "recomendado". Se entrega licencia, se capacita y se exige. Es el cambio que hace viable todo lo demás.

**4. Contraseña única por servicio.**
La reutilización es el vector de ataque número uno. Con gestor, esta regla deja de ser una carga.

**5. Sin cambio periódico obligatorio.**
Se cambia cuando hay indicio de compromiso, cuando aparece en una filtración, o cuando fue compartida.

**6. MFA obligatorio donde el servicio lo permita.**
La contraseña deja de ser el único obstáculo. Esta regla vale más que todas las anteriores juntas.

**7. Prohibido compartir credenciales.**
Si dos personas necesitan el mismo acceso, se crean dos cuentas o se usa la función de compartir del gestor, que mantiene trazabilidad.

**8. Cuentas administrativas separadas.**
Nadie lee correo ni navega con una cuenta de administrador. Cuentas distintas, contraseñas distintas, MFA reforzado con llave física.

**9. Baja de accesos el mismo día.**
Cuando alguien sale de la empresa, sus accesos se revocan ese día. Incluye sistemas de terceros, no solo los internos.

**10. Revisión trimestral de accesos.**
Cada responsable de área confirma quién debe seguir teniendo acceso a qué. Se documenta.

---

### Cómo implementarla sin que se rebele el equipo

**No anuncies la política. Entrega primero la herramienta.**

Secuencia que funciona:

**Semana 1.** Se reparte el gestor de contraseñas con licencia pagada, incluida la versión para uso personal y familiar si la licencia lo permite. Sesión de 30 minutos mostrando cómo importa contraseñas del navegador y cómo autocompleta. La gente adopta un gestor cuando descubre que le ahorra tiempo, no cuando se lo imponen.

**Semana 2.** Migración asistida. Cada persona mueve sus credenciales al gestor con alguien disponible para ayudar.

**Semana 3.** Se publica la política. Ya no pide un esfuerzo: describe lo que la gente ya está haciendo.

**Semana 4.** Se activan los controles técnicos: longitud mínima, lista de bloqueo, MFA.

Al revés —publicar la política primero y pedir que se cumpla— genera resistencia y hojas de cálculo con contraseñas escondidas.

---

### Lo que debe medir el área de sistemas

- **Cobertura de MFA:** porcentaje de cuentas con segundo factor activo. Objetivo: 100% en críticas.
- **Adopción del gestor:** usuarios activos semanales sobre licencias asignadas.
- **Credenciales en listas filtradas:** cuántas cuentas corporativas aparecen en filtraciones conocidas.
- **Cuentas huérfanas:** cuentas activas sin usuario vigente. Objetivo: cero.
- **Tiempo de revocación de accesos** tras una baja. Objetivo: mismo día.

---

### Preguntas frecuentes

**¿De verdad ya no hay que forzar el cambio cada 90 días?**
Correcto, salvo que una norma sectorial o un cliente te lo exija por contrato. El cambio forzado degrada la calidad de las contraseñas de forma medible.

**¿Es seguro poner todo en un gestor?**
El riesgo concentrado existe, pero es muy inferior al de reutilizar contraseñas en 40 servicios. Protege la contraseña maestra con MFA y una frase larga.

**¿Y las contraseñas compartidas de redes sociales o servicios sin cuentas múltiples?**
Usa la función de compartición del gestor, que permite revocar sin cambiar la contraseña, y registra quién accedió.

---

**Escrito por Carlos Anaya Ruiz** — Consultor tecnológico. Diseño políticas de acceso que la gente puede cumplir sin sabotearlas.

---

### PROMPT DE PORTADA — Artículo 015

> Una bóveda de acero oscuro entreabierta, de cuyo interior escapan cadenas de caracteres abstractos convertidos en partículas de luz cian que se disuelven en el aire al alejarse. Sin caracteres legibles en ningún punto. Composición desplazada al centro-derecha, luz dura lateral que recorta el metal, fondo negro carbón con niebla baja.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.

---
---

# ARTÍCULO 016

```yaml
title: "Ingeniería social: las 10 técnicas más usadas contra empresas"
slug: "ingenieria-social-tecnicas-ciberseguridad"
description: "Las 10 técnicas de ingeniería social más usadas contra empresas, cómo se ven en la práctica y el control que corta cada una."
author: "Carlos Anaya Ruiz"
category: "Ciberseguridad"
tags: ["ingeniería social", "fraude", "capacitación", "seguridad"]
keyword_principal: "ingeniería social ciberseguridad"
```

## Ingeniería social: las 10 técnicas más usadas contra empresas

**La ingeniería social es la manipulación de personas para obtener acceso, información o dinero.** No ataca sistemas: ataca la forma en que trabajamos, confiamos y obedecemos.

Es el vector más rentable que existe porque no requiere vulnerabilidades técnicas. Requiere entender a la organización, y eso hoy se investiga en redes profesionales en una tarde.

Conocer las técnicas importa, pero lo que realmente protege son los controles de proceso al final de este artículo. La atención humana falla; los procesos no.

---

### Los cinco resortes psicológicos que explotan

Todas las técnicas se apoyan en alguno de estos:

**Autoridad.** Obedecemos a quien parece tener rango. "Soy del área de sistemas", "me pidió el director".
**Urgencia.** La prisa apaga la verificación. Es el resorte más usado.
**Escasez.** "Solo hoy", "queda un lugar".
**Reciprocidad.** Si alguien te hizo un favor, cuesta negarle uno.
**Prueba social.** "Todos en tu equipo ya lo hicieron".

Cuando notes dos o más de estos en una misma solicitud, detente. Esa combinación es una señal más confiable que cualquier detalle técnico.

---

### Las 10 técnicas

**1. Suplantación de directivo.**
Un mensaje del director general pidiendo una transferencia urgente y confidencial, normalmente cuando está de viaje. Explota autoridad, urgencia y secreto a la vez.
*Control:* toda instrucción de pago se verifica por voz con un contacto previamente guardado. Sin excepción por rango.

**2. Cambio de datos bancarios de proveedor.**
Un correo del proveedor de siempre notificando nueva cuenta. A veces desde su cuenta real, ya comprometida.
*Control:* los cambios de datos bancarios se validan llamando al teléfono que ya tenías en el expediente, no al del correo. Doble firma para modificar datos de proveedores.

**3. Pretexto de soporte técnico.**
Alguien llama diciendo ser del área de sistemas, o del proveedor de tu software, y pide instalar algo, dar acceso remoto o dictar un código.
*Control:* sistemas nunca pide contraseñas ni códigos. Publícalo como regla. Toda solicitud de soporte se verifica llamando al número interno conocido.

**4. Solicitud del código de verificación.**
"Te va a llegar un código de seis dígitos, dímelo para confirmar tu identidad." Ya tienen tu contraseña y les falta el segundo factor.
*Control:* regla absoluta, repetida hasta el cansancio: **el código de seis dígitos no se comparte con nadie, jamás, por ningún motivo.**

**5. Suplantación de candidato o de reclutador.**
Currículums con archivos maliciosos, u ofertas de trabajo falsas dirigidas a tu personal técnico para obtener información de tu infraestructura.
*Control:* apertura de adjuntos en entorno aislado. Capacitación específica para recursos humanos, que es de los perfiles más expuestos.

**6. Acceso físico con pretexto.**
Persona con uniforme, caja o portapapeles que pide entrar "a revisar el aire acondicionado". A veces solo necesita conectar un dispositivo a un puerto de red o dejar una memoria USB en la recepción.
*Control:* proceso de visitantes con registro y acompañamiento. Puertos de red no usados, deshabilitados. Nadie conecta memorias encontradas.

**7. Seguimiento en el acceso (tailgating).**
Entrar detrás de alguien que abrió con su credencial, cargando cajas o con las manos ocupadas. Explota cortesía.
*Control:* política explícita de no permitir el paso, con respaldo de la dirección para que nadie se sienta grosero al aplicarla.

**8. Suplantación de cliente importante.**
Alguien se hace pasar por un cliente de peso y presiona a atención o ventas para obtener información de otras cuentas, precios o datos de contacto internos.
*Control:* nunca se comparte información de una cuenta sin verificación de identidad establecida. Protocolo de escalamiento ante presión.

**9. Recolección de información previa.**
Antes del ataque, se investiga organigrama, nombres, formatos de correo, proveedores, ausencias anunciadas en redes. No es un ataque en sí: es la preparación de todos los demás.
*Control:* política de qué se publica en redes profesionales. Evitar anunciar públicamente viajes de directivos y detalles de proveedores.

**10. Voz clonada.**
Con pocos segundos de audio público se genera una voz convincente. Ataca directamente el control de "verifica por voz".
*Control:* para operaciones de alto monto, palabra clave acordada previamente entre las partes, o verificación por videollamada con confirmación visual. Si la llamada suena rara, haz una pregunta cuya respuesta solo esa persona pueda saber.

---

### Los cuatro controles que valen más que la capacitación

La capacitación ayuda, pero la atención humana es un recurso que se agota. Estos controles funcionan aunque la persona esté cansada, distraída o presionada:

**1. Verificación fuera de banda obligatoria.** Toda solicitud de dinero, credenciales o accesos se confirma por un canal distinto con un contacto previamente conocido.

**2. Doble autorización para pagos.** Ninguna transferencia por encima de un umbral la ejecuta una sola persona.

**3. Regla del código nunca compartido.** Sin matices ni excepciones.

**4. Canal de reporte inmediato sin castigo.** Un botón, un número, algo que tome cinco segundos. Y garantía explícita de que reportar nunca tiene consecuencias negativas. Si castigas al que cayó, dejan de avisarte y pierdes las horas que más importan.

---

### Cómo medir si estás mejorando

No midas solo la tasa de clic en simulacros. Mide:

- **Tiempo hasta el primer reporte** de un simulacro. De horas a minutos es la mejora que salva.
- **Tasa de reporte**: cuántos reportaron, no cuántos cayeron.
- **Cumplimiento del protocolo de verificación** en solicitudes de pago reales, auditado por muestreo.

---

### Preguntas frecuentes

**¿Sirven los simulacros de phishing?**
Sí, si se usan para enseñar y no para señalar. Trimestrales, con retroalimentación inmediata y sin publicar nombres.

**¿Quién es el objetivo más frecuente?**
Finanzas, recursos humanos, asistentes de dirección y recepción. Tienen acceso o influencia y suelen recibir menos capacitación técnica que el área de sistemas.

**¿La IA cambió el panorama?**
Sí. Mejoró la redacción, permitió personalización a escala y volvió práctica la clonación de voz. Por eso los controles de proceso importan más que la capacidad de detección individual.

---

**Escrito por Carlos Anaya Ruiz** — Consultor tecnológico. Diseño controles de proceso que resisten cuando la atención humana falla.

---

### PROMPT DE PORTADA — Artículo 016

> Una máscara veneciana completamente lisa y sin rasgos faciales, hecha de cromo negro pulido, flotando de perfil en el aire y reflejando en su superficie líneas de luz cian que forman una red de conexiones abstracta. La máscara está hueca por dentro, no hay rostro detrás. Fondo negro absoluto, iluminación contrastada de estudio, espacio negativo amplio a la izquierda.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.
