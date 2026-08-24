---
n: 80
title: "Derechos ARCO: cómo atender solicitudes de datos"
slug: "derechos-arco-solicitudes-datos"
description: "Qué son los derechos ARCO, los plazos legales para responder y cómo montar un proceso técnico que atienda solicitudes sin caos."
category: "Cumplimiento"
keyword: "derechos arco"
tipo: "satelite"
tags: ["derechos arco","lfpdppp","privacidad","procesos"]
---


**ARCO son los derechos de Acceso, Rectificación, Cancelación y Oposición que toda persona tiene sobre sus datos personales.** Son ejercitables ante cualquier organización que trate sus datos, y atenderlos en plazo es una obligación, no una cortesía.

La primera solicitud suele llegar sin aviso y encontrar a la empresa sin proceso. Este artículo es para que no te pase.

**Nota:** verifica la normativa y los plazos vigentes al implementar tu proceso, ya que el marco mexicano ha sido objeto de reformas. Este artículo es informativo y no constituye asesoría legal.

---

### Qué es cada derecho

**Acceso.** Conocer qué datos personales tienes de la persona, para qué los usas, y las condiciones del tratamiento.

**Rectificación.** Corregir datos inexactos o incompletos.

**Cancelación.** Que se supriman sus datos. **No es absoluto:** hay supuestos donde no procede, como cuando existe una obligación legal de conservación, cuando se requieren para un procedimiento judicial, o cuando son necesarios para cumplir obligaciones de una relación jurídica vigente.

**Oposición.** Oponerse al tratamiento para finalidades específicas cuando exista causa legítima.

---

### El proceso completo

#### Paso 1 — Recepción

El aviso de privacidad debe indicar el medio para recibir solicitudes: típicamente un correo electrónico o un formulario.

**Recomendación práctica:** un buzón dedicado, no el correo general de contacto. Y con alertas: el plazo empieza a correr desde la recepción, no desde que alguien lo lee.

**Qué debe contener una solicitud:**
- Nombre del titular y medio para comunicarle la respuesta
- Documentos que acrediten su identidad o representación
- Descripción clara de los datos sobre los que ejerce el derecho
- Cualquier elemento que facilite la localización de los datos

Si falta algo, puedes requerir que subsane, y ese requerimiento tiene su propio plazo.

#### Paso 2 — Verificación de identidad

**Es obligatoria y es crítica.** Entregar los datos de una persona a quien se hace pasar por ella es una brecha de seguridad, no un cumplimiento.

**Cómo verificar de forma proporcional:**
- Si la solicitud llega desde el correo registrado en la cuenta, es un indicio fuerte
- Solicitud de identificación oficial, tratada con cuidado y suprimida después de la verificación
- Verificación por un segundo canal
- Si tiene cuenta activa: que la solicitud se ejerza desde dentro de la sesión autenticada

**Cuidado:** el proceso de verificación no puede ser tan gravoso que impida en la práctica el ejercicio del derecho. Es un equilibrio.

#### Paso 3 — Localización de los datos

Aquí es donde las empresas descubren que no tienen inventario.

**Necesitas saber, para cada persona, dónde están sus datos:**
- Base de datos principal
- Sistemas secundarios: CRM, facturación, soporte
- Herramientas de terceros: correo, análisis, publicidad
- Respaldos
- Registros de sistema
- Documentos y archivos
- Hojas de cálculo de algún departamento

**Sin un inventario de tratamientos, esta fase es imposible de hacer bien.** Es la razón principal por la que conviene tenerlo mucho antes de la primera solicitud.

#### Paso 4 — Evaluación de procedencia

No toda solicitud procede en su totalidad.

**Casos donde la cancelación puede no proceder:**
- Existe obligación legal de conservar los datos (fiscal, laboral, sectorial)
- Son necesarios para cumplir una relación jurídica vigente
- Se requieren para un procedimiento judicial o administrativo
- Son necesarios para proteger intereses jurídicamente tutelados

**Si no procede, debes responder explicando el fundamento.** No responder no es una opción.

#### Paso 5 — Respuesta y ejecución

**Responde dentro del plazo legal**, y si procede, ejecuta dentro del plazo correspondiente.

