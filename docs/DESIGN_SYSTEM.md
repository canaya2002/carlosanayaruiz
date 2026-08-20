# Sistema de diseño — aurora, cristal y profundidad

Lenguaje visual con **color saturado en movimiento, cristal real y 3D con punto
de fuga compartido**. Fondo claro, gradiente azul → cielo → cian como firma,
carruseles en vez de rejillas estáticas, huecos de imagen etiquetados donde
todavía no hay foto.

Reemplazó a dos sistemas anteriores que el dueño rechazó por sosos: primero uno
editorial minimalista, después uno que sí tenía efectos pero los frenaba «por
rendimiento» antes de que se vieran. **Cuando dudes entre lo discreto y lo
vistoso, elige lo vistoso** — respetando las reglas medidas de abajo, que no son
opinión: salen de `scripts/palette-check.mjs` y `scripts/perf-probe.mjs`.

**Referencia canónica: `app/[locale]/page.tsx`.** Está terminada. Copia de ahí
la estructura, el ritmo y el vocabulario de clases antes de inventar nada.

Verificación, en este orden:

```bash
npx tsc --noEmit --incremental false
npm run palette:check      # contraste, incluidos los casos compuestos
npm run images:manifest    # regenera docs/IMAGENES.md
npx next build
npm run check:perf   http://localhost:PUERTO/es        # presupuesto: 20
npm run check:nav    http://localhost:PUERTO/es
npm run check:overflow http://localhost:PUERTO/es
```

---

## Lo no negociable

1. **Nunca escribas un color literal.** Ni `#hex`, ni `rgb()`, ni colores de la
   paleta de Tailwind (`bg-blue-600`, `text-gray-500`). Solo los tokens
   semánticos de abajo, definidos en un único sitio: `app/globals.css`.
   La única excepción viva es `lib/constants.ts` → `PALETTE_HEX`, que alimenta
   el `theme-color`, el manifiesto y las imágenes OG: las pinta Satori, que no
   lee variables CSS. `palette-check` verifica que sea un espejo exacto de
   `globals.css`, así que no puede desviarse en silencio.
2. **No existe modo oscuro.** No hay clase `.dark`, no hay variante `dark:`, no
   hay `prefers-color-scheme`, no hay script de tema. Fue eliminado a propósito.
   Verificado sobre el CSS servido: **0 apariciones de cada uno**.
3. **`--sky` y `--cyan` son solo decorativos.** Miden **2.70:1** y **1.76:1**
   sobre el fondo. Sirven como stop de gradiente, aurora o resplandor. **Nunca**
   texto, nunca un borde que signifique algo, nunca el relleno de un botón. Para
   texto legible: `text-sky-ink` (5.78) o `text-cyan-ink` (5.22).
4. **Solo se animan `transform`, `opacity` y `filter`.** Nada que afecte el
   layout. Este sitio vende optimización de Core Web Vitals; una animación que
   provoque CLS o suba el INP es una contradicción que se puede medir.
5. **El contenido tiene que estar en el HTML del servidor.** Nada detrás de un
   clic, un scroll o un `useEffect`. Los carruseles cumplen: el imán es
   `scroll-snap` nativo y los elementos completos están en el markup.
6. **Un solo `<h1>` por página.** Verificado en las 16 páginas.

---

## Aurora — lo que hace visible al cristal

El error del sistema anterior: el cristal era invisible porque el fondo era casi
blanco. **Un panel translúcido sobre blanco se ve como un panel blanco.** No
había nada que difuminar. La aurora son cuatro campos de color saturados que se
mueven despacio y le dan al `backdrop-filter` algo real que procesar.

```tsx
<section className="relative isolate overflow-hidden">
  <div className="aurora" aria-hidden="true">
    <i /><i /><i /><i />
  </div>
  <div className="grain" aria-hidden="true" />
  <div className="grid-fade" aria-hidden="true" />
  <PointerGlow />
  {/* contenido */}
</section>
```

- **Los cuatro `<i>` son obligatorios.** Cada uno es un campo distinto con su
  color, su tamaño y su ciclo. Con menos, el fondo se lee como una mancha.
