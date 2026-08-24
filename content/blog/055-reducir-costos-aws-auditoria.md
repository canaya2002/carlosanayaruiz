---
n: 55
title: "Cómo auditar y reducir tu factura de AWS"
slug: "reducir-costos-aws-auditoria"
description: "Método de auditoría de costos AWS en 7 pasos, con los desperdicios que aparecen en casi toda cuenta y cómo cortarlos sin downtime."
category: "Cloud"
keyword: "reducir costos aws"
tipo: "pillar"
tags: ["aws","finops","costos","optimización"]
---


**En casi toda cuenta de AWS que no ha sido auditada hay entre 20% y 40% de gasto eliminable sin tocar el rendimiento.** No por incompetencia: por acumulación. Recursos que se crearon para una prueba, instancias sobredimensionadas "por seguridad", almacenamiento de alto rendimiento en cargas que no lo necesitan.

Este es el método que uso, en el orden correcto.

---

### Paso 1 — Entiende dónde se va el dinero

Antes de tocar nada, desglosa el gasto del último trimestre por servicio, y dentro del servicio principal, por recurso.

Casi siempre encontrarás que un solo servicio se lleva más de la mitad. En la mayoría de las cuentas con aplicaciones de negocio es la base de datos. En otras, cómputo o transferencia de datos.

**Enfoca ahí el 80% de tu esfuerzo.** Optimizar un servicio que representa el 3% de la factura es trabajo perdido.

---

### Paso 2 — El orden de las acciones (esto importa mucho)

Hay un orden correcto y equivocarse cuesta caro:

```
1. ELIMINAR lo que no se usa       ← sin riesgo, sin downtime
2. AJUSTAR tipos de almacenamiento ← generalmente sin downtime
3. REDIMENSIONAR cómputo           ← requiere ventana
4. COMPROMETER capacidad           ← SOLO al final
```

**El error más caro que existe en esta materia:** comprar instancias reservadas o planes de ahorro **antes** de haber redimensionado. Las recomendaciones automáticas de la consola calculan el ahorro sobre tu configuración **actual**. Si tu servidor está sobredimensionado al doble, te van a recomendar comprometerte por un año a ese tamaño excesivo.

Te ahorras un porcentaje sobre un gasto que no deberías tener, y quedas atado. Redimensiona primero. Compromete después.

---

### Paso 3 — Eliminar lo que no se usa

Riesgo cero, resultado inmediato. Busca:

- **Volúmenes de disco sin adjuntar.** Se quedan cuando terminas una instancia y siguen facturando.
- **Instantáneas antiguas.** Respaldos de sistemas que ya no existen, acumulados durante años.
- **Direcciones IP elásticas no asociadas.** Se cobran cuando no están en uso.
- **Balanceadores de carga sin destinos.**
- **Instancias detenidas con disco.** Detenida no significa gratis: el almacenamiento sigue facturando.
- **Recursos en regiones que nadie usa.** Revisa todas las regiones, no solo la principal.
- **Registros con retención infinita.** El almacenamiento de logs crece de forma silenciosa y constante.

Este paso solo suele recuperar entre 5% y 15% de la factura.

---

### Paso 4 — Ajustar el almacenamiento

Después de eliminar, el ajuste de tipos de almacenamiento suele ser la acción con mejor relación entre ahorro y riesgo, porque en muchos casos se puede hacer en línea, sin interrumpir el servicio.

**Qué revisar:**
- Volúmenes de generación anterior que pueden migrarse a la generación actual con mejor precio.
- Volúmenes de altísimo rendimiento en cargas que no lo necesitan. Verifica el consumo real de operaciones de entrada/salida antes de decidir: si estás usando una fracción de lo aprovisionado, estás pagando de más.
- Almacenamiento de objetos sin políticas de ciclo de vida. Mover datos antiguos a clases de acceso infrecuente o archivo puede reducir mucho el costo.

