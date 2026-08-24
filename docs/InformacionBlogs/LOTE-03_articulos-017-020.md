# LOTE 03 — ARTÍCULOS COMPLETOS 017–020
**Autor:** Carlos Anaya Ruiz · Listos para publicar

---
---

# ARTÍCULO 017

```yaml
title: "Zero Trust: qué es y cómo empezar sin rehacer todo"
slug: "arquitectura-zero-trust-como-empezar"
description: "Zero Trust explicado sin marketing: los 5 principios reales, qué implementar primero y cómo migrar sin tirar tu infraestructura actual."
author: "Carlos Anaya Ruiz"
category: "Ciberseguridad"
tags: ["zero trust", "arquitectura de seguridad", "control de acceso", "redes"]
keyword_principal: "arquitectura zero trust"
```

## Zero Trust: qué es y cómo empezar sin rehacer todo

**Zero Trust es un modelo de seguridad que elimina la confianza automática basada en la ubicación en la red.** Estar dentro de la oficina o conectado a la VPN deja de ser una credencial. Cada acceso se verifica, cada vez, con el contexto completo.

No es un producto. Nadie te vende Zero Trust en una caja, por mucho que lo anuncien así. Es un conjunto de principios que se implementan por etapas sobre lo que ya tienes.

---

### El modelo que reemplaza

El modelo tradicional es el del castillo: un perímetro fuerte (firewall, VPN) y confianza amplia adentro. Funcionaba cuando todos trabajaban en la oficina y todos los sistemas vivían en el mismo edificio.

Falla por dos razones evidentes hoy:

1. **Ya no hay adentro.** Tu gente trabaja desde casa, tus sistemas están en la nube, tus proveedores acceden desde fuera.
2. **Una vez dentro, el atacante se mueve libre.** Es exactamente lo que hace el ransomware entre el día 2 y el día 10.

---

### Los 5 principios

**1. Verificar explícitamente.**
Cada acceso se evalúa con toda la señal disponible: identidad, salud del dispositivo, ubicación, hora, comportamiento previo, sensibilidad del recurso.

**2. Mínimo privilegio.**
Cada identidad tiene solo los permisos que necesita, solo por el tiempo que los necesita. Nada de accesos administrativos permanentes "por si acaso".

**3. Asumir la brecha.**
Diseña como si el atacante ya estuviera dentro. Eso cambia las prioridades: segmentación, cifrado interno, detección y registro pasan al frente.

**4. Segmentación fina.**
Nada de una red plana donde cualquier equipo alcanza cualquier servidor. Cada carga de trabajo con su propio perímetro.

**5. Registro y análisis continuo.**
Si no lo registras, no lo detectas. Y si no lo revisas, tampoco.

---

### Por dónde empezar de verdad

Este es el orden que funciona en una empresa que ya tiene infraestructura andando. No necesitas presupuesto extraordinario para las primeras tres etapas.

#### Etapa 1 — Identidad (mes 1 a 3)

La identidad es el nuevo perímetro. Todo lo demás se construye encima.

- Consolida en un solo proveedor de identidad. Si tienes usuarios en cinco sistemas distintos sin sincronizar, empieza aquí.
- MFA obligatorio en todo, con factores resistentes a phishing en cuentas críticas.
- Acceso condicional: bloquear o exigir verificación adicional según país, dispositivo, hora o nivel de riesgo detectado.
- Elimina cuentas huérfanas y accesos compartidos.

**Esta etapa sola entrega más del 50% del beneficio de todo el modelo.**

#### Etapa 2 — Dispositivos (mes 3 a 6)

- Inventario real de qué equipos acceden a qué.
- Exigir que el dispositivo esté gestionado y cumpla requisitos mínimos (cifrado de disco, sistema actualizado, protección activa) para acceder a recursos sensibles.
- Separar el acceso desde dispositivos personales: navegador sin descarga local, o directamente restringido.

