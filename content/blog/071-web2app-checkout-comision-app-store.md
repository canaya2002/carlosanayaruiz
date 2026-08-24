---
n: 71
title: "Web2App: cómo cobrar sin la comisión de la App Store"
slug: "web2app-checkout-comision-app-store"
description: "Cómo funciona el flujo web2app para cobrar fuera de la tienda, qué permiten hoy las reglas y cómo medir la conversión."
category: "SaaS"
keyword: "web2app checkout"
tipo: "satelite"
tags: ["web2app","monetización","app store","conversión"]
---


**Web2app es un embudo donde el usuario descubre tu producto en la web, se suscribe en tu propio sitio con tu procesador de pagos, y después descarga la app ya con su cuenta activa.** La comisión de la tienda no aplica porque la transacción nunca ocurre dentro de la app.

Es legítimo. Y también es un terreno con reglas que cambian y que conviene entender bien antes de invertir.

---

### El marco de reglas: qué está permitido

Este es el punto donde más desinformación circula. Los puntos estables:

**1. Vender en tu propio sitio web siempre ha estado permitido.** Nadie te impide tener una web donde la gente se suscriba con tu procesador de pagos.

**2. Lo que ha sido restringido históricamente es promocionar esa alternativa desde dentro de la app.** Enlaces, botones o menciones dirigiendo al pago externo.

**3. Ese punto está en evolución.** Diversas decisiones regulatorias y judiciales en distintos mercados han obligado a las tiendas a permitir enlaces externos en determinadas condiciones, y las reglas específicas varían por región y siguen cambiando.

**4. Las reglas de "reader apps" y ciertas categorías tienen tratamiento particular.**

**Recomendación práctica:** las reglas de las tiendas cambian y difieren por país. **Verifica las directrices vigentes de cada tienda para tu categoría y tu mercado antes de diseñar tu embudo**, y revísalas periódicamente. No construyas una estrategia entera sobre una interpretación que puede quedar obsoleta.

**Lo que es seguro en cualquier escenario:** adquirir usuarios fuera de la app, convertirlos en tu web, y que la app sea el lugar donde consumen el producto ya pagado.

---

### El embudo, paso por paso

```
[Anuncio / contenido / búsqueda]
        ↓
[Página de destino móvil optimizada]
        ↓
[Cuestionario o demostración de valor]   ← el paso que más convierte
        ↓
[Muro de pago web]
        ↓
[Pago con tu procesador]
        ↓
[Creación de cuenta + envío de credenciales]
        ↓
[Descarga de la app]
        ↓
[Inicio de sesión: cuenta ya activa]
```

**El punto de fuga crítico es el último tramo.** Entre pagar y tener la app funcionando hay tres pasos donde se pierde gente: descargar, encontrar cómo iniciar sesión, y recordar la contraseña.

---

### Cómo reducir la fuga post-pago

**1. Enlace directo tras el pago.** Un botón que abre directamente la tienda con el enlace de tu app, no una instrucción de "busca nuestra app".

**2. Enlaces diferidos.** Tecnologías que permiten que, tras instalar, la app sepa de dónde vino el usuario y complete el inicio de sesión automáticamente. Es la solución técnica correcta al problema.

**3. Enlace mágico por correo.** El usuario recibe un correo con un enlace que, al abrirlo desde el móvil con la app instalada, inicia sesión sin contraseña. Elimina el punto de fricción más grande.

**4. Código de acceso corto.** Un código de seis dígitos que se muestra tras el pago y se introduce en la app. Funciona bien y es fácil de implementar.

**5. Recordatorios.** Si a las 24 horas no ha iniciado sesión en la app, un correo. Si a las 72 horas tampoco, otro. Recuperas un porcentaje relevante.

---

### El cuestionario: la pieza que más convierte

Muchos productos de consumo con embudo web2app usan un cuestionario de entre 8 y 15 preguntas antes del muro de pago. Funciona por razones concretas:

- **Personalización percibida.** El resultado se siente hecho para el usuario.
- **Compromiso progresivo.** Quien invirtió dos minutos respondiendo está más dispuesto a pagar.
- **Segmentación.** Puedes ajustar la oferta según las respuestas.
- **Datos.** Aprendes sobre tu audiencia desde antes de que sea cliente.

**Cómo hacerlo bien:**
- Preguntas fáciles y visuales al principio, para generar impulso
- Barra de progreso visible
- El resultado debe sentirse específico, no genérico
- Máximo 15 preguntas; más allá, la fuga se dispara

---

### La economía: haz el cálculo completo

Web2app no es automáticamente mejor. Compara:

**Vía tienda:**
```
Ingreso neto = Precio − Comisión de la tienda
Costo de adquisición: puede ser menor (descubrimiento orgánico en la tienda)
Fricción de compra: mínima (pago con un toque)
```

**Vía web2app:**
```
Ingreso neto = Precio − Comisión del procesador − Costo de la pasarela
Costo de adquisición: mayor (tienes que pagar por el tráfico)
Fricción de compra: mayor (formulario, tarjeta, descarga posterior)
Costo adicional: desarrollo y mantenimiento del embudo
```

**La pregunta correcta:** ¿la comisión que ahorras compensa la conversión que pierdes por fricción más el costo de adquirir el tráfico?

En productos con precio alto y buen margen, normalmente sí. En productos de precio bajo donde el descubrimiento orgánico en la tienda es tu principal canal, muchas veces no.

**Haz el cálculo con tus números reales antes de construir el embudo.**

---

### Qué medir

| Métrica | Por qué importa |
|---|---|
| Conversión de página de destino a inicio del cuestionario | Calidad del tráfico y del mensaje |
| Finalización del cuestionario | Fuga en el compromiso |
| Cuestionario a muro de pago | Calidad de la propuesta |
| Muro de pago a pago completado | Precio y fricción de checkout |
| **Pago a app instalada** | **El tramo más crítico** |
| **App instalada a sesión iniciada** | **El segundo más crítico** |
| Retención a 7 y 30 días | Si el producto entrega lo prometido |
| Tasa de reembolso | Si el embudo prometió de más |

**Esa última métrica es la señal de alarma.** Un embudo optimizado agresivamente puede generar conversión alta y reembolsos altos, lo cual además daña tu relación con el procesador de pagos.

---

### Cumplimiento del checkout

No es solo diseño de conversión. Vender suscripciones en web tiene obligaciones:

- **Precio total claro antes del pago**, incluyendo impuestos aplicables.
- **Renovación automática declarada de forma visible**, con periodicidad e importe. Varios marcos de protección al consumidor exigen consentimiento expreso e informado para la renovación automática.
- **Cancelación fácil.** Debe poder cancelarse con facilidad comparable a la de contratar.
- **Recibo y confirmación** por correo.
- **Aviso de privacidad y términos** accesibles antes de pagar.
- **Patrones oscuros prohibidos.** Casillas premarcadas, cuentas regresivas falsas, botones de cancelar ocultos. Además de ser mala práctica, en varios marcos regulatorios constituyen práctica engañosa.

---

### Preguntas frecuentes

**¿Es esto arriesgado para mi app en las tiendas?**
Vender en tu web no lo es. Lo que puede serlo es cómo lo promocionas dentro de la app. Verifica las reglas vigentes de tu categoría y mercado.

**¿Funciona para B2B?**
Para B2B casi siempre vendes en web de todos modos y la app es un complemento. El embudo web2app tal como se describe aquí es más propio de productos de consumo.

**¿Qué hago si un usuario ya pagó en la tienda y quiere pasar a web?**
No lo fuerces. Mantén ambos caminos y unifica el estado de suscripción en tu backend, sin importar por dónde pagó.