**Verifica siempre las métricas reales de utilización antes de bajar de nivel.** Y hazlo en un entorno de menor tráfico aunque la operación sea en línea.

---

### Paso 5 — Redimensionar el cómputo

Aquí está normalmente el mayor ahorro y también el mayor riesgo.

**Qué revisar por instancia:**
- Utilización de CPU: percentil 95 de los últimos 30 días, no el promedio
- Utilización de memoria (requiere agente de monitoreo; si no lo tienes, instálalo antes de decidir)
- Conexiones y consultas en bases de datos
- Picos: ¿son diarios, semanales, o eventos aislados?

**Señales de sobredimensionamiento:**
- CPU consistentemente por debajo del 20% en percentil 95
- Memoria usada muy por debajo de la disponible
- Instancia que se subió de tamaño para resolver un incidente puntual y nunca se bajó

**Este último caso es el clásico.** Alguien sube el servidor de base de datos al doble para superar un pico de carga, el pico pasa, y la instancia se queda ahí durante meses duplicando el costo.

**Cómo ejecutarlo con seguridad:**
1. Documenta el tamaño actual y las métricas de referencia.
2. Programa ventana de bajo tráfico.
3. Ten el plan de reversión escrito y probado.
4. Cambia un recurso a la vez.
5. Monitorea 48 horas antes de tocar el siguiente.

En configuraciones de alta disponibilidad, el cambio suele poder hacerse con interrupción mínima, pero **planifica ventana igualmente**.

---

### Paso 6 — Reducir transferencia de datos

Es el costo silencioso que casi nadie audita.

- Tráfico entre zonas de disponibilidad: aparece en la factura sin que nadie lo note. Coloca los servicios que hablan mucho entre sí en la misma zona cuando sea posible.
- Salida a internet sin CDN. Servir archivos estáticos directamente desde almacenamiento de objetos es más caro que hacerlo a través de una red de distribución.
- Servicios que consultan a través de internet en lugar de por conexión privada.

---

### Paso 7 — Ahora sí, comprometer capacidad

Con la infraestructura ya dimensionada correctamente, evalúa compromisos de uso.

**Reglas:**
- Cubre solo tu carga base estable, nunca los picos.
- Empieza con compromisos de un año antes de considerar tres.
- Prefiere las modalidades flexibles que permiten cambiar tipo de instancia sobre las que atan a una configuración específica.
- No cubras el 100% de tu carga. Deja margen para reducir en el futuro.

Un objetivo razonable de cobertura para empezar es entre el 60% y el 75% de la carga base.

---

### Cómo evitar que vuelva a acumularse

**Etiquetado obligatorio.** Todo recurso con etiquetas de dueño, proyecto, entorno y fecha. Sin etiquetas no puedes atribuir costo ni saber a quién preguntar.

**Presupuestos con alertas** por proyecto y por entorno.

**Revisión mensual** de costos con el equipo técnico, no solo con finanzas.

**Apagado automático de entornos de desarrollo** fuera de horario laboral. Un entorno de pruebas encendido 24/7 cuesta más de tres veces que uno encendido solo en horario de trabajo.

**Infraestructura como código.** Si los recursos se crean desde un repositorio, quedan documentados y se pueden auditar.

---

### Preguntas frecuentes

**¿Cuánto se puede ahorrar de verdad?**
En una cuenta nunca auditada, entre 20% y 40% es realista. En una ya optimizada, entre 5% y 10% adicional con esfuerzo considerable.

**¿Necesito una herramienta de gestión de costos?**
Para empezar, la consola de análisis de costos nativa y las recomendaciones del asesor son suficientes. Las herramientas de terceros aportan valor cuando tienes múltiples cuentas y necesitas atribución fina.

**¿Cuánto tarda una auditoría completa?**
De 15 a 30 horas de análisis para una cuenta mediana, más las ventanas de ejecución de cambios que pueden extenderse varias semanas.
