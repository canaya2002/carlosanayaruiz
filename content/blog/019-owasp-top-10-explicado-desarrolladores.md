---
n: 19
title: "OWASP Top 10 explicado para desarrolladores"
slug: "owasp-top-10-explicado-desarrolladores"
description: "El OWASP Top 10 explicado con causa raíz, remediación concreta y el control que detecta cada falla en tu pipeline de CI."
category: "Ciberseguridad"
keyword: "owasp top 10"
tipo: "satelite"
tags: ["owasp","desarrollo seguro","vulnerabilidades","devsecops"]
---


**El OWASP Top 10 es la lista de referencia de las categorías de riesgo más críticas en aplicaciones web.** No es un checklist de cumplimiento: es un mapa de dónde se rompen las aplicaciones en el mundo real.

Lo explico desde el lado de la remediación: qué causa cada categoría, cómo se corrige y qué control automatizado lo detecta antes de que llegue a producción.

---

### 1. Control de acceso roto

**Qué es:** un usuario accede a datos o funciones que no le corresponden. Cambiar un identificador en la URL y ver el registro de otro cliente es el caso clásico.

**Causa raíz:** la autorización se verifica en el frontend, o se verifica en algunos endpoints y en otros se olvidó.

**Remediación:**
- Denegar por defecto. El acceso se concede explícitamente, nunca se asume.
- La autorización se resuelve en el servidor, en una capa central, no endpoint por endpoint.
- Si usas base de datos con políticas a nivel de fila, aplícalas: mueve la decisión al motor de datos y deja de depender de que cada consulta filtre bien.
- Nunca confíes en identificadores enviados por el cliente para determinar propiedad.

**Control automatizado:** pruebas de integración que ejecutan cada endpoint con un usuario sin permisos y esperan un rechazo. Es la prueba de seguridad con mejor retorno que puedes escribir.

---

### 2. Fallas criptográficas

**Qué es:** datos sensibles expuestos por ausencia de cifrado o por cifrado mal implementado.

**Remediación:**
- Cifrado en tránsito obligatorio, sin excepciones internas.
- Cifrado en reposo para datos sensibles.
- Contraseñas con algoritmos de derivación de clave diseñados para ello. Nunca con funciones hash rápidas de propósito general.
- No inventes criptografía. Usa las bibliotecas estándar de tu plataforma.
- Datos que no necesitas, no los guardes. Es la mejor protección posible.

**Control automatizado:** análisis estático que detecte algoritmos obsoletos y verificación de configuración de cifrado en el pipeline.

---

### 3. Inyección

**Qué es:** entrada del usuario interpretada como código o instrucción. Incluye inyección SQL, de comandos, y ahora también inyección de prompts en sistemas con IA.

**Remediación:**
- Consultas parametrizadas siempre. Sin concatenar cadenas para construir consultas, jamás, ni en el código "temporal".
- Validación de entrada con lista blanca de valores permitidos.
- Para comandos del sistema: evitarlos; si son necesarios, con argumentos separados y sin intérprete de shell.
- Para sistemas con IA: trata el contenido recuperado y el de los usuarios como no confiable. Nunca le des a un modelo capacidad de ejecutar acciones sensibles basándose solo en texto de entrada.

**Control automatizado:** análisis estático en cada commit y reglas de linter que prohíban la construcción dinámica de consultas.

---

### 4. Diseño inseguro

**Qué es:** la falla está en el diseño, no en la implementación. Un flujo de recuperación de contraseña que permite enumerar usuarios está bien programado y mal diseñado.

**Remediación:**
- Modelado de amenazas al inicio de cada funcionalidad nueva: qué puede salir mal, quién querría abusar de esto, qué pasa si el usuario miente.
- Límites de tasa por diseño en operaciones sensibles.
- Segregación de funciones en operaciones críticas.

**Control:** este no se automatiza. Es una sesión de 45 minutos por funcionalidad, con el equipo, antes de escribir código.

---

### 5. Configuración de seguridad incorrecta

**Qué es:** valores por defecto sin cambiar, mensajes de error con detalles internos, servicios innecesarios activos, permisos de almacenamiento abiertos.

**Remediación:**
- Entornos idénticos por configuración como código, no por ajustes manuales.
- Mensajes de error genéricos hacia el cliente, detalle solo en los registros internos.
- Cabeceras de seguridad configuradas.
- Revisión periódica de permisos en almacenamiento y reglas de red.

