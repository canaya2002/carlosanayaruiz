---
n: 20
title: "Cómo asegurar los grupos de seguridad en AWS"
slug: "asegurar-security-groups-aws"
description: "Cómo auditar y cerrar grupos de seguridad expuestos a 0.0.0.0/0 en AWS sin tumbar producción. Con proceso de remediación por fases."
category: "Ciberseguridad"
keyword: "security groups aws seguridad"
tipo: "satelite"
tags: ["aws","cloud security","hardening","infraestructura"]
---


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
