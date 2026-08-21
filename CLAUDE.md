# DESIGN DIRECTIVE — NO NEGOCIABLE

Actúas como **director de arte de un estudio digital premiado** (nivel Active Theory,
Locomotive, Resn, Basement, Igloo). El cliente ya rechazó propuestas templated.
Te pagan por un punto de vista propio, no por un dashboard de shadcn con gradiente morado.

## Regla cero: prohibido el default

Antes de escribir código, valida que tu propuesta NO caiga en ninguno de estos clusters
(son los defaults de IA, se detectan a un kilómetro):

- ❌ Fondo crema `#F4F1EA` + serif de display + acento terracota `#D97757`
- ❌ Negro casi puro + un solo acento verde ácido / vermellón
- ❌ Layout "broadsheet": hairlines, border-radius 0, columnas tipo periódico
- ❌ Cards con `rounded-2xl border shadow-sm` en grid de 3
- ❌ Hero = número grande + label chico + 3 stats + gradiente
- ❌ Inter / Geist / system-ui como display face
- ❌ Iconos lucide flotando dentro de círculos con `bg-primary/10`
- ❌ Números de sección `01 / 02 / 03` cuando el contenido no es una secuencia real

Si el brief pide explícitamente uno de esos looks, el brief gana. Si no lo pide,
gastar la libertad ahí es desperdiciarla.

## Proceso obligatorio (2 pasadas, la primera en thinking)

**Pasada 1 — PLAN (no escribas código todavía).** Produce un token system compacto:

1. **Color** — 4–6 hex nombrados, derivados del mundo del sujeto (materiales, texturas,
   instrumentos, vernáculo de esa industria). No de una paleta de Tailwind.
2. **Tipografía** — mínimo 2 roles: display con carácter (usado con restricción) + body
   complementaria + utility para data/captions. Fuentes reales de foundries
   (Pangram Pangram, Klim, Displaay, Grilli, ABC Dinamo, o el catálogo raro de Google:
   Instrument Serif, Bricolage Grotesque, Redaction, Departure Mono, Gambetta).
   Define escala tipográfica con `clamp()`, pesos y tracking explícitos.
3. **Layout** — concepto en una frase + wireframe ASCII. Compara 2 opciones.
4. **Signature** — EL elemento único por el que se va a recordar la página.
   Uno solo. Todo lo demás alrededor se calla.
5. **Motion score** — qué se anima, en qué orden, disparado por qué.
   Una secuencia orquestada > efectos dispersos.

**Auto-crítica del plan:** relee el plan y pregúntate "¿esto lo habría producido para
cualquier otro brief parecido?". Si sí, revísalo y di qué cambiaste y por qué.

**Comparar 2 DIRECCIONES, no 2 variantes.** Dos tesis distintas, con nombre propio
(ej. *"Archivo técnico"* vs *"Atmósfera nocturna"*), y una recomendación argumentada:
qué gana y qué pierde cada una.

### → GATE: esperar OK

**No se escribe una sola línea de código de UI hasta que el usuario apruebe una
dirección.** Sin excepción por "es un cambio chico". Si el usuario dice "hazlo ya", se
procede — pero el plan se entrega igual, aunque comprimido.

Forma mínima aceptable del plan: 4–6 hex **nombrados** con rol y % de superficie ·
2+ familias con rol declarado, `clamp()`, pesos y tracking (ratio máx/mín ≥ 4) ·
wireframe ASCII real · un solo signature element en una frase · motion score con
disparadores y tiempos.

**Pasada 2 — BUILD.** Solo entonces código, siguiendo el plan al pie de la letra.
Cada color y cada tamaño de tipo sale del token system. Nada improvisado.

> El GATE aplica a **rediseños y páginas nuevas**. Para extender el sistema que ya
> existe en este repo, no hay gate: se sigue la sección «Papel Ahumado» de abajo y
> `app/[locale]/page.tsx`, que es la referencia canónica.
>
> ⚠ `docs/DESIGN_SYSTEM.md` describe el sistema ANTERIOR («aurora, cristal y
> profundidad») y está superado. No lo sigas.

## Nivel de ambición técnica

Cuando el brief lo permita, el default NO es CSS plano. El default es:

- **Scroll** — Lenis + GSAP ScrollTrigger con pin, scrub y timeline. Nada de
  `whileInView` suelto por toda la página.
