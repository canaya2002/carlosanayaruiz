---
n: 63
title: "Kubernetes: ¿de verdad lo necesitas?"
slug: "kubernetes-cuando-usarlo"
description: "Cuándo Kubernetes vale la pena y cuándo es sobreingeniería cara. Criterios de decisión y qué usar si la respuesta es no."
category: "DevOps"
keyword: "kubernetes cuándo usar"
tipo: "satelite"
tags: ["kubernetes","contenedores","arquitectura","devops"]
---


**Kubernetes resuelve problemas reales de orquestación de contenedores a escala. Y la mayoría de los equipos que lo adoptan no tienen esos problemas.** Lo adoptan porque es el estándar de la industria, y terminan pagando una complejidad operativa considerable para ejecutar tres servicios que cabrían en dos máquinas.

Esta es la evaluación honesta.

---

### Qué resuelve realmente

- **Programación de cargas** en un conjunto de máquinas, aprovechando la capacidad.
- **Autorreparación**: si un contenedor muere, se levanta otro.
- **Escalado automático** horizontal según métricas.
- **Despliegues progresivos** con reversión automática.
- **Descubrimiento de servicios** y balanceo interno.
- **Abstracción del proveedor**: la misma definición corre en cualquier nube.

Todos son beneficios reales. La pregunta es si los necesitas y cuánto cuesta obtenerlos.

---

### El costo real

**Complejidad conceptual.** Pods, servicios, ingress, volúmenes persistentes, configuraciones, secretos, políticas de red, cuentas de servicio y control de acceso. Es un sistema operativo distribuido con su propio modelo mental.

**Operación continua.** Actualizaciones del clúster, gestión de nodos, certificados, monitoreo del propio clúster. En un servicio gestionado el proveedor se encarga del plano de control, pero los nodos y las cargas siguen siendo tuyos.

**Depuración más difícil.** Un problema puede estar en el contenedor, en el pod, en el servicio, en el ingress, en la política de red, en el nodo o en el clúster. La superficie de diagnóstico se multiplica.

**Costo de infraestructura.** Un clúster tiene sobrecarga: el plano de control, los nodos con capacidad reservada, los componentes del sistema. Para cargas pequeñas, esa sobrecarga puede ser mayor que las cargas mismas.

**Costo de conocimiento.** Necesitas al menos una persona que lo entienda de verdad. Si esa persona se va, tienes un problema serio.

---

### Los criterios de decisión

**Kubernetes probablemente SÍ, si cumples tres o más:**

- Tienes más de 15-20 servicios distintos en producción.
- Necesitas escalado automático con variabilidad de carga real y significativa.
- Tienes un equipo con capacidad dedicada a plataforma.
- Requieres portabilidad entre nubes por razón concreta, no hipotética.
- Tus cargas son heterogéneas: distintos lenguajes, distintos requisitos de recursos.
- Ya estás pagando el costo de complejidad de otra forma y lo consolidarías.

**Kubernetes probablemente NO, si:**

- Tienes menos de 10 servicios.
- Tu carga es relativamente estable.
- Tu equipo es de menos de 8 personas sin rol dedicado a infraestructura.
- Tu producto es principalmente una aplicación web con base de datos.
- La razón principal para adoptarlo es "es lo que se usa" o "para estar preparados".

**El escenario que más veo:** cinco microservicios que en realidad deberían ser un monolito, corriendo en un clúster que cuesta más de operar que todo lo demás junto.

---

### Las alternativas, por orden de complejidad

**1. Plataforma como servicio.**
Empujas el código, la plataforma lo ejecuta. Sin contenedores que gestionar, sin nodos. Cubre la mayoría de las aplicaciones web y APIs.
*Cuándo: hasta que tengas requisitos que la plataforma no soporte.*

**2. Contenedores gestionados sin clúster.**
Defines una tarea en un contenedor y el servicio la ejecuta sin que tú administres máquinas. Te da contenedores reales, escalado y despliegue, sin el modelo mental de Kubernetes.
*Cuándo: necesitas contenedores y control, no necesitas orquestación compleja.*

**3. Máquinas virtuales con contenedores.**
Dos o tres instancias con Docker Compose detrás de un balanceador. Sorprendentemente viable para muchos productos.
*Cuándo: pocos servicios, carga predecible, equipo cómodo con administración de servidores.*

**4. Serverless.**
Funciones que se ejecutan por evento. Cero administración de infraestructura.
*Cuándo: cargas por evento, tráfico irregular, tolerancia a arranques en frío.*

**5. Kubernetes.**
*Cuándo: cumples los criterios de arriba.*

---

### Si decides adoptarlo, hazlo bien

**Usa un servicio gestionado.** Administrar el plano de control tú mismo solo tiene sentido en casos muy específicos.

**Empieza simple.** Despliegues, servicios, ingress. No metas malla de servicios, operadores personalizados y despliegues progresivos avanzados en el mes uno.

**Define límites y solicitudes de recursos desde el inicio.** Sin ellos, un contenedor con fuga de memoria puede tumbar un nodo entero.

**Todo declarativo y versionado.** Manifiestos en el repositorio, aplicados por pipeline. Nunca `kubectl apply` desde la máquina de alguien.

**Monitorea el clúster, no solo las aplicaciones.** Estado de nodos, presión de recursos, pods reiniciándose en bucle.

**Ten un plan de actualización.** Las versiones de Kubernetes tienen ciclo de soporte limitado. Actualizar es un proyecto recurrente que hay que presupuestar.

---

### El costo de la decisión equivocada

**Adoptarlo sin necesitarlo:** meses de curva de aprendizaje, incidentes por configuración, un costo de infraestructura mayor y un equipo dedicando tiempo a plataforma en lugar de a producto.

**No adoptarlo cuando lo necesitas:** despliegues manuales frágiles, escalado que requiere intervención, incidentes por falta de autorreparación.

El primer error es mucho más común que el segundo. Y el segundo se corrige migrando cuando el dolor sea evidente; el primero se corrige desmontando algo en lo que ya invertiste mucho.

---

### Preguntas frecuentes

**¿Puedo empezar simple y migrar después?**
Sí, y es lo recomendable. Si contenedorizas tu aplicación desde el inicio, migrar a Kubernetes más adelante es factible. Lo que no debes hacer es adoptar Kubernetes hoy "para no tener que migrar mañana".

**¿Y si mis clientes empresariales lo exigen?**
Ocurre en ventas empresariales, especialmente si el cliente quiere desplegarlo en su propia infraestructura. Es una razón de negocio válida. Solo ten claro que es esa la razón.

**¿Cuánto cuesta un clúster pequeño?**
Entre el plano de control gestionado y dos o tres nodos modestos, para producción estás en el rango de varios miles de pesos mensuales antes de tus propias cargas. Compáralo contra la alternativa antes de decidir.