#### Etapa 3 — Aplicaciones y datos (mes 6 a 12)

- Clasifica: qué información es realmente sensible. Casi nadie lo tiene hecho.
- Aplica permisos por rol sobre esos datos, no sobre carpetas heredadas de hace ocho años.
- Sustituye la VPN de acceso total por acceso por aplicación. La VPN clásica es el ejemplo perfecto de lo que Zero Trust corrige: te autentica una vez y te da la red entera.

#### Etapa 4 — Red y cargas de trabajo (mes 12 en adelante)

- Segmentación entre servidores y entre entornos.
- Cifrado del tráfico interno, no solo del que sale a internet.
- Reglas de mínimo privilegio entre servicios: que la aplicación web solo alcance su base de datos y nada más.

---

### Los errores más caros

**Comprar la herramienta antes de arreglar la identidad.** Una plataforma de acceso avanzada sobre un directorio desordenado con cuentas compartidas no arregla nada.

**Tratarlo como proyecto con fecha de término.** Zero Trust es una postura operativa continua, no una implementación que se cierra.

**Ignorar a los proveedores externos.** Suelen tener accesos amplios y controles débiles. Es una de las vías de entrada más frecuentes y de las peor vigiladas.

**Bloquear antes de observar.** Activa las políticas primero en modo de solo registro. Vas a descubrir flujos de trabajo legítimos que no conocías. Bloquear a ciegas genera interrupciones y una revuelta interna que frena el proyecto entero.

**Olvidar las cuentas de servicio y las llaves de API.** Suelen tener permisos excesivos, no rotan nunca y nadie las audita.

---

### Cómo medir el avance

| Indicador | Objetivo |
|---|---|
| Cobertura de MFA en cuentas críticas | 100% |
| Cuentas con privilegios administrativos permanentes | Tendiendo a cero |
| Aplicaciones tras acceso condicional | Creciente por trimestre |
| Dispositivos gestionados con acceso a datos sensibles | 100% |
| Tiempo de revocación de accesos tras una baja | Mismo día |
| Segmentos de red donde un equipo comprometido queda contenido | Creciente |

---

### Preguntas frecuentes

**¿Zero Trust significa quitar la VPN?**
A mediano plazo, sí, sustituirla por acceso por aplicación. Pero no es el primer paso. Primero identidad, luego dispositivos, después el acceso.

**¿Sirve para una empresa de 50 personas?**
Los principios sí, con implementación proporcional. Etapas 1 y 2 son perfectamente alcanzables con las suites de productividad que probablemente ya pagas.

**¿Cuánto cuesta?**
Las dos primeras etapas suelen estar cubiertas por licencias que ya tienes, en su nivel intermedio. El costo real es de configuración y de tiempo interno, no de compra.

---

**Escrito por Carlos Anaya Ruiz** — Consultor tecnológico. Trabajo con identidad, acceso y seguridad en organizaciones distribuidas.

---

### PROMPT DE PORTADA — Artículo 017

> Múltiples anillos concéntricos de luz cian rotando en distintos ejes alrededor de un núcleo de datos luminoso, cada anillo con una compuerta abierta en una posición diferente. Estilo giroscopio de precisión mecánica, materiales de metal oscuro y vidrio. Vista tres cuartos, iluminación azul fría, atmósfera de sala de servidores en penumbra, fondo negro carbón.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.

---
---

# ARTÍCULO 018

```yaml
title: "Backup 3-2-1 a prueba de ransomware"
slug: "regla-backup-3-2-1-ransomware"
description: "La regla 3-2-1 de backups explicada y su versión moderna 3-2-1-1-0, con backups inmutables que el ransomware no puede cifrar."
author: "Carlos Anaya Ruiz"
category: "Ciberseguridad"
tags: ["backups", "respaldos", "ransomware", "continuidad de negocio"]
keyword_principal: "regla 3-2-1 backup"
```