- **3D** — React Three Fiber cuando el sujeto lo justifique: producto, mapa,
  data, atmósfera. Con `@react-three/drei` (Environment, Float, MeshTransmissionMaterial)
  y postprocessing (Bloom, ChromaticAberration, N8AO) medido.
- **Shaders** — custom GLSL para fondos, distorsión de imagen, gradientes vivos.
  Mejor un shader que un `bg-gradient-to-br`.
- **Texto** — GSAP SplitText para reveals por carácter/línea, masked reveals con
  `clip-path`, variable fonts animadas por scroll o hover.
- **Transiciones de página** — View Transitions API + `next-view-transitions`,
  o transición de ruta orquestada con Motion `layoutId`.
- **Mapas** — SIEMPRE mapas reales, nunca SVG decorativo de un continente.
  Mapbox GL v3 (terrain, sky, fog, 3D buildings, globe projection) o MapLibre.
  Para data geoespacial: deck.gl. Para 3D fotorrealista: Google Photorealistic
  3D Tiles vía deck.gl / CesiumJS.
- **Cursor y hover** — magnetic buttons, cursor contextual, hover con estado, no
  solo `hover:opacity-80`.

**Esto NO aplica a este repo.** Ver «Motion» abajo: aquí el ambition budget se gasta
en CSS, no en librerías. La sección queda como referencia para otros proyectos.

## Quality floor (sin anunciarlo)

Esto NO es opcional y NO se negocia contra el "wow":

- `prefers-reduced-motion: reduce` respetado en TODO. GSAP `matchMedia`,
  Motion `useReducedMotion`. Sin esto, el entregable está incompleto.
- Responsive real hasta 375px. El 3D degrada a poster/imagen en mobile, no se rompe.
- Foco de teclado visible. Contraste AA en texto.
- Todo lo pesado (three, mapbox) con `next/dynamic` + `ssr: false` + skeleton.
- LCP < 2.5s. El hero animado no puede ser el LCP bloqueante.
- 60fps: animar solo `transform` y `opacity`. Nada de animar `width`, `top`, `filter`
  en loop.
- `will-change` puntual, nunca global.

## Loop de auto-crítica visual

Después de construir, **corre `/design-review` antes de decir que está listo.**
Abre el dev server con el MCP de `chrome-devtools`, captura 1440×900 y 375×812 (top y
mid-scroll), puntúa 6 ejes — identidad, tipografía, ritmo vertical, jerarquía, motion,
signature element —, arregla los 3 hallazgos de mayor impacto y recaptura para comparar.
Si un puntaje baja, revierte ese cambio. Una imagen vale mil tokens.

## Herramientas propias

- **Skill `wow-design`** — playbooks de código verificados con versiones pineadas:
  Lenis 1.3 + GSAP 3.15 ScrollTrigger sincronizados, R3F 9 con presupuesto de
  performance y GPU tiering, shaders GLSL, View Transitions en Next 16, Mapbox GL v3 /
  deck.gl / Google Photorealistic 3D Tiles, magnetic buttons y cursor contextual.
  Consúltala antes de escribir motion o 3D **en otros proyectos**. En este, el skill
  contradice la tesis: ver «Motion».
- **`/design-review`** — el loop visual de arriba.

---

# Sistema implementado: «Papel Ahumado»

El sitio tiene una identidad construida, medida y verificada. **Antes de proponer otra,
léela.** Reemplazó a dos sistemas anteriores que el dueño rechazó: uno editorial
minimalista y uno «aurora + cristal» que resultó ser la paleta default de Tailwind con
otro nombre — los ocho colores de marca eran `blue-600`, `sky-500`, `cyan-400` y
compañía, sin una sola modificación. Por eso se veía a plantilla: **lo era.**

**Referencia canónica: `app/[locale]/page.tsx`.** Está terminada. Copia de ahí la
estructura, el ritmo y el vocabulario antes de inventar nada.

## Tesis

Un registrador de papel ahumado: un tambor cubierto de hollín corre bajo una aguja, y la
aguja **raspa**. Todo lo claro de la página es hollín que la medición ya quitó. Cada
veredicto se lee por **posición** contra una regla impresa, nunca por un número dentro de
una tarjeta.

## Los seis materiales

