---
n: 25
title: "Monorepo con Turborepo y pnpm: estructura completa"
slug: "monorepo-turborepo-pnpm-estructura"
description: "Cómo montar un monorepo con Turborepo y pnpm: estructura de carpetas, paquetes compartidos, cache remoto y CI que solo compila lo que cambió."
category: "Desarrollo"
keyword: "monorepo turborepo pnpm"
tipo: "satelite"
tags: ["monorepo","turborepo","pnpm","arquitectura"]
---


**Un monorepo tiene sentido cuando compartes código entre varias aplicaciones y necesitas que los cambios se propaguen sin publicar paquetes.** Web, móvil, panel administrativo y una API compartiendo tipos, cliente de base de datos y componentes: ese es el caso donde gana claramente.

Si tienes una sola aplicación, no lo necesitas. La complejidad no se paga sola.

---

### Estructura que funciona

```
mi-producto/
├── apps/
│   ├── web/                 # Next.js — sitio público
│   ├── app/                 # Next.js — aplicación autenticada
│   ├── movil/               # Expo
│   └── api/                 # Servicios de fondo
├── packages/
│   ├── ui/                  # Componentes compartidos
│   ├── db/                  # Cliente de base de datos y esquema
│   ├── config/              # ESLint, TS, Tailwind compartidos
│   ├── tipos/               # Tipos y contratos compartidos
│   └── utils/               # Utilidades puras
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

**Regla que evita la mayoría de los problemas:** `apps/` consume, `packages/` provee. Un paquete nunca importa desde una app. Si necesitas eso, el código está en el lugar equivocado.

---

### Configuración base

`pnpm-workspace.yaml`:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

`package.json` raíz:

```json
{
  "name": "mi-producto",
  "private": true,
  "packageManager": "pnpm@9.12.0",
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "typecheck": "turbo run typecheck"
  },
  "devDependencies": {
    "turbo": "latest"
  }
}
```

`turbo.json`:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"],
      "env": ["NODE_ENV"]
    },
    "typecheck": {
      "dependsOn": ["^build"]
    },
    "lint": {},
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

**`dependsOn: ["^build"]`** significa: antes de compilar este paquete, compila sus dependencias internas. Es lo que hace que el orden se resuelva solo.

---

### Cómo se referencian los paquetes internos

En el `package.json` de una app:

```json
{
  "dependencies": {
    "@mi-producto/ui": "workspace:*",
    "@mi-producto/db": "workspace:*"
  }
}
```

El protocolo `workspace:*` le dice a pnpm que use la versión local, no una del registro público.

Y en el paquete compartido, exporta por subrutas para que el consumidor no importe de más:

```json
{
  "name": "@mi-producto/ui",
  "exports": {
    ".": "./src/index.ts",
    "./boton": "./src/boton.tsx",
    "./tabla": "./src/tabla.tsx"
  }
}
```

---

### Configuración compartida: el paquete que más valor da

`packages/config` centraliza lo que todos repiten:

```
packages/config/
├── eslint/
│   ├── base.js
│   ├── next.js
│   └── react.js
├── typescript/
│   ├── base.json
│   ├── nextjs.json
│   └── library.json
└── tailwind/
    └── base.js
```

Un `tsconfig.json` de una app queda así:

```json
{
  "extends": "@mi-producto/config/typescript/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["**/*.ts", "**/*.tsx", "next-env.d.ts"],
  "exclude": ["node_modules"]
}
```

Cambias una regla en un lugar y aplica en todo el repositorio.

---

### Caché remoto: el beneficio principal

Turborepo cachea las salidas de cada tarea. Si nada cambió en un paquete, no lo vuelve a compilar. Con caché remoto, ese resultado se comparte entre tu máquina, la de tus compañeros y la integración continua.

El efecto práctico: una compilación de siete minutos pasa a veinte segundos cuando solo tocaste una app.

Puedes usar el caché remoto de Vercel o autohospedarlo. La configuración se reduce a autenticar y vincular el repositorio.

**Requisito para que funcione:** declara correctamente los `outputs` y las variables de entorno en `turbo.json`. Si una tarea depende de una variable no declarada, el caché puede devolverte un resultado construido con otro valor. Es la causa más común de "funciona en local y no en producción".

---

### CI que solo compila lo que cambió

```yaml
name: CI
on: [push, pull_request]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 2   # Necesario para comparar contra el commit anterior

      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile
      - run: pnpm turbo run lint typecheck test build --filter=...[HEAD^1]
        env:
          TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
          TURBO_TEAM: ${{ vars.TURBO_TEAM }}
```

El filtro `...[HEAD^1]` ejecuta las tareas solo en los paquetes afectados por el cambio y en los que dependen de ellos. En un repositorio con seis aplicaciones, esto es la diferencia entre esperar dos minutos o quince.

---

### Comandos del día a día

```bash
# Instalar una dependencia en una app concreta
pnpm add zod --filter web

# Instalar una herramienta en la raíz
pnpm add -D turbo -w

# Correr solo una app en desarrollo
pnpm turbo run dev --filter=web

# Correr una app y todo de lo que depende
pnpm turbo run dev --filter=web...

# Compilar todo lo afectado por cambios respecto a main
pnpm turbo run build --filter=...[origin/main]

# Ver por qué una tarea no usó caché
pnpm turbo run build --dry-run
```

Ese último comando es el que resuelve el 90% de los problemas de caché.

---

### Los errores que hacen doloroso un monorepo

**Un paquete `shared` que lo contiene todo.** Se vuelve dependencia de todo, y cualquier cambio invalida el caché del repositorio entero. Divide por dominio: `db`, `ui`, `tipos`, `utils`.

**Dependencias circulares entre paquetes.** Turborepo falla y con razón. Suele indicar que la frontera entre paquetes está mal trazada.

**No declarar los `outputs`.** Sin eso, no hay caché.

**Versiones distintas de la misma dependencia entre paquetes.** Genera errores incomprensibles, especialmente con React. Fija versiones desde la raíz.

**Meter todo en el monorepo desde el día uno.** Empieza con dos apps y un paquete compartido. Extrae cuando la duplicación duela, no antes.

---

### Preguntas frecuentes

**¿Turborepo o Nx?**
Turborepo es más simple y suficiente para la mayoría. Nx tiene más capacidades de generación y análisis, y más complejidad. Para un equipo pequeño, Turborepo.

**¿Puedo incluir un proyecto de Expo?**
Sí, con configuración adicional para que el empaquetador de Metro resuelva los paquetes del workspace. Requiere ajustes, pero funciona.

**¿Un solo despliegue para todo?**
No. Cada app se despliega por separado, con su directorio raíz configurado en la plataforma. El monorepo es de desarrollo, no de despliegue.
