---
n: 17
title: "Zero Trust: qué es y cómo empezar sin rehacer todo"
slug: "arquitectura-zero-trust-como-empezar"
description: "Zero Trust explicado sin marketing: los 5 principios reales, qué implementar primero y cómo migrar sin tirar tu infraestructura actual."
category: "Ciberseguridad"
keyword: "arquitectura zero trust"
tipo: "satelite"
tags: ["zero trust","arquitectura de seguridad","control de acceso","redes"]
---


**Zero Trust es un modelo de seguridad que elimina la confianza automática basada en la ubicación en la red.** Estar dentro de la oficina o conectado a la VPN deja de ser una credencial. Cada acceso se verifica, cada vez, con el contexto completo.

No es un producto. Nadie te vende Zero Trust en una caja, por mucho que lo anuncien así. Es un conjunto de principios que se implementan por etapas sobre lo que ya tienes.

---

### El modelo que reemplaza

El modelo tradicional es el del castillo: un perímetro fuerte (firewall, VPN) y confianza amplia adentro. Funcionaba cuando todos trabajaban en la oficina y todos los sistemas vivían en el mismo edificio.

Falla por dos razones evidentes hoy:

1. **Ya no hay adentro.** Tu gente trabaja desde casa, tus sistemas están en la nube, tus proveedores acceden desde fuera.
2. **Una vez dentro, el atacante se mueve libre.** Es exactamente lo que hace el ransomware entre el día 2 y el día 10.

---

### Los 5 principios

**1. Verificar explícitamente.**
Cada acceso se evalúa con toda la señal disponible: identidad, salud del dispositivo, ubicación, hora, comportamiento previo, sensibilidad del recurso.

**2. Mínimo privilegio.**
Cada identidad tiene solo los permisos que necesita, solo por el tiempo que los necesita. Nada de accesos administrativos permanentes "por si acaso".

**3. Asumir la brecha.**
Diseña como si el atacante ya estuviera dentro. Eso cambia las prioridades: segmentación, cifrado interno, detección y registro pasan al frente.

**4. Segmentación fina.**
Nada de una red plana donde cualquier equipo alcanza cualquier servidor. Cada carga de trabajo con su propio perímetro.

**5. Registro y análisis continuo.**
Si no lo registras, no lo detectas. Y si no lo revisas, tampoco.

---

### Por dónde empezar de verdad

Este es el orden que funciona en una empresa que ya tiene infraestructura andando. No necesitas presupuesto extraordinario para las primeras tres etapas.

#### Etapa 1 — Identidad (mes 1 a 3)

La identidad es el nuevo perímetro. Todo lo demás se construye encima.

- Consolida en un solo proveedor de identidad. Si tienes usuarios en cinco sistemas distintos sin sincronizar, empieza aquí.
- MFA obligatorio en todo, con factores resistentes a phishing en cuentas críticas.
- Acceso condicional: bloquear o exigir verificación adicional según país, dispositivo, hora o nivel de riesgo detectado.
- Elimina cuentas huérfanas y accesos compartidos.

**Esta etapa sola entrega más del 50% del beneficio de todo el modelo.**

#### Etapa 2 — Dispositivos (mes 3 a 6)

- Inventario real de qué equipos acceden a qué.
- Exigir que el dispositivo esté gestionado y cumpla requisitos mínimos (cifrado de disco, sistema actualizado, protección activa) para acceder a recursos sensibles.
- Separar el acceso desde dispositivos personales: navegador sin descarga local, o directamente restringido.

#### Etapa 3 — Aplicaciones y datos (mes 6 a 12)

- Clasifica: qué información es realmente sensible. Casi nadie lo tiene hecho.
- Aplica permisos por rol sobre esos datos, no sobre carpetas heredadas de hace ocho años.
- Sustituye la VPN de acceso total por acceso por aplicación. La VPN clásica es el ejemplo perfecto de lo que Zero Trust corrige: te autentica una vez y te da la red entera.

#### Etapa 4 — Red y cargas de trabajo (mes 12 en adelante)

- Segmentación entre servidores y entre entornos.
- Cifrado del tráfico interno, no solo del que sale a internet.
- Reglas de mínimo privilegio entre servicios: que la aplicación web solo alcance su base de datos y nada más.

---

### Los errores más caros

**Comprar la herramienta antes de arreglar la identidad.** Una plataforma de acceso avanzada sobre un directorio desordenado con cuentas compartidas no arregla nada.

**Tratarlo como proyecto con fecha de término.** Zero Trust es una postura operativa continua, no una implementación que se cierra.

**Ignorar a los proveedores externos.** Suelen tener accesos amplios y controles débiles. Es una de las vías de entrada más frecuentes y de las peor vigiladas.

**Bloquear antes de observar.** Activa las políticas primero en modo de solo registro. Vas a descubrir flujos de trabajo legítimos que no conocías. Bloquear a ciegas genera interrupciones y una revuelta interna que frena el proyecto entero.

**Olvidar las cuentas de servicio y las llaves de API.** Suelen tener permisos excesivos, no rotan nunca y nadie las audita.

---

### Cómo medir el avance

| Indicador | Objetivo |
|---|---|
| Cobertura de MFA en cuentas críticas | 100% |
| Cuentas con privilegios administrativos permanentes | Tendiendo a cero |
| Aplicaciones tras acceso condicional | Creciente por trimestre |
| Dispositivos gestionados con acceso a datos sensibles | 100% |
| Tiempo de revocación de accesos tras una baja | Mismo día |
| Segmentos de red donde un equipo comprometido queda contenido | Creciente |

---

### Preguntas frecuentes

**¿Zero Trust significa quitar la VPN?**
A mediano plazo, sí, sustituirla por acceso por aplicación. Pero no es el primer paso. Primero identidad, luego dispositivos, después el acceso.

**¿Sirve para una empresa de 50 personas?**
Los principios sí, con implementación proporcional. Etapas 1 y 2 son perfectamente alcanzables con las suites de productividad que probablemente ya pagas.

**¿Cuánto cuesta?**
Las dos primeras etapas suelen estar cubiertas por licencias que ya tienes, en su nivel intermedio. El costo real es de configuración y de tiempo interno, no de compra.
