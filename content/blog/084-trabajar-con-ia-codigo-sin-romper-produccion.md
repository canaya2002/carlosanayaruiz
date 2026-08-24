---
n: 84
title: "Cómo trabajar con IA de código sin romper producción"
slug: "trabajar-con-ia-codigo-sin-romper-produccion"
description: "Reglas de trabajo con agentes de código: ramas, permisos, revisión obligatoria y los tipos de tarea donde nunca conviene dejar suelta a la IA."
category: "Desarrollo"
keyword: "programar con ia buenas prácticas"
tipo: "satelite"
tags: ["ia para programar","buenas prácticas","agentes de código","calidad"]
---


**Un agente de código puede modificar decenas de archivos, ejecutar comandos y hacer commits. Esa capacidad es lo que lo hace útil y lo que lo hace peligroso.** La diferencia entre acelerar y acumular deuda técnica está en el proceso, no en el modelo.

---

### Las cinco reglas no negociables

**1. Rama por tarea. Nunca directo a main.**

Es la regla más importante y la más fácil de saltarse "porque es un cambio pequeño". Protección de rama activada, incluso si trabajas solo.

**2. Revisar el diff, no la explicación.**

La descripción de lo que hizo puede sonar impecable y el código estar mal. Lee el cambio línea por línea. Si el diff es demasiado grande para revisarlo, la tarea era demasiado grande.

**3. Verificaciones automáticas antes de considerar terminada una tarea.**

Tipos, linter y pruebas. Que el agente las ejecute como parte del flujo. Código que compila y pasa pruebas es el piso mínimo, no el techo.

**4. Aprobación explícita para operaciones destructivas.**

Migraciones, borrado de archivos, cambios de configuración de infraestructura, cualquier cosa que toque producción. Sin excepciones.

**5. Tareas acotadas.**

"Refactoriza el módulo de autenticación" produce resultados impredecibles. "Extrae la validación de sesión de estas tres rutas a una función en lib/sesion.ts" es una tarea.

---

### Dónde la IA de código es excelente

- **Código repetitivo con patrón claro.** Endpoints CRUD, formularios, adaptadores.
- **Escribir pruebas para código existente.** Es tediosos para humanos y la IA lo hace bien.
- **Migraciones mecánicas.** Cambiar de biblioteca, actualizar una API, renombrar en todo el proyecto.
- **Explorar código desconocido.** "¿Cómo funciona el flujo de autenticación aquí?" en un repositorio que no conoces.
- **Depuración con contexto.** Pegar un error y dejar que rastree la causa.
- **Documentación.** Comentarios, README, documentación de API.

---

### Dónde NO conviene dejarla suelta

**Decisiones de arquitectura.** Puede proponer opciones; la decisión es tuya. Un modelo optimiza el problema que le planteas, no el negocio que tienes detrás.

**Código de seguridad.** Autenticación, autorización, criptografía, manejo de secretos. Puede escribirlo, pero la revisión aquí es más estricta y no delegable.

**Reglas de negocio complejas.** El modelo no sabe por qué esa comisión se calcula así, ni qué caso extremo te costó dinero el año pasado.

**Optimización de rendimiento sin datos.** Puede optimizar lo que no era el cuello de botella. Mide primero.

**Migraciones de base de datos.** Genera el SQL, tú lo lees. Un `DROP COLUMN` generado sin querer no se deshace.

**Código que toca dinero.** Cobros, cálculos de saldo, conciliación. Revisión doble.

---

### El archivo de contexto: la inversión con mejor retorno

Un documento en la raíz del repositorio que el agente lee al inicio de cada sesión. Es la diferencia entre una herramienta que adivina tus convenciones y una que las conoce.

Debe contener:

- **Stack y versiones.** Qué se usa y qué no.
- **Comandos.** Cómo se compila, se prueba, se verifica.
- **Convenciones.** Estilo de commits, estructura de carpetas, patrones a seguir.
- **Reglas duras.** Lo que nunca se hace, en negativo y explícito.
- **Contexto de dominio.** Por qué existen las decisiones raras.

**Cómo construirlo:** empieza corto. Cada vez que corrijas lo mismo dos veces, esa corrección se vuelve una línea del documento. Crece por uso, no por planeación.

---

### El anti-patrón principal: aceptar sin entender

La forma más rápida de terminar con una base de código que nadie comprende es aceptar cambios que funcionan sin entender por qué.

**Síntomas de que estás cayendo:**
- No podrías explicar qué hace un archivo que "escribiste" la semana pasada
- Cuando algo falla, tu primera reacción es pedirle al agente que lo arregle, sin mirar
- Los pull requests son de 800 líneas
- Nadie ha leído el código de un módulo completo

**El antídoto:** si no entiendes un cambio, no lo fusiones. Pide que lo explique, o divídelo en partes que sí puedas revisar.

**Esto importa especialmente trabajando solo.** No tienes a nadie que note que la base de código se está volviendo incomprensible.

---

### Permisos: dónde poner la línea

**Sin aprobación:** leer archivos, editar archivos dentro del proyecto, comandos de solo lectura.

**Con aprobación:** instalar dependencias, hacer push, ejecutar migraciones, desplegar, cualquier comando que toque servicios externos.

**El modo sin aprobaciones** existe y acelera mucho. Úsalo solo donde el peor caso sea aceptable: rama desechable, contenedor aislado, proyecto experimental. En un repositorio con credenciales de producción activas, no.

---

### Lo que cambia en tu trabajo

Menos tiempo escribiendo, más tiempo en:

- **Definir bien el problema.** La calidad de la tarea determina la calidad del resultado.
- **Revisar.** Es ahora la habilidad crítica.
- **Diseñar la arquitectura.** Lo que el modelo no puede decidir por ti.
- **Entender el dominio.** Lo que ninguna herramienta sabe.

La habilidad que sube de valor no es escribir código: es saber si el código que tienes enfrente es correcto para el problema que tienes.

---

### Preguntas frecuentes

**¿Puedo usarlo en código propietario de un cliente?**
Revisa el contrato con tu cliente y los términos del proveedor de la herramienta. Muchos contratos de consultoría tienen cláusulas sobre a quién se puede exponer el código. Resuélvelo antes.

**¿Cómo evito que la calidad se degrade con el tiempo?**
Pruebas automatizadas, revisión real de cada diff, y una auditoría periódica de módulos que nadie ha leído completo.

**¿Es más rápido de verdad?**
En tareas repetitivas y exploración, mucho. En decisiones de diseño, no. La ganancia neta es real pero menor de lo que la gente reporta, porque el tiempo de revisión es tiempo.