## Backup 3-2-1 a prueba de ransomware

**La regla 3-2-1 dice: tres copias de tus datos, en dos tipos de medio distintos, con una fuera de sitio.** Es el estándar de facto desde hace décadas y sigue siendo la base correcta. Pero por sí sola ya no basta contra ransomware moderno, porque los atacantes buscan y destruyen los respaldos antes de cifrar.

La versión que necesitas hoy es **3-2-1-1-0**.

---

### La regla ampliada

- **3** copias totales de los datos (la original más dos respaldos).
- **2** medios o tecnologías distintas.
- **1** copia fuera de sitio.
- **1** copia **inmutable o fuera de línea**.
- **0** errores en la verificación de restauración.

Los dos últimos dígitos son los que marcan la diferencia real, y son los que casi nadie tiene.

---

### Qué significa "inmutable" y por qué lo decide todo

Inmutable significa que la copia **no se puede modificar ni borrar durante un periodo definido, ni siquiera con credenciales de administrador**. Se implementa con bloqueo de objetos en almacenamiento en la nube, con repositorios reforzados, o con medios físicos desconectados.

Por qué importa: en un ataque de ransomware, el atacante obtiene privilegios administrativos antes de cifrar. Si tu respaldo se puede borrar con esas credenciales, tu respaldo ya está muerto cuando lo necesitas.

**Sincronización no es respaldo.** Una carpeta que se sincroniza automáticamente replica los archivos cifrados y sobrescribe tu copia buena en cuestión de minutos. Es la confusión más costosa que existe en este tema.

---

### El "0": la parte que casi nadie hace

Un respaldo que nunca has restaurado no es un respaldo. Es una hipótesis.

**Prueba trimestral mínima:**
1. Elige un servidor o conjunto de datos real, no uno de prueba.
2. Restaura en un entorno aislado.
3. **Cronometra.** Anota el tiempo total.
4. Verifica que los datos estén completos y usables: abre archivos, consulta la base de datos, comprueba integridad.
5. Documenta qué falló y corrígelo.

Lo que sale a la luz en estas pruebas, siempre: la restauración tarda mucho más de lo que asumías, falta la clave de cifrado del respaldo, nadie sabe el orden de arranque de los sistemas, o el respaldo de la base de datos estaba corrupto desde hace meses.

---

### Diseño práctico para una empresa mediana

| Copia | Ubicación | Medio | Frecuencia | Retención |
|---|---|---|---|---|
| Producción | Servidor / nube | Disco | — | — |
| Copia 1 | Almacenamiento local (NAS o servidor de respaldo) | Disco | Diaria | 30 días |
| Copia 2 | Nube, **con bloqueo de objetos** | Objeto inmutable | Diaria | 90 días |
| Copia 3 | Fuera de línea (cinta o disco desconectado) o segunda región | Distinto | Semanal | 12 meses |

**Reglas de configuración que importan:**
- El servidor de respaldo **no** pertenece al mismo dominio que el resto. Si el atacante compromete el dominio, no debe heredar acceso a los respaldos.
- Credenciales del sistema de respaldo distintas y con MFA propio.
- Alertas ante cualquier intento de borrado o cambio de política de retención. Es una de las señales tempranas más útiles de un ataque en curso.

---

### Cómo definir cuánto respaldar y cada cuánto

Dos números por sistema:

**RPO (cuántos datos puedes perder).** Si respaldas cada 24 horas, puedes perder hasta 24 horas de trabajo. ¿Es aceptable para ese sistema? Para la contabilidad probablemente no; para un servidor de archivos internos quizá sí.

**RTO (cuánto puedes estar caído).** Si restaurar tarda 30 horas y tu operación no aguanta más de 6, tienes un problema de diseño, no de respaldo.

Clasifica tus sistemas en tres niveles y asigna RPO/RTO distintos. Tratar todo con el mismo estándar es o carísimo o insuficiente.

