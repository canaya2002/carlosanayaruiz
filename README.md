# carlosanayaruiz.com

Sitio de consultoría de Carlos Anaya Ruiz — consultor SEO técnico e ingeniero
full-stack, Ciudad de México. Bilingüe (español principal, inglés), estático,
sin CMS y **sin base de datos**.

Next.js 16 App Router · React 19 · TypeScript strict · Tailwind CSS v4 ·
next-intl v4 · Vercel

```bash
npm install
npm run dev              # http://localhost:3000 -> redirige a /es
npm run typecheck        # tsc --noEmit --incremental false
npm run palette:check    # sincronía de paleta + pisos de contraste WCAG
npm run verify           # typecheck + palette + build
```

---

## Decisiones que no hay que revertir por accidente

Tres cosas se eliminaron a propósito. Cada una tiene un comentario en el código
explicando por qué; esta lista existe para que nadie las reintroduzca creyendo
que faltan.

### 1. No hay base de datos

Había Firestore para el formulario de contacto y un newsletter. Se eliminó
entero: la dependencia `firebase`, `lib/firebase.ts`,
`lib/firebase-services.ts`, `firestore.rules` y el componente del newsletter.

El formulario de contacto (`components/sections/contact-form.tsx`) compone un
enlace `mailto:` y abre la aplicación de correo del visitante con el mensaje ya
escrito. La pantalla lo dice antes de que hagas clic, y hay una salida alterna
(copiar el correo) para quien no tenga cliente configurado.

El formulario sigue existiendo porque **estructura el mensaje**: alguien que ve
los campos "URL del sitio" y "qué está pasando y desde cuándo" escribe un correo
útil. Un `mailto:` a secas produce "hola, info?".

Si vuelve la recepción real (Resend, Formspree, una Route Handler), el cambio es
el `onSubmit` de ese archivo, y el host concreto hay que añadirlo a
`connect-src` en `next.config.ts` — nunca con comodín.

### 2. No hay modo oscuro

Existía y seguía `prefers-color-scheme`. El resultado práctico: cualquiera con
el sistema operativo en oscuro —incluido el dueño— veía una versión casi negra
que nadie había aprobado, y era lo primero que se llevaba de impresión.

No hay clase `.dark`, ni variante `dark:`, ni script de arranque de tema, ni
componente de toggle. Un solo tema significa que lo que se aprueba es
exactamente lo que todos ven.

> Cuidado con un detalle no obvio: el script de tema también estaba duplicado en
> `app/not-found.tsx`, y como Next inyecta el markup de esa frontera en el
> payload de **todas** las páginas, seguía llegando al navegador en cada URL
> después de quitarlo del layout. Si algún día reaparece un
> `prefers-color-scheme` en el HTML servido, busca ahí primero.

### 3. `/` siempre va a español

`i18n/routing.ts` fija `localeDetection: false`.

Con la detección activa (su valor por omisión), next-intl negocia el idioma con
el header `Accept-Language`: cualquiera con el navegador en inglés aterrizaba en
`/en` y nunca veía el sitio en español. Así fue como el sitio "solo estaba en
inglés".

Esta práctica es México primero: el español es el mercado principal y el
`x-default` de hreflang. Una petición sin prefijo resuelve a `/es`, siempre, y al
inglés se llega por decisión — el selector de idioma o un enlace directo a `/en`.
Google además desaconseja redirigir por `Accept-Language`, porque sus crawlers no
envían el header de forma consistente.

---

## Rutas

| Página | ES | EN |
|---|---|---|
| Inicio | `/es` | `/en` |
| Servicios (hub) | `/es/servicios` | `/en/services` |
| SEO técnico | `/es/seo-tecnico` | `/en/technical-seo` |
| Desarrollo web | `/es/desarrollo-web` | `/en/web-development` |
| Automatización IA | `/es/automatizacion-ia` | `/en/ai-automation` |
| Dashboards | `/es/dashboards` | `/en/dashboards` |
| Sobre mí | `/es/sobre-mi` | `/en/about` |
| Contacto | `/es/contacto` | `/en/contact` |
| Recursos | `/es/libros` | `/en/books` |
| Privacidad | `/es/privacidad` | `/en/privacy` |
| Términos | `/es/terminos` | `/en/terms` |

**Añadir o renombrar una ruta toca exactamente dos archivos**, y los tipos te
obligan a hacer los dos:

1. `i18n/routing.ts` — el mapa `pathnames` con el que navega next-intl.
2. `lib/constants.ts` — la tabla `ROUTES` de la que se deriva todo lo demás.

`app/sitemap.ts` tipa su metadata como `Record<RouteKey, SitemapMeta>`, así que
una ruta nueva sin metadata de sitemap es un error de compilación, no una página
que se publica sin listarse.

---

## Fuentes únicas de verdad

Casi todos los defectos que ha tenido este repo fueron dos lugares en
desacuerdo. Cada una de estas existe para que eso no pueda pasar:

| Dato | Dueño | Nunca lo dupliques en |
|---|---|---|
| Color | `app/globals.css` | componentes, `tailwind.config` (borrado — muerto en v4) |
| Paleta en hex | `PALETTE_HEX` en `lib/constants.ts` | manifest, viewport, `lib/og.tsx` |
| NAP (nombre/correo/teléfono/ciudad) | `NAP` en `lib/constants.ts` | copy, schema, footer |
| URLs | `ROUTES` + `routeUrl()` | sitemap, schema, breadcrumbs |
| Copy | `messages/{es,en}.json` | strings sueltos |
| Datos de servicio | `data/services.ts` | cuerpos de página |
| Hechos de la entidad | `lib/schema.ts` | cualquier otro lugar |

