---
n: 38
title: "Claude Code: guía práctica para desarrolladores"
slug: "claude-code-guia-desarrolladores"
description: "Cómo usar Claude Code de verdad: instalación, CLAUDE.md, permisos, subagentes y el flujo que evita que la IA rompa tu repositorio."
category: "Desarrollo"
keyword: "claude code"
tipo: "satelite"
tags: ["claude code","ia para programar","productividad","agentes"]
---


**Claude Code es una herramienta de programación agéntica que lee tu base de código, edita archivos, ejecuta comandos y se integra con tus herramientas de desarrollo.** No es un autocompletado dentro del editor: es un agente que trabaja sobre el proyecto completo.

Esa diferencia es lo que lo hace potente y lo que exige disciplina para usarlo bien.

---

### Instalación

Está disponible en varias superficies —terminal, extensiones de IDE, aplicación de escritorio y navegador— y todas se conectan al mismo motor, así que tu configuración y tus archivos de contexto funcionan en cualquiera.

Para la terminal, la instalación nativa:

```bash
# macOS, Linux, WSL
curl -fsSL https://claude.ai/install.sh | bash

# Windows PowerShell
irm https://claude.ai/install.ps1 | iex
```

También está disponible por Homebrew (`brew install --cask claude-code`) y por WinGet (`winget install Anthropic.ClaudeCode`).

Después, en cualquier proyecto:

```bash
cd tu-proyecto
claude
```

En Windows nativo conviene tener Git for Windows instalado para que pueda usar Bash como shell; si no, usa PowerShell.

Consulta siempre la documentación oficial para métodos alternativos y solución de problemas: `code.claude.com/docs`.

---

### CLAUDE.md: el archivo que cambia todo

Es un archivo markdown en la raíz de tu proyecto que se lee al inicio de cada sesión. Es la diferencia entre una herramienta que adivina tus convenciones y una que las conoce.

Lo que debe contener:

```markdown
# Proyecto: Plataforma de gestión

## Stack
- Monorepo pnpm + Turborepo
- Next.js App Router, TypeScript strict
- Supabase (Postgres + Auth), RLS en todas las tablas
- Inngest para trabajo en background

## Comandos
- `pnpm dev` — desarrollo
- `pnpm typecheck` — verificación de tipos (ejecutar SIEMPRE antes de terminar)
- `pnpm test` — pruebas
- `pnpm lint`

## Convenciones
- Commits convencionales en inglés
- Componentes de servidor por defecto; 'use client' solo en hojas del árbol
- Toda tabla nueva necesita política RLS + prueba de acceso cruzado
- Validación con Zod en la frontera de toda Server Action
- Nunca usar `any`; si es inevitable, comentar el porqué

## Reglas duras
- NUNCA hacer push directo a main
- NUNCA modificar archivos de migración ya aplicados
- NUNCA commitear archivos .env
- Antes de terminar cualquier tarea: ejecutar typecheck y lint
```

**Consejo práctico:** empieza corto. Cada vez que corrijas algo dos veces, esa corrección se convierte en una línea del CLAUDE.md. Es un documento que crece por uso, no por planeación.

Además del archivo que tú escribes, Claude Code construye memoria automática conforme trabaja, guardando aprendizajes entre sesiones.

---

### El flujo de trabajo que evita desastres

**1. Rama por tarea, siempre.**
Nunca trabajes directo sobre `main`. Es la regla más importante y la más fácil de olvidar cuando algo parece un cambio pequeño.

**2. Pide un plan antes de que escriba código.**
Para tareas no triviales, pide primero el enfoque. Revisar un plan de diez líneas toma un minuto; revisar quinientas líneas de código mal enfocado toma una hora.

**3. Tareas acotadas.**
"Refactoriza el módulo de autenticación" es demasiado ancho. "Extrae la validación de sesión de estas tres rutas a una función compartida en lib/sesion.ts" es una tarea.

