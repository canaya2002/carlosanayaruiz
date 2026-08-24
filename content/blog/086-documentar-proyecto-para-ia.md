---
n: 86
title: "Cómo documentar tu proyecto para que la IA lo entienda"
slug: "documentar-proyecto-para-ia"
description: "Cómo escribir documentación que un agente de IA pueda usar: estructura de archivos de contexto, convenciones y qué nunca omitir."
category: "Desarrollo"
keyword: "documentar proyecto para ia"
tipo: "satelite"
tags: ["documentación","agentes de código","contexto","productividad"]
---


**La documentación que sirve a un agente de código es distinta de la que sirve a un humano nuevo: es más explícita, más operativa y contiene reglas negativas.** Un humano infiere convenciones leyendo el código. Un agente también, pero comete menos errores si se las dices.

Y hay un efecto colateral valioso: la documentación que hace productivo a un agente también hace productivo a un desarrollador nuevo.

---

### La jerarquía de documentos

```
proyecto/
├── CLAUDE.md              ← contexto operativo para agentes
├── README.md              ← qué es esto y cómo arrancarlo
├── docs/
│   ├── arquitectura.md    ← decisiones estructurales y su porqué
│   ├── dominio.md         ← conceptos de negocio
│   └── adr/               ← registros de decisión
└── packages/
    └── db/
        └── CLAUDE.md      ← contexto específico del paquete
```

**Los archivos de contexto anidados funcionan.** Uno en la raíz con lo general, y uno en cada paquete con sus particularidades.

---

### El archivo de contexto: qué debe contener

Cinco bloques, en este orden:

**1. Stack y versiones.**

```markdown
## Stack
- Monorepo: pnpm 9 + Turborepo
- Web: Next.js App Router, React 19, TypeScript strict
- Datos: Postgres vía Supabase, RLS activo en todas las tablas
- Background: Inngest
- Validación: Zod en toda frontera de entrada
- Estilos: Tailwind, sin CSS-in-JS
```

Incluye lo que **no** se usa. "Sin CSS-in-JS" evita que el agente lo introduzca.

**2. Comandos.**

```markdown
## Comandos
- `pnpm dev` — desarrollo
- `pnpm typecheck` — verificación de tipos. EJECUTAR SIEMPRE antes de terminar
- `pnpm test` — pruebas
- `pnpm db:migrate` — aplicar migraciones (requiere aprobación)
```

Que un agente pueda verificar su propio trabajo cambia por completo la calidad del resultado.

**3. Convenciones.**

```markdown
## Convenciones
- Server Components por defecto; 'use client' solo en componentes hoja
- Toda Server Action valida entrada con Zod y verifica sesión
- Toda tabla nueva requiere política RLS + prueba de acceso cruzado
- Nombres de archivo en kebab-case
- Commits convencionales en inglés
- Errores de negocio con clases propias, no strings
```

**4. Reglas duras, en negativo.**

```markdown
## NUNCA
- Hacer push directo a main
- Modificar archivos de migración ya aplicados
- Usar `any` sin comentario justificando
- Commitear archivos .env
- Consultar la base de datos desde componentes cliente
- Registrar datos personales en logs
```

**Este bloque es el que más previene desastres.** Las reglas negativas explícitas funcionan mejor que esperar que se infieran.

**5. Contexto de dominio.**

```markdown
## Dominio
- Una "organización" es el tenant. Todo dato pertenece a una.
- Un usuario puede pertenecer a varias organizaciones.
- Los "expedientes" tienen estados que solo avanzan hacia adelante.
- El campo `legacy_id` existe por la migración de 2024. No usar en código nuevo.
```

Ese último tipo de nota —explicar la rareza histórica— es la que más tiempo ahorra y la que nadie escribe.

---

### Registros de decisión arquitectónica

Un documento corto por cada decisión estructural:

```markdown
# ADR-007: Usar RLS en lugar de filtrado en aplicación

## Estado
Aceptada — 2026-03-14

## Contexto
El aislamiento entre organizaciones dependía de que cada consulta
incluyera el filtro correcto. En dos ocasiones se olvidó.

## Decisión
Activar Row Level Security en todas las tablas de datos de cliente,
con políticas basadas en la membresía del usuario.

## Consecuencias
- El aislamiento deja de depender de la disciplina del equipo
- Requiere índices sobre organizacion_id
- Las operaciones administrativas requieren service role, solo en servidor
- Toda tabla nueva necesita su política + prueba
```

**Por qué importa:** en seis meses nadie recuerda por qué se tomó una decisión. Sin el contexto, alguien la revierte por parecer innecesariamente compleja.

---

### El código como documentación

**Nombres que explican.** `calcularTotalConImpuestos` no necesita comentario. `calc2` sí, y el comentario se desactualiza.

**Tipos como contrato.** Un tipo bien definido comunica más que un párrafo.

**Comentarios que explican el porqué, no el qué.**

```ts
// Mal: repite lo que el código dice
// Incrementa el contador
contador++

// Bien: explica lo que el código no puede decir
// El proveedor rechaza más de 3 reintentos en 60s con un bloqueo
// temporal de 15 minutos. Mantener el límite en 3.
const MAX_REINTENTOS = 3
```

**Ejemplos ejecutables.** Las pruebas son documentación que no puede mentir: si se desactualizan, fallan.

---

### Lo que se debe evitar

**Documentación duplicada.** Si el stack está en el README y en el archivo de contexto, se van a contradecir. Una fuente por dato.

**Documentos gigantes.** Un archivo de contexto de 500 líneas consume espacio de contexto sin aportar proporcionalmente. Sé denso.

**Documentar lo obvio.** No expliques qué es React.

**Documentación desactualizada.** Peor que ninguna, porque genera confianza injustificada. Si no vas a mantenerla, no la escribas.

---

### Cómo mantenerlo vivo

**La regla de las dos correcciones:** si corriges lo mismo dos veces, se convierte en una línea del archivo de contexto.

**Revisión trimestral.** Lee el archivo completo y borra lo que ya no aplica.

**Actualízalo en el mismo pull request** que cambia la convención. Si el cambio de convención y su documentación van separados, la documentación no llega.

---

### Preguntas frecuentes

**¿Qué tan largo debe ser el archivo de contexto?**
Entre 100 y 250 líneas para un proyecto mediano. Si crece mucho, divide por paquete.

**¿Esto sirve también para humanos nuevos?**
Sí, y ese es el mejor argumento para escribirlo. La misma información que hace productivo a un agente reduce el tiempo de incorporación de una persona.

**¿Debo documentar cada función?**
No. Documenta las decisiones, las convenciones y lo que no es evidente. El código bien escrito documenta el resto.
