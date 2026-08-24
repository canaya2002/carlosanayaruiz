---
n: 58
title: "Vercel vs AWS vs Railway: dónde desplegar tu producto"
slug: "vercel-vs-aws-vs-railway"
description: "Vercel, AWS y Railway comparados por costo real a distintas escalas, control operativo, velocidad de despliegue y facilidad de migración."
category: "Cloud"
keyword: "vercel vs aws"
tipo: "satelite"
tags: ["vercel","aws","railway","despliegue"]
---


**La pregunta correcta no es cuál es mejor, sino cuánto vale tu tiempo de operación frente a tu factura de infraestructura.** Esa relación cambia según el tamaño de tu equipo y la escala de tu producto, y por eso la respuesta cambia con el tiempo.

---

### La comparación honesta

| Dimensión | Vercel | AWS | Railway |
|---|---|---|---|
| Tiempo hasta el primer despliegue | Minutos | Horas o días | Minutos |
| Curva de aprendizaje | Baja | Alta | Baja |
| Control de la infraestructura | Bajo | Total | Medio |
| Costo a escala pequeña | Bajo | Bajo | Bajo |
| Costo a escala grande | Alto | El más bajo posible | Medio |
| Trabajo operativo requerido | Casi nulo | Alto | Bajo |
| Procesos de larga duración | Limitado | Sin límite | Sí |
| Facilidad de migrar fuera | Media | Alta | Alta |

---

### Vercel: velocidad de entrega

**Dónde gana:**
- Despliegue por rama con vista previa automática. Cada pull request genera una URL funcional. Para equipos que iteran rápido, es transformador.
- Cero configuración de infraestructura.
- Red de distribución global incluida.
- Integración muy afinada con frameworks de frontend modernos.

**Dónde duele:**
- El costo escala con el uso y puede sorprender. Un pico de tráfico sobre rutas dinámicas se traduce en factura.
- Límites de duración en funciones: no es el lugar para procesamiento pesado.
- Poco control sobre la infraestructura subyacente.
- Depuración de problemas de rendimiento con menos visibilidad de la que tendrías en infraestructura propia.

**Para quién:** equipos pequeños y medianos donde la velocidad de entrega es el cuello de botella, con productos mayormente web y cargas que caben en el modelo serverless.

---

### AWS: control y costo a escala

**Dónde gana:**
- Costo por unidad de cómputo, el más bajo posible si sabes optimizar.
- Control total: tipo de instancia, red, almacenamiento, todo.
- Catálogo enorme de servicios gestionados.
- Sin límites artificiales de duración ni de recursos.
- Compromisos de capacidad para reducir el costo de la carga base.

**Dónde duele:**
- La complejidad es real. Necesitas conocimiento de redes, permisos, seguridad y monitoreo.
- El tiempo de configuración inicial es alto.
- Es fácil dejar recursos huérfanos y acumular gasto silencioso.
- Requiere alguien que se ocupe de la operación de forma continua.

**Para quién:** productos con escala significativa, requisitos de infraestructura específicos, o equipos con capacidad operativa. También cuando la factura mensual ya justifica el salario de quien la optimiza.

---

### Railway: el punto medio

**Dónde gana:**
- Despliegue casi tan simple como Vercel, pero con contenedores reales.
- Soporta procesos de larga duración, workers, y servicios que no encajan en serverless.
- Bases de datos y servicios adicionales provisionados en un clic.
- Precio más predecible que el modelo por invocación.

**Dónde duele:**
- Ecosistema más pequeño.
- Menos opciones de configuración fina que en infraestructura propia.
- A escala muy grande, el costo por unidad es mayor que administrar tú mismo.

**Para quién:** productos que necesitan más que funciones serverless pero cuyo equipo no quiere —ni debe— dedicar tiempo a administrar infraestructura.

---

### El cálculo que realmente decide

Compara el **costo total**, no solo la factura:

```
Costo total = Factura de infraestructura
            + (Horas de operación mensual × costo por hora del equipo)
            + Costo de oportunidad de lo que no se construyó
```

Un equipo de tres personas donde una dedica 20 horas mensuales a operar infraestructura está gastando el equivalente a un salario parcial. Si mover eso a una plataforma gestionada sube la factura en 8,000 pesos pero libera esas 20 horas, la decisión es obvia.

**Y al revés:** si tu factura de plataforma gestionada es de 60,000 pesos mensuales y administrarlo tú mismo costaría 20,000 más 30 horas de operación, ahí el cálculo cambia.

**El punto de inflexión típico** ronda cuando la factura mensual de la plataforma gestionada supera lo que costaría la infraestructura equivalente más el tiempo de una persona a tiempo parcial.

---

### La arquitectura híbrida: lo que hago en la práctica

No es una decisión de todo o nada. La combinación que funciona bien:

- **Frontend y aplicación web** en la plataforma con mejor experiencia de despliegue.
- **Trabajo en background y procesos largos** en un servicio de orquestación o en contenedores.
- **Base de datos** en un servicio gestionado especializado.
- **Archivos y multimedia** en almacenamiento de objetos con CDN. Esto solo suele ser el mayor ahorro, porque el ancho de banda de archivos pesados es caro en plataformas de aplicación.
- **Cargas pesadas específicas** donde tengan sentido.

Esta arquitectura te da velocidad donde importa y costo controlado donde el volumen es alto.

---

### Cómo evitar quedarte atrapado

Independientemente de dónde despliegues:

**Mantén la lógica de negocio fuera de las APIs específicas de la plataforma.** Si tu código depende profundamente de funciones propietarias, migrar es una reescritura.

**Contenedoriza lo que puedas.** Un contenedor corre en cualquier lado.

**Base de datos portable.** Postgres estándar corre en todas partes. Una base de datos propietaria no.

**Infraestructura como código.** Aunque uses una plataforma gestionada, documenta la configuración.

**Prueba la migración antes de necesitarla.** Levanta tu aplicación en un entorno alternativo una vez. Descubrirás los amarres reales.

---

### Preguntas frecuentes

**¿Cuál elijo si estoy empezando?**
La que te permita lanzar más rápido. A escala pequeña la diferencia de costo es de cientos de pesos; la diferencia de velocidad puede ser de semanas. Optimizas después, cuando tengas usuarios.

**¿Cuándo debo migrar?**
Cuando tengas un problema medido: costo desproporcionado, límite técnico que te bloquea, o requisito de cumplimiento. No por preferencia arquitectónica.

**¿Puedo usar varias a la vez?**
Sí, y es lo más común en productos maduros. Cada carga donde mejor encaje.
