---
n: 76
title: "Aviso de privacidad: cómo redactarlo correctamente"
slug: "aviso-de-privacidad-como-redactarlo"
description: "Cómo redactar un aviso de privacidad conforme a la ley mexicana: estructura obligatoria, versión integral vs simplificada y errores frecuentes."
category: "Cumplimiento"
keyword: "aviso de privacidad méxico"
tipo: "satelite"
tags: ["aviso de privacidad","lfpdppp","cumplimiento","méxico"]
---


**El aviso de privacidad es el documento por el que informas al titular qué datos tratas, para qué, con quién los compartes y cómo puede ejercer sus derechos.** No es un trámite: es el instrumento central del cumplimiento en materia de datos personales en México.

Y es donde más se copia y pega, lo cual lo vuelve inútil y además delata que no se hizo el análisis.

**Advertencia:** este artículo es informativo. La redacción final de un aviso de privacidad, especialmente en sectores regulados, debe revisarla un abogado especializado. Verifica también la normativa vigente al momento de redactarlo.

---

### Las tres modalidades

**Integral.** El documento completo, con todos los elementos. Vive en una URL permanente y accesible.

**Simplificado.** Versión resumida que se presenta en el momento de la captación, con enlace al integral. Es el que va junto al formulario.

**Corto.** Para espacios muy limitados —un mostrador, una llamada—. Indica la existencia del aviso y dónde consultarlo.

**El error más común:** tener solo el integral en una página escondida en el pie del sitio, sin aviso simplificado en el punto donde realmente se capturan los datos.

---

### Qué debe contener el aviso integral

**1. Identidad y domicilio del responsable.**
Nombre o razón social completa y domicilio. No basta con el nombre comercial.

**2. Los datos personales que se tratan.**
Enumerados por categoría. Si tratas datos sensibles, debe señalarse expresamente.

**3. Las finalidades del tratamiento.**
Separadas en dos grupos, y esto es importante:

- **Finalidades necesarias** para la relación jurídica: prestar el servicio, facturar, dar soporte.
- **Finalidades adicionales** que no son necesarias: mercadotecnia, prospección comercial, elaboración de perfiles.

**El titular debe poder negarse a las adicionales sin perder el servicio.** Debes ofrecerle un mecanismo para hacerlo, y decirlo en el aviso.

**4. Las opciones para limitar el uso o divulgación.**
Cómo puede el titular restringir ciertos usos.

**5. Los medios para ejercer los derechos.**
Correo electrónico o dirección donde se reciben las solicitudes, y qué información debe incluir la solicitud.

**6. Las transferencias de datos.**
A quién se transfieren, con qué finalidad, y si son nacionales o internacionales. Las transferencias que requieren consentimiento deben incluir el mecanismo para negarlo.

**7. El procedimiento para comunicar cambios al aviso.**
Cómo notificarás si actualizas el documento.

**8. Uso de tecnologías de rastreo.**
Cookies, píxeles y similares: qué datos obtienen y cómo deshabilitarlos.

---

### La estructura que uso

```
1. Identidad y domicilio del responsable
2. Qué datos personales tratamos
   2.1 Datos de identificación
   2.2 Datos de contacto
   2.3 Datos de facturación
   2.4 Datos de navegación
   2.5 Datos sensibles (si aplica, expresamente señalados)
3. Finalidades del tratamiento
   3.1 Finalidades necesarias
   3.2 Finalidades adicionales y cómo negarse a ellas
4. Transferencias
   4.1 Nacionales
   4.2 Internacionales
   4.3 Cómo oponerse
5. Ejercicio de derechos: procedimiento y datos de contacto
6. Limitación del uso o divulgación
7. Uso de cookies y tecnologías similares
8. Cambios al aviso
9. Fecha de última actualización
```

**La fecha de última actualización es obligatoria en la práctica** y es lo primero que se revisa para saber si el documento está vivo.

---

### El aviso simplificado

Va en el punto de captación, junto al formulario. Debe incluir, como mínimo:

- Identidad del responsable
- Las finalidades principales
- Mención de si hay transferencias que requieren consentimiento
- **Enlace visible al aviso integral**

```
Los datos que proporciones serán tratados por [Razón Social] para
[finalidad principal] y [finalidad secundaria]. Puedes consultar
el aviso de privacidad integral en [enlace].

□ Acepto el tratamiento de mis datos conforme al aviso de privacidad
□ Acepto recibir comunicaciones comerciales (opcional)
```

**Dos casillas separadas, ninguna premarcada.** La segunda es la finalidad adicional y debe ser genuinamente opcional.

---

### Los errores que hacen inválido un aviso

**1. Copiarlo de otra empresa.** Las finalidades serán las de esa empresa, no las tuyas. Es el error más común y el más evidente.

**2. Finalidades vagas.** "Para fines administrativos y comerciales" no informa nada. Cada finalidad debe ser específica: "para emitir y enviar facturas electrónicas", "para enviar notificaciones sobre el estado de tu pedido".

**3. No separar necesarias de adicionales.** Si mezclas todo, estás condicionando el servicio a que acepte mercadotecnia, lo cual no es válido.

**4. Casillas premarcadas o consentimiento por defecto.** El consentimiento debe ser un acto afirmativo.

**5. No mencionar las transferencias reales.** Si usas un CRM en la nube, un proveedor de correo, un procesador de pagos y un servicio de IA, hay transferencias. Declararlas.

**6. Enlace roto o documento inaccesible.** Suena obvio y ocurre constantemente.

**7. No actualizarlo al cambiar el producto.** Si añades una funcionalidad que trata datos nuevos o para una finalidad nueva, el aviso debe actualizarse **antes** de lanzarla.

---

### Cómo mantenerlo actualizado en la práctica

**Convierte la actualización del aviso en parte de tu proceso de desarrollo.**

Añade a tu lista de verificación previa al lanzamiento de cualquier funcionalidad:

```
□ ¿Esta funcionalidad captura datos personales nuevos?
□ ¿Introduce una finalidad de tratamiento nueva?
□ ¿Añade un proveedor que tratará datos?
□ Si alguna es sí → actualizar aviso ANTES de lanzar
```

Sin esto, el aviso se desactualiza en tres meses y nadie se entera hasta que hay una solicitud o una revisión.

**Versiona el aviso.** Guarda cada versión con su fecha. Si necesitas demostrar qué aceptó un usuario en una fecha concreta, necesitas ese histórico.

---

### Preguntas frecuentes

**¿Necesito aviso si solo tengo un formulario de contacto?**
Sí. Nombre y correo son datos personales.

**¿Tiene que estar en español?**
Debe estar en el idioma que el titular comprenda. Para titulares en México, español. Si tienes usuarios en otros idiomas, ofrécelo también en esos.

**¿Puedo tener un solo aviso para toda la empresa?**
Puedes, si cubre todas las finalidades de todos tus tratamientos. En organizaciones con líneas de negocio muy distintas, a veces es más claro tener avisos separados.

**¿Y el consentimiento de menores?**
Requiere tratamiento especial y consentimiento de quien ejerce la patria potestad. Si tu producto puede ser usado por menores, esto necesita análisis específico con asesoría legal.