- **Va en cada sección principal**, no solo en la cabecera. Es lo que da vida y
  lo que hace que el cristal exista.
- La sección contenedora necesita `relative isolate overflow-hidden`: `isolate`
  para que el `z-index` de los campos no escape, `overflow-hidden` para que los
  óvalos no ensanchen el documento.
- `<PointerGlow />` es opcional y arrastra runtime de cliente. Ponlo en la
  cabecera y en una o dos secciones más, no en todas.
- **En páginas de servicio, `Backdrop` es un helper local** (`function Backdrop({
  glow = false })`) declarado en cada archivo de página, no un componente
  compartido. Es a propósito: cada página ajusta cuántas auroras lleva glow.

**Cuántas caben.** Medido en el sitio actual: 3–4 auroras por página, y el
presupuesto de recálculos de estilo en reposo se mantiene en **6–9 de 20**.

---

## Cristal

`.glass` / `.glass-strong` / `.glass-tint` / `.glass-spec` / `.glass-rim`, o el
componente `<GlassPanel>` de `components/ui/glass-panel.tsx`.

**Úsalo mucho** — en el sistema anterior se usó de menos. El sitio actual lleva
18–49 nodos de cristal por página.

| Clase | Qué hace |
|---|---|
| `.glass` | Panel base: 62 % de blanco, `blur(28px)`, `saturate(180%)` |
| `.glass-strong` | Sube a 74 % de blanco. **Obligatorio si contiene `text-ink-subtle`** |
| `.glass-tint` | Variante teñida de marca |
| `.glass-spec` | Reflejo especular en el canto superior |
| `.glass-rim` | Borde luminoso |

Prohibiciones, cada una con su razón:

- **Nunca cristal dentro de cristal.** Difumina dos veces: el doble de costo por
  un efecto que se ve peor. Si necesitas un panel dentro de un panel, el
  interior es opaco (`.card`, `bg-surface-alt`). Verificado en runtime: **0
  `backdrop-filter` anidados**.
- **En rejillas de más de ~8 elementos, usa `.card`** (opaca). Ocho
  `backdrop-filter` es el punto donde deja de pagarse solo.
- **Si la sección no lleva aurora, no pongas cristal.** Sin nada saturado
  detrás, un panel translúcido se ve idéntico a uno blanco y pagas el
  `backdrop-filter` a cambio de nada. Ahí va `.card` o `.grad-soft`.

**El truco de la placa de fondo.** `.glass` lleva `contain: paint`, que aplana el
3D: con el contenido dentro, las clases `.depth-*` no levantan nada. Cuando
necesites las dos cosas, la placa de cristal va como **hermano de fondo** y no
como contenedor:

```tsx
<div className="relative flex h-full flex-col p-6 [transform-style:preserve-3d]">
  <span className="absolute inset-0" aria-hidden="true">
    <span className="glass glass-spec block size-full" />
  </span>
  <p className="depth-1 text-ink">…</p>
</div>
```

Son dos capas porque `.glass` fija `position: relative` y le ganaría al
`absolute`.

---

## 3D

**La perspectiva va en el CONTENEDOR (`.scene`), la rotación en el HIJO
(`.tilt`).** Separarlas hace que una rejilla comparta punto de fuga. Si cada
tarjeta lleva su propia perspectiva, el 3D se ve falso — cada una gira por su
cuenta como si fueran doce cámaras distintas.

| Herramienta | Cuándo |
|---|---|
| `<Tilt3D>` (`components/motion/tilt-3d.tsx`) | Tarjetas protagonistas: inclinación que sigue al puntero. Envuelve el contenedor en `.scene` |
| `.tilt-hover` | Rejillas: inclinación fija en hover, sin JS |
| `.depth-1` / `.depth-2` / `.depth-3` | Planos dentro de una tarjeta inclinada, para que el contenido flote sobre el fondo |
| `.stack-3d` | Pila de tarjetas que se abre en hover. Para el héroe |
| `.enter-3d` / `.reveal-3d` | Entrada girando desde atrás |

