---
n: 85
title: "Flujo de trabajo con Git para equipos pequeños"
slug: "flujo-git-equipos-pequenos"
description: "El flujo de Git que funciona para equipos de 1 a 6 personas: ramas cortas, conventional commits, PRs pequeños y despliegue continuo."
category: "Desarrollo"
keyword: "git workflow"
tipo: "satelite"
tags: ["git","workflow","colaboración","buenas prácticas"]
---


**Para equipos de una a seis personas, el flujo correcto es ramas cortas desde main, pull requests pequeños y despliegue frecuente.** Los flujos elaborados con ramas de desarrollo, de release y de hotfix resuelven problemas de organizaciones grandes con ciclos de lanzamiento planificados. En un equipo pequeño, solo añaden ceremonia.

---

### El flujo

```
main  ────●────●────●────●────●────→  (siempre desplegable)
           \    /      \    /
            ●──●        ●──●          (ramas de 1-3 días)
```

**Reglas:**

1. `main` siempre está en estado desplegable.
2. Todo cambio va en una rama corta creada desde `main`.
3. Las ramas viven de uno a tres días. Más allá, los conflictos se multiplican.
4. Pull request obligatorio, con verificaciones automáticas.
5. Al fusionar, se despliega.

Es todo. La simplicidad es la característica, no una limitación.

---

### Nombres de rama

```
feat/exportacion-csv
fix/calculo-impuesto-redondeo
chore/actualizar-dependencias
docs/guia-instalacion
```

Prefijo del tipo, descripción en kebab-case. Si tu equipo usa un sistema de tickets, incluye el identificador: `feat/PROJ-142-exportacion-csv`.

---

### Conventional Commits

Un formato de mensaje que permite generar changelogs automáticamente y comunica la intención de un vistazo.

```
<tipo>(<ámbito opcional>): <descripción>

[cuerpo opcional]

[pie opcional]
```

**Tipos:**

| Tipo | Cuándo |
|---|---|
| `feat` | Funcionalidad nueva |
| `fix` | Corrección de error |
| `refactor` | Cambio interno sin alterar comportamiento |
| `perf` | Mejora de rendimiento |
| `test` | Pruebas |
| `docs` | Documentación |
| `chore` | Mantenimiento, dependencias |
| `ci` | Pipeline |

**Ejemplos:**

```
feat(auth): agregar inicio de sesión con enlace mágico

fix(billing): corregir redondeo en cálculo de IVA

El cálculo redondeaba antes de sumar en lugar de después,
generando diferencias de centavos en facturas con muchas líneas.

Fixes #234
```

**Cambios que rompen compatibilidad:**

```
feat(api)!: cambiar formato de respuesta de /pedidos

BREAKING CHANGE: el campo `total` ahora es un objeto con
`monto` y `moneda` en lugar de un número.
```

**Idioma:** en inglés si el proyecto puede tener colaboradores externos o es open source. En español si es interno y el equipo lo prefiere. **Lo importante es consistencia**, no cuál elijas.

---

### Pull requests que se revisan de verdad

**Pequeños.** Un pull request de 200 líneas se revisa. Uno de 1,500 se aprueba sin leer. Si tu cambio es grande, divídelo en varios secuenciales.

**Con descripción útil.** Qué problema resuelve, cómo se probó, qué mirar con atención. No repitas lo que el diff ya muestra.

**Con verificaciones pasando antes de pedir revisión.** No hagas que otra persona descubra que tus pruebas fallan.

**Autorevisión primero.** Lee tu propio diff antes de pedir revisión. Vas a encontrar código de depuración olvidado, comentarios sin sentido y cosas fuera de alcance.

---

### Protección de rama

En `main`:

```
□ Requiere pull request antes de fusionar
□ Requiere que las verificaciones pasen
□ Requiere que la rama esté actualizada respecto a main
□ Prohíbe force push
□ Prohíbe eliminación
```

**Trabajando solo, actívalo igual.** Es la única red que tienes, y "solo esta vez" es exactamente como se rompe producción un viernes.

---

### Merge, squash o rebase

**Squash and merge** es la opción por defecto correcta para equipos pequeños:
- Un commit limpio por funcionalidad en el historial
- El historial de `main` es legible
- Los commits de trabajo en progreso desaparecen

**Merge commit** cuando quieres preservar el historial detallado de una rama compleja.

**Rebase and merge** para historial lineal sin commits de fusión. Requiere disciplina y entender rebase bien.

**Nunca hagas rebase de ramas compartidas.** Reescribe el historial y rompe el trabajo de quien la tenga descargada.

---

### El comando que salva

```bash
git reflog
```

Registra todos los movimientos de HEAD, incluidos los que "perdiste". Un reset agresivo, un rebase mal hecho, una rama borrada por error: casi siempre se recupera desde aquí.

```bash
git reflog                    # Encuentra el hash del estado bueno
git reset --hard <hash>       # Vuelve ahí
```

**Casi nada se pierde de verdad en Git** si el commit existió alguna vez. Vale la pena saberlo antes de necesitarlo.

---

### Errores frecuentes

**Ramas de dos semanas.** Los conflictos crecen exponencialmente con el tiempo. Fusiona `main` a tu rama a diario, o mejor, haz ramas más cortas.

**Commits de "wip" y "arreglos".** Con squash al fusionar no importan tanto, pero mientras trabajas, commits con mensaje real te ayudan a ti.

**Commitear secretos.** Una vez en el historial, quitarlo requiere reescribirlo. Usa detección de secretos en el pipeline y un `.gitignore` bien configurado desde el inicio.

**Archivos generados versionados.** `node_modules`, artefactos de compilación, archivos de entorno.

**No usar `.gitattributes`.** En equipos mixtos Windows/Mac, los finales de línea generan diffs falsos enormes.

---

### Preguntas frecuentes

**¿Necesito una rama de desarrollo?**
Con despliegue continuo y verificaciones automáticas, no. Añade un paso de fusión sin beneficio real en equipos pequeños.

**¿Y las versiones de producción?**
Etiquetas en `main`. Si necesitas mantener versiones antiguas con parches, ahí sí una rama de mantenimiento por versión.

**¿Cómo manejo un cambio urgente en producción?**
Igual que cualquier cambio: rama, PR, verificaciones, fusión, despliegue. Si tu pipeline tarda tanto que no puedes hacer esto en una urgencia, arregla el pipeline.
