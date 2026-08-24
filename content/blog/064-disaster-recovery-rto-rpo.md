---
n: 64
title: "Disaster recovery: RTO, RPO y planes que sí funcionan"
slug: "disaster-recovery-rto-rpo"
description: "RTO y RPO explicados con números, las 4 estrategias de disaster recovery en la nube y cómo probar el plan sin romper producción."
category: "Cloud"
keyword: "rto rpo"
tipo: "satelite"
tags: ["disaster recovery","continuidad","rto","rpo"]
---


**RTO es cuánto tiempo puedes estar caído. RPO es cuántos datos puedes permitirte perder.** Esos dos números determinan tu arquitectura de recuperación y su costo. Todo lo demás son detalles de implementación.

Y la mayoría de las empresas no los tiene definidos, lo cual significa que su plan de recuperación es una esperanza.

---

### Definir los dos números

**RTO (Recovery Time Objective).** Desde que ocurre el desastre hasta que el servicio vuelve a operar. Si tu RTO es de 4 horas y tardas 30, incumpliste.

**RPO (Recovery Point Objective).** Cuánto trabajo puedes perder. Si respaldas cada 24 horas, tu RPO es de 24 horas: en el peor caso pierdes un día completo de datos.

**Cómo definirlos:** no preguntes al área técnica. Pregunta al negocio.

- ¿Cuánto cuesta cada hora de operación detenida? Ingresos perdidos, penalizaciones contractuales, costo de personal parado, daño reputacional.
- ¿Qué pasa si perdemos las últimas 4 horas de datos? ¿Y las últimas 24? ¿Se puede reconstruir?

Con esos números puedes justificar la inversión. Sin ellos, cualquier propuesta de continuidad parece cara.

---

### Clasifica tus sistemas por nivel

Tratar todo con el mismo estándar es o carísimo o insuficiente.

| Nivel | Ejemplo | RTO típico | RPO típico |
|---|---|---|---|
| **Crítico** | Transaccional, cobros | < 1 hora | < 15 min |
| **Importante** | CRM, gestión interna | 4-8 horas | 1-4 horas |
| **Estándar** | Reportería, herramientas internas | 24-48 horas | 24 horas |
| **Diferible** | Archivo histórico | Días | Días |

La mayoría de los sistemas de una empresa mediana son "importante" o "estándar". Solo unos pocos son verdaderamente críticos.

---

### Las cuatro estrategias

**1. Respaldo y restauración.**
Respaldos periódicos hacia otra ubicación. Ante un desastre, se levanta la infraestructura y se restaura.
*RTO: horas a días. RPO: según frecuencia de respaldo. Costo: el más bajo.*

**2. Piloto encendido (pilot light).**
Los componentes centrales —principalmente la base de datos con replicación— están corriendo en la región secundaria, apagados o al mínimo. Ante un desastre, se escala y se activa.
*RTO: decenas de minutos a horas. RPO: minutos. Costo: bajo-medio.*

**3. Espera templada (warm standby).**
Una versión reducida pero funcional del entorno completo corriendo en paralelo. Ante un desastre, se escala y se redirige el tráfico.
*RTO: minutos. RPO: segundos a minutos. Costo: medio-alto.*

**4. Activo-activo.**
Dos regiones sirviendo tráfico simultáneamente. Si una cae, la otra absorbe todo.
*RTO: casi cero. RPO: casi cero. Costo: el más alto, y complejidad de consistencia de datos considerable.*

**Recomendación práctica:** la mayoría de las empresas medianas están bien con respaldo y restauración para sistemas estándar, y piloto encendido para los críticos. Activo-activo se justifica en muy pocos casos y muchos equipos lo subestiman: mantener consistencia de datos entre regiones activas es un problema difícil.

---

### Lo que la gente olvida incluir en el plan

**La configuración, no solo los datos.** Reglas de red, variables de entorno, certificados, configuración de DNS. Restaurar datos sin configuración te deja a mitad del camino.

**Los secretos.** Si tus credenciales viven solo en el sistema caído, no puedes levantar nada. Necesitas acceso a un gestor de secretos desde el entorno de recuperación.

**Las dependencias externas.** Tu proveedor de pagos, tu servicio de correo, tu API de terceros. ¿Tienen listas blancas de IP que hay que actualizar? ¿Certificados vinculados?

**El DNS.** El tiempo de propagación puede añadir minutos u horas a tu RTO. Un TTL bajo configurado de antemano es una preparación barata que ahorra mucho tiempo.

**La documentación.** Impresa o accesible sin acceso a tu infraestructura. Que no viva únicamente en el servidor que se cayó.

**El orden de arranque.** Qué se levanta primero, qué depende de qué. Sin esto documentado, la recuperación es prueba y error bajo presión.

**Las personas.** Quién decide activar el plan. Quién ejecuta. Quién comunica. Y qué pasa si esa persona está de vacaciones.

---

### Cómo probar el plan

Un plan no probado es ficción. Tres niveles de prueba, en orden:

**Nivel 1 — Simulacro de mesa (trimestral).**
El equipo se reúne, se plantea un escenario y se recorren las decisiones verbalmente. Dura 90 minutos y siempre encuentra huecos: contactos desactualizados, dependencias no consideradas, ambigüedad sobre quién decide.

**Nivel 2 — Restauración parcial (semestral).**
Restaurar un sistema real en un entorno aislado. **Cronometrar.** Verificar integridad de los datos abriendo archivos y consultando la base.

Lo que sale a la luz aquí, siempre: la restauración tarda más de lo asumido, falta la clave de cifrado del respaldo, o un respaldo llevaba meses corrupto sin que nadie lo supiera.

**Nivel 3 — Prueba de conmutación completa (anual).**
Activar la región secundaria con tráfico real. Es la prueba de verdad y la que casi nadie hace por miedo. Se hace en ventana planificada, con plan de reversión, y comunicando al equipo.

**Documenta cada prueba:** tiempo real de recuperación vs. RTO objetivo, qué falló, qué se corrigió. Esa documentación es también tu evidencia ante auditorías y clientes que preguntan.

---

### La métrica que importa

**RTO real medido, no RTO objetivo declarado.**

Si tu documento dice 4 horas y tu última prueba tardó 19, tu RTO real es 19 horas. Ese es el número que debes reportar y el que debes atacar.

---

### Preguntas frecuentes

**¿Cuánto debería costar mi estrategia de recuperación?**
Compara contra el costo de la caída. Si una hora detenido cuesta 80,000 pesos y tu RTO objetivo es de 4 horas, una inversión que garantice ese RTO tiene un techo racional de referencia claro.

**¿Multi-región es lo mismo que disaster recovery?**
No. Multi-región puede ser para latencia. Recuperación ante desastres requiere que la región secundaria pueda operar de forma independiente y que hayas probado que puede.

**¿Los respaldos del proveedor son suficientes?**
Los respaldos automáticos de un servicio gestionado cubren fallos del servicio, no un borrado accidental fuera de la ventana de retención ni un compromiso de tu cuenta. Necesitas una copia adicional, idealmente en otra cuenta y con inmutabilidad.