Cuidado con el conflicto de `transform`: una animación con `fill: both` se queda
dueña del `transform` de su elemento para siempre. `.reveal-3d` en el mismo nodo
que `.tilt-hover` mata la inclinación. Pon el revelado en la tarjeta interior y
la inclinación en el `<li>`.

---

## Carruseles

`<Carousel>` de `components/ui/carousel.tsx`.

```tsx
<Carousel label={tl('scopeRail')} prevLabel={tl('prevSlide')} nextLabel={tl('nextSlide')}>
  <Tilt3D className="w-[19rem] sm:w-[23rem]">…</Tilt3D>
</Carousel>
```

- Props: `{ children, label, prevLabel, nextLabel, className }`.
- **El scroll y el imán son nativos** (`scroll-snap`). Si su JS no corre, el
  carrusel sigue funcionando y el contenido completo está en el HTML del
  servidor.
- **Los hijos necesitan ancho fijo**: `className="w-[19rem] sm:w-[23rem]"`.
- `.scene` ya vive en el riel, así que todas las tarjetas comparten punto de
  fuga. No lo repitas por tarjeta.
- Úsalos para capturas, certificaciones, premios, stack, y cualquier lista de
  más de 4 elementos que sería una rejilla estática.

**Los carriles NO desbordan la página**, y por eso `overflow-audit` los cuenta
aparte. Un riel con hijos de ancho fijo *tiene* que extenderse más allá del
viewport: eso es lo que lo hace desplazable. El script solo reporta un elemento
si **ningún** ancestro lo contiene, ni un riel (`overflow-x: auto|scroll`) ni una
sección recortada (`hidden|clip`). Medido en `/es` a 360 px: 203 elementos
rebasaban el viewport y **cero** desbordaban de verdad — 171 dentro de un riel,
32 dentro de un clip.

---

## Huecos de imagen

`<ImageSlot>` de `components/ui/image-slot.tsx`. Es lo que el dueño pidió más
explícitamente: «no hay muchas imágenes con huecos vacíos y algo que las
referencie para yo entender dónde van».

```tsx
<ImageSlot
  path={`/proyectos/${slug}/captura-1.png`}
  alt="Captura 1 de Amazon"
  hint="Captura del dashboard"
  width={1200}
  height={750}
  className="depth-1 aspect-[16/10] w-full rounded-xl shadow-lift-2"
/>
```

- `path` es la ruta relativa a `/public`, **con barra inicial**, en kebab-case.
- Con `filled` en falso (el caso hoy: no hay ninguna imagen puesta) dibuja un
  patrón determinista por hash de la ruta y **encima escribe la ruta exacta del
  archivo que falta y el tamaño**. Ese es el punto: un hueco gris anónimo no le
  dice a nadie dónde pegar nada.
- `hint` dice **qué** va ahí en dos palabras: «Captura del dashboard», «Diploma»,
  «Logo».
- La etiqueta es `.glass-strong` porque contiene `text-ink-subtle`. Por eso el
  hueco tiene que ir dentro de una superficie **opaca** (`.card`), nunca dentro
  de otro cristal.
- La ruta se arma en **una sola plantilla** (`` {`public${path}`} ``). Con dos
  hijos de texto adyacentes React mete un `<!-- -->` en medio, y la ruta deja de
  existir como texto: no aparece al ver el código fuente ni al buscarla con
  Ctrl+F. Es exactamente lo que hay que poder copiar.
- Para apagar las etiquetas cuando ya haya fotos: `NEXT_PUBLIC_SHOW_SLOTS=0`.
  El patrón se queda, así que la página nunca se ve rota.

**Estado medido:** 31 declaraciones de `<ImageSlot>` en el código, que rinden
**89 huecos etiquetados por idioma** (las rutas dinámicas rinden uno por dato).
El inventario completo, con la ruta y el tamaño de cada uno, está en
`docs/IMAGENES.md` — **generado**, no escrito a mano: `npm run images:manifest`
escanea el código, así que el documento no puede mentir sobre dónde van las
imágenes.

---

## Interacción «pro»

El tacto es la mitad de la sensación de calidad. **Ponlas en todo lo clicable.**