---

### Lo que la gente olvida respaldar

- **Correo en la nube.** La retención del proveedor no es un respaldo. Si alguien borra una carpeta y se supera el periodo de recuperación, se acabó.
- **Datos en aplicaciones de terceros.** CRM, sistema administrativo, herramientas de gestión. Casi ninguna incluye respaldo exportable por defecto.
- **Configuración de infraestructura.** Reglas de firewall, configuración de red, variables de entorno. Restaurar datos sin configuración te deja a mitad del camino.
- **Claves y secretos.** Si están solo en el sistema que se cayó, no puedes levantar nada.
- **Documentación del proceso de restauración.** Impresa o en un lugar accesible sin acceso a la red. Que no viva únicamente en el servidor que se cayó.

---

### Señales de que tu respaldo no sirve

- Nadie sabe decir cuándo fue la última restauración exitosa.
- El respaldo se hace a una carpeta de red accesible con el usuario administrador de dominio.
- No hay alertas cuando un trabajo de respaldo falla.
- La retención es de siete días. El ransomware suele estar dentro más tiempo que eso, así que tus siete días pueden estar ya comprometidos.
- Nadie ha cronometrado nunca una restauración completa.

---

### Preguntas frecuentes

**¿Cuánto cuesta un esquema así?**
Para una empresa mediana, el almacenamiento inmutable en la nube ronda entre 25,000 y 70,000 pesos anuales según volumen, más el software de respaldo. Es una fracción del costo de una semana de operación detenida.

**¿Sirve un disco externo conectado permanentemente?**
No como copia inmutable. Si está conectado, el ransomware lo alcanza. Como copia adicional desconectada tras el respaldo, sí funciona.

**¿Cuánto tiempo debo retener?**
Mínimo 90 días para poder retroceder más allá del periodo de permanencia típico de un atacante. Para obligaciones fiscales o contractuales, lo que exija la norma aplicable.

---

**Escrito por Carlos Anaya Ruiz** — Consultor tecnológico. Diseño esquemas de respaldo y continuidad para empresas multi-sucursal.

---

### PROMPT DE PORTADA — Artículo 018

> Tres bloques de datos idénticos hechos de cristal cian, colocados a distintas profundidades en el espacio: uno cercano y nítido, uno intermedio, uno lejano y desenfocado, conectados por finos haces de luz. Uno de los tres está encapsulado por completo dentro de un bloque de ámbar sólido translúcido, sellado. Fondo negro infinito, iluminación fría con acento cálido en el bloque de ámbar.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.

---
---

# ARTÍCULO 019

```yaml
title: "OWASP Top 10 explicado para desarrolladores"
slug: "owasp-top-10-explicado-desarrolladores"
description: "El OWASP Top 10 explicado con causa raíz, remediación concreta y el control que detecta cada falla en tu pipeline de CI."
author: "Carlos Anaya Ruiz"
category: "Ciberseguridad"
tags: ["owasp", "desarrollo seguro", "vulnerabilidades", "devsecops"]
keyword_principal: "owasp top 10"
```

## OWASP Top 10 explicado para desarrolladores

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

---

**Escrito por Carlos Anaya Ruiz** — Desarrollador full-stack. Escribo código en producción y diseño los controles que lo revisan.

---

### PROMPT DE PORTADA — Artículo 019

> Una pared construida con ladrillos de vidrio oscuro donde exactamente diez piezas específicas brillan en rojo alerta, formando un patrón irregular disperso. Vista frontal ligeramente angulada, con los bordes del encuadre cortados por profundidad de campo. Luz cian rasante entrando desde la izquierda que revela la textura del vidrio. Fondo negro carbón.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.

---
---

# ARTÍCULO 020

