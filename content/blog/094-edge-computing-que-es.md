---
n: 94
title: "Edge computing: qué es y cuándo te conviene"
slug: "edge-computing-que-es"
description: "Edge computing explicado con casos concretos: qué mover al edge, qué dejar en el origen y cuánta latencia ganas de verdad."
category: "Cloud"
keyword: "edge computing"
tipo: "satelite"
tags: ["edge computing","latencia","cdn","arquitectura"]
---


**Edge computing significa ejecutar código en servidores distribuidos geográficamente, cerca del usuario, en lugar de en una región central.** El objetivo es reducir latencia y descargar trabajo del origen.

Y como toda arquitectura distribuida, resuelve problemas concretos y crea otros. Este artículo es sobre cuáles son ambos.

---

### El espectro, del más simple al más complejo

**Nivel 1 — CDN estático.**
Archivos servidos desde un punto cercano al usuario. Lleva décadas funcionando y sigue siendo el mayor ahorro de latencia por unidad de esfuerzo.

**Nivel 2 — Caché de páginas en el borde.**
Páginas HTML completas cacheadas y servidas desde el borde, con invalidación bajo demanda.

**Nivel 3 — Funciones en el borde.**
Código ejecutándose en el punto de presencia. Enrutamiento, reescritura, personalización ligera, autenticación de sesión.

**Nivel 4 — Datos en el borde.**
Almacenamiento clave-valor o base de datos replicada globalmente. Aquí la complejidad crece mucho.

**Recomendación práctica:** la mayoría de los productos obtienen el 80% del beneficio en los niveles 1 y 2. Los niveles 3 y 4 se justifican con casos concretos.

---

### Qué sí conviene mover al borde

**Enrutamiento y redirecciones.**
Decidir a dónde va una petición según país, idioma, dispositivo o cookie. Ejecutar esto en el origen implica un viaje de ida y vuelta completo para algo trivial.

**Pruebas A/B y activación de funcionalidades.**
Asignar la variante en el borde evita el parpadeo de contenido que ocurre cuando se decide en el cliente.

**Autenticación de sesión (verificación ligera).**
Verificar que un token es válido antes de enrutar. **Con matices:** la verificación real de permisos va en el acceso a datos, no aquí.

**Personalización basada en geolocalización.**
Moneda, idioma, disponibilidad de servicio por región.

**Limitación de tasa y filtrado.**
Bloquear tráfico abusivo antes de que llegue a tu origen es más barato y más efectivo.

**Transformación de imágenes.**
Redimensionar y convertir formato cerca del usuario.

---

### Qué NO conviene mover al borde

**Lógica de negocio compleja.**
Depurar código distribuido en decenas de ubicaciones es notablemente más difícil que depurar un origen.

**Cualquier cosa que necesite consultar tu base de datos central.**
Si tu función en el borde tiene que llamar a una base de datos en una sola región, la latencia total puede ser **peor** que ejecutar todo en esa región. Estás añadiendo un salto.

Este es el error más común y el más contraintuitivo.

**Operaciones que requieren consistencia fuerte.**
Transacciones, contadores, inventario, reservas. La consistencia global es un problema difícil.

**Procesos largos.**
Los entornos de ejecución en el borde tienen límites estrictos de tiempo y memoria.

**Trabajo intensivo en cómputo.**
No es el lugar.

---

### El problema de los datos

Es el que define hasta dónde puedes llevar esta arquitectura.

**Si tus datos están en una región, tu lógica en el borde no gana nada** salvo que pueda responder sin consultarlos.

**Opciones para resolverlo:**

**Almacenamiento clave-valor replicado globalmente.** Excelente para datos que cambian poco y se leen mucho: configuración, banderas de funcionalidad, contenido publicado. Consistencia eventual.

**Réplicas de lectura regionales.** Lecturas cerca del usuario, escrituras a la región primaria. Buena solución para cargas con mucha más lectura que escritura.

**Bases de datos distribuidas globalmente.** Existen y funcionan, con trade-offs importantes en consistencia, latencia de escritura y costo.

**Cache con tiempo de vida.** La opción más simple: cachea la respuesta en el borde durante un periodo y acepta que puede estar ligeramente desactualizada.

**Regla honesta:** si tu producto requiere consistencia fuerte en cada operación, el edge no va a resolver tu latencia. Optimiza el origen y usa el borde solo para lo cacheable.

---

### Cuánta latencia ganas realmente

Sé escéptico con las cifras de marketing.

**Lo que sí ganas:** la latencia de red entre el usuario y el punto de presencia, en lugar de entre el usuario y tu región. Puede ser una diferencia importante para usuarios geográficamente lejanos.

**Lo que no cambia:** si tu página hace ocho peticiones secuenciales, sigues multiplicando la latencia por ocho, esté donde esté el servidor.

**La optimización con mayor impacto casi nunca es geográfica:** es reducir el número de peticiones, el tamaño de la carga y el trabajo del navegador.

**Antes de mover nada al borde, verifica que hayas hecho:**
- CDN configurado con caché agresivo en estáticos
- Compresión activada
- Reducción de peticiones secuenciales
- Imágenes optimizadas
- JavaScript reducido

He visto sitios "lentos por la región" que en realidad cargaban 4 MB de scripts.

---

### Los costos que se olvidan

**Depuración distribuida.** Un error que ocurre solo en el punto de presencia de un país concreto es difícil de reproducir.

**Observabilidad.** Necesitas trazas que abarquen borde y origen. Sin eso, no sabes dónde se fue el tiempo.

**Consistencia de despliegue.** La propagación de una nueva versión a todos los puntos no es instantánea. Durante unos minutos puede haber versiones distintas sirviendo.

**Límites del entorno.** Los tiempos de ejecución en el borde suelen tener APIs restringidas. Bibliotecas que funcionan en el servidor pueden no funcionar ahí.

**Costo.** Se factura por invocación y por ejecución. Un uso descuidado puede salir caro.

---

### Preguntas frecuentes

**¿Edge reemplaza a mi servidor de origen?**
No. Es una capa delante. Sigues necesitando origen para lógica compleja y datos.

**¿Vale la pena si mis usuarios están concentrados en un país?**
Menos. La ganancia principal del borde es geográfica. Con usuarios concentrados cerca de tu región, la CDN para estáticos ya te da casi todo el beneficio.

**¿Cómo pruebo código del borde en local?**
Los proveedores ofrecen emuladores locales, pero no reproducen todas las condiciones. Prueba en un entorno de vista previa real antes de producción.