- `.press` — baja de escala al hacer clic, casi instantáneo.
- `.lift` — se eleva en hover (`transform` + `box-shadow`, nunca `margin` ni `top`).
- `.sheen` — barrido especular.
- `.float` / `.float-slow` — flotación permanente, para elementos decorativos.

`.press` está escrita **fuera de toda `@layer`**, así que su `transition` le gana
a cualquier utilidad de Tailwind (que viven en `@layer utilities`). No le sumes
`transition-colors`: quedaría como clase muerta.

**Nav desplegable.** Los dos grupos del header abren **al pasar el mouse**, sin
clic. El cierre lleva 220 ms de retardo, porque sin él el hueco de 1 px entre la
etiqueta y el panel cierra el menú justo cuando el puntero va hacia él. El cierre
es **por grupo**, nunca global: con un `onClose` compartido, barrer el puntero de
«Servicios» a «Trayectoria» abría el segundo y 220 ms después el temporizador ya
obsoleto del primero lo cerraba — el menú parpadeaba y se sentía roto. Si tocas
`components/layout/header.tsx`, vuelve a correr `npm run check:nav`.

---

## Tokens de color

| Token | Utilidad | Uso |
|---|---|---|
| `--ground` | `bg-ground` | Fondo de página |
| `--ground-tint` | `bg-ground-tint` | Bandas alternas de sección |
| `--surface` | `bg-surface` | Tarjetas, paneles opacos |
| `--surface-alt` | `bg-surface-alt` | Panel dentro de un panel |
| `--ink` | `text-ink` | Texto principal, títulos (**15.71:1**) |
| `--ink-muted` | `text-ink-muted` | Texto corrido (**5.89:1**) |
| `--ink-subtle` | `text-ink-subtle` | Metadatos, pies (**4.96:1**) |
| `--hairline` | `border-hairline` | Divisores — **decorativo** |
| `--hairline-strong` | `border-hairline-strong` | Divisor enfatizado — **decorativo** |
| `--control` | `border-control` | Bordes de input y botón outline (**3.51:1**, piso 1.4.11) |
| `--brand` | `bg-brand` `text-brand` | Acción primaria, enlaces (**5.03:1**) |
| `--brand-strong` | `text-brand-strong` | Hover, enlaces sobre banda (**6.53:1**) |
| `--brand-ink` | `text-brand-ink` | Texto sobre relleno de marca |
| `--brand-wash` | `bg-brand-wash` | Fondo teñido de marca |
| `--sky` | `bg-sky` | **Solo decorativo** — 2.70:1 |
| `--sky-ink` | `text-sky-ink` | Cielo legible como texto (**5.78:1**) |
| `--sky-wash` | `bg-sky-wash` | Fondo teñido cielo |
| `--cyan` | `bg-cyan` | **Solo decorativo** — 1.76:1 |
| `--cyan-ink` | `text-cyan-ink` | Cian legible como texto (**5.22:1**) |
| `--cyan-wash` | `bg-cyan-wash` | Fondo teñido cian |

---

## Contraste — las reglas compuestas

Aquí es donde el sistema anterior falló, porque nadie midió el **apilado**. Un
texto no cae sobre el fondo: cae sobre la aurora, y sobre el cristal que está
sobre la aurora. `palette-check` calcula ese apilado (aurora al 30 % sobre el
fondo = `#bbcef8`; cristal al 62 % encima = `#e5ecfc`; al 74 % = `#edf2fd`).

| Situación | Medido | Veredicto |
|---|---|---|
| `ink` directo sobre la aurora | **10.21** | pasa |
| `ink-muted` directo sobre la aurora | **3.83** | **NO pasa** |
| `ink-subtle` directo sobre la aurora | **3.23** | **NO pasa** |
| `ink` sobre `.glass` | **13.62** | pasa |
| `ink-muted` sobre `.glass` | **5.11** | pasa |
| `ink-subtle` sobre `.glass` | **4.30** | **NO pasa** |
| `ink-subtle` sobre `.glass-strong` | **4.54** | pasa |
| `brand-strong` sobre `.glass` | **5.66** | pasa |
| blanco sobre cristal | **1.96** | **NO pasa nunca** |