```yaml
title: "Cómo asegurar los grupos de seguridad en AWS"
slug: "asegurar-security-groups-aws"
description: "Cómo auditar y cerrar grupos de seguridad expuestos a 0.0.0.0/0 en AWS sin tumbar producción. Con proceso de remediación por fases."
author: "Carlos Anaya Ruiz"
category: "Ciberseguridad"
tags: ["aws", "cloud security", "hardening", "infraestructura"]
keyword_principal: "security groups aws seguridad"
```

## Cómo asegurar los grupos de seguridad en AWS

**Un grupo de seguridad abierto a `0.0.0.0/0` en un puerto administrativo o de base de datos es una de las exposiciones más comunes y más graves que existen en la nube.** Y aparece en prácticamente toda cuenta que no ha sido auditada, porque casi siempre nace de un "lo abro un momento para probar" que nadie cerró.

Este es el proceso para encontrarlas y cerrarlas sin tumbar producción.

---

### Qué es realmente un grupo de seguridad

Un firewall virtual a nivel de instancia. Tres cosas que hay que tener claras porque generan errores:

1. **Es de tipo permitir únicamente.** No existen reglas de denegación. Lo que no está permitido, está bloqueado.
2. **Tiene estado.** Si permites la entrada, la respuesta sale automáticamente. No necesitas regla de salida para eso.
3. **Se acumulan.** Una instancia puede tener varios grupos y aplican todas las reglas sumadas. Por eso auditar uno solo no dice nada.

---

### Las exposiciones que hay que buscar primero

Por orden de gravedad:

| Puerto | Servicio | Riesgo si está abierto al mundo |
|---|---|---|
| 22 | SSH | Acceso administrativo. Crítico. |
| 3389 | Escritorio remoto | Vía de entrada frecuente de ransomware. Crítico. |
| 3306 / 5432 | Bases de datos | Exposición directa de datos. Crítico. |
| 27017 / 6379 | Bases NoSQL y caché | Frecuentemente sin autenticación por defecto. Crítico. |
| 9200 | Motores de búsqueda | Fuga masiva de datos. Crítico. |
| 0-65535 | Todos los puertos | Sin comentarios. |

Un solo grupo que exponga base de datos y acceso administrativo simultáneamente al mundo es el peor escenario posible: da acceso y datos en el mismo movimiento.

---

### El proceso de auditoría

**Paso 1 — Inventario completo.**
Lista todos los grupos de seguridad de todas las regiones. Sí, todas: las exposiciones aparecen con frecuencia en regiones que nadie usa y nadie revisa. Registra grupo, regla, puerto, origen y a qué recursos está asociado.

**Paso 2 — Clasifica.**
- **Crítico:** puerto administrativo o de datos abierto a `0.0.0.0/0`.
- **Alto:** puerto no estándar abierto al mundo, o rangos amplios de IP sin justificación.
- **Medio:** reglas demasiado permisivas dentro de la red privada.
- **Limpieza:** grupos sin ningún recurso asociado. Bórralos, ensucian la auditoría.

**Paso 3 — Averigua quién usa cada regla antes de tocarla.**
Este es el paso que evita tumbar producción. Activa los registros de flujo de red y observa durante al menos una semana quién se conecta realmente a ese puerto y desde dónde. Vas a encontrar integraciones que nadie recordaba.

**Paso 4 — Diseña el reemplazo.**
Para cada regla abierta, define la alternativa antes de cerrarla:
- Acceso administrativo → servicio de acceso gestionado sin puertos abiertos, o bastión con lista blanca.
- Base de datos → accesible solo desde el grupo de seguridad de la aplicación, nunca desde internet.
- Servicio de terceros → lista blanca de las IP publicadas por ese proveedor.
- Acceso del equipo → VPN, o IP fija de oficina.

**Paso 5 — Cierra por fases y en ventana controlada.**
Nunca todo de golpe. Primero lo que no tiene tráfico registrado, después lo que tiene tráfico identificado y ya migrado. Con plan de reversión escrito para cada cambio.

---