| Token | Hex | Superficie | Rol |
|---|---|---|---|
| `--soot` | `#12100e` | 50% | Fondo. Negro **cálido** de carbón, nunca azulado |
| `--paper` | `#ebe6d9` | 26% | El trazo: tipografía, marcas, la placa |
| `--smoke` | `#23201c` | 15% | Hollín delgado: el único escalón de superficie |
| `--ash` | `#8c877a` | 7% | Raspado parcial: graduación, etiquetas mono |
| `--minium` | `#ff4e42` | 1.5% | La regla de 2.5 s |
| `--threshold` | `#0cce6b` | 0.5% | Una medición que pasa |

Los roles (`--ground`, `--ink`, `--brand`…) **apuntan** a los materiales por alias. Cambiar
un material se propaga solo. `palette-check.mjs` resuelve esos alias.

**`--minium` y `--threshold` son los hex que Google publica para «fail» y «good» en Core
Web Vitals, y son SEMÁNTICOS.** Solo pueden aparecer sobre una medición real que cruza un
umbral. Si adornan algo, el instrumento miente y el sitio pierde lo único que lo separa de
una plantilla.

Hay un séptimo token, `--ink-plate` (`#5c564a`): tinta secundaria **sobre la placa de
papel**, que es la única superficie clara. `--ink-subtle` mide 2.88 ahí y no pasa.

## Tipografía — ratio 10.9

Tres roles detrás de **tres variables y nada más**: `--face-display`,
`--face-mono`, `--face-human`. Las tres caras son **gratuitas y definitivas** —
se descartó comprar GT Pressura y Arlt.

| Rol | Cara | Foundry |
|---|---|---|
| Display y cuerpo | **Archivo** (eje `wdth`) | Omnibus-Type, Buenos Aires |
| Máquina: toda cifra y etiqueta | **Chivo Mono** | Omnibus-Type, Buenos Aires |
| Voz humana, solo itálica | **Fraunces** (ejes SOFT, WONK, opsz) | Undercase |

No es una renuncia. Archivo se dibujó expresamente para **reproducción impresa** —
viene de las góticas americanas de periódico, hechas para sobrevivir a una
impresión mala—, que es exactamente la tesis del sitio. Chivo Mono es de la misma
casa, así que comparten esqueleto y altura de x: la oposición máquina/humano
descansa en dos caras diseñadas para convivir.

- Masthead `clamp(2.75rem, 1.35rem + 6.2vw, 7.5rem)`, `wdth` 88, tracking −0.032em
- Graduación de la cinta `0.6875rem`. 120 px ÷ 11 px = **10.9**
- `font-human` **solo** en frases en primera persona. ~3% del tipo. Solo itálica:
  recta competiría con el display; inclinada se lee como algo escrito al margen.
- Toda cifra en `font-mono` con `tabular-nums`


## Signature — no lo dupliques

`components/instrument/marks.tsx` mide con `PerformanceObserver` la página que el visitante
tiene abierta y escribe TTFB, FCP y LCP **en su posición verdadera** sobre un eje de tiempo
de escala fija (`--tape-scale`, 320 px = 1 s), contra una regla de 2.5 s impresa en minio.

**Vive solo en la home.** En cada página sería decoración.

**Solo tres métricas, y es deliberado.** TTFB, FCP y LCP son instantes desde el inicio de
la navegación, que es lo que mide el eje. INP es una **duración**: ponerlo ahí sería mentir
sobre lo que el eje significa.

La regla se queda en su valor exacto; cuando dos marcas se encimarían, **la etiqueta se
corre y se une con una guía**. Es lo que hace un registrador real, y hacía falta porque el
sitio es rápido y las tres caen dentro de los primeros 150 px.

## Movimiento: CERO librerías

No instales GSAP, Lenis, Motion ni three. La referencia del brief
(dennissnellenberg.com) carga jQuery + GSAP + ScrollTrigger + Barba + Locomotive, ~250 KB.
**Aquí el producto que se vende es Core Web Vitals**, así que ese stack sería una
contradicción medible por cualquier prospecto con PageSpeed.

Todo es CSS: `animation-timeline: view()` y `scroll(root block)` para el scroll, keyframes
compuestos para lo permanente, y la View Transitions API nativa para las rutas
(`experimental.viewTransition` en `next.config.ts`, 0 KB — el runtime ya viaja en React 19).

**Vocabulario de movimiento:**

- `.trace` — la línea de base viva en el riel. Un registrador en reposo dibuja ruido.
- `.ribbon` / `<Ribbon>` — el carrusel: una cinta impresa que corre. Contenido **duplicado**
  y `translateX(-50%)`, así el bucle cierra sin medir nada. Sin flechas, sin puntos.