De ahí salen cuatro reglas mecánicas:

1. **Texto directo sobre la aurora solo puede ser `text-ink`.** Si necesitas
   texto secundario ahí, **mételo en un panel de cristal**.
2. **Un panel que contenga `text-ink-subtle` tiene que ser `.glass-strong`.**
3. **Texto sobre cristal siempre es tinta, nunca blanco.**
4. **Blanco solo sobre `.grad-fill`**, cuyos stops pasan todos 5.3:1.

Excepción legítima: un **ícono** no es texto. El piso de un control gráfico es
3:1 (WCAG 1.4.11), no 4.5. Los chevrones del nav llevan `text-ink-subtle` sobre
el cristal del header (4.30) y eso está bien porque no hay texto ahí.

### Los tres gradientes NO son intercambiables

| Clase | Uso | Regla |
|---|---|---|
| `.grad-deco` | Decorativo | **Sin texto encima.** Pasa por `--sky` y `--cyan` |
| `.grad-fill` | Relleno con texto blanco | Todos los stops ≥ 5.3:1 |
| `.grad-text` | Texto recortado | Todos los stops ≥ 5.7:1 |
| `.grad-soft` | Lavado de fondo suave | Sin coste de capa compuesta |
| `.grad-drift` | Lavado que deriva | Anima un `::before` en `-z-10` |

`.grad-drift` mueve un `::before` en `z-index: -10`, así que sus hijos necesitan
`relative` o quedan por debajo.

---

## Rendimiento — el presupuesto y por qué existe

El dueño reportó lentitud. La causa se encontró **midiendo**, no adivinando.
`npm run check:perf` mide recálculos de estilo en 3 s en reposo. **Presupuesto:
20.** Estado actual: **6 en `/es`, 8 en `/es/proyectos`.** Cero layouts, cero
tareas largas, cero layouts forzados al mover el mouse.

Prohibiciones, cada una con su medición:

- **`background-position` / `background-size` animados.** Repintan cada frame.
- **`content-visibility: auto` junto a animaciones en bucle.** Obliga a
  reevaluar relevancia por frame, y como las animaciones decorativas corren en
  bucle infinito hay frames —y por tanto recálculos— para siempre. **Costo
  medido: 181 recálculos en 3 s en reposo, contra 7 sin él.** Usa `.defer-paint`,
  que hoy es `contain: layout`.
- **`filter: blur()` en algo que se mueve.** Un blur sobre una capa que además
  se traslada obliga a re-rasterizar la capa entera cada frame. Por eso
  `@keyframes enter-blur` anima **solo** `opacity` y `filter`, sin `transform`:
  lo llevan los `<h1>` de las 16 páginas, el elemento más grande de cada una.
  El costo no aparece en el contador de estilo (medido: 76 recálculos con y sin
  blur, idéntico) — está en la rasterización, que ese contador no ve.
- **`backdrop-filter` anidado.**
- **`transition-all`.** Incluye geometría que no se compone. Ojo: Tailwind v4
  escanea el **texto crudo** de los archivos, así que mencionar el nombre de esa
  utilidad *aunque sea en un comentario* hace que genere la clase de verdad en la
  hoja servida y quede disponible para que alguien la use sin darse cuenta. No
  escribas su nombre; describe el problema.

A 60 fps, **una** animación no compuesta genera ~180 recálculos en 3 s: uno por
frame. Eso es lo que el presupuesto de 20 detecta. Si se pasa, busca qué empezó a
animar un fondo o qué subárbol volvió a pedir revisión por frame.

---

## Escala tipográfica

Sora para títulos (`font-display`, ya aplicada a `h1`–`h4`), Plus Jakarta Sans
para el resto. Usa los tamaños con nombre, nunca `text-[42px]`.

| Clase | Uso |
|---|---|
| `text-hero` | Solo el `h1` de la home y de páginas ancla |
| `text-d1` | `h1` de las demás páginas, y `h2` de sección |
| `text-d2` | `h2` secundario |
| `text-d3` | `h3`, títulos de tarjeta |
| `text-lead` | El párrafo que sigue al `h1` |
| `text-base` / `text-sm` | Cuerpo / secundario |

