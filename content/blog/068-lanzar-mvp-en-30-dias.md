---
n: 68
title: "Cómo lanzar un MVP en 30 días"
slug: "lanzar-mvp-en-30-dias"
description: "Plan de 30 días para lanzar un MVP real: qué recortar, qué nunca recortar y el cronograma semana por semana."
category: "SaaS"
keyword: "lanzar mvp"
tipo: "satelite"
tags: ["mvp","lanzamiento","producto","desarrollo"]
---


**Un MVP no es una versión incompleta de tu producto final: es el experimento más pequeño que responde a tu pregunta más riesgosa.** Si no sabes cuál es esa pregunta, no estás listo para construir.

Treinta días es factible con una condición: que recortes con disciplina.

---

### Antes de empezar: define la pregunta

Escribe en una frase qué quieres aprender:

- "¿Un despacho pagaría por automatizar la extracción de datos de sus expedientes?"
- "¿La gente completaría el flujo si eliminamos el registro previo?"
- "¿Podemos entregar el resultado en menos de 5 minutos a costo razonable?"

Todo lo que no contribuya a responder esa pregunta se recorta. Ese es el criterio, y es el único.

---

### Qué recortar sin culpa

- **Panel de administración.** Consulta la base de datos directamente. Los primeros meses tienes cinco clientes.
- **Configuración y personalización.** Valores fijos. Ya personalizarás cuando alguien lo pida.
- **Múltiples planes.** Un solo precio.
- **Recuperación de contraseña compleja.** Enlace mágico por correo resuelve todo y es más simple.
- **Incorporación elaborada.** Un correo tuyo, escrito a mano, funciona mejor y te da conversación con el cliente.
- **Aplicación móvil.** Web adaptable.
- **Integraciones.** Exportar a CSV cubre el 80% de las necesidades iniciales.
- **Modo oscuro, animaciones, ilustraciones.** Después.
- **Internacionalización.** Un idioma.
- **Optimización de rendimiento.** Con 50 usuarios, cualquier cosa funciona.

**Y lo más importante: automatización de procesos internos.** Si el alta de un cliente requiere que tú ejecutes tres comandos, hazlo a mano. Cinco clientes son quince comandos al mes.

---

### Qué NUNCA recortar

- **Autenticación segura.** No inventes; usa una solución probada.
- **Cifrado en tránsito.** HTTPS, sin excepciones.
- **Respaldos de la base de datos.** Automáticos y probados. Perder los datos de tus primeros clientes es terminal.
- **Registro de errores.** Necesitas saber qué falla en producción.
- **Aviso de privacidad.** Si procesas datos personales, es obligación legal desde el primer usuario.
- **Cobro funcionando.** Si tu pregunta es si pagan, tienes que poder cobrar.
- **Una forma de contactarte.** Correo visible. Tus primeros usuarios son tu mejor fuente de información.

**La seguridad y el cumplimiento no son funcionalidades opcionales del MVP.** Un incidente en tus primeros meses es de lo poco verdaderamente irrecuperable.

---

### El cronograma

#### Semana 1 — Definir y preparar

**Días 1-2: alcance.**
Escribe la pregunta. Lista las funcionalidades absolutamente necesarias para responderla. Después elimina un tercio. Lo que queda es tu alcance.

**Días 3-4: diseño del flujo principal.**
Solo el camino feliz. Bocetos, no diseño terminado. Un flujo de cinco pantallas máximo.

**Días 5-7: andamiaje técnico.**
Repositorio, proyecto desplegado en producción **desde el día uno**, base de datos, autenticación, cobros configurados en modo de prueba, captura de errores.

**Al final de la semana 1 debes tener una página en producción que diga "hola" y ya cobre en modo prueba.** Desplegar al final es como se pierden proyectos.

#### Semana 2 — El núcleo

Construye únicamente la funcionalidad que responde tu pregunta. Sin decoración, sin casos límite.

**Regla:** si te encuentras construyendo algo que no está en tu lista de la semana 1, para y pregúntate por qué.

**Al final de la semana 2:** el flujo principal funciona de extremo a extremo, aunque sea feo.

#### Semana 3 — Cerrar los bordes

- Manejo de errores en el flujo principal
- Estados vacíos y de carga
- El diseño pasa de "feo" a "presentable" (no a "bonito")
- Cobros en modo real
- Correos transaccionales mínimos: bienvenida, recibo
- Página de inicio con propuesta de valor y precio
- Aviso de privacidad y términos

#### Semana 4 — Probar y lanzar

**Días 22-24: pruebas con personas reales.**
Cinco personas del perfil objetivo, sin que tú les expliques nada. Observa dónde se atoran. Vas a descubrir que algo obvio para ti no lo es para nadie más.

**Días 25-26: corregir lo que bloquea.**
Solo lo que impide completar el flujo. Lo demás va a la lista de después.

**Día 27: lista previa al lanzamiento.**
```
□ Respaldos automáticos configurados y probados
□ Captura de errores funcionando
□ Cobros probados con una transacción real
□ Correos llegando (revisa que no caigan en spam)
□ HTTPS y dominio correctos
□ Aviso de privacidad y términos publicados
□ Formulario o correo de contacto funcionando
□ Analítica básica instalada
□ Probado en móvil de verdad, no solo en el simulador
```

**Días 28-30: lanzar.**
A tu lista de espera, a las comunidades donde validaste, a los contactos de tus entrevistas. No esperes a que esté perfecto: no lo va a estar.

---

### Los errores que rompen el plazo

**1. Cambiar el alcance a mitad.** La causa número uno. Congela el alcance el día 7 y anota todo lo demás en una lista para después.

**2. Perfeccionismo en el diseño.** Presentable basta. Nadie canceló por un espaciado imperfecto.

**3. Construir para escala que no tienes.** No necesitas arquitectura para un millón de usuarios cuando tienes cero.

**4. Desplegar al final.** Despliega el día 5 y todos los días después.

**5. No hablar con usuarios hasta el día 22.** Enséñalo desde la semana 2, aunque esté a medias.

**6. Automatizar procesos internos.** Hazlo a mano hasta que duela de verdad.

---

### Qué hacer después del día 30

**No construyas nada nuevo durante dos semanas.** Habla con cada usuario que se registró. Pregunta qué esperaban, qué encontraron, qué falta.

Esa conversación vale más que cualquier funcionalidad que se te ocurra sin ella.

**Y si nadie se registró:** esa también es una respuesta, y llegó en 30 días en lugar de en 8 meses. Ese es el punto del MVP.

---

### Preguntas frecuentes

**¿30 días es realista para cualquier producto?**
Para un SaaS web con un flujo principal, sí, trabajando enfocado. Para productos con requisitos regulatorios fuertes, hardware o integraciones complejas, no. Ajusta el plazo pero mantén la disciplina de alcance.

**¿Puedo hacerlo con equipo de una persona?**
Sí, y el plazo asume aproximadamente eso. Con dos personas puede ir más rápido si el alcance está bien dividido; con cinco, la coordinación consume la ganancia.

**¿Y si mi MVP necesita IA?**
Empieza con una API existente y el prompt más simple que funcione. No entrenes nada. No montes RAG hasta que sepas que el producto interesa.