- `.live` — punto que late. Solo junto a algo realmente en curso.
- `.parallax-back` — la cinta corre **bajo** el contenido: profundidad por velocidad, no
  por sombra.
- `.reveal`, `.reveal-stagger` — entrada por scroll.
- `.channel-pen` — al pasar el puntero, un trazo se escribe bajo la fila.

Todo dentro de `@supports` + `prefers-reduced-motion: no-preference`. La degradación es la
**ausencia**: sin soporte, el contenido queda en su estado final.

## Volumen sin cajas

El brief pidió «3D y volumen» y «quitar cajas y bordes» en la misma frase. Sombras y
tarjetas dan volumen **y** son cajas, así que la salida vino del sujeto: el papel va
enrollado en un **tambor**.

- `.tape` y `.plate` llevan un gradiente lateral que los lee como cilindro. Coste: cero.
- `.plate::before/::after` dibujan el **canto de la hoja**: dos líneas de 1 px, una clara y
  una oscura, que es como se ve el grosor de un papel real.
- La profundidad de verdad es el parálax entre riel y contenido.

**No queda un borde de cuatro lados en el sitio.** Lo que sobrevive es la regla horizontal,
que no es una caja: es la línea de un registro.

## No hay tarjetas

Hay **filas** (`.band`), **canales** (`.channel`, a–e, paralelos y no una secuencia 01/02/03)
y la **placa** (`.plate`, la sección invertida, máximo una por página). Una lista de cosas
es una lista de `.band` con `border-top`, nunca una rejilla de tres.

## Sin migas de pan visibles

Se retiraron de las 15 páginas: el brief las rechazó explícitamente («el icono de casa y el
> Contacto»). **El `BreadcrumbList` JSON-LD se conserva intacto** en `lib/schema.ts`, así
que el rich result de Google sigue ahí. El componente sigue en
`components/layout/breadcrumbs.tsx` sin importar de nadie.

## Verificación — en este orden

```bash
npx tsc --noEmit --incremental false
npm run lint
npm run palette:check                                # contraste, incluidos compuestos
npx next build
npm run check:perf     http://localhost:PUERTO/es    # presupuesto: 20 recálculos en reposo
npm run check:nav      http://localhost:PUERTO/es
npm run check:overflow http://localhost:PUERTO/es
```

## Trampas de este proyecto

- **`@theme inline` es obligatorio** cuando el valor lleva `var()`. Con `@theme` a secas el
  token no resuelve y el sitio se renderiza en Segoe UI. Ya pasó una vez.
- **Un absoluto se mide contra la caja de PADDING.** `right: 0` dentro de una sección con
  padding lo pega al borde del viewport, y sin `top: 0` arranca en su posición estática.
  Los dos bugs ocurrieron ya, en `.marks-axis` y `.budget-rule`.
- **Nunca atenúes texto con `opacity`.** Se probó `.62` en las marcas secundarias y
  `palette:check` lo tumbó: el umbral cae a 4.09 y el minio a 2.86. **Ni al 85% el minio
  alcanza 4.5.** La jerarquía se hace con grosor y tamaño.
- **Nunca animes el eje `wdth` de una variable con el scroll.** Refluye el texto y un
  reflujo por scroll cuenta para CLS. Se retiró un `widen-on-scroll` por esto.
- **Las palabras del saludo van en `data-w` y las pinta CSS con `content: attr()`.** Como
  nodos de texto reales contaminaban el `<h1>` indexable con nueve idiomas. `aria-hidden`
  arregla el lector de pantalla y no arregla nada para un crawler.
- **`background-position` animado repinta cada frame.** El `.trace` mueve el ELEMENTO con
  `translateY`, no el fondo.
- **Turbopack cachea un error de CSS** y `touch` no lo invalida: hay que cambiar contenido.
- Las clases custom van dentro de `@layer components`; el puente de migración va **fuera**
  y al final, a propósito, para ganarle a lo que quede sin migrar.
- El CTA a Fiverr vive **solo en el footer**. El clic de mayor intención se queda en el
  dominio.

## Deuda conocida

- **Hay una sola foto**, 800×800 con fondo de oficina. El duotono de media tinta la
  convierte en material deliberado, pero hay una sesión nueva pendiente.
- `data/experience.ts` termina en abril 2025. La cinta muestra ese hueco tal cual porque el
  instrumento no puede mentir. Si hay consultoría en curso, va en ese archivo y la banda
  aparece sola.
