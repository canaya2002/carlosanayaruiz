---
n: 59
title: "CI/CD con GitHub Actions: pipeline completo"
slug: "ci-cd-github-actions-pipeline"
description: "Pipeline completo de CI/CD con GitHub Actions listo para copiar: tests, lint, build cacheado, entornos y despliegue con aprobación."
category: "DevOps"
keyword: "ci cd github actions"
tipo: "satelite"
tags: ["ci cd","github actions","automatización","despliegue"]
---


**Un pipeline de CI/CD verifica automáticamente cada cambio y lo despliega sin intervención manual cuando pasa las verificaciones.** Su valor real no es la automatización del despliegue: es que nadie pueda meter a producción código que no compila, no pasa pruebas o tiene vulnerabilidades conocidas.

---

### El pipeline base

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  verificar:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'

      - name: Instalar dependencias
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: Verificación de tipos
        run: pnpm typecheck

      - name: Pruebas
        run: pnpm test -- --coverage

      - name: Auditoría de dependencias
        run: pnpm audit --audit-level=high

      - name: Compilar
        run: pnpm build
```

**El bloque `concurrency` es de lo más útil y menos usado.** Cancela ejecuciones anteriores de la misma rama cuando llega un commit nuevo. Ahorra minutos de ejecución y evita que se acumule una cola de compilaciones obsoletas.

**`--frozen-lockfile` es obligatorio.** Falla si el archivo de bloqueo no coincide con el manifiesto, en lugar de actualizarlo silenciosamente. Sin eso, tu CI puede instalar versiones distintas a las de tu máquina.

---

### Despliegue con entornos y aprobación

```yaml
  desplegar-staging:
    needs: verificar
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment:
      name: staging
      url: https://staging.midominio.com
    steps:
      - uses: actions/checkout@v4
      - name: Desplegar
        run: ./scripts/deploy.sh staging
        env:
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN_STAGING }}

  desplegar-produccion:
    needs: desplegar-staging
    runs-on: ubuntu-latest
    environment:
      name: production          # Con revisores requeridos configurados
      url: https://midominio.com
    steps:
      - uses: actions/checkout@v4
      - name: Desplegar
        run: ./scripts/deploy.sh production
        env:
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN_PROD }}
```

**Los entornos de GitHub son la pieza clave.** Configurados en el repositorio, permiten:
- Requerir aprobación humana antes de ejecutar el trabajo
- Restringir qué ramas pueden desplegar a ese entorno
- Aislar secretos por entorno
- Imponer un tiempo de espera antes del despliegue

Es la forma correcta de tener despliegue automático a staging y aprobado a producción.

---

### Monorepo: ejecutar solo lo afectado

```yaml
      - uses: actions/checkout@v4
        with:
          fetch-depth: 2      # Necesario para comparar contra el commit anterior

      - name: Verificar solo lo afectado
        run: pnpm turbo run lint typecheck test build --filter=...[HEAD^1]
        env:
          TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
          TURBO_TEAM: ${{ vars.TURBO_TEAM }}
```

En un monorepo con seis aplicaciones, esto es la diferencia entre esperar dos minutos y quince.

---

### Seguridad del pipeline

Esta parte se ignora con frecuencia y es donde se producen incidentes reales.

**1. Fija las acciones de terceros por hash de commit, no por etiqueta.**

```yaml
# Frágil: la etiqueta puede reapuntarse
- uses: alguna-org/alguna-accion@v3

# Seguro: hash inmutable
- uses: alguna-org/alguna-accion@a1b2c3d4e5f6...
```

Una acción de terceros ejecuta código en tu pipeline con acceso a tus secretos. Si la etiqueta se reapunta a código malicioso, ya está dentro.

**2. Permisos mínimos por trabajo.**

```yaml
permissions:
  contents: read
  pull-requests: write   # Solo si lo necesita
```

Por defecto, los tokens pueden tener más permisos de los necesarios. Restríngelos explícitamente.

**3. Cuidado con los disparadores sobre pull requests de forks.**

El disparador `pull_request_target` ejecuta con permisos elevados y acceso a secretos, con código que puede venir de un fork no confiable. Es un vector de ataque conocido. Si no sabes exactamente por qué lo necesitas, no lo uses.

**4. Nunca imprimas secretos.**

GitHub enmascara los valores conocidos, pero si transformas un secreto (lo decodificas, lo concatenas) el enmascaramiento puede fallar.

**5. Detección de secretos en el código.**

Añade un paso que escanee el repositorio buscando credenciales committeadas. Es de las verificaciones con mejor retorno.

---

### Optimizar el tiempo de ejecución

**Caché de dependencias.** El `cache: 'pnpm'` del paso de configuración de Node ya lo hace. Verifica que esté funcionando revisando los tiempos.

**Caché de compilación.** Con Turborepo y caché remoto, las compilaciones sin cambios son casi instantáneas.

**Paralelización.** Trabajos independientes corren en paralelo por defecto. Solo usa `needs` cuando haya dependencia real.

**Matrices con criterio.** Probar en cinco versiones de Node multiplica por cinco el tiempo. Prueba en las que realmente soportas.

**Ejecutores más grandes.** Para compilaciones pesadas, los ejecutores de mayor capacidad cuestan más por minuto pero pueden salir a cuenta si reducen el tiempo lo suficiente.

---

### Los errores más comunes

**Pipeline lento que la gente evita.** Si tarda 20 minutos, el equipo empieza a saltárselo. Objetivo: menos de 5 minutos para la verificación de un pull request.

**Pruebas inestables (flaky).** Una prueba que falla aleatoriamente enseña al equipo a reintentar sin mirar. Arréglala o elimínala; una prueba en la que nadie confía es peor que no tenerla.

**Sin verificaciones obligatorias.** Configura la protección de rama para que no se pueda fusionar sin que el pipeline pase. Sin eso, el pipeline es decorativo.

**Migraciones de base de datos automáticas en el despliegue.** Un cambio destructivo generado sin querer no se deshace. Migraciones con revisión y ejecución controlada.

**Sin plan de reversión.** Ten un camino probado para volver a la versión anterior en minutos.

---

### Preguntas frecuentes

**¿Cuánto cuesta GitHub Actions?**
Los repositorios públicos tienen ejecución gratuita. Los privados tienen minutos incluidos según el plan y facturación por encima. Los ejecutores de mayor capacidad y otros sistemas operativos consumen a tarifas distintas. Consulta los detalles vigentes en la documentación.

**¿Ejecutores propios o los de GitHub?**
Los de GitHub para la mayoría de los casos. Ejecutores propios cuando necesitas acceso a red privada, hardware específico, o tienes tanto volumen que el costo lo justifica. Ten en cuenta que un ejecutor propio requiere que tú lo mantengas y lo asegures.

**¿Despliegue continuo a producción?**
Solo con cobertura de pruebas seria, monitoreo de errores y reversión rápida. Sin esas tres cosas, mantén la aprobación manual.
