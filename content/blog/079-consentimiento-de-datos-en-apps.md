---
n: 79
title: "Consentimiento de datos en apps: cómo hacerlo bien"
slug: "consentimiento-de-datos-en-apps"
description: "Cómo pedir consentimiento en apps y web sin destruir la conversión: patrones válidos, dark patterns prohibidos y registro probatorio."
category: "Cumplimiento"
keyword: "consentimiento de datos apps"
tipo: "satelite"
tags: ["consentimiento","privacidad","ux","cumplimiento"]
---


**Un consentimiento válido es libre, específico, informado e inequívoco.** Si falla cualquiera de esas cuatro condiciones, no tienes consentimiento: tienes un formulario.

Y la buena noticia es que hacerlo bien no destruye la conversión. Lo que la destruye es hacerlo mal: banners agresivos, seis pantallas de permisos al abrir, y solicitudes sin contexto.

---

### Las cuatro condiciones

**Libre.** El usuario puede negarse sin perder el servicio. Si condicionas el acceso a que acepte mercadotecnia, el consentimiento no es libre.

**Específico.** Un consentimiento por finalidad. Una casilla que cubre "tratamiento de datos, mercadotecnia, transferencias y perfilado" no es específica.

**Informado.** El usuario sabe qué acepta antes de aceptarlo, en lenguaje comprensible. No en la cláusula 14 de un documento de 30 páginas.

**Inequívoco.** Un acto afirmativo. El silencio, la inacción y las casillas premarcadas no son consentimiento.

---

### Los patrones prohibidos

Estos aparecen en informes de autoridades de protección de datos y de consumidores como prácticas problemáticas:

**Casillas premarcadas.** No hay acto afirmativo.

**Botón de aceptar destacado y rechazar escondido.** Si "Aceptar todo" es un botón grande de color y "Rechazar" es un enlace gris pequeño, el consentimiento no es libre.

**Rechazar que requiere más pasos que aceptar.** Aceptar en un clic y rechazar en cinco pantallas de configuración es un patrón oscuro claro.

**Muro de consentimiento sin alternativa.** "Acepta todo o no puedes usar el servicio" cuando el tratamiento no es necesario para prestarlo.

**Cargar rastreadores antes de la aceptación.** Si tus cookies de análisis y publicidad se cargan al abrir la página, el consentimiento posterior es irrelevante: ya trataste los datos.

**Repreguntar hasta el cansancio.** Si el usuario rechazó, volver a preguntarle en cada visita es presión indebida.

**Lenguaje confuso o doble negación.** "Desmarca si no quieres que no te enviemos comunicaciones."

---

### El patrón que funciona

**Nivel 1 — Lo necesario, sin preguntar.**

Los tratamientos necesarios para prestar el servicio no requieren consentimiento en la mayoría de los marcos: se sustentan en la ejecución del contrato. Informas en el aviso de privacidad y sigues adelante.

Esto incluye: crear la cuenta, procesar el pago, enviar el producto, dar soporte, seguridad básica.

**Nivel 2 — Lo opcional, en el momento con contexto.**

Aquí está la clave: **pide el permiso en el momento en que el usuario entiende para qué sirve**, no al abrir la app.

```
Mal:  [Al abrir la app] "Permite notificaciones"
      → tasa de aceptación baja

Bien: [Cuando el usuario configura un recordatorio]
      "¿Quieres que te avisemos cuando llegue la fecha?"
      → tasa de aceptación mucho más alta
```

Esto se conoce como permiso en contexto, y mejora tanto el cumplimiento como la conversión. No es una concesión: es mejor diseño.

**Nivel 3 — Configuración accesible siempre.**

Una pantalla de privacidad donde el usuario puede revisar y cambiar lo que aceptó, en cualquier momento. Y donde revocar sea tan fácil como aceptar fue.

---

### El registro probatorio

**Tener el consentimiento pero no poder demostrarlo equivale a no tenerlo.**

Guarda, para cada consentimiento:

```sql
CREATE TABLE consentimientos (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id      uuid NOT NULL,
  finalidad       text NOT NULL,        -- 'marketing', 'analitica', 'perfilado'
  otorgado        boolean NOT NULL,
  version_aviso   text NOT NULL,        -- versión del aviso vigente al aceptar
  mecanismo       text NOT NULL,        -- 'formulario_registro', 'banner_cookies'
  otorgado_en     timestamptz NOT NULL DEFAULT now(),
  revocado_en     timestamptz,
  ip_hash         text,                  -- hash, no la IP en claro
  user_agent      text
);
```

**Puntos importantes:**

- **Versión del aviso.** Si actualizas el aviso, necesitas saber qué versión aceptó cada usuario.
- **Registro de revocaciones.** No borres el registro al revocar: marca la fecha. Necesitas el histórico.
- **No guardes la IP en claro** si no la necesitas. Un hash sirve como evidencia sin conservar el dato identificable.
- **Inmutable.** El registro de consentimientos no se edita, solo se añade.

---

### Cookies y tecnologías de rastreo

El caso donde más se incumple.

**Reglas prácticas:**

1. **Nada se carga antes del consentimiento**, salvo lo estrictamente necesario para el funcionamiento del sitio.
2. **Categorías separadas:** necesarias (sin consentimiento), analíticas, publicitarias, personalización. Cada una con su interruptor.
3. **Rechazar en un clic**, con la misma prominencia visual que aceptar.
4. **Revocable** desde un enlace permanente y accesible.
5. **Informar de la duración** y de quién accede a los datos.

**Implementación técnica correcta:** tu gestor de etiquetas o tu código de carga de scripts debe leer el estado de consentimiento antes de inyectar nada. Si el script se carga y "respeta" el consentimiento después, ya cargaste el rastreador.

---

### Cómo pedir permisos del sistema en móvil

Los permisos de sistema —cámara, ubicación, notificaciones, contactos— tienen su propia dinámica.

**El patrón de doble solicitud:**

1. **Primero tu propia pantalla**, explicando por qué necesitas el permiso y qué gana el usuario.
2. **Si acepta**, entonces lanzas la solicitud del sistema.

Por qué importa: en las plataformas móviles, si el usuario rechaza el diálogo del sistema, volver a pedirlo es difícil o imposible. Tu pantalla previa filtra a quien iba a rechazar, y solo lanzas el diálogo del sistema a quien probablemente aceptará.

**Y nunca pidas permisos que no usas.** Además del riesgo de cumplimiento, las tiendas revisan que los permisos solicitados correspondan a funcionalidad real.

---

### Menores de edad

Requiere tratamiento especial. Si tu producto puede ser usado por menores:

- Verificación de edad proporcional al riesgo
- Consentimiento de quien ejerce la patria potestad cuando la normativa lo exija
- Información en lenguaje comprensible para su edad
- Restricciones sobre publicidad dirigida y perfilado

**Este es un tema donde no conviene improvisar.** Si tu producto tiene usuarios menores, consulta con asesoría legal especializada antes de lanzar.

---

### Preguntas frecuentes

**¿El consentimiento por seguir navegando es válido?**
No. No es un acto afirmativo inequívoco.

**¿Puedo asumir consentimiento si el usuario ya era cliente?**
Depende de la base legal y de qué se le informó en su momento. Para finalidades nuevas, generalmente necesitas nuevo consentimiento.

**¿Cada cuánto renuevo el consentimiento?**
No hay un plazo universal. Buena práctica: revisarlo cuando cambien las finalidades, y considerar una renovación periódica para consentimientos de mercadotecnia muy antiguos sin interacción.