`data/services.ts` tenía un `slug` de texto libre por idioma, y tres de los
cuatro servicios habían derivado de su ruta real — así que canonical y schema
apuntaban a páginas que no existían. Ahora lleva `route: RouteKey`, con lo que
ese error deja de ser representable.

---

## Diseño

Lenguaje **"tech vivo"**: fondo claro, gradiente azul → violeta → cian como
firma, profundidad con sombras teñidas, y movimiento presente.
Lee [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) antes de tocar un
componente — es el contrato, no una sugerencia.

Tres reglas cubren la mayoría:

- **Nunca un color literal.** Solo tokens semánticos (`bg-ground`, `text-ink`,
  `text-ink-muted`, `border-hairline`, `bg-brand`, `text-violet`).
- **`--cyan` es solo decorativo.** Mide 2.4:1 sobre el fondo: sirve como stop de
  gradiente o resplandor, nunca como texto ni borde con significado.
- **Solo se anima `transform`, `opacity` y `filter`.** Este sitio vende
  optimización de Core Web Vitals; una animación que provoque CLS o suba el INP
  es una contradicción medible.

`npm run palette:check` verifica que `PALETTE_HEX` siga sincronizado con los
tokens CSS **y** que cada piso de contraste WCAG se cumpla. Los dos bordes,
`--hairline` (decorativo, 1.2:1) y `--control` (componente de formulario,
3.5:1), tienen pisos distintos a propósito — la regla 1.4.11 aplica al segundo y
no al primero.

### Movimiento

- **Entrada al cargar** (`.enter`, `.step-1..6`) — solo la primera pantalla.
- **Revelado al scroll** (`.reveal`, `.reveal-stagger`) — con
  `animation-timeline: view()`, **cero JavaScript**. En un navegador sin soporte
  el bloque `@supports` no aplica y el contenido está visible: no hay estado
  oculto que dependa de que algo se ejecute, así que ningún crawler ve una
  página en blanco.
- **Con JS** (`components/motion/`): `<Counter>` cuenta al entrar pero renderiza
  el valor final en el servidor; `<PointerGlow>` sigue al cursor y se apaga solo
  en pantallas táctiles.

Todo muere bajo `prefers-reduced-motion: reduce`, incluida la malla de fondo.

### Fuentes

Dos archivos, ambos variables: **Sora** para títulos y **Plus Jakarta Sans**
para texto, auto-hospedadas por `next/font` y con subconjunto
`latin` + `latin-ext` (el español necesita los acentos).

---

## Imágenes

Cada asset se genera al tamaño al que realmente se sirve:

```bash
npm run assets:generate    # scripts/generate-assets.mjs
```

Antes: todo archivo en `public/` era un PNG de 1000×1000 y ~517 KB sin importar
su función —`favicon.ico` incluido— y las imágenes Open Graph eran cuadradas
declaradas como 1200×630, así que las previsualizaciones de enlaces salían mal
en todas partes. Eran ~5.8 MB. Ahora son ~78 KB.

**Las imágenes OG no son archivos estáticos.** Cada página tiene un
`opengraph-image.tsx` que pasa por `renderOgCard()` en `lib/og.tsx`, así que el
tamaño declarado y los píxeles producidos no pueden discrepar. Next inyecta la
ruta en la metadata automáticamente — no pongas `openGraph.images` a mano.

Satori (el motor de `next/og`) no puede leer fuentes variables, así que
`assets/fonts/` guarda cortes estáticos usados **solo** para las tarjetas OG.
Están versionados a propósito: descargarlos de Google en tiempo de build haría
que un fallo de red reventara el deploy.

---

## SEO

- **Canonical + hreflang** en cada página vía `generatePageMetadata`, derivados
  de `ROUTES`. Recíprocos y autorreferenciales; `x-default` → español.
- **JSON-LD** — un `@graph` por página desde `lib/schema.ts`. `Person` es la
  entidad principal (marca personal); `ProfessionalService` es lo que opera; se
  referencian mutuamente.
- **`robots.txt`** (`app/robots.ts`) nombra explícitamente cada crawler que
  importa en lugar de confiar en `*`. `GPTBot` (entrenamiento) y
  `OAI-SearchBot` (ChatGPT Search) son decisiones separadas — el comentario ahí
  explica la actual.
- **`sitemap.xml`** usa una constante `CONTENT_UPDATED` honesta. **Súbela cuando
  el contenido cambie de verdad**, no en refactors.
- **Sin `meta keywords`.** Google la ignora desde hace veinte años.
- **IndexNow** para Bing/Copilot: ver [`docs/seo/INDEXNOW.md`](docs/seo/INDEXNOW.md).

### Cosas que deliberadamente NO se hacen

Porque serían datos estructurados falsos, no optimización:

- Sin `aggregateRating` ni `review` del negocio. Google no permite que reseñas
  propias generen estrellas, y de todos modos no hay datos de reseñas.
- Sin `SearchAction` — no hay búsqueda en el sitio. La versión anterior declaraba
  una apuntando a la página de contacto.
- Sin marcado `Book`/`Product` con oferta para el libro que no está publicado.
- Sin `dateModified` inventado a partir de la hora del build.
- Sin clientes, testimonios, métricas ni precios fabricados en ninguna parte.

---

## Estructura del layout

`app/layout.tsx` devuelve `children` a secas a propósito:
`app/[locale]/layout.tsx` es el que renderiza `<html>` para que `lang` pueda ser
por idioma. Es el patrón documentado de next-intl, y significa que **cualquier
archivo en la raíz tiene que renderizar su propio `<html>`/`<body>`** —
`app/not-found.tsx` lo hace.