**4. Revisa el diff, no la explicación.**
La descripción de lo que hizo puede sonar perfecta y el código estar mal. Lee el cambio.

**5. Que ejecute las verificaciones.**
Si tu CLAUDE.md dice que debe correr `typecheck` y `test` antes de terminar, lo hará. El código que compila y pasa pruebas es un piso mínimo razonable.

**6. Commits pequeños y frecuentes.**
Facilita revertir cuando algo salió mal. Que lo haga él: trabaja directamente con git, prepara cambios, escribe mensajes y abre pull requests.

---

### Permisos: la decisión que más importa

Puedes configurar qué operaciones requieren tu aprobación. Vale la pena pensarlo bien.

**Lo razonable para la mayoría:**
- Lectura de archivos: sin aprobación.
- Edición de archivos: sin aprobación dentro del proyecto.
- Comandos de solo lectura (`ls`, `cat`, `git status`, `git diff`): sin aprobación.
- Comandos que modifican estado (`git push`, migraciones, instalación de paquetes, despliegues): **con aprobación**.
- Cualquier cosa que toque producción: **con aprobación, siempre**.

**El modo sin aprobaciones existe** y acelera mucho el trabajo, pero úsalo solo en entornos donde el peor caso sea aceptable: una rama desechable, un contenedor aislado, un proyecto experimental. En un repositorio de producción con credenciales activas, no.

---

### Capacidades que vale la pena conocer

**MCP.** Puedes conectarlo a fuentes externas mediante servidores del Model Context Protocol: documentos, sistemas de tickets, tus propias herramientas internas. Es lo que le da contexto más allá del repositorio.

**Skills.** Empaquetan flujos de trabajo repetibles que tu equipo puede compartir, como una revisión de pull request estandarizada o un despliegue a staging.

**Hooks.** Ejecutan comandos de shell antes o después de sus acciones. Útil para formatear automáticamente después de cada edición o correr el linter antes de un commit.

**Subagentes.** Para tareas grandes puedes lanzar varios agentes que trabajan en partes distintas en paralelo, con uno coordinando.

**Uso desde la línea de comandos.** Es componible al estilo Unix, así que puedes canalizarle salida de otros procesos:

```bash
tail -200 app.log | claude -p "resume los errores recurrentes"
git diff main --name-only | claude -p "revisa estos archivos por problemas de seguridad"
```

Esa capacidad de usarlo como filtro dentro de un pipeline es de lo más infravalorado de la herramienta.

**Tareas programadas.** Puede correr en horario: revisión de pull requests por la mañana, análisis de fallos de integración continua por la noche, auditoría semanal de dependencias.

---

### Los errores que hacen que la gente se decepcione

**No escribir CLAUDE.md.** Sin él, cada sesión empieza de cero y las convenciones se pierden.

**Pedir tareas demasiado grandes.** Cuanto más ancha la tarea, más probable que el enfoque no sea el que querías.

**Aceptar cambios sin leerlos.** Es la vía rápida hacia una base de código que nadie entiende.

**Usarlo en un repositorio sin pruebas.** Sin verificación automática, no tienes forma de saber si rompió algo.

**Esperar que adivine el contexto de negocio.** Sabe programar; no sabe por qué tu tabla de facturación tiene esa columna rara. Explícaselo o documéntalo.

---

### Preguntas frecuentes

**¿Reemplaza al desarrollador?**
Cambia la proporción del trabajo: menos escritura de código, más diseño, revisión y decisión. Sigues siendo responsable de lo que se despliega.

**¿Y los datos de mi código?**
Revisa la documentación oficial y los términos del plan que uses. Para código sensible, verifica las condiciones por escrito antes de conectarlo.

**¿Funciona bien en bases de código grandes?**
Sí, y ahí es donde más se nota, porque puede rastrear cómo se relacionan archivos que tú no conoces. La calidad depende mucho de lo bien documentado que esté el proyecto.
