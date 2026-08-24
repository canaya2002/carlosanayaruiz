---
n: 18
title: "Backup 3-2-1 a prueba de ransomware"
slug: "regla-backup-3-2-1-ransomware"
description: "La regla 3-2-1 de backups explicada y su versión moderna 3-2-1-1-0, con backups inmutables que el ransomware no puede cifrar."
category: "Ciberseguridad"
keyword: "regla 3-2-1 backup"
tipo: "satelite"
tags: ["backups","respaldos","ransomware","continuidad de negocio"]
---


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