**Control automatizado:** escaneo de configuración de infraestructura en el pipeline, y verificación de cabeceras en las pruebas de extremo a extremo.

---

### 6. Componentes vulnerables y desactualizados

**Qué es:** una dependencia con una vulnerabilidad conocida y publicada. Es de las causas más frecuentes de compromiso y de las más fáciles de evitar.

**Remediación:**
- Auditoría de dependencias automatizada en cada compilación.
- Actualizaciones de seguridad con proceso definido, no cuando alguien se acuerda.
- Inventario de dependencias que permita responder rápido: "¿usamos esta biblioteca?" es una pregunta que debe contestarse en minutos, no en días.
- Reducir el número de dependencias. Cada una es superficie de ataque.

**Control automatizado:** auditoría de vulnerabilidades que falla la compilación ante severidad alta.

---

### 7. Fallas de identificación y autenticación

**Qué es:** sesiones mal manejadas, ausencia de límite de intentos, contraseñas débiles permitidas, recuperación de cuenta insegura.

**Remediación:**
- MFA disponible y obligatorio para cuentas con privilegios.
- Límite de intentos con retardo progresivo.
- Verificación contra listas de contraseñas comprometidas.
- Sesiones en cookies con las banderas de seguridad correctas, expiración razonable y regeneración del identificador al iniciar sesión.
- Cerrar todas las sesiones al cambiar la contraseña.

**Control automatizado:** pruebas de integración sobre el ciclo completo de sesión.

---

### 8. Fallas de integridad de software y datos

**Qué es:** confiar en código o datos sin verificar su origen. Actualizaciones sin firmar, dependencias desde fuentes no confiables, deserialización insegura.

**Remediación:**
- Archivos de bloqueo de dependencias con versiones fijas y verificación de integridad.
- Pipeline de compilación con permisos mínimos y secretos gestionados.
- No deserializar datos de fuentes no confiables. Si no hay alternativa, con validación estricta de tipos.

**Control automatizado:** verificación de integridad en la instalación de dependencias y revisión obligatoria de cambios en el pipeline.

---

### 9. Fallas de registro y monitoreo

**Qué es:** el ataque ocurre y nadie se entera. Es la falla que convierte un incidente contenible en un desastre.

**Remediación:**
- Registrar autenticaciones fallidas y exitosas, cambios de permisos, accesos a datos sensibles y operaciones administrativas.
- Registros centralizados, con reloj sincronizado y protegidos contra modificación.
- Alertas sobre patrones, no sobre eventos aislados.
- **Nunca registrar contraseñas, tokens ni datos personales sensibles.** El registro se convierte entonces en el problema.

**Control:** una prueba periódica que genere un evento sospechoso y verifique que la alerta llegó a alguien.

---

### 10. Falsificación de solicitudes del lado del servidor

**Qué es:** la aplicación hace una petición a una URL que controla el usuario, y se usa para alcanzar recursos internos.

**Remediación:**
- Lista blanca de destinos permitidos. Nunca lista negra.
- Bloquear rangos de red internos y direcciones de servicios de metadatos de la nube.
- No seguir redirecciones automáticamente en peticiones originadas por entrada de usuario.
- Aislar en red el componente que hace peticiones externas.

**Control automatizado:** revisión de todo punto donde una URL de entrada del usuario alimenta una petición del servidor.

---

### El pipeline mínimo de seguridad

Si solo puedes automatizar cuatro cosas:

1. **Auditoría de dependencias** que falle ante vulnerabilidades altas.
2. **Análisis estático** con reglas de seguridad activadas.
3. **Detección de secretos** en el historial de commits.
4. **Pruebas de autorización** por endpoint con usuario sin permisos.

Esas cuatro atrapan la mayoría de lo que llega a producción.

---

### Preguntas frecuentes

**¿Cada cuánto se actualiza el Top 10?**
Cada pocos años. Las categorías se reordenan y a veces se fusionan, pero los fundamentos se mantienen estables.

**¿Necesito una prueba de intrusión?**
Cuando ya tengas los controles automatizados funcionando. Antes de eso, encontrará lo mismo que encontraría el pipeline, a mucho mayor costo.

**¿Aplica a APIs?**
Sí, y hay una lista específica para APIs que conviene revisar en paralelo si tu producto es principalmente una API.