### El reemplazo correcto para cada caso

**Acceso administrativo a servidores.**
La mejor solución es no tener puertos administrativos abiertos en absoluto. Usa un servicio de acceso gestionado que se conecta a través de un agente saliente. Te da acceso con registro completo, sin puerto de entrada, sin llaves distribuidas.

**Bases de datos.**
Nunca en subred pública. Nunca accesibles desde internet. La regla de entrada apunta al grupo de seguridad de la aplicación, no a un rango de IP. Así el permiso se mueve solo cuando cambian las instancias.

**Servicios web.**
Solo el balanceador de carga expuesto, en 80 y 443. Las instancias detrás solo aceptan tráfico del balanceador.

**Acceso de proveedores externos.**
Lista blanca de sus IP publicadas, o acceso a través de un punto de entrada dedicado. Y revisión trimestral: los proveedores cambian de rangos y no te avisan.

---

### Cómo evitar que vuelva a pasar

**Prevención en el diseño:**
- Infraestructura como código. Los grupos de seguridad se definen en el repositorio, no en la consola.
- Revisión obligatoria de todo cambio a reglas de red.
- Reglas de política que rechacen automáticamente en el pipeline cualquier regla con `0.0.0.0/0` en puertos administrativos.

**Detección continua:**
- Reglas de configuración que evalúan permanentemente el cumplimiento y alertan ante una regla no conforme.
- Alerta en tiempo real ante creación o modificación de grupos de seguridad en cuentas de producción.
- Revisión trimestral documentada, con responsable asignado.

**Higiene operativa:**
- Etiquetado obligatorio: dueño, propósito, fecha de creación.
- Regla cultural: toda apertura temporal se registra con fecha de cierre. Sin fecha, no se abre.

---

### Los errores que causan caídas al remediar

- **Cerrar sin observar el tráfico primero.** Siempre hay una integración que nadie documentó.
- **Olvidar las reglas de salida.** Menos comunes, pero un endurecimiento agresivo de salida rompe actualizaciones y llamadas a APIs externas.
- **Asumir que solo hay un grupo por instancia.** Cierras uno y sigue expuesta por otro.
- **Ignorar las listas de control de acceso de la subred.** Son otra capa, sin estado, y bloquean de forma distinta.
- **No revisar todas las regiones.** La exposición suele estar donde nadie mira.

---

### Preguntas frecuentes

**¿Es grave si el puerto está abierto pero el servicio pide contraseña?**
Sí. Te expone a intentos automatizados constantes, a fallas del propio servicio y a fugas por versiones vulnerables. La autenticación es la segunda línea, no la primera.

**¿Cuánto tarda una remediación completa?**
En una cuenta mediana con varias decenas de grupos: de 2 a 6 semanas incluyendo observación de tráfico y ventanas de cambio. La observación no se puede acelerar.

**¿Y si necesito acceso desde IP dinámicas?**
Usa VPN o un servicio de acceso gestionado. Abrir al mundo "porque mi IP cambia" no es una solución aceptable.

---

**Escrito por Carlos Anaya Ruiz** — Consultor tecnológico. He ejecutado auditorías de costo y seguridad sobre cuentas de nube en producción.

---

### PROMPT DE PORTADA — Artículo 020

> Una compuerta industrial de metal oscuro con múltiples aberturas circulares dispuestas en cuadrícula, la mayoría selladas herméticamente con placas de luz cian y exactamente tres abiertas de par en par emitiendo luz roja intensa hacia el exterior. Vista frontal en ligera perspectiva, atmósfera de niebla técnica, fondo negro carbón, iluminación bicromática de alto contraste.
>
> Ilustración editorial 3D, render cinematográfico, iluminación volumétrica, grano fílmico sutil, profundidad de campo, ultra detallado, 16:9, 1600x900. SIN texto, SIN letras, SIN logos, SIN rostros humanos, SIN marcas de agua.