**La respuesta debe:**
- Ser clara sobre qué se resolvió y por qué
- Entregarse por el medio que solicitó el titular
- Documentarse íntegramente

#### Paso 6 — Registro

Guarda de cada solicitud: fecha de recepción, identidad verificada y cómo, derecho ejercido, evaluación, resolución, fecha de respuesta y evidencia de ejecución.

Este registro es tu evidencia de cumplimiento.

---

### La implementación técnica

**Para acceso:**

Necesitas poder generar un reporte con todos los datos de una persona. Constrúyelo como función, no como consulta manual:

```ts
export async function exportarDatosUsuario(usuarioId: string) {
  const [perfil, pedidos, tickets, consentimientos, actividad] =
    await Promise.all([
      db.usuario.findUnique({ where: { id: usuarioId } }),
      db.pedido.findMany({ where: { usuarioId } }),
      db.ticket.findMany({ where: { usuarioId } }),
      db.consentimiento.findMany({ where: { usuarioId } }),
      db.registroActividad.findMany({ where: { usuarioId } }),
    ])

  return { perfil, pedidos, tickets, consentimientos, actividad }
}
```

**Y no olvides los sistemas externos.** Si tu CRM y tu herramienta de soporte tienen datos, deben incluirse.

**Para cancelación:**

La supresión real es más compleja de lo que parece.

```ts
export async function suprimirDatosUsuario(usuarioId: string) {
  // 1. Verificar que no haya obligación de conservación
  const obligaciones = await verificarObligacionesLegales(usuarioId)
  if (obligaciones.length > 0) {
    return { procede: false, motivos: obligaciones }
  }

  await db.$transaction([
    // 2. Anonimizar lo que debe conservarse por integridad contable
    db.pedido.updateMany({
      where: { usuarioId },
      data: { usuarioId: null, nombreComprador: '[SUPRIMIDO]', email: null },
    }),
    // 3. Suprimir lo que sí puede eliminarse
    db.ticket.deleteMany({ where: { usuarioId } }),
    db.usuario.delete({ where: { id: usuarioId } }),
  ])

  // 4. Propagar a sistemas externos
  await Promise.all([
    crm.eliminarContacto(usuarioId),
    correoMarketing.eliminarSuscriptor(usuarioId),
    almacenamiento.eliminarArchivos(`usuarios/${usuarioId}/`),
  ])

  // 5. Registrar la ejecución
  await db.registroARCO.create({ data: { usuarioId, tipo: 'cancelacion' } })
}
```

**Puntos que se olvidan:**
- **Archivos en almacenamiento de objetos.** No están en la base de datos.
- **Registros de sistema.** Si contienen datos personales, entran en el alcance.
- **Respaldos.** No puedes editarlos, pero debes tener una política: los datos suprimidos no se restauran, y el respaldo caduca según tu política de retención. Documenta ese enfoque.
- **Cachés.** Invalida.
- **Herramientas de terceros.** Cada una necesita su llamada de eliminación.

---

### Errores frecuentes

**1. No tener buzón dedicado.** La solicitud llega al correo general, nadie la ve, se vence el plazo.

**2. Verificación de identidad inexistente o excesiva.** Ambos extremos son problema.

**3. Suprimir sin evaluar obligaciones legales.** Borrar una factura que debes conservar por obligación fiscal te crea un problema distinto.

**4. Olvidar los sistemas externos.** El dato sigue en el CRM y en la herramienta de correo.

**5. No documentar.** Sin registro, no puedes demostrar que cumpliste.

**6. Construir el proceso al recibir la primera solicitud.** Con el reloj corriendo.

---

### Preguntas frecuentes

**¿Puedo cobrar por atender una solicitud?**
El acceso a la información generalmente es gratuito, aunque pueden cubrirse costos de reproducción o envío en ciertos supuestos. Verifica el marco vigente.

**¿Qué pasa si no respondo?**
El titular puede acudir ante la autoridad, lo que puede derivar en un procedimiento de protección de derechos y, en su caso, sanciones.

**¿Debo tener un formulario automatizado?**
No es obligatorio, pero con volumen alto es la única forma de cumplir plazos de forma consistente. Con volumen bajo, un proceso manual bien documentado es suficiente.
