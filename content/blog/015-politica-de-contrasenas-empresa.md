---
n: 15
title: "Política de contraseñas que la gente sí cumple"
slug: "politica-de-contrasenas-empresa"
description: "Cómo escribir una política de contraseñas basada en NIST que la gente cumpla: sin cambios forzados cada 90 días y con gestor obligatorio."
category: "Ciberseguridad"
keyword: "política de contraseñas"
tipo: "satelite"
tags: ["contraseñas","políticas","nist","gestión de accesos"]
---


**La política de contraseñas de la mayoría de las empresas está basada en recomendaciones que los propios organismos que las emitieron ya retiraron.** Cambio obligatorio cada 90 días, reglas de complejidad de símbolos, prohibición de pegar en el campo: todo eso empeora la seguridad en la práctica, porque empuja a la gente a patrones predecibles.

Esta es una política moderna, alineada con las guías vigentes, que reduce el riesgo real y genera menos resistencia.

---

### Qué cambió y por qué

Las guías actuales de referencia internacional se movieron en esta dirección:

| Práctica antigua | Práctica actual | Por qué |
|---|---|---|
| Cambio obligatorio cada 90 días | Cambio solo ante indicio de compromiso | El cambio forzado produce `Empresa2026!` → `Empresa2027!` |
| Exigir mayúscula, número y símbolo | Exigir longitud, no composición | La complejidad forzada genera patrones predecibles |
| Mínimo 8 caracteres | Mínimo 12–14, idealmente frases | La longitud aporta mucha más resistencia que los símbolos |
| Preguntas de seguridad | Eliminarlas | Las respuestas suelen ser públicas o adivinables |
| Prohibir pegar la contraseña | Permitirlo | Prohibirlo bloquea el uso de gestores, que es lo que quieres fomentar |
| Sin lista de bloqueo | Bloquear contraseñas filtradas conocidas | Es la medida con mayor impacto real |

---

### La política, lista para adaptar

**1. Longitud mínima: 14 caracteres.**
Sin exigencias de composición. Una frase de cuatro palabras al azar es más fuerte y más memorable que `P@ssw0rd!23`.

**2. Verificación contra listas de contraseñas comprometidas.**
En el momento de crearla, se compara contra bases de credenciales filtradas. Si aparece, se rechaza. Esta única medida elimina la mayoría de los ataques automatizados.

**3. Gestor de contraseñas obligatorio y provisto por la empresa.**
No es opcional ni "recomendado". Se entrega licencia, se capacita y se exige. Es el cambio que hace viable todo lo demás.

**4. Contraseña única por servicio.**
La reutilización es el vector de ataque número uno. Con gestor, esta regla deja de ser una carga.

**5. Sin cambio periódico obligatorio.**
Se cambia cuando hay indicio de compromiso, cuando aparece en una filtración, o cuando fue compartida.

**6. MFA obligatorio donde el servicio lo permita.**
La contraseña deja de ser el único obstáculo. Esta regla vale más que todas las anteriores juntas.

**7. Prohibido compartir credenciales.**
Si dos personas necesitan el mismo acceso, se crean dos cuentas o se usa la función de compartir del gestor, que mantiene trazabilidad.

**8. Cuentas administrativas separadas.**
Nadie lee correo ni navega con una cuenta de administrador. Cuentas distintas, contraseñas distintas, MFA reforzado con llave física.

**9. Baja de accesos el mismo día.**
Cuando alguien sale de la empresa, sus accesos se revocan ese día. Incluye sistemas de terceros, no solo los internos.

**10. Revisión trimestral de accesos.**
Cada responsable de área confirma quién debe seguir teniendo acceso a qué. Se documenta.

---

### Cómo implementarla sin que se rebele el equipo

**No anuncies la política. Entrega primero la herramienta.**

Secuencia que funciona:

**Semana 1.** Se reparte el gestor de contraseñas con licencia pagada, incluida la versión para uso personal y familiar si la licencia lo permite. Sesión de 30 minutos mostrando cómo importa contraseñas del navegador y cómo autocompleta. La gente adopta un gestor cuando descubre que le ahorra tiempo, no cuando se lo imponen.

**Semana 2.** Migración asistida. Cada persona mueve sus credenciales al gestor con alguien disponible para ayudar.

**Semana 3.** Se publica la política. Ya no pide un esfuerzo: describe lo que la gente ya está haciendo.

**Semana 4.** Se activan los controles técnicos: longitud mínima, lista de bloqueo, MFA.

Al revés —publicar la política primero y pedir que se cumpla— genera resistencia y hojas de cálculo con contraseñas escondidas.

---

### Lo que debe medir el área de sistemas

- **Cobertura de MFA:** porcentaje de cuentas con segundo factor activo. Objetivo: 100% en críticas.
- **Adopción del gestor:** usuarios activos semanales sobre licencias asignadas.
- **Credenciales en listas filtradas:** cuántas cuentas corporativas aparecen en filtraciones conocidas.
- **Cuentas huérfanas:** cuentas activas sin usuario vigente. Objetivo: cero.
- **Tiempo de revocación de accesos** tras una baja. Objetivo: mismo día.

---

### Preguntas frecuentes

**¿De verdad ya no hay que forzar el cambio cada 90 días?**
Correcto, salvo que una norma sectorial o un cliente te lo exija por contrato. El cambio forzado degrada la calidad de las contraseñas de forma medible.

**¿Es seguro poner todo en un gestor?**
El riesgo concentrado existe, pero es muy inferior al de reutilizar contraseñas en 40 servicios. Protege la contraseña maestra con MFA y una frase larga.

**¿Y las contraseñas compartidas de redes sociales o servicios sin cuentas múltiples?**
Usa la función de compartición del gestor, que permite revocar sin cambiar la contraseña, y registra quién accedió.
