---
n: 22
title: "Plan de respuesta a incidentes: plantilla y pasos"
slug: "plan-de-respuesta-a-incidentes-plantilla"
description: "Plantilla completa de plan de respuesta a incidentes: las 6 fases, quién decide qué, y el guion de los primeros 60 minutos."
category: "Ciberseguridad"
keyword: "plan de respuesta a incidentes"
tipo: "satelite"
tags: ["respuesta a incidentes","continuidad","gestión de crisis","seguridad"]
---


**Un plan de respuesta a incidentes existe porque nadie improvisa bien a las 2 de la mañana.** Su función no es predecir qué va a pasar: es eliminar las decisiones que se tomarían mal bajo presión.

Debe caber en una hoja, estar impreso, y ser accesible sin acceso a la red. Si tu plan vive en una carpeta compartida del servidor que se cayó, no tienes plan.

---

### Las 6 fases

**1. Preparación** (antes de que pase nada)
**2. Detección e identificación**
**3. Contención**
**4. Erradicación**
**5. Recuperación**
**6. Lecciones aprendidas**

La mayoría de las empresas solo tiene la 5, improvisada.

---

### Fase 1 — Preparación

Lo que debe existir **antes**:

- **Lista de contactos impresa.** Interna (dirección, sistemas, legal, comunicación) y externa (proveedor de seguridad, aseguradora, asesor legal, contactos de banco). Con teléfonos personales, porque el correo corporativo puede estar comprometido.
- **Canal de comunicación alterno.** Un grupo en una aplicación de mensajería fuera de la infraestructura corporativa. Si el atacante está leyendo tu correo, coordinar la respuesta por correo es entregarle el plan.
- **Definición de roles.** Quién decide desconectar. Quién habla con clientes. Quién documenta. Quién autoriza el gasto de emergencia.
- **Umbrales de severidad** definidos con antelación.
- **Respaldos probados** y documentación de restauración accesible fuera de línea.

---

### Fase 2 — Detección e identificación

**Objetivo: responder tres preguntas en menos de 30 minutos.**

1. ¿Qué está pasando?
2. ¿Qué sistemas están afectados?
3. ¿Sigue ocurriendo ahora mismo?

**Niveles de severidad sugeridos:**

| Nivel | Definición | Quién se activa |
|---|---|---|
| **S1 — Crítico** | Operación detenida, datos comprometidos, o cifrado en curso | Todos, incluida dirección |
| **S2 — Alto** | Cuenta comprometida, acceso no autorizado confirmado | Sistemas + responsable de área |
| **S3 — Medio** | Actividad sospechosa sin impacto confirmado | Sistemas |
| **S4 — Bajo** | Intento fallido, correo reportado | Registro y seguimiento |

Definir esto de antemano evita la discusión de "¿esto es grave?" en el peor momento.

---

### Fase 3 — Contención

**Regla de oro: aísla, no apagues.** Desconectar de la red preserva la evidencia en memoria; apagar la destruye, y esa evidencia suele ser la que dice cómo entraron.

**Contención inmediata (primeros 60 minutos):**
1. Aísla los equipos afectados de la red.
2. Corta el acceso remoto de toda la organización si hay duda del alcance.
3. Aísla los respaldos para que no sean alcanzables.
4. Revoca sesiones activas y restablece credenciales de cuentas privilegiadas desde un equipo limpio.
5. Revisa reglas de reenvío automático en el correo de las cuentas implicadas.

**Contención a corto plazo (primeras 24 horas):**
- Segmenta la red para frenar el movimiento lateral.
- Aplica bloqueos en el perímetro sobre indicadores identificados.
- Levanta sistemas críticos en entorno limpio si es viable.

---

### Fase 4 — Erradicación

No se pasa a esta fase hasta entender **cómo entraron**. Restaurar sin cerrar la vía de entrada es reinfectarse en días.

- Identifica el punto de acceso inicial y ciérralo.
- Elimina persistencia: cuentas creadas, tareas programadas, servicios, claves de acceso añadidas.
- Reconstruye desde cero los sistemas comprometidos. Limpiar un sistema comprometido nunca da la misma certeza que reconstruirlo.
- Rota todos los secretos: contraseñas, llaves de API, certificados, tokens.

---

### Fase 5 — Recuperación

- Restaura por orden de criticidad, no por orden de facilidad.
- Verifica integridad antes de reconectar cada sistema.
- Monitoreo reforzado durante al menos 30 días. Los reingresos ocurren.
- Comunicación a clientes y terceros según lo que corresponda legal y contractualmente.

**Sobre obligaciones legales:** si hubo datos personales comprometidos, hay deberes de notificación que atender y plazos que corren. Esto se evalúa desde la primera hora con asesoría legal, no al final.

---

### Fase 6 — Lecciones aprendidas

Reunión dentro de las dos semanas siguientes. Formato de una página:

1. **Línea de tiempo.** Qué pasó y cuándo, con horas.
2. **Cómo entraron.** Causa raíz, sin señalar personas.
3. **Qué funcionó** de la respuesta.
4. **Qué falló** y por qué.
5. **Acciones concretas** con responsable y fecha.

**Sin culpar a individuos.** El objetivo es corregir el sistema. En cuanto la reunión se convierte en búsqueda de culpables, la gente deja de reportar y pierdes tu capacidad de detección temprana.

---

### El guion de los primeros 60 minutos

Esto es lo que va impreso:

```
MINUTO 0-5
□ Quien detecta llama al responsable de sistemas (tel: ____)
□ Se abre el canal alterno de comunicación
□ Se anota la hora exacta de detección

MINUTO 5-15
□ Aislar equipos afectados de la red (NO apagar)
□ Determinar nivel de severidad
□ Si es S1: notificar a dirección (tel: ____)

MINUTO 15-30
□ Cortar acceso remoto organizacional
□ Aislar respaldos
□ Restablecer credenciales privilegiadas desde equipo limpio
□ Iniciar bitácora con hora de cada acción

MINUTO 30-60
□ Determinar alcance: qué sistemas, qué datos
□ Contactar proveedor externo de respuesta (tel: ____)
□ Notificar a asesor legal si hay datos personales (tel: ____)
□ Definir mensaje interno: qué se le dice al equipo
□ NO comunicar externamente aún

NUNCA
✗ Apagar equipos afectados
✗ Coordinar por el correo posiblemente comprometido
✗ Pagar o negociar sin asesoría
✗ Borrar registros o evidencia
✗ Comunicar externamente sin revisión legal
```

---

### Preguntas frecuentes

**¿Cada cuánto se prueba el plan?**
Un simulacro de mesa cada seis meses, de 90 minutos. Se plantea un escenario y el equipo recorre las decisiones. Siempre aparecen huecos.

**¿Necesito contratar un proveedor de respuesta a incidentes?**
Tener uno identificado y con contrato marco firmado **antes** del incidente ahorra días. Negociar un contrato mientras estás cifrado es la peor posición posible.

**¿Quién debe liderar la respuesta?**
Alguien con autoridad para tomar decisiones costosas —como detener la operación— y capacidad técnica para entender lo que pasa. Si esas dos cosas están en personas distintas, defínelas como pareja de mando desde ahora.