Los números que se comparan necesitan `data-numeric` para cifras tabulares.

---

## Composición

- `.eyebrow` — la píldora con punto de gradiente que va sobre el título de
  sección. Ya trae su fondo y su punto; úsala, no la rehagas.
- `.card` — tarjeta opaca con profundidad. Combínala con `.lift`.
- `.prose-rich` — cuerpos de texto largo. Fija medida, ritmo, viñetas con
  gradiente y enlaces. Envuelve el texto, no estilices los hijos.
- `.grid-fade` — cuadrícula fina que se desvanece. Va con la aurora.
- `.grain` — grano sutil. Va con la aurora.
- `.ping` — punto que late. Indicador de disponibilidad.
- `.defer-paint` — `contain: layout` en secciones de abajo.
- `shadow-lift-1` … `shadow-lift-4` — cuatro niveles, cada uno de **dos** planos
  de sombra. Un nivel más alto no es una sombra más grande.

### Estructura de página

```
Contenedor:  mx-auto w-full max-w-6xl px-5 sm:px-8
Sección:     py-20 sm:py-24            (mayor)
             py-14 sm:py-16            (menor, primera banda de página interior)
Con aurora:  relative isolate overflow-hidden border-b border-hairline
Sin aurora:  defer-paint  (+ bg-ground-tint o grad-soft si toca banda)
Encabezado:  <p className="eyebrow">…</p>
             <h2 className="mt-5 text-d1 text-ink">…</h2>
             <p className="mt-4 text-lead text-ink-muted">…</p>   ← en cristal si hay aurora
```

Una sección con un ancla (`id="…"`) **no** lleva `.defer-paint`.

---

## Movimiento

**Entrada al cargar** — solo en la primera pantalla.
`.enter`, `.enter-blur`, `.enter-scale`, `.enter-3d` + `.step-1` … `.step-6`
para coreografiar (70 ms entre pasos).

**Revelado al scroll** — `.reveal`, `.reveal-scale`, `.reveal-stagger`,
`.reveal-3d`. Implementadas con `animation-timeline: view()`: **cero
JavaScript**. En un navegador sin soporte el bloque `@supports` no aplica y el
contenido está visible — no hay estado oculto que dependa de que algo corra.
`.reveal-stagger` escalona automáticamente hasta 6 hijos directos.

**Permanente** — `.float`, `.float-slow`, `.grad-drift`, la aurora, `.sheen`.
Ojo: aplica la flotación al **contenido** (`dd`, un hijo), nunca al panel que
lleva `backdrop-filter`.

**Componentes con JS** (`components/motion/`):

- `<Counter value={4} suffix="+" />` — cuenta al entrar. El valor final se
  renderiza en el servidor, así que el HTML nunca dice 0.
- `<PointerGlow />` — resplandor que sigue al cursor. Se apaga en táctil.
- `<Tilt3D>` — inclinación que sigue al puntero.

Todo muere con `prefers-reduced-motion: reduce`, incluida la aurora.

---

## Piso de accesibilidad

WCAG 2.2 AA.

- Un solo `h1` por página. Nunca saltes un nivel de encabezado.
- Íconos decorativos: `aria-hidden="true"`. Si el ícono es el único contenido de
  un control, el control necesita `aria-label`.
- Todo campo necesita `<label for>` real. El placeholder no es una etiqueta.
- Usa `<Field>` de `components/ui/field.tsx`: ya conecta label,
  `aria-describedby`, `aria-invalid` y una región `aria-live`.
- Menús y desplegables cierran con `Escape` y devuelven el foco al disparador.
  Verificado con `npm run check:nav`.
- Los carruseles necesitan `label`, `prevLabel` y `nextLabel` traducidos.
- Objetivos táctiles ≥ 44 px.
- Nunca comuniques estado solo con color.
- Cada clave nueva en `messages/es.json` va **también** en `en.json`. La paridad
  es obligatoria o explota en render. Estado actual: 416 claves en ambos.
