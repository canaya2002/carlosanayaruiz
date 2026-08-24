---
n: 93
title: "Computación cuántica y criptografía post-cuántica"
slug: "criptografia-post-cuantica"
description: "Por qué la computación cuántica amenaza el cifrado actual, qué es 'harvest now, decrypt later' y cuándo migrar."
category: "Ciberseguridad"
keyword: "criptografía post cuántica"
tipo: "satelite"
tags: ["criptografía","computación cuántica","seguridad","futuro"]
---


**Una computadora cuántica suficientemente grande podría romper los algoritmos de clave pública que hoy protegen prácticamente toda la comunicación en internet.** Esa computadora no existe todavía. Pero la amenaza es operativa hoy, por una razón que se llama "recolectar ahora, descifrar después".

---

### Qué se rompe y qué no

**En riesgo — criptografía de clave pública.**

Los algoritmos que sustentan el intercambio de claves y las firmas digitales basan su seguridad en problemas matemáticos —factorización de números grandes, logaritmos discretos— que una computadora cuántica con suficientes qubits estables podría resolver de forma eficiente.

Esto incluye lo que protege el establecimiento de conexiones seguras, los certificados digitales, las firmas electrónicas y buena parte de la infraestructura de identidad.

**Menos afectada — criptografía simétrica.**

Los algoritmos de cifrado simétrico y las funciones hash se ven afectados, pero de forma manejable: en términos generales, la respuesta es aumentar el tamaño de clave. Un cifrado simétrico con clave suficientemente larga sigue considerándose robusto.

**Traducción práctica:** el problema principal está en cómo se establecen las claves y cómo se firman las identidades, no tanto en cómo se cifran los datos una vez que hay clave compartida.

---

### "Recolectar ahora, descifrar después"

Este es el punto que hace la amenaza actual y no futura.

Un actor con recursos puede capturar hoy tráfico cifrado y almacenarlo. No puede leerlo ahora. Pero si en diez o quince años dispone de capacidad cuántica suficiente, podrá descifrar todo lo que guardó.

**La pregunta que debes hacerte:** ¿qué información tuya que se transmite hoy seguirá siendo sensible dentro de quince años?

Ejemplos donde la respuesta es sí:
- Expedientes médicos
- Información de identidad y biométrica
- Secretos industriales y propiedad intelectual
- Comunicaciones diplomáticas o legales
- Datos financieros estructurales
- Información que pueda usarse para chantaje

Ejemplos donde probablemente no:
- El estado de un pedido de comida
- Datos de sesión temporales
- Precios de productos

**Si tienes datos de la primera categoría, tu horizonte de migración es más corto de lo que parece.**

---

### El estado de la estandarización

Los organismos internacionales de estandarización han publicado algoritmos resistentes a computación cuántica tras procesos de evaluación de varios años. Existen estándares para intercambio de claves y para firmas digitales.

**Consulta el estado actual** en las publicaciones de los organismos correspondientes: este es un terreno donde la información se actualiza y donde hay algoritmos que fueron candidatos y quedaron fuera tras encontrárseles debilidades.

**Un punto importante:** parte del proceso de estandarización incluyó descartar candidatos que resultaron vulnerables a ataques con computación clásica. Esto es señal de que el proceso funciona, y también recordatorio de que la criptografía nueva necesita tiempo de exposición antes de considerarse madura.

---

### La estrategia de migración

**Enfoque híbrido.** El consenso actual en la práctica es combinar un algoritmo clásico con uno post-cuántico. Si el nuevo resulta tener una debilidad no descubierta, el clásico sigue protegiendo. Si llega la capacidad cuántica, el nuevo protege.

Varios navegadores, proveedores de nube y bibliotecas de red ya están desplegando esquemas híbridos en el establecimiento de conexiones seguras.

**Agilidad criptográfica.** Es el concepto central que deberías adoptar aunque no migres nada todavía: diseña tus sistemas para poder cambiar de algoritmo sin reescribirlos.

En la práctica significa:
- No incrustar el algoritmo en la lógica de negocio
- Centralizar las operaciones criptográficas en una capa
- Versionar los datos cifrados con el algoritmo usado
- Poder rotar sin migración masiva

**Esto vale la pena independientemente de la computación cuántica.** Los algoritmos se debilitan con el tiempo por razones clásicas también.

---

### Qué hacer ahora, en concreto

**Paso 1 — Inventario criptográfico.**
Qué algoritmos usas, dónde, y para qué. La mayoría de las organizaciones no lo tiene y es el requisito de todo lo demás.

**Paso 2 — Clasifica por horizonte de sensibilidad.**
Qué datos siguen siendo sensibles en 5, 10 y 20 años. Eso determina tu urgencia.

**Paso 3 — Habla con tus proveedores.**
Tu proveedor de nube, tu CDN, tu proveedor de certificados. Pregunta por su calendario de soporte para algoritmos post-cuánticos. Buena parte de tu migración depende de ellos, no de ti.

**Paso 4 — Actualiza bibliotecas.**
Las implementaciones de referencia están apareciendo en las bibliotecas criptográficas principales. Mantenerte actualizado te pone en posición de adoptar cuando toque.

**Paso 5 — Prioriza los datos de larga vida.**
Si tienes información que debe protegerse durante décadas, empieza por ahí.

---

### Lo que NO debes hacer

**Implementar criptografía tú mismo.** Nunca, y menos con algoritmos nuevos. Usa bibliotecas establecidas y auditadas.

**Migrar todo de golpe.** Los algoritmos post-cuánticos tienen características distintas: tamaños de clave y firma mayores, distinto rendimiento. Eso tiene implicaciones en protocolos, almacenamiento y ancho de banda que hay que evaluar.

**Pánico.** No hay evidencia pública de una computadora cuántica capaz de romper el cifrado actual, y construirla es un desafío de ingeniería enorme. La migración es un proyecto planificado, no una emergencia.

**Ignorarlo.** El otro extremo. Las organizaciones con datos de larga vida que no empiecen el inventario ahora se van a encontrar con una migración muy difícil bajo presión.

---

### Preguntas frecuentes

**¿Cuándo existirá una computadora cuántica capaz de esto?**
Nadie lo sabe con certeza. Las estimaciones públicas varían enormemente. Lo relevante es que el horizonte de sensibilidad de tus datos puede ser más largo que cualquiera de esas estimaciones.

**¿Esto afecta a las criptomonedas?**
Las firmas digitales que las sustentan usan algoritmos afectados. Es un tema activo de discusión en esos ecosistemas.

**¿Mi empresa pequeña debe preocuparse?**
Tu preocupación práctica es que tus proveedores lo hagan. Si no manejas datos con horizonte de sensibilidad de décadas, tu papel es mantener tus sistemas actualizados y tener agilidad criptográfica.
