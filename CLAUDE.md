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


## El riel — una sola pieza, del nav al pie

`components/instrument/rail.tsx` exporta **dos** cosas y la separación es el punto:

- `<Drum>` — el riel visible. Un **único elemento fijo**, montado una sola vez en
  `app/[locale]/layout.tsx`, que corre del canto superior del nav al canto inferior del
  pie con la **misma marca a la misma distancia** (`--rail-step`, 1 rem) en toda su
  longitud. Lleva el canto del eje, el volumen del tambor y el trazo del avance.
- `<Rail>` — el **hueco**. No pinta nada: es la primera columna de la rejilla que cada
  página reserva. Las 15 páginas siguen montándolo igual.

**Lo que se retiró, y por qué.** El riel estaba graduado en segundos y escribía las cifras
al margen (0, .25, .50, .75, 1, 1.25, 1.50), con una aguja de punta de flecha y una línea
de ruido. Todo eso vivía dentro de la altura del héroe: **la graduación se cortaba en seco
a media página** y debajo quedaban cuatro mil píxeles de riel negro. Un eje que se detiene
no es un eje. Y como el riel era hijo de cada página, no podía existir ni en el nav ni en
el pie: la misma línea se veía en tres tramos.

Con eso se fueron los tokens `--tape-scale`, `--tape-span`, `--tape-budget`, `--needle-y`
y `--hero-h`, las clases `.tape-axis`, `.tape-label`, `.needle`, `.tape-end`,
`.tape-progress`, `.trace`, `.budget-rule` y el export `BudgetRule`. **No los revivas.**

**El riel CORRE, y eso es deliberado.** `.drum-marks` arrastra el rollo hacia abajo en
bucle permanente (`--rail-run` = 20 × `--rail-step` en 24 s ≈ 13 px/s) y al cargar el riel
se despliega de arriba abajo una sola vez con `clip-path`. Un registrador encendido arrastra
papel; un riel quieto es un dibujo.

Dos reglas que no se negocian:

- **`--rail-run` tiene que ser un múltiplo entero de `--rail-step`.** Es lo único que hace
  invisible el empalme del bucle, y `.drum-marks` lleva ese mismo sobrante por ARRIBA
  (`inset-block: calc(var(--rail-run) * -1) 0`) para que el desplazamiento no descubra el
  canto.
- **`will-change: transform` en `.drum-marks`** es lo que deja el bucle en el compositor.
  Medido: con la promoción, la página sigue en **0 layouts y 0 recálculos en reposo**.

Se mueve el ELEMENTO, nunca `background-position`.

## Signature — no lo dupliques

`components/instrument/marks.tsx` mide con `PerformanceObserver` la página que el visitante
tiene abierta y escribe TTFB, FCP y LCP contra la regla de su propio presupuesto.

**Vive solo en la home.** En cada página sería decoración.

**Una sola regla, al final de la pista.** El 100% de cada pista es el umbral que Google
publica para esa métrica, así que la regla en minio cae en el **mismo x** en las tres filas
y se lee como una regla impresa. La versión anterior la ponía a la mitad de cada fila con
su cifra flotando encima de la primera: tres marcas rojas a distinta altura y una etiqueta
huérfana («800 ms») que parecía un dato sin dueño. Se leía roto porque había dos números
por fila y nada que dijera cuál era cuál.

**La cifra medida se lee junto a su presupuesto** (`152 / 800 ms`): la relación entre las
dos ES el veredicto. Y lo que queda a la izquierda de la regla no es hueco, es el margen
que sobra — que es el producto. La leyenda de abajo lo dice en una línea, y **la leyenda es
la regla misma**, un trazo de 1 px en minio: un color solo se explica mostrándose.

**Solo tres métricas, y es deliberado.** TTFB, FCP y LCP son instantes desde el inicio de
la navegación. INP es una **duración**: ponerlo ahí sería mentir sobre lo que la escala
significa.

## Movimiento: CERO librerías

No instales GSAP, Lenis, Motion ni three. La referencia del brief
(dennissnellenberg.com) carga jQuery + GSAP + ScrollTrigger + Barba + Locomotive, ~250 KB.
**Aquí el producto que se vende es Core Web Vitals**, así que ese stack sería una
contradicción medible por cualquier prospecto con PageSpeed.

Todo es CSS: `animation-timeline: view()` y `scroll(root block)` para el scroll, keyframes
compuestos para lo permanente, y la View Transitions API nativa para las rutas
(`experimental.viewTransition` en `next.config.ts`, 0 KB — el runtime ya viaja en React 19).

**Vocabulario de movimiento:**

- `.drum-trace` — el avance del rollo en el riel. Ligado a `scroll(root block)`; el canto
  izquierdo está dibujado entero desde el principio y el trazo solo lo enciende. Sin eso,
  el avance se leía como una línea que se para a media pantalla.
- `.drum-field` — el fondo. La retícula del papel de registro más la curvatura del tambor,
  en tres capas de pintura con máscara. Deriva con `view()`, **no** con `scroll(root)`: con
  la línea de tiempo del documento, un campo que vive a 4000 px de la portada llega a su
  estado final antes de aparecer y nunca se mueve. Es lo que ocupa el sitio de los huecos
  de video que no existen.
- `.ribbon` / `<Ribbon>` — el carrusel: una cinta impresa que corre. Contenido **duplicado**
  y `translateX(-50%)`, así el bucle cierra sin medir nada. Sin flechas, sin puntos.
  **La velocidad no se pasa por prop.** Sale de `SPEED_PX_S` (38 px/s; 64 en `large`, ×0.72
  al revés) y de nada más. **Y NO tiene estado de hover.** Había un
  `.ribbon:hover` que multiplicaba `animation-duration` por 2.6 para frenarla:
  cambiar la duración a mitad de vuelo no cambia la velocidad, el navegador
  recalcula el progreso como tiempo-transcurrido ÷ duración-nueva y **la pista
  SALTA** en el frame siguiente. Con 240 nombres y siete minutos de duración, ese
  salto son cientos de píxeles — es el defecto que se reportó como «se traba y se
  rompe». Ahora lleva `pointer-events: none`: una cinta de registro no responde a
  un ratón. Las 15 páginas pasaban un `duration="64s"` a mano que anulaba el
  cálculo: con 56 nombres eso eran 143 px/s, cuatro veces lo previsto, y por eso «se movía
  muy rápido». Si vuelves a añadir `duration`, vuelve el defecto.
- `.drum-marks` y `.sheet-field::before` — el rollo y la hoja corriendo. Mismo
  keyframe, misma duración, bucle permanente, compositor puro. `--rail-run` tiene que
  ser múltiplo entero de `--rail-step` o el empalme se ve.
- `.dial-sweep` y `.dial-bezel` — el barrido (7 s) y el bisel (44 s, al revés).
  Dos velocidades es lo que separa un aparato encendido de un dibujo. Los dos son
  capas con `background`, **NUNCA nodos dentro del SVG**: ver la tabla de «El
  dial», donde un `<g>` girando costaba 179 layouts en reposo.
- `.morph > span` — el cierre del titular rotando entre cinco frases. Cinco capas
  promovidas animando solo opacidad; ver «El titular que muta».
- `.chrome-glass` / `.drop` / `.drop-panel` — el cristal del nav. Ver su sección.
- `.figure-scan` — la aguja escribiendo el retrato, una vez al cargar. La línea va al PIE de
  la capa y el barrido termina en `translateY(0)`, no en `100%`: con el final abajo la capa
  quedaba 546 px por debajo del encuadre y el `scrollHeight` de la figura al doble de su
  alto. Nada se veía —`overflow: hidden`— pero `check:layout` lo reportaba como un corte, y
  con razón: un desbordamiento invisible sigue siendo un desbordamiento. El de arriba no
  cuenta, `scrollHeight` solo mide lo que sobra por abajo. La misma razón invirtió
  `drum-turn`, que ahora va de −7rem a 0.
- `.hero-in` — entrada escalonada AL CARGAR, para lo que está en la primera pantalla:
  `.reveal-stagger` ahí no anima nada porque su rango de `view()` ya pasó. **El `<h1>` queda
  fuera a propósito** — es el candidato a LCP.
- `::details-content` — el índice se abre con una transición nativa, sin una línea de JS.
  `content-visibility` con `allow-discrete` es lo que lo mantiene en el DOM mientras sale. No
  se anima el alto: eso es layout.
- `.live` — punto que late. Solo junto a algo realmente en curso.
- `.reveal`, `.reveal-stagger` — entrada por scroll.
- `.channel-pen` — al pasar el puntero, un trazo se escribe bajo la fila.

Todo dentro de `@supports` + `prefers-reduced-motion: no-preference`. La degradación es la
**ausencia**: sin soporte, el contenido queda en su estado final.

## El titular que muta

`components/instrument/morph.tsx`. «Mido lo que tu sitio …» y el cierre va
cambiando entre cinco frases, cada una una afirmación que se sostiene sola.
17.5 s de ciclo, 3.5 s por frase, en los dos idiomas.

Es el MISMO mecanismo que `<Greeting>`, y por las mismas dos razones que no
son de estilo:

1. **Cero CLS.** Las cinco frases viven en LA MISMA celda de grid, todas
   presentes a la vez, y solo cambia la opacidad. La celda mide lo que la
   frase más larga, así que nada refluye nunca. Rotar el texto de un titular
   de 120 px con un reflujo sería una regresión de CLS **en la portada de
   alguien que vende Core Web Vitals**. Medido después: CLS 0.0000.
2. **Un solo h1 indexable.** Solo la frase canónica es un nodo de texto; las
   otras cuatro viajan en `data-w` y las pinta `content: attr()`. El HTML
   servido sigue diciendo «Hola. Mido lo que tu sitio tarda en existir.» y no
   las cinco pegadas. `aria-hidden` arreglaría el lector de pantalla y no
   arreglaría nada para un crawler — ya se aprendió con el saludo.

**El desfase sale de `--i` y de UNA sola tanda de keyframes.** Cada frase corre
la misma animación con un retardo NEGATIVO de `(i − n)/n` del ciclo. Positivo
no sirve: el relleno hacia atrás dejaría las cinco visibles durante la espera.

**`will-change: opacity` no es opcional aquí.** Cinco animaciones infinitas sin
promover se comían el presupuesto de reposo. Con la promoción son compositor
puro: medido, 3–5 recálculos en reposo de un presupuesto de 20, contando también
el barrido del dial.

Si añades una sexta frase, actualiza `--n` (lo pone el componente) y comprueba
que no sea la más ancha: la celda mide lo que el más largo y una frase desmedida
empujaría el titular a una línea más en las otras cuatro.

## La hoja viva — un solo fondo, y se mueve

**El riel y el fondo son el mismo papel.** `<SheetField>` es el segundo —y último—
elemento fijo del sitio: la superficie de papel de registro detrás de todo el
documento. Misma graduación (`--rail-step`), mismo recorrido por ciclo
(`--rail-run`) y misma duración (24 s) que `.drum-marks`. El riel es el margen
perforado y esto es la superficie, así que arrastran juntos a ~13 px/s. Permanente,
porque un registrador encendido arrastra papel.

Dos capas y **solo una se mueve**: la retícula corre y el bastidor —las divisiones
mayores y el cilindro— se queda quieto. Que dos planos vayan a distinta velocidad es
de donde sale la profundidad, sin una sola sombra y sin una sola caja.

### Por qué reemplazó a `.drum-field`

El campo por sección tenía dos defectos, los dos reportados:

1. Solo lo llevaban dos secciones, así que el resto de la página se veía en negro
   pelado.
2. Su máscara terminaba el degradado **en una última línea visible de la retícula**,
   y esa línea caía a ocho píxeles del borde del último renglón de la lectura. La
   «línea de separación duplicada» que rompía la estética no era un borde de nadie:
   era el canto de una máscara. La otra mitad era `.readout-row:last-child`, que
   llevaba una regla debajo de la última fila sin nada que separar.

**Un campo fijo y uniforme no tiene última línea.** Es la lección: en un fondo con
textura, el final de un degradado ES una arista.

## El dial

`components/instrument/dial.tsx`. La cara del tambor, y a la cuarta versión un
instrumento de verdad: **72 marcas de bisel**, un **arco por canal** con su marca
y su etiqueta, retícula polar, cruz de centro y el husillo. Vive en la portada y
en /servicios — es la leyenda de la lista de canales, así que pertenece a donde
está la lista.

### Por qué SVG, y qué se quedó fuera de él

Las tres versiones anteriores eran degradados de CSS y ahí estaba el techo: un
`repeating-radial-gradient` no puede dar un arco con principio y fin, ni una
etiqueta de texto, ni retícula a 1 px real. De ahí que se reportara «soso, sin
vida, sin nada dentro». **SVG no es una librería: es marcado**, va en el HTML del
servidor y no manda un byte de JavaScript.

Pero el bisel NO va en el SVG, y eso lo decidió una medición:

| Cómo estaba el bisel | Layouts en reposo | Recálculos |
|---|---|---|
| `<g>` dentro del SVG principal | **179** | **179** |
| Su propio `<svg>` hermano | 0 | **181** |
| `repeating-conic-gradient` en un `<span>` | **0** | **3–5** |

**Ni un `<g>` ni un `<svg>` con contenido reciben capa propia**, así que su
transform no se compone y el motor rerasteriza el árbol en cada frame. Un
`<span>` con `background` sí. Y resulta que un bisel de 72 marcas radiales ES un
gradiente cónico repetido. La regla: **si algo va a girar en bucle, tiene que ser
un elemento con `background`, nunca un nodo dentro de un SVG.**

### Es interactivo, sin una línea de JavaScript

`:has()` mirando hacia arriba: al pasar el puntero por una fila de canal, la
PLACA entera sabe cuál es y se lo dice al dial — enciende su arco, agranda su
marca, sube su etiqueta a tinta plena y el husillo escribe su identificador. El
enlace entre la fila y el disco es un `data-ch` y nada más.

**Cada regla lleva su gemela en `:focus-visible`.** Un efecto de hover que no
existe para quien tabula no es un efecto, es una trampa.

El husillo pinta un `<text>` por estado y CSS apaga los que no tocan: el
contenido de un `<text>` no se puede cambiar con `content`.

### Cuatro trampas más, todas medidas

- **`width: min(var(--face), 100%)` y `aspect-ratio`, nunca un alto fijo.** A 1280
  exactos la celda medía 224 px y el `clamp` daba 393: **148 px de desborde
  horizontal del documento**.
- **`overflow: hidden` en `.dial`.** Los arcos no rotan, pero si algo rota,
  **rotar un elemento cuadrado agranda su caja alineada a los ejes hasta √2
  veces** aunque dentro haya un círculo quieto. Por eso `dial` está en la lista
  de VENTANAS de `check:layout`.
- **La máscara del bisel necesita `closest-side`.** Sin él, un
  `radial-gradient(circle)` resuelve su 100% a `farthest-corner` —0.707 del
  ancho— y el radio del disco es 0.5: el anillo caía ENTERO fuera del disco y las
  72 marcas quedaban dibujadas e invisibles.
- **El bisel va en `z-index: 2`, encima del SVG.** El cuerpo del disco es un
  `<circle>` opaco y, a igual z-index, gana el que va después en el DOM. Con el
  bisel en 1 estaba tapado.

### El reparto de la placa

`xl:grid-cols-[minmax(0,54rem)_minmax(14rem,1fr)]`: la LISTA pide su medida real
—la misma 54rem que `.channel`— y el dial absorbe lo que sobre. Con el reparto al
revés y el dial a 30rem, la lista se quedaba en 768 px y las descripciones caían
a ocho líneas en una columna de 230: **el dial se comió a la lista**. Y el rótulo
de la sección sale de los datos (`canales a–d`), porque decía «a–e» dibujando
cuatro — un instrumento que rotula cinco plumas y dibuja cuatro miente.

## El cristal del nav — «liquid glass sin contenedores»

El brief lo pidió con esas palabras, así que **el brief gana** sobre la línea de arriba que
dice que en este sistema no hay cristal. Y ahora el sistema lo aguanta, porque lo que cambió
no es el cristal: es lo que hay detrás. Con el retrato y la retícula del tambor en el héroe
hay algo que refractar. Sobre el hollín pelado el cristal era invisible — el mismo fallo que
está documentado arriba de `globals.css`, con el color al revés.

Tres decisiones para que **no sea un contenedor**:

1. **No hay borde.** La regla de 1 px de abajo se fue. Lo que queda es `.chrome-meniscus`:
   una línea de luz que se apaga en los dos cantos. Un brillo, no un marco.
2. **Se disuelve.** `.chrome-glass` lleva una máscara que lo apaga hacia abajo y se extiende
   2.5 rem por debajo del nav, así que el canto duro del desenfoque cae donde el scrim ya es
   cero. No tiene borde inferior: se acaba en el aire.
3. **No envuelve al contenido.** Es un hermano absoluto dentro de `.sheet`. Si envolviera, la
   máscara desvanecería también los descendentes de la tipografía del nav. Y va dentro de
   `.sheet` y no del `<header>` porque el panel móvil también es hijo del header.

**El cristal se CONDENSA con el scroll** (`chrome-condense`, ligado a `scroll(root block)`):
arriba del todo no hay vidrio, el nav flota sobre el material. Es lo que lo hace sentir
líquido en vez de ser una barra con blur puesta desde el primer frame.

**La gota** (`.drop`) es el hover. Óptica pura —remache de luz arriba, cáustica abajo, cuerpo
radial— y **sin `backdrop-filter`**: sobre casi negro el desenfoque no aporta nada visible y
sí obliga a volver a muestrear el fondo en cada frame. Funciona con `z-index: -1` porque la
fila del nav lleva `isolate`; sin ese `isolate` el negativo sube hasta el header y el cristal
se lo come. En los grupos con desplegable la gota va en el CONTENEDOR, para que cubra la
etiqueta y el chevron como el solo control que son.

`.drop-panel` es la misma gota a otra escala: el panel del desplegable, con el canto inferior
más redondo que el superior porque el agua cae.

### Contraste, medido

Sobre un píxel claro del retrato, papel **sin scrim mide 3.63 y no pasa**. Con el scrim al
88% mide 11.1. Por eso el gradiente arranca en 0.88 y no en 0.4: el vidrio vive en el 12%
que queda. Los radios de desenfoque (11 px en el nav, 7 en móvil, 13 en el panel) están
abajo de lo que se ve bonito en una captura a propósito — el coste de un desenfoque crece
con el cuadrado del radio y lo que hay detrás son marcas de 1 px y una foto, no texto.

## El retrato del héroe

**Sube 96 px a partir de 64rem (160 desde 96rem), y por eso la máscara difumina
su canto SUPERIOR.** Medido antes de decidirlo: la celda del morph llega a
x=1093 a 1440 y el retrato arranca en x=792, así que el titular CRUZA la franja
que el retrato gana por arriba. Solo a partir de 1920 hay holgura horizontal
real (65 px). Con el canto de arriba desvanecido, el texto pasa por encima de
píxeles ya apagados y no por encima de su pelo — y encima cae donde el recorte
solo tiene aire, así que no se pierde nada de él.

Con `align-self: stretch` la caja de MARGEN se ajusta a la fila, así que un
margen negativo hace la caja de borde más alta SIN cambiar el alto de la fila.
Es lo que deja crecer y subir el retrato sin abrir un hueco en la columna de
texto — pero el relleno inferior de la sección tiene que crecer lo mismo que el
margen, o el desbordamiento invisible reaparece.



`public/carlos-anaya-ruiz-retrato.webp` — 1000×1663, 95 KB, y lo que importa: **es un recorte
con canal alfa de verdad**. De ahí sale todo lo que el sistema puede hacer con él. No hay
rectángulo, así que no hay caja: se compone directo sobre el hollín, la retícula del tambor
se ve por detrás de él y se disuelve por abajo con una máscara. Es cómo se mete una foto de
medio cuerpo en un sistema que prohíbe las cajas.

- **El titular manda a todo lo ancho.** El retrato va en la banda de abajo, a la derecha, y
  sangra al canto de la pantalla con un margen negativo (`overflow-hidden` obligatorio en la
  sección; lo verifica `check:overflow`). Constreñir el masthead a media hoja para hacerle
  sitio lo partía en cinco líneas y le quitaba lo único que tiene.
- **La imagen va `position: absolute`.** En flujo, el recorte pide 692 px de alto a 26 rem de
  ancho y se los impone a la fila, así que la columna de texto —que mide unos 500— quedaba
  con doscientos píxeles de vacío en medio. Fuera del flujo no aporta alto: a partir de 64rem
  lo manda la columna de texto.
- **`priority` no es opcional.** A este tamaño le gana el LCP al titular. Medido con la
  precarga: **LCP 116–188 ms, CLS 0.0036**. Un candidato a LCP sin precargar es exactamente
  la regresión que este sitio vende arreglar.
- **`grayscale(0.32)`** existe porque el remache de luz del hombro es azul y este sistema no
  tiene azules. Un desaturado parcial lo lleva al neutro cálido sin apagar el tono de piel.
## El retrato en blanco y negro

`carlos-anaya-ruiz-bn.webp` — 400×400, 11 KB. Va en «el operador», en /sobre-mi y en el
CV, y jubiló a la foto de 800×800 con fondo de oficina que era deuda declarada.

Con él se retiró `.portrait` entero: la plancha de papel, el duotono de media tinta y
la trama de rayas de 3 px. Esa muleta existía para convertir una foto pobre en un
artefacto de imprenta deliberado; con una de estudio no hace falta, y el brief pidió
quitar las rayas. Lo que queda es `.figure-bw` y la misma regla que el retrato del
héroe: la foto **se disuelve en el material**, sin rectángulo.

### El difuminado tiene que ser RECTANGULAR

Se probaron dos radiales y los dos fallaron por la misma razón geométrica: **sobre un
cuadrado, un degradado radial que llegue a cero en las esquinas deja los bordes medios
al 86% de opacidad** —solo están 1.41 veces más cerca del centro— así que el rectángulo
se seguía viendo entero. Hay que elegir entre dejar el canto o comerse los hombros.

Lo que funciona son **dos degradados lineales cruzados con
`mask-composite: intersect`**: difuminan los cuatro cantos por igual sin tocar el
centro. Está en CSS **y** horneado en el canal alfa del archivo, y no es cinturón y
tirantes: medido, el alfa del archivo no llega intacto por el optimizador de imágenes
de Next en todas las variantes del srcset, y ahí el canto duro reaparecía.

El ajuste de niveles (`linear(1.2, -18)`) sí va horneado: baja el fondo de estudio al
nivel del hollín. Y el `sepia(0.13)` de CSS existe porque la foto es gris NEUTRO y el
negro de este sistema es cálido: sin él se lee azulada al lado del hollín.

## Volumen sin cajas

El brief pidió «3D y volumen» y «quitar cajas y bordes» en la misma frase. Sombras y
tarjetas dan volumen **y** son cajas, así que la salida vino del sujeto: el papel va
enrollado en un **tambor**.

- `.drum` y `.plate` llevan un gradiente lateral que los lee como cilindro. Coste: cero.
- `.plate::before/::after` dibujan el **canto de la hoja**: dos líneas de 1 px, una clara y
  una oscura, que es como se ve el grosor de un papel real.
- `.drum-field` es la retícula del papel de registro sobre el mismo cilindro, en el fondo
  de una sección. Es lo que da fondo a lo que antes era negro y nada.
- La profundidad de verdad es el parálax de `.drum-field` contra el contenido que lleva
  encima: dos planos a distinta velocidad, sin una sola sombra.

**No queda un borde de cuatro lados en el sitio.** Lo que sobrevive es la regla horizontal,
que no es una caja: es la línea de un registro.

## El hueco de medio es un RENGLÓN

`<MediaSlot>` sin archivo dibuja una línea —qué falta, a qué ruta, de qué tamaño— y nada
más. Reservar la relación de aspecto real de un archivo de 1920×1080 significaba pintar una
caja de cuatrocientos píxeles de nada, y eso **era** el «espacio vacío enorme» que se
reportó dos veces: la caja que iba a resolver el hueco era el hueco.

La única excepción es `compact`, que conserva la caja marcada. Se usa donde el hueco es
**estructural** —una portada dentro de una rejilla, un logo en una columna de 176 px— y un
renglón dejaría la celda descuadrada.

## La hoja: un solo margen

`.sheet` es el margen del documento: `calc(var(--tape-w) + 2.5rem)` a la izquierda. Lo usan
el nav, el panel móvil y el pie. Antes iban centrados en `max-w-6xl` mientras el contenido
va a sangre desde el canto del riel, así que la marca del nav caía cien píxeles a la
derecha del titular y las dos rejillas no se reconocían como la misma hoja.

## No hay tarjetas

Hay **filas** (`.band`), **canales** (`.channel`, a–e, paralelos y no una secuencia 01/02/03)
y la **placa** (`.plate`, la sección invertida, máximo una por página). Una lista de cosas
es una lista de `.band` con `border-top`, nunca una rejilla de tres.

A partir de 64rem el canal se abre en **dos plumas**: el nombre a la izquierda y lo que
hace a su derecha. Apilados en una columna de 52ch sobraba más de la mitad del ancho de la
placa. El override de `.channel-note` vive **fuera de toda capa** al final de `globals.css`,
y tiene que estar ahí: una capa le gana a otra antes de comparar especificidad, así que
`@layer components` no puede vencer al `mt-1` escrito en el markup de las 15 páginas.

## La placa de datos, y el copy duplicado

`.plaque` es la etiqueta grabada de un instrumento: rótulo mono, valor, una regla por
renglón. **No es una rejilla de estadísticas** —no hay cifra grande ni icono— y todo lo que
dice sale de `data/` o de `NAP`. Si un dato no está en el repo, no aparece.

Y la lección de esa sección: «el operador» se veía vacía porque **lo estaba**. El párrafo era
`hero.lead`, literalmente el mismo que ya está en el héroe, y la frase iba en una columna de
30ch a tamaño d2. Ahora la frase abre a todo el ancho a escala de titular —es una
declaración— y el cuerpo sale de `about.lead` + `about.philosophyDesc`, que viven en otra
página. **Antes de rellenar un hueco con diseño, revisa si el hueco es que el bloque no dice
nada nuevo.**

En el índice del registro, el «+» va **pegado a su pregunta**, no al canto de la hoja: con
`justify-between` sobre una fila de mil píxeles quedaba a media pantalla de su propio texto.
La regla de la banda sí cruza toda la hoja — eso es lo que le da la anchura a la sección.

## La misma vida en las 15 páginas

Lo que hace que una página se sienta viva en este sistema es GLOBAL, no por
página. Nada de esto se monta dos veces:

| Qué | Dónde vive | Alcance |
|---|---|---|
| El riel arrastrando el rollo | `<Drum>` en el layout | todas |
| La hoja de fondo corriendo | `<SheetField>` en el layout | todas |
| El cristal del nav y la gota | `components/layout/header.tsx` | todas |
| La pluma que se apoya en cada enlace | `.link-stylus` | todas |
| El índice que se abre | `::details-content` | todas |
| La entrada escalonada al cargar | `.hero-in` en el héroe | **15/15** |
| La entrada por scroll | `.reveal` / `.reveal-stagger` | todas |

**`.hero-in` existe porque `.reveal-stagger` no sirve arriba.** Esa clase usa
`animation-timeline: view()`, y lo que está en la primera pantalla ya pasó su
rango antes de que nadie toque la rueda: no anima nada. `.hero-in` es la versión
de carga.

**Y deja el `<h1>` fuera a propósito.** En las trece páginas que no llevan retrato,
el titular ES el elemento LCP; retrasar su pintado por una entrada es la regresión
que este sitio vende arreglar. Medido en /servicios y /sobre-mi con la entrada
puesta: **LCP 80–140 ms, y el elemento sigue siendo el `h1`.**

Lo que NO se replica, y es deliberado: la LECTURA en vivo (`<Marks>`) y el TITULAR
que muta viven solo en la portada. En cada página serían decoración.

## Sin migas de pan visibles

Se retiraron de las 15 páginas: el brief las rechazó explícitamente («el icono de casa y el
> Contacto»). **El `BreadcrumbList` JSON-LD se conserva intacto** en `lib/schema.ts`, así
que el rich result de Google sigue ahí. El componente sigue en
`components/layout/breadcrumbs.tsx` sin importar de nadie.

## El boletín

Preparado ahora, antes de que existan los blogs, y a propósito: **una lista que
empieza a llenarse antes de tener contenido vale más que un formulario impecable
el día del lanzamiento.**

- `lib/newsletter.ts` — el alta. **Sin SDK**: cualquier proveedor acepta un POST
  con JSON, así que dos variables de entorno y un `fetch` hacen el trabajo y se
  cambia de proveedor sin tocar código. Ver `.env.example`.
- `app/[locale]/newsletter-action.ts` — la Server Action. Vive en su propio
  archivo porque la consume un componente de cliente.
- `components/sections/newsletter.tsx` — el formulario, en el pie de las 15
  páginas. El campo es un **renglón**, no una caja: regla abajo, texto encima y
  el botón al final de la misma línea de escritura.

**Sin configurar NO miente.** Si falta `NEWSLETTER_ENDPOINT`, responde «la lista
todavía no está conectada» y ofrece el correo directo, en vez de decir «listo» y
tirar la dirección. Un formulario que finge en producción durante seis meses es
peor que no tenerlo.

**El cebo, no un captcha.** Un campo escondido para personas y visible para un
bot; si viene lleno se descarta el alta y se responde `ok` a propósito — un bot
que recibe un error reintenta, uno que recibe un éxito se va. Sin tercero y sin
cookie.

### Por qué es un componente de cliente en un sitio sin librerías

Porque el resultado tiene que aparecer DONDE se escribió el correo, y en el pie
eso no se puede hacer desde el servidor: **un layout de Next no recibe
`searchParams`**. Las alternativas eran una ruta de acuse (te saca de la página)
o el estado solo en la portada. Y el coste real es casi nulo: el runtime de React
ya viaja porque el nav es de cliente, así que esto añade el código del
componente, no un runtime. Los textos entran por props ya traducidos para no
arrastrar el diccionario de `next-intl` al cliente.

**Lo que no cubre, y se dice:** sin JavaScript el POST se hace igual pero el
estado devuelto se pierde, así que no hay acuse. El alta SÍ se procesa.

### ⚠ El aviso de privacidad es parte del entregable

El boletín rompió **cuatro afirmaciones** del aviso, entre ellas «no hay boletín
ni lista de correo» y «sin servidor de formularios» en la propia descripción de
la página. Están corregidas y el boletín tiene su sección con finalidad,
consentimiento, revocación y encargado.

**Si vuelves a tocar qué datos se recogen, el aviso se actualiza en el MISMO
commit.** Un aviso que dice «no hay lista» junto a un formulario de alta no es un
descuido de copy: es una declaración falsa en el documento donde importa.

## El segundo margen — «la hoja tiene dos márgenes»

**El diagnóstico se midió con capturas, no se supuso.** A 1440, en las páginas que
no son la portada el contenido vivía en UNA columna izquierda de ~800 px, así que el
**45% derecho de la hoja estaba muerto en todo offset de scroll**. Y el ritmo vertical
era idéntico en todas, así que ninguna se distinguía de otra. No faltaba diseño:
faltaba una SEGUNDA COLUMNA.

Una gráfica de registrador real tiene dos márgenes: el perforado a la izquierda —que
aquí es el riel, y ya existía— y el **margen de anotación** a la derecha, donde el
operador escribe a mano la escala, el rango del canal y la lectura en cifras. **En una
gráfica de verdad ese margen es DONDE VA LA LECTURA**, así que no es relleno.

`.ledger` es la rejilla: `[minmax(0,54rem) minmax(0,var(--margin-w))]` a partir de
**80rem**, con el canto del margen en una regla de 1 px. Por debajo de 80rem no hay dos
columnas: el margen cae al flujo y **su regla se vuelve horizontal**. Se eligió 80rem y
no 64rem porque a 1024 la columna de texto se queda en 46rem y las descripciones caen a
ocho líneas — es el mismo error que ya se midió con el dial comiéndose la lista.

Un solo token nuevo: `--margin-w` (18rem, lo que pide una cifra de lectura de 1.375rem
con su rótulo encima sin partirse). Ninguna cara nueva y ningún color nuevo: **extiende
«Papel Ahumado», no lo rediseña.**

### Tres reglas que salieron de medir

- **La regla del renglón no puede depender del hermano anterior.** Era
  `.margin-row + .margin-row`, y el primer renglón después del tramo salía pegado sin
  regla: el tramo es hijo directo del margen y las cifras viven dentro de un `<dl>`, así
  que entre uno y otro no hay relación de hermanos. Ahora la regla la lleva CADA renglón
  y se le quita solo al primero de todos, cubriendo las dos formas de montarlo. **Un
  margen se compone de piezas: un selector de hermanos se rompe en cuanto algo las
  agrupa.**
- **Una FRASE en el margen no va en mono.** El descalificador de /dashboards eran seis
  líneas de cara de máquina a 13 px y se comía el margen entero. La regla del sistema ya
  lo dice —el mono es para toda cifra y etiqueta— y una anotación al margen es prosa.
  Eso es `.margin-prose`.
- **Un instrumento tiene su tamaño, no el del hueco donde cae.** A 1279 —justo por
  debajo de 80rem, donde el margen se pone en flujo— las cuatro trazas se estiraban a
  1150 px y dejaban de leerse como un aparato para leerse como una gráfica de barras.
  `.pens` y `.span-axis` llevan `max-width: var(--margin-w)`. Es la misma lección que el
  `width: min(var(--face), 100%)` del dial.

## Los instrumentos del margen, y dónde NO va ninguno

| Página | Qué lleva el margen | De qué dato sale |
|---|---|---|
| 4 de servicio | **`<Pens>`** + renglones del alcance + el descalificador | `service.process`, `includes`, `notFor` |
| /servicios | la leyenda del catálogo: cada canal con sus pasos y renglones | `getServices` |
| /premios · /certificaciones | **`<Span>`** + las cifras contadas | fechas reales |
| /cv · /sobre-mi | **`<Span>`** en la columna que YA tenían | `experience` + `education` |
| /proyectos | las tres cifras + el hueco declarado del registro | `companies` |
| /proyectos/[slug] | la ficha técnica: stack y documentos | `company.stack`, `docs` |
| /privacidad · /terminos | la ficha del documento: cláusulas, vigencia, responsable | `sections`, `NAP` |
| /libros | **NINGÚN instrumento**, y es la decisión | — |
| /contacto | **¿Eres cliente?** + respuesta, idiomas y zona horaria | — |

**`<Pens>`** (`components/instrument/pens.tsx`) es el registro multicanal: una pluma por
paso del proceso. **El largo de cada traza es la POSICIÓN del paso dentro de la entrega**,
no un porcentaje inventado — un proceso avanza. Y la cifra de lectura sale de `length`,
así que no puede desmentir al dibujo: es exactamente el defecto que se corrigió en el
dial, que rotulaba «a–e» dibujando cuatro.

**`<Span>`** (`components/instrument/span.tsx`) es un eje de tiempo con las entradas
marcadas **por posición**: la tesis del sitio aplicada a una credencial. La entrada más
reciente lleva marca larga y a tinta plena —graduación mayor— **y NO minio**: el minio y
el umbral son semánticos y gastarlos en «lo último» rompe el instrumento.

**En /libros no hay instrumento porque hay UN libro.** Una regla con una sola marca no es
una medición. El margen lleva el estado —«1 en escritura, 0 publicados»— y nada más. Es la
misma regla que ya estaba escrita a cuenta del dial, aplicada por lo bajo.

**Y no se añadió un índice al margen de las páginas legales**, aunque estaba planeado:
`/privacidad` y `/terminos` YA traen su propio índice pegajoso de anclas en la sección del
documento. Dos índices en una pantalla son el mismo dato dos veces. El componente `Tabs`
se escribió y se borró; el margen lleva la FICHA del documento, que es lo que se mira antes
de decidir si se lee.

**Lo que se quitó de /premios:** la cifra «el más reciente · 2024 · NASA» estaba en el
margen justo debajo de un eje cuya primera marca es 2024 y dice NASA. **El mismo dato dos
veces en una columna de 18rem.** Con ella se fueron `latest` y `latestYear`: el tramo
ordena descendente por su cuenta.

## La pestaña de arrastre — el «botón» de este sistema

El brief pidió un botón y aquí no hay botones: no queda un borde de cuatro lados en el
sitio. Pero un registrador **sí** tiene un control que se tira —la pestaña perforada con
la que se hace avanzar el papel— y eso es lo que hace este enlace: te lleva a otra parte.

`.pull-tab`: una regla arriba, el rótulo y la flecha. Al apuntar, la regla pasa de ceniza
a papel y la flecha se desplaza. Sin caja, sin radio y sin sombra.

- **`--control` y no `--hairline`**, porque esto ES un control y WCAG 1.4.11 pide 3:1 para
  el borde de un componente. Misma distinción que `.field-line`.
- **`min-height: 2.75rem`** — 44 px de objetivo táctil. Un rótulo mono de 11 px mide 15 px
  de caja: **un botón que no se puede tocar no es un botón.**

### ¿Eres cliente? — separa las dos intenciones

`SOCIAL_LINKS.clientPortal` → `https://carlosanayaweb.com`. Es el **segundo y último**
enlace que manda fuera del dominio a propósito (el otro es el CTA del pie).

Va **primero en el margen de /contacto** y en el pie de las 15 páginas. La razón no es
decorativa: **en /contacto el margen separa las dos intenciones.** A la izquierda, quien
viene a contratar. A la derecha, quien ya es cliente y viene a resolver algo de un trabajo
en curso — y a ese se le manda a la otra propiedad en vez de dejarlo competir por el mismo
formulario. **Sin eso, la intención que pierde es la que paga.**

Va en el mismo tab (no `target="_blank"`) y sin `rel`: es una propiedad del mismo dueño,
no una referencia externa, y el botón «atrás» tiene que funcionar.

**No se puso en el nav**, y es deliberado: la fila del nav ya desbordaba 6 px a 320 px una
vez, y `check:overflow` empieza a probar en 360. Si se añade ahí, hay que medir a 320 a
mano.

## Prettier — el repo NO tiene configuración

Y eso ya costó una recuperación: `npx prettier --write` instaló la 3.9 con sus valores por
omisión y reformateó cuatro páginas a punto y coma y comillas dobles, que **no** es el
estilo del repo. Los ajustes que reproducen lo que hay escrito son:

```bash
npx prettier --no-semi --single-quote --trailing-comma es5 --write <archivos>
```

`trailingComma: es5` es el que importa y el que no es el valor por omisión de Prettier 3:
el repo no pone coma final en los argumentos de una llamada. Verificado corriendo
`--check` contra archivos que nadie había tocado. **El gate del proyecto es `npm run
lint`, no Prettier** — así que si dudas, no lo corras sobre un archivo que no acabas de
escribir tú.

# EL BLOG — 100 artículos programados

Cien artículos escritos, uno cada **martes y viernes** a las 14:00 UTC (08:00 en Ciudad
de México), del **25/08/2026 al 06/08/2027**. 99 743 palabras, 812 encabezados, 304 pares
de preguntas frecuentes, 44 tablas y 198 bloques de código.

## De dónde sale, y qué se generó

La fuente es `docs/InformacionBlogs/`: 27 archivos de markdown con los 100 artículos y
dos índices maestros que definen una arquitectura de **10 clústeres con pillar + satélites**.
De ahí salieron:

| Qué | Dónde | Generado por |
|---|---|---|
| Los 100 cuerpos | `content/blog/NNN-slug.md` | extracción única, ya hecha |
| El registro | `data/blog.ts` | `npm run blog:data` |
| Las 99 portadas | `public/blog/*.webp` | `npm run blog:covers` |
| El mapa de portadas | `data/blog-covers-map.json` | emparejado revisado, en git |

**El markdown es la fuente y `data/blog.ts` es derivado.** Es el mismo patrón que
`media:manifest`: un dato, un generador, cero posibilidad de que la lista y las páginas
discrepen.

## Cómo aparece un artículo en su fecha

Las cien páginas se generan **en el build**, y cada una comprueba su propia fecha al
renderizarse: si `publishedAt` está en el futuro, responde **404**. Con `revalidate = 900`
esa respuesta se regenera, así que el 404 se convierte en el artículo sin desplegar nada.

Las dos alternativas están descartadas por una razón concreta:

- **Generar solo las publicadas** dejaría a las futuras fuera del build, y entonces
  existirían solo si alguien redespliega el día exacto.
- **Generar las cien sin comprobar la fecha** las publicaría TODAS el primer día, que es
  lo contrario de un calendario.

**Y el 404 no es una página «próximamente».** Una URL que devuelve 200 con un marcador se
indexa como contenido pobre, y luego hay que pelear para que Google reemplace esa versión
por la real. 404 hasta la fecha y 200 con el artículo completo después es lo que produce
una primera indexación limpia.

**Las fechas son ABSOLUTAS, no relativas al despliegue.** Si el sitio se publica tarde,
los artículos cuya fecha ya pasó salen juntos en el primer despliegue en vez de empezar
la cuenta desde cero.

> ⚠ **`SCHEDULE_START` no se mueve después de publicar.** Cambiaría el `datePublished` de
> URLs ya indexadas, y una URL que cambia su fecha de publicación le dice a Google que el
> contenido es otro.

## `content/blog/**` tiene que viajar al bundle

Está en `outputFileTracingIncludes` de `next.config.ts` y **no se quita**. Las páginas
leen su markdown en tiempo de ejecución; sin esos archivos en el bundle de servidor, la
regeneración por ISR —o sea, la publicación de todos los artículos posteriores al build—
fallaría al leer el archivo y el artículo no saldría nunca. Es la misma clase de trampa
que las fuentes de las tarjetas OG, y aquí está activa desde el primer día.

## El renderizador de markdown es propio

`lib/blog-render.ts`. **No es dogma antilibrería:** un renderizador genérico emite `<h2>`,
`<table>` y `<pre>` sin una sola clase, así que habría que encadenarle una pasada de
rehype para vestirlos con el vocabulario de «Papel Ahumado» — más código del que hay ahí,
y con una dependencia encima.

El subconjunto está **medido** sobre los 100 artículos, no supuesto: 396 vallas de código
(198 bloques, todas balanceadas, 11 lenguajes), 780 `###`, 29 `####`, 1 113 listas con
`-`, 238 ordenadas, 309 filas de tabla, 2 774 negritas, 608 `código`, 2 citas, 974 `---`,
**158 itálicas de un asterisco en 9 artículos**, **3 `##` en el cuerpo (art. 091)**,
**cero enlaces y cero imágenes** en el cuerpo.

Tres decisiones que salieron del contenido real:

- **La valla de código va antes que los encabezados.** Cinco artículos llevan `## Stack`,
  `## Propósito`… DENTRO de un bloque ```markdown: son plantillas de ejemplo. Si los
  encabezados se procesaran primero, esos ejemplos se volverían encabezados reales y
  contaminarían el índice y la jerarquía.
- **La jerarquía se desplaza un nivel.** En la fuente el título es `##` y las secciones
  `###`. El título lo pinta la página como el único `<h1>`, así que `###` sale como `<h2>`.
  Sin el desplazamiento habría un `h1` seguido de `h3` sin `h2` en medio.
- **El `---` solo se pinta si NO le sigue un encabezado.** Hay 974 y su único trabajo es
  separar; junto a un encabezado serían dos separadores a un centímetro.

**`npm run check:blog` es la condición para que esto sea defendible.** Renderiza los 100 y
falla si encuentra sintaxis sin cubrir, etiquetas desbalanceadas, markdown que sobrevivió,
un artículo sin FAQ, anclas repetidas o frontmatter incompleto. Hoy: **0 problemas.**

## Las portadas: 99 de 100, y cómo se emparejaron

Llegaron con el nombre que les puso la herramienta que las generó —`ChatGPT Image 21 ago
2026, 13_31_41.png`, `Gemini_Generated_Image_wxqh77wxqh77wxqh.jpg`— que no dice nada ni a
una persona ni a un buscador. 214 MB en 99 archivos.

**Los prompts de portada pedían «SIN texto, SIN letras» y las imágenes salieron con el
título rotulado igual.** Ese fallo respecto al prompt es lo que permitió emparejarlas con
certeza: 20 traían su número en el nombre y las otras 79 se identificaron **leyendo el
título impreso en la imagen** y casándolo contra los 100 títulos reales por solapamiento
de palabras. Resultado: 77 con puntuación alta, 2 dudosos —los dos correctos, bajaron solo
por «IA» vs «inteligencia artificial» y «Security Groups» vs «grupos de seguridad»— y 0
sin asignar. Cada uno se verificó además contra la descripción visual de su prompt.

**El artículo 10 es el único sin portada** («10 errores al implementar IA en tu empresa»).
La página se dibuja sin ella y la celda de la rejilla simplemente no existe: nunca una
caja vacía esperando un archivo.

Nombres nuevos: `{slug}-carlos-anaya-ruiz.webp`. El nombre de archivo es una de las pocas
señales que un buscador tiene para entender de qué es una imagen, y cuando alguien la
descarga o la rehospeda el nombre viaja con ella.

**213.1 MB → 5.6 MB, 97.4 % menos, 57 kB de media**, WebP 1600×900. Los originales se
movieron a `assets/blog-covers-originales/` —fuera de `public/`— y esa ruta está en el
.gitignore: estaban dentro de lo que se despliega, y un `git add -A` habría metido 214 MB
en el repo y en el bundle.

**El color de las portadas vive SOLO en la imagen.** Violeta, cian, ámbar, magenta, dorado
son los acentos que el índice maestro asigna a cada clúster, y no entran en la interfaz:
este sistema tiene seis materiales y el minio es semántico. La portada se disuelve en el
material con dos degradados lineales cruzados y `mask-composite: intersect`, igual que los
dos retratos — sin rectángulo. (Un degradado radial dejaría los cantos medios al 86 % de
opacidad; ya está medido en este repo.)

## El enlazado interno se genera, no se escribe

El índice maestro fija la regla: cada artículo enlaza a la pillar de su clúster, dos
satélites hermanos y uno de otro clúster. **El contenido llegó sin un solo enlace markdown
en el cuerpo**, así que `getRelated()` los construye del dato, y eso es mejor que
inyectarlos en la prosa por dos razones:

1. Un enlace en prosa a un artículo que aún no salió es un 404. Aquí se filtra por
   publicados, así que la red crece con el calendario y **nunca apunta a nada roto**.
2. Quedan en un bloque identificable al final, que es donde un lector los busca.

El cruce entre clústeres solo se hace si comparten al menos una etiqueta: un enlace
cross-cluster sin relación real es relleno.

## Lo que el blog NO tiene, y es deliberado

- **No hay páginas de categoría.** Las doce categorías reparten muy desigual —una tiene
  un artículo, otra dieciocho— así que serían nueve páginas de contenido pobre compitiendo
  con las pillar, que son los hubs de verdad. El agrupado vive en el índice.
- **No hay paginación todavía.** Con cien artículos en cincuenta semanas, el índice pasa
  de 20 entradas hacia el tercer mes. Montarla hoy sería construirla contra un volumen que
  no existe.
- **No hay comentarios**, así que el schema no declara `commentCount`.
- **`dateModified` = `datePublished`** mientras nadie edite el texto. Fingir una fecha de
  modificación reciente para parecer fresco es lo primero que Google verifica contra el
  contenido que ya tiene indexado.

## El blog es solo en español, y /en redirige

Los 100 artículos están escritos para México y LATAM. Servir ese texto bajo `/en` y
declararlo `en-US` en hreflang es un error que Search Console reporta, y traducir 99 743
palabras no es una decisión de código.

Así que `/en/blog*` **redirige** a `/es/blog*` —consolidando la señal en una sola URL— y
el hreflang de estas páginas declara **`es-MX` y `x-default`, sin `en-US`**.

> ⚠ **`seo.mjs` reporta esto como «hreflang incompleto (2, se esperan 3)» y es un FALSO
> POSITIVO.** La sonda aplica una regla de todo el sitio que no vale para una sección que
> existe en un solo idioma. Declarar `en-US` apuntando a una URL que redirige sí sería un
> par no recíproco, o sea el error de verdad. **No lo «arregles».**

> ⚠ Y durante una ronda esta afirmación fue falsa por otras dos vías: el middleware
> de next-intl emitía una cabecera `Link` con `hreflang="en"` en TODA ruta, y el
> sitemap listaba `/en/blog` con el clúster de tres hreflang. Google lee la
> cabecera igual que la etiqueta. Cerradas las dos: `alternateLinks: false` en
> `i18n/routing.ts` y el índice del blog fuera del bucle de locales en
> `app/sitemap.ts`. Y el redirect pasó de 307 a `permanentRedirect` (308),
> porque un 307 no consolida la señal.

## El envío por correo — Resend Broadcasts

`lib/broadcast.ts` + `app/api/cron/publicar/route.ts` + `vercel.json` (`0 14 * * 2,5`).

El cron hace tres cosas **en este orden, y el orden importa**: revalida, después envía.
Al revés, el correo podría llegar antes de que la página respondiera 200 y el primer clic
de la lista se encontraría un 404. La ventana es de segundos, pero la lista entera hace
clic en esos segundos.

**La idempotencia no necesita base de datos.** Cada difusión se crea con el nombre
`blog-{slug}` y antes de crear nada se listan las existentes. Si ya hay una con ese
nombre, no se hace nada. El estado vive en Resend, que es donde de todas formas está la
verdad de si un correo salió — y eso es **más** robusto que una tabla propia, porque una
tabla puede decir «enviado» cuando el envío falló.

Si no se puede listar, **no se envía**: un duplicado a toda la lista es peor que un envío
que se reintenta en la siguiente ejecución.

**Mira una ventana de 72 horas**, no «el de hoy». Si una ejecución falla, la siguiente
recupera lo pendiente en vez de saltárselo para siempre.

**`CRON_SECRET` es obligatorio.** Sin él la ruta responde 401 a todo el mundo, incluido
Vercel: una ruta que dispara correos a una lista no puede quedar abierta por omisión.

El HTML del correo es tabla de un carril con estilos en línea, sin media queries. Un
cliente de correo no es un navegador —Outlook sigue renderizando con Word— y un diseño
elaborado que se rompe en la mitad de las bandejas es peor que uno sobrio que se ve igual
en todas. Va con versión en texto plano, que es puntos de entregabilidad.

## SEO del blog, medido

- `BlogPosting` + `Person` por `@id` + `FAQPage` + `BreadcrumbList` por artículo. El autor
  apunta a la MISMA entidad que el CV, las certificaciones y los proyectos: eso es E-E-A-T
  expresado en datos, no en una frase.
- Sitemap: los publicados, con su `lastModified` real por URL —aquí el dato exacto SÍ se
  conoce, que es la razón por la que el resto del sitemap usa una constante— y prioridad
  0.8 para pillar, 0.6 para satélite. `revalidate = 1800`.
- `/feed.xml`: RSS 2.0, 50 entradas, solo publicadas.
- Medido con el calendario cumplido: **sitemap 132 URLs, feed 50 items, artículo con 1 h1
  y 13 h2, BlogPosting y FAQPage presentes, canónico correcto.**
- `/es/blog`: LCP 104–120 ms, CLS 0.0000, **0 layouts y 0 recálculos en reposo**.

## `npm run` del blog

```bash
npm run check:blog     # renderiza los 100 y falla si hay residuos
npm run blog:data      # regenera data/blog.ts desde el markdown
npm run blog:covers    # renombra y optimiza portadas (idempotente)
```

## La ronda de auditoría adversarial — 19 defectos confirmados

Después de construir el blog se corrió una revisión con cinco dimensiones en
paralelo (gate de publicación, cron e idempotencia, renderizador, SEO técnico,
puente del formulario) y **cada hallazgo se verificó por separado con un agente
que intentaba refutarlo**. De 61 hallazgos brutos, **19 sobrevivieron**. Los 42
refutados incluían cinco que reportaban como defecto un arreglo que ya estaba
aplicado — de ahí la regla: **antes de tocar un archivo de este repo, leerlo.**

Esto es lo que estaba mal de verdad. Se listan porque cada uno es una trampa que
puede volver.

### Lo que habría roto en producción

**El correo se podía mandar dos veces a toda la lista.** `sendPostBroadcast`
hacía listar → decidir → crear → enviar sin exclusión mutua, y el nombre de una
difusión no es único en Resend. Dos ejecuciones simultáneas —el cron y una
llamada manual con el secreto— creaban dos difusiones y mandaban dos correos.

Resuelto **sin cerrojo y sin base de datos**: se crea el borrador, se vuelve a
listar y, si hay gemelos, solo envía el de `id` menor; el perdedor borra su
propio borrador. El desempate es una función pura del estado listado, así que las
dos ejecuciones eligen el mismo ganador sin hablar entre ellas. La acción
irreversible ocurre **después** de que la colisión es visible.

**Un borrador huérfano bloqueaba un artículo para siempre.** «Existe» no es «se
envió»: si el `POST /broadcasts` funcionaba y el `/send` fallaba, quedaba un
borrador que hacía que toda ejecución posterior respondiera «ya enviado». Ese
artículo no se mandaba nunca. Ahora un estado distinto de `draft` significa
enviado, y un `draft` significa **reintentar el envío reutilizando su id** —
reintentar sobre un borrador no puede duplicar, porque tras un envío correcto ya
no es un borrador.

**La ventana de recuperación de 72 h no recuperaba nada.** Medido sobre el
calendario real: los huecos entre publicaciones alternan **72 h y 96 h** (50 y
49). Con la ventana en 72 h, el artículo del viernes ya tenía 96 h el martes
siguiente y quedaba fuera. La ventana era funcionalmente «solo el de hoy».
Ahora son **8 días**, con un tope de **2 correos por ejecución**: sin el tope, un
despliegue muy retrasado mandaría cuatro correos seguidos a la lista en un
minuto, que es la definición de spam.

**Y Vercel NO reintenta un cron fallido** — el comentario que decía lo contrario
era falso. Esta ventana es el único mecanismo de recuperación que existe.

**El 404 se servía obsoleto el día de publicación.** Las 100 rutas están
prerenderizadas como 404 y una entrada vencida pero dentro de su `expire` se
sirve **stale** mientras regenera por detrás. Si el cron no purgaba, el primer
visitante —o Googlebot— recibía el 404 del artículo recién anunciado por correo.
Ahora el cron **calienta la página con un GET** después de revalidar y **antes**
del correo, y **solo manda el correo de los artículos que responden 200**.
Anunciar por correo una URL que devuelve 404 es el peor resultado posible de
todo el sistema.

**Y el cron ya no responde 200 cuando algo falló.** Antes registraba y seguía, así
que en el panel de Cron Jobs una ejecución que dejó la página en 404 se veía
idéntica a una correcta. Ahora devuelve 500 con el detalle.

### Las trampas del renderizador

**158 asteriscos crudos en 9 artículos.** La itálica de un asterisco no estaba
implementada, y `check:blog` daba OK porque solo buscaba `**`. Medido con el
renderizador real: 066 (42), 007 (30), 088 (26), 016 (20), 063, 099, 064, 009,
081 — y en varios la itálica envuelve frases completas. Ahora se generan **79
`<em>` y quedan 0 asteriscos**. Va en la itálica de Archivo, **no en Fraunces**:
esa cara está reservada a la voz en primera persona y gastarla en el énfasis de
un párrafo técnico la devaluaría.

**Una valla de código con info string invertía el resto del documento.** La
apertura exigía `` ```lang `` a secas, así que ` ```js title="x" ` caía a párrafo
y **la valla de cierre pasaba a actuar como apertura**, tragándose el resto del
artículo dentro de un `<pre>`. Ahora la apertura es laxa y **el cierre sigue
estricto** — si se relajaran las dos, dos aperturas seguidas volverían a
invertir el documento.

**El artículo 091 aplanaba su jerarquía.** Era el único con `##` en el cuerpo:
tres grupos que agrupaban once tendencias, y como `###`→h2 y `##`→h2 también,
los grupos se pintaban idénticos a sus ítems y el índice del margen listaba 17
entradas planas. Arreglado en el CONTENIDO —grupos a `###`, ítems a `####`— y no
remapeando el renderizador, que habría cambiado el tamaño de los 29 `####` del
resto del corpus. El índice pasó de 17 entradas a 6.

**`check:blog` daba falsa confianza.** La detección de sintaxis sin cubrir estaba
DENTRO de la rama del párrafo, después de que listas, tablas, encabezados y el
bloque de FAQ ya hubieran emitido. Un enlace en una viñeta salía crudo con
`uncovered` vacío; en una pregunta del FAQ entraba crudo **dentro del JSON-LD**.
Ahora es un **barrido previo por líneas del markdown de entrada**, fuera de
vallas, y cubre enlaces, imágenes, tachado, `#####` y `##`. Verificado con once
casos sintéticos.

**Y una tabla se reestructuraba en silencio:** cualquier fila de guiones
reasignaba la separadora, así que una a media tabla borraba el `<thead>` entero;
y `| - | - |`, válida en GFM, no se reconocía. Ahora la separadora solo cuenta en
la posición 1 y lo anómalo va a `uncovered`.

### SEO

**84 de 100 títulos se recortaban en la SERP.** La plantilla añade
« | Carlos Anaya Ruiz» (20 caracteres) y el peor llegaba a **92**. Con
`title: { absolute }` solo quedan 10 por encima de 60 y el peor es 72. Extra: el
`<title>`, el de Open Graph y el de Twitter ahora coinciden entre sí y con el
`<h1>` — antes discrepaban 20 caracteres. En un artículo el nombre de la marca no
compra nada: quien busca «qué es RAG» no busca por marca.

**El middleware declaraba `hreflang="en"` para el blog.** `alternateLinks` de
next-intl está en `true` por omisión y emite una cabecera `Link` con alternates
en toda ruta, apuntando a `/en/blog/{slug}` — una URL que redirige. Justo el par
no recíproco que este archivo decía haber evitado, y encima con dos juegos de
códigos contradictorios (`es`/`en` en la cabecera contra `es-MX`/`en-US` en el
HTML). Apagado en `i18n/routing.ts` **dentro de `defineRouting`**: en next-intl
4.8, `createMiddleware(routing, {...})` no compila.

**Y el sitemap entregaba activamente la URL que redirige:** emitía las dos
entradas del índice, `/es/blog` y `/en/blog`, las dos con el clúster de tres
hreflang, mientras los 100 artículos del mismo archivo ya estaban bien. El
archivo se contradecía consigo mismo.

**`/en/blog*` redirigía con 307.** Un 307 le dice a Google que la URL original
sigue siendo la válida, así que no consolidaba nada. Ahora es `permanentRedirect`
(308).

**El feed servía `lastBuildDate` de 1970** cuando no había artículos, y **la
tarjeta social del índice se congelaba en «0 de 100»**: no exporta
`generateStaticParams`, así que se genera en la primera petición y sin
`revalidate` esa versión se quedaba para siempre.

### El puente del formulario fallaba en abierto

Con `LEAD_WEBHOOK_AUTH=hmac` y el token bajo otro nombre —un typo en el panel—
`isForwardConfigured()` devolvía `true` y la petición salía **sin firma, sin
`authorization` y sin `x-api-key`**: los cuatro casos del `switch` iban tras un
`if (cfg.token)` y fallaban en abierto. Ahora el modo **exige** su credencial:
configuración incompleta = pieza apagada, nunca pieza a medias.

Y las doce variables `LEAD_WEBHOOK_*` no estaban documentadas en ninguna parte —
lo que hacía verosímil ese typo. Ya están en `.env.example`.

## El bug del `??` con variables vacías

Salió al enviar el formulario de verdad, no leyendo código, y merece su propia
sección porque es una **clase** de bug, no un caso.

`process.env.CONTACT_TO ?? NAP.email` parece correcto y no lo es: `??` solo cae
al valor por omisión con `null` o `undefined`, y una variable **declarada y
vacía** —`CONTACT_TO=` en un .env, o añadida en el panel de Vercel y dejada en
blanco— llega como la cadena vacía, que no es nullish. Resend recibió
`to: ['']`, respondió 422, y el formulario dijo «algo falló de mi lado».

La misma forma estaba en cuatro sitios más, todos en el camino de producción:

| Archivo | Con la variable vacía |
|---|---|
| `lib/channels.ts` | el enlace de WhatsApp apuntaba a `wa.me/` sin número — el canal que «ya funciona» |
| `lib/broadcast.ts` | la difusión se creaba con `from: ''` |
| `lib/newsletter.ts` | el alta mandaba el campo `''` |
| `lib/contact.ts` | Supabase recibía la tabla `''` |

Resuelto con `lib/env.ts`: `envOpt`, `envOr` y `envSet` tratan blanco como
ausente. **Reciben el VALOR y no el nombre** a propósito: con una clave dinámica,
Next no puede sustituir las `NEXT_PUBLIC_*` en el build y llegarían `undefined`
al navegador.

Y el `.env.example` de este repo **invita** al bug: documenta `CONTACT_TO=` como
opcional. Por eso el arreglo va en el código y no en la documentación.

## El puente al otro sistema

`lib/forward.ts` reenvía cada mensaje del formulario a un endpoint HTTP propio —
un CRM, un n8n, otro proyecto. Todo por variables de entorno: URL, método,
autenticación (`none|bearer|header|basic|hmac`), formato (`json|form`), renombrado
de campos y campos fijos añadidos. Cambiar de sistema receptor es cambiar una
variable.

**Corre en `after()`**, que ejecuta trabajo después de haber enviado la
respuesta. Es lo que permite reintentar tres veces con espera creciente sin que
el visitante mire una ruedita, y lo que evita las dos malas alternativas: esperar
(el visitante paga la latencia del tercero) o disparar sin esperar (en serverless
la función puede congelarse antes de que la petición salga).

**Son DOS CANALES INDEPENDIENTES y basta con uno.** Si el correo falla, el puente
se intenta de forma sincrónica como plan B; si entrega, el mensaje llegó y el
visitante ve «llegó». Antes el correo era una cadena: un 422 de Resend tiraba el
lead a la basura aunque el CRM estuviera disponible — y eso **pasó** al probar.

**`event_id` es el mismo en todos los reintentos**, así que el receptor puede
deduplicar. Sin él, un reintento tras un timeout donde la petición sí llegó crea
un lead duplicado del otro lado.

`/api/probar-reenvio` (protegida con `CRON_SECRET`) manda un lead de prueba y
devuelve el status, el cuerpo enviado y **la respuesta literal del receptor**. Con
eso se distingue en un intento un 401 de token, un 404 de URL y un 422 de campo
que falta. Probado de punta a punta contra un receptor local que **valida la firma
HMAC**: éxito, 3 reintentos ante un 500 (1 657 ms de espera creciente), 1 solo
intento ante un 422, y 401 sin secreto.

## El enlazado interno

Antes de esta ronda, `grep -rn "/blog" app components` daba **dos**
resultados: el nav y el pie, los dos al índice, los dos plantilla global. Cero
enlaces contextuales desde la portada (prioridad 1.0), `/servicios` (0.8) o las
cuatro páginas de servicio (0.9). Y en la otra dirección, los 100 artículos solo
salían a `/contacto`, `/sobre-mi` y `/blog`: **las cuatro páginas que facturan no
recibían nada de cien URLs temáticas.**

`ROUTE_TOPICS` en `lib/blog.ts` puntúa por **clúster (+2), etiqueta (+1) y pillar
(+1)**. Un mapa de valor único no habría servido: el clúster de cloud reparte
entre desarrollo (despliegue, IaC, Kubernetes) y dashboards (observabilidad,
costos), y hay artículos de medición repartidos por todo el corpus.

Reparto medido de los 100: **automatización 28 · desarrollo 25 · SEO 11 ·
proyectos 10 · dashboards 5 · sin destino 21.**

**Los 21 sin destino son la decisión, no un hueco.** Ciberseguridad (11),
privacidad (7), tendencias (2) y uno de cloud no tienen página comercial que los
reciba. Mandarlos a `/sobre-mi` serían veintiún enlaces sin relación temática:
diluye y contradice la regla del repo. `routeForPost` devuelve `undefined` y la
fila no se pinta, igual que `ch c` no existe sin la clave de Cal.com.

Lo que se montó, en orden de rendimiento:

1. **Artículo → servicio.** Una fila en la placa «seguir leyendo», rotulada como
   SERVICIO y no como lectura. Es la única pieza que rinde el día uno —no depende
   del volumen del calendario— y la que convierte cien URLs en autoridad.
2. **Anterior / siguiente** en el pie del artículo: un camino secuencial por el
   archivo sin pasar por un índice de cien entradas.
3. **`<BlogStrip>`** en la portada y en las cinco páginas comerciales. En la
   portada va en modo `recientes` (la señal de frescura) y **en su propia banda**,
   nunca dentro del «índice del registro» — esa sección es el bloque de preguntas
   de conversión y meter artículos ahí rompería su rejilla.

**La guarda de lista vacía no es estilo.** Los primeros días `getPublishedPosts()`
devuelve cero: sin ella quedarían rótulos sobre listas vacías en seis páginas.

## Los tres canales de contacto

Tres formas de llegar, y **cada una degrada sola**: sin su clave, la fila no se
pinta o dice honestamente que no está conectada. Nada se rompe y nada finge.
El paso a paso de las claves está en `docs/CONECTAR.md`; los nombres de las
variables, en `.env.example`.

| Archivo | Qué es |
|---|---|
| `lib/channels.ts` | Las URLs. `whatsappUrl(mensaje)`, `calUrl()`, `mailtoUrl()` y los tres `is*Configured()` |
| `lib/contact.ts` | El envío: Resend por `fetch`, y Supabase **después** y opcional |
| `app/[locale]/lead-action.ts` | La Server Action, en su propio archivo porque la consume un cliente |
| `components/sections/lead-form.tsx` | Cinco renglones, cebo antibot, acuse con `aria-live` |
| `components/sections/contact-channels.tsx` | Las filas `ch a/b/c`, de servidor |

**El mensaje de WhatsApp viene escrito, y distinto en cada página.** Quien
escribe desde `/dashboards` llega diciendo de dónde viene. Es el único canal que
ya funciona sin configurar nada: el número sale de `NAP`.

### Cal.com es un ENLACE y no el embed

`@calcom/embed-react` mete una librería, un iframe y un script de terceros que
compiten por el hilo principal exactamente donde se mide el LCP. En un sitio cuyo
producto **son** los Core Web Vitals, eso es una contradicción que cualquier
prospecto mide con PageSpeed en treinta segundos. El enlace cuesta cero, funciona
sin JavaScript y lleva al mismo calendario.

Sin `NEXT_PUBLIC_CAL_LINK` la fila **`ch c` no existe**. Un botón que lleva a un
404 es peor que un botón que no está.

### Supabase va DESPUÉS del correo, y es opcional de verdad

Un formulario de contacto no necesita base de datos: necesita **que el correo
llegue**. Supabase aquí es respaldo e historial, no la vía de entrega, y el orden
lo refleja: si la fila falla pero el correo salió, el visitante ve «llegó»,
porque llegó. Al revés se pierde un cliente por un problema de infraestructura.

**`SUPABASE_SERVICE_ROLE_KEY` nunca lleva el prefijo `NEXT_PUBLIC_`.** Ese
prefijo la manda al navegador de todo el mundo y esa llave salta RLS.

### El correo trae `Reply-To` del visitante

Así se contesta con «Responder» sin copiar direcciones a mano, y el asunto ya
dice el nombre y **de qué página** salió el mensaje. Es la diferencia entre una
bandeja que se puede trabajar y un montón de avisos iguales.

### Los dos `ContactPoint` del grafo

`lib/schema.ts` declara **dos** y no uno, porque no son el mismo canal: WhatsApp
no es «el teléfono» —tiene su propia URL, su propio uso (una duda corta) y es
como llega la mayoría desde un móvil en México. Un solo nodo que mezcla correo y
teléfono describe mal la realidad, y un asistente que lee ese grafo no puede
ofrecer el canal correcto.

Lo que **no** se marca: `SearchAction` (no hay buscador), `contactOption`
(ninguna aplica) y `ReserveAction` (dependería de una variable de entorno, así
que el grafo cambiaría según el despliegue). Marcar lo que no es cierto es peor
que no marcar.

## Los huecos de imagen — 40 pendientes, y dónde van

`data/media-slots.ts` es la única fuente. `npm run media:manifest` regenera
`docs/MEDIA.md` **del mismo dato que pinta las páginas**, así que la lista para
el dueño no puede desincronizarse del sitio.

Prioridad, y no todos valen lo mismo:

1. ~~**`home-evidencia`**~~ — **LLENADO.** Ver «La evidencia»: son tres capturas
   reales del panel de Search Console de `manuelsolis.com`. Era el único archivo
   que valía la pena conseguir si solo llegaba uno, y llegó.
2. Los **ocho de servicios**, dos por servicio: el crawl, el schema, el
   Lighthouse, el PR, el flujo, el chat, el dashboard, el modelo.
3. Las capturas de proyectos.

Mientras no existan, cada hueco es **un renglón con su ruta exacta**, no una caja
vacía (ver «El hueco de medio es un RENGLÓN»). Se llenan poniendo el archivo en
`public/` y cambiando `filled: false` a `true`. El layout no se mueve un píxel.

## SEO — la ronda, y cómo repetirla

La ronda se corre sobre el **HTML servido**, no sobre el código, con la sonda de
`scratchpad/seo.mjs` del historial: títulos y descripciones únicos y en rango, un
solo h1, canónico coincidente, hreflang recíproco con x-default, tipos de
JSON-LD, imágenes sin alt y enlaces internos.

Estado tras esta ronda: **0 hallazgos en las 16 rutas, en los dos idiomas.**

Lo que encontró y se arregló:

- `/es/certificaciones`: título de **73 caracteres**. La plantilla añade
  « | Carlos Anaya Ruiz» (20), así que el título de la página tiene que caber en
  ~40 para no pasar de 60 y que Google no lo recorte.
- Tres descripciones por encima de 165: `/cv` (202), `/certificaciones` (196),
  `/privacidad` (169).
- `/privacidad`: la descripción afirmaba algo que el boletín volvió falso.

Lo que **no** era un hallazgo: el hreflang salía en 0 en las 16 rutas y era un
falso positivo de la sonda — Next emite `hrefLang` en camelCase y el regex era
sensible a mayúsculas. Está los tres (es-MX, en-US, x-default) y son recíprocos.

**⚠ `CONTENT_UPDATED` en `app/sitemap.ts` se sube cuando la copia cambia de
verdad.** Esta ronda cambió el titular, la frase del operador y el tiempo de
respuesta, así que se subió. No se sube en refactors.

## La ronda de contenido: el sitio decía cosas que no eran

Una revisión de la copia de las 16 rutas contra el código que de verdad corre.
**39 hallazgos confirmados**, y el reparto dice de qué tipo era el problema:
19 afirmaciones sin respaldo, 6 contradicciones entre páginas, 5 cifras que no
cuadran, 5 trozos de copia duplicada, 2 de relleno, 1 error de lengua y 1
marcador de posición.

### El aviso de privacidad describía un formulario que ya no existe

**Ocho cláusulas.** El formulario dejó de componer un `mailto:` y pasó a ser una
Server Action que entrega por Resend y reenvía al sistema de gestión, y el
documento se quedó diciendo «este sitio no tiene base de datos», «el formulario
no manda nada a ningún servidor» y «el tratamiento empieza cuando tu correo
llega a mi buzón, no antes».

**La peor no era ninguna de esas.** Era un párrafo que INVITABA al visitante a
abrir la pestaña de red del navegador y comprobar que no sale ninguna petición.
Hoy eso demuestra lo contrario en diez segundos: un documento legal que ofrece
una verificación que lo desmiente es peor que uno que solo está viejo. Se borró
sin sustituto.

Lo que se rehízo, todo en el mismo commit porque a medias el documento se
contradice: el resumen de tres bandas (dos eran falsas, la de cookies sigue
siendo cierta y por eso se queda), la sección de qué pasa al enviar, los cinco
campos —decía cuatro—, el consentimiento (describía una casilla que
`lead-form.tsx` no tiene), los terceros (nombraba uno de tres), la
conservación, la seguridad, el ARCO y la cabecera de mantenimiento.

**No se afirmó nada sobre row level security, y eso fue deliberado.** El plan
proponía una viñeta diciendo que la tabla `leads` la tiene activada.
`SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` están VACÍAS: no hay tabla de la
que afirmarlo. Por eso Supabase se declara «previsto y no conectado» y la
cláusula de seguridad habla solo de lo que existe. ⚠ Cuando se conecte, se
comprueba RLS ANTES de escribir la viñeta.

### Los términos eran peor en un sentido concreto

La cláusula del formulario es una **limitación de responsabilidad**, y trasladaba
al visitante un riesgo que hoy es del despacho: «que el correo salga depende de
tu dispositivo, de tu cliente de correo y de tu proveedor». Esa cadena ya no
existe; la de verdad es Resend y esta infraestructura, las dos bajo control
propio. Una cláusula así, además de falsa, **no protege**: se lee contra quien la
redactó. Lo que sí se conservó, porque sigue siendo honesto, es que no se promete
la entrega de un correo y que hay un canal alterno cuando la cadena falla.

### La fecha, en dos constantes que se separaron

`LAST_UPDATED` decía `2026-08-24` y el texto visible `19 de agosto de 2026`:
cinco días de diferencia en el documento cuya propia cláusula de cambios dice que
la fecha identifica la versión vigente. Ahora la etiqueta se deriva
(`formatDate(LAST_UPDATED, locale)`) en el aviso y en los términos.

Eso obligó a arreglar `formatDate`: **le faltaba `timeZone: 'UTC'`**. La entrada
es una fecha civil sin hora, que `Date` interpreta como medianoche UTC, y
`toLocaleDateString` la trasladaba a la zona local — en CDMX (UTC−6) imprimía el
día anterior. `lib/blog.ts` ya lo llevaba, y por eso el blog nunca se corrió.

### Las promesas que el propio sitio se desmiente

Este es el patrón que más se repitió: una página promete algo y otra del mismo
repo dice que eso no se puede prometer.

| Decía | Lo desmentía |
|---|---|
| «SSR/ISR para indexación instantánea» | `data/faq.ts`: «Google no promete indexación ni posiciones a nadie» |
| «Google indexa el contenido en el primer intento» | lo mismo |
| «se indexan el mismo día en que salen a producción» | lo mismo |
| «impacto en 2-8 semanas después del recrawl» | el `notFor` del propio servicio admite no controlar el recrawl |
| «Vercel garantiza despliegues» | `data/faq.ts` se niega a garantizar lo que no controla |
| «la mejor combinación» | un superlativo sin comparativa |
| «el único framework que me deja elegir el renderizado por ruta» | Nuxt, Astro, SvelteKit y Remix también |
| «Siempre empiezo con una auditoría técnica» | el `process` de ese servicio empieza en «Alcance y arquitectura» |
| «Todas empiezan con una auditoría» (los cuatro) | dos de los cuatro empiezan en inventario y en definición de preguntas |
| «si no se puede medir, no se cobra como resultado» | la FAQ de la portada: «alcance cerrado… precio fijo», y sale en el `FAQPage` |

**La lección: el respaldo tiene que estar en un archivo del repo, no en la
intuición de que suena razonable.** Cada reemplazo de esta ronda se escribió
apuntando a un archivo concreto, y donde no había archivo se quitó la promesa en
lugar de suavizarla.

### El `notFor` que se anulaba a sí mismo

«No es para decisiones legales, médicas o financieras **sin revisión humana**»
decía en realidad «sí lo tomo, con aprobación humana» — y la aprobación humana ya
está vendida dos párrafos antes. Nadie se autoexcluye leyendo eso, y es el único
`notFor` que se imprime en el margen de la cabecera bajo «no aplica». Un
descalificador con una condición al final no descalifica.

### El NASA estaba atribuido, no citado

«Galactic Problem Solver **por contribución técnica con datasets complejos y
visualizaciones**» es una interpretación, no una cita: en el repo no hay diploma,
ni texto del certificado, ni URL de verificación (`image` está vacío a propósito
y `public/pdf/` está vacía). En el NASA Space Apps Challenge esa es la
designación de los equipos que entregan un proyecto válido; las distinciones son
Local y Global Nominee. La frase la subía dos escalones — el inflado que la propia
página promete no hacer, y es la afirmación estelar del sitio: encabeza
`/premios`, va en su descripción SEO y se repite en `/sobre-mi`, `/cv` y
`/proyectos/aurascope`.

Se **borró** el campo `impact` en vez de recortarlo: es opcional a propósito, y
reducido a repetir el nombre la fila sería el mismo dato dos veces.

### «Software Developer Engineer» no existe en Amazon

Es **Software Development Engineer** (SDE). Estaba en seis lugares, incluidos el
`<title>`, el `h1` de `/proyectos/amazon` y el JSON-LD, así que salía también en
Google. Para cualquiera de la industria es la señal inmediata de que el puesto se
escribió de memoria. Nada de «Engineer I»: el nivel no está en ningún archivo.

### Las cifras escritas a mano al lado de las que se calculan

El sitio calcula `canales a–${channelId(services.length - 1)}` en la portada
y en dos sitios más de `/servicios`… y tenía «a–d» escrito a mano en el rótulo de
`/servicios` y de `/contacto`, más tres «los cuatro» en prosa. Con un quinto
servicio, el hub pintaba cinco filas bajo un rótulo que decía cuatro mientras el
dial se actualizaba solo. **Es el mismo defecto del «a–e» que el comentario de la
portada ya documenta como «el tipo de mentira que nadie revisa».** Ahora los dos
rótulos se calculan y las cuentas en prosa se quitaron — el arreglo es quitar la
cifra, no convertirla en dígito.

### El boletín se anunciaba «en preparación» junto a cien artículos programados

Y `newsletter.lead` decía «Sin cadencia fija» mientras el **aviso de privacidad**
declara «dos por semana, los martes y los viernes». El aviso es el que tiene razón
(`vercel.json`: `0 14 * * 2,5`), así que se corrigió el otro lado. Una
contradicción cuyo otro extremo es un documento legal no es un descuido de copy —
es el mismo defecto que el aviso que decía «no hay boletín» al lado de un
formulario de alta.

Nada de fechas absolutas escritas a mano en el acuse: «el próximo artículo te
llega el martes o el viernes» es cierto hoy y sigue siéndolo el 2027-08-06, donde
termina el calendario. Y no dice «el primero», porque para el suscriptor número
mil no lo es.

### «Vigente» en el hueco de la fecha, tres veces

El PMP se renueva cada tres años con 60 PDU. «Vigente» sin fecha de emisión ni de
renovación es la única afirmación de `/certificaciones` que no se puede
comprobar — y la página se titula «Credenciales que se pueden comprobar» y remata
con «para que no tengas que creerme». Iba en el hueco donde va la FECHA, así que
ahora dice «sin fecha». **Las tres a la vez** (`certificaciones.noDate`,
`cv.active` y una tercera escrita a mano en el JSX de `/sobre-mi`), o el sitio se
contradice entre páginas.

### La bio del blog, en 100 URLs

Decía «plataformas en producción para empresas de servicios y **productos SaaS
propios**». Los únicos `kind: 'propio'` de `data/companies.ts` son AuraScope y
LogiRoute AI: dos hackathons de un mes. Y en `data/` no hay una sola empresa de
servicios como cliente. Es la afirmación con más superficie del sitio —se sirve en
100 URLs y es el nodo `Person` del grafo escrito en la página—, así que ahora cada
cláusula sale de un archivo: el grado de `data/education.ts`, el rol del `title`
de `data/personal.ts`, los tres empleos de `data/companies.ts` y la última frase
es literalmente el `summary`.

### Y una cifra congelada en el documento que leen los asistentes

`llms.txt` decía «Blog técnico (100 artículos)». Hoy `getPublishedPosts()`
devuelve 0 y la cifra no llega a 100 hasta agosto de 2027. Todo el resto del sitio
cuenta del dato precisamente por esto —la tarjeta OG del blog lo dice con sus
propias palabras—, y `llms.txt` es exactamente el documento que leen los
asistentes que este sitio vende conseguir que lo citen. Ahora dice «100 artículos
programados, 2026-08-25 a 2027-08-06»: cierto hoy y cierto en 2027.

**Si se quiere la cifra real de publicados, la etiqueta no basta:** hay que darle a
la ruta un ciclo de refresco como el de sus hermanas (`revalidate = 900` en vez de
`dynamic = 'force-static'`) y purgarla desde el cron. Sin eso, contar en vivo es
peor que la cifra fija.

### Tres artículos prometían en el título lo que el cuerpo no trae

- **012 (phishing)** — «con ejemplos reales» en el `<title>`, el `<h1>`, la meta,
  la tarjeta OG y la fila del índice. «Ejemplo» y «anonimizado» no aparecen ni una
  vez en el cuerpo: lo que hay es una taxonomía, ocho señales y un protocolo. Y un
  «corta el 95% de los casos» sin fuente.
- **007 (casos de uso de IA)** — la meta prometía «el resultado medible de cada
  uno» y el cuerpo dice «qué nivel de complejidad tiene». De los 15 casos, tres
  traen cifra.
- **039 (prompt engineering)** — 1107 palabras para 20 técnicas son 55 cada una.
  Prometía «el antes y después de cada prompt»: **aritméticamente imposible** a esa
  extensión.

Después de editar el front-matter, `npm run blog:data`. **Verificado con un diff:
no se movió ni una fecha ni un slug** — solo los tres títulos y descripciones. Eso
es lo que hay que comprobar siempre al regenerar, porque `SCHEDULE_START` mueve
`datePublished` de URLs ya indexadas.

### Un `<ol>` necesita su propia regla

La cláusula que enumera los destinos del formulario es una lista NUMERADA, y el
número es el dato. El `DOC` del aviso estilizaba `ul` y no `ol`, así que el
preflight de Tailwind le quitaba marcador y sangría: se habría renderizado como
párrafos sueltos. Lleva `list-decimal`, `pl-6` y el marcador en mono, como toda
cifra de este sistema.

### Lo que NO se tocó, y por qué

- **`data/skills.ts`.** El archivo confiesa que pasó de 56 a ~165 entradas porque
  «la cinta con 56 nombres se veía corta», y dos párrafos más abajo declara «⚠ ESTA
  ES LA LISTA PÚBLICA DE UNA PERSONA REAL». Hay 38 entradas que no aparecen en
  ningún archivo del repo. **Pero borrarlas es del dueño, no mío:** el repo solo
  cubre tres empleos y cinco proyectos, así que la ausencia ahí es evidencia débil,
  y borrar una habilidad real falsea tanto como inventar una.
- **El stack contradictorio de Amazon.** `experience.ts` describe un analista de BI
  y Product Owner (Python, Pandas, Power BI, DAX, Jira); `companies.ts` describe un
  SDE de backend (Java, AWS, CI/CD, Git). Misma empresa, mismas fechas, y no
  comparten ni una tecnología salvo Python. Se ve abriendo `/cv` y luego
  `/proyectos/amazon`. El arreglo es fuente única, pero **cuál de los dos es el
  puesto real solo lo sabe él.**

## La primera publicación real, y el defecto que sacó

El artículo 001 salió el **2026-08-25 a las 14:00 UTC**, la fecha que fija
`SCHEDULE_START`. La página se publicó sola por ISR, pero **el correo no salió**,
y lo que lo destapó fue mirar los logs, no el código.

La secuencia, medida:

| Hora | Qué pasó |
|---|---|
| 14:00 | el cron de Vercel dispara y revalida las rutas |
| 14:00 | el GET de calentado recibe **404** |
| 14:00 | se niega a anunciar por correo y devuelve **500** |
| 15:20 | una llamada manual ve 200 y el correo sale |

**La guarda funcionó**: no se anunció por correo una URL que devolvía 404, que es
el peor resultado posible de todo el sistema. Lo que falló es que hacía falta una
mano — y habría hecho falta en los **100** artículos, porque la causa es
estructural.

### Un solo GET nunca puede ver el resultado de haber despertado la página

`stale-while-revalidate` entrega la versión vieja al PRIMER lector y usa **esa
misma petición** para disparar la regeneración por detrás. El GET que hace de
despertador es, por definición, el que recibe la versión sin regenerar. Con las
100 rutas prerenderizadas como 404, ese primer GET del día de publicación siempre
da 404.

**La prueba de que fue eso y no otra cosa:** en los logs de producción de esas
tres horas, la página del artículo devolvió 404 **exactamente una vez**, y fue esa
petición. Un grupo de logs por `requestPath` y por `statusCode` lo dijo en dos
consultas; leyendo el código no se veía.

Ahora el calentado hace **hasta cuatro intentos con 1.2 s de espera**, con un
presupuesto de **45 s para TODO el calentado, no por artículo**: con varios
pendientes, cuatro intentos cada uno se comerían la invocación. El presupuesto se
comprueba **antes** de gastar, así que agotarlo deja el artículo sin correo, que
es el resultado seguro. Y un 404 en el primer intento **dejó de registrarse como
error**: es lo esperado, no un fallo.

Verificado ejercitando el código real de la ruta —apuntando su calentado a un
servidor que reproduce la carrera— en los dos caminos:

| Escenario | Resultado |
|---|---|
| 404 y luego 200 | petición 1 = 404, petición 2 = 200, `calentadas` 200, `ok: true` |
| 404 siempre | 4 intentos, `correo: []`, `omitidos` con el slug, **HTTP 500** |

Y la idempotencia se comprobó en el mismo paso: la segunda llamada devolvió
`ya-enviado` en vez de mandar un segundo correo, porque la difusión
`blog-001-…` ya existía en Resend con estado distinto de `draft`.

### Lo que quedó verificado en producción

`status: sent` en Resend a las 15:20:56 UTC. El artículo responde 200 con su
`h1`, su `BlogPosting` y su `FAQPage`; **el del viernes sigue en 404**, que es la
puerta de publicación haciendo su trabajo; el sitemap tiene 32 URLs, el feed 1
item y `/en/blog` sigue consolidando con 308.

> ⚠ **Los martes y viernes a las 14:00 UTC, la ejecución del cron es lo único que
> hay que mirar.** Si responde 500, el correo de ese artículo NO salió: la
> respuesta trae `calentadas` y `omitidos` diciendo cuál y con qué código. La
> ventana de 8 días lo recupera en la siguiente ejecución, pero eso son tres o
> cuatro días de retraso para ese artículo, así que conviene llamarlo a mano:
>
> ```bash
> curl -H "Authorization: Bearer TU_CRON_SECRET" \
>      https://www.carlosanayaruiz.com/api/cron/publicar
> ```
>
> Es idempotente: si el correo ya salió, contesta `ya-enviado` y no manda nada.

## El titular de la portada se cortaba en TODOS los teléfonos

El defecto más caro que ha tenido este sitio, y estuvo vivo hasta el 2026-09-02
sin que ningún chequeo lo viera. **El `<h1>` de la portada —el elemento LCP— se
cortaba en seco en un teléfono**, en pantalla se leía «tarda en respond», y
`npm run check:overflow` respondía «✓ sin desbordamiento en ningún ancho».

### La causa: `white-space: nowrap` en las cinco frases del morph

La celda es `inline-grid`, así que su ancho lo fija el `max-content` de la frase
más larga. Con `nowrap` ese `max-content` es inalcanzable en un teléfono y la
caja entera se sale del documento. Medido, frase por frase:

| ancho | columna del h1 | frases que NO caben en una línea |
|---|---|---|
| 320 px | 252 px | **las cinco** (42 a 144 px de más) |
| 360 px | 292 px | **las cinco** (2 a 104 px) |
| 390 px | 314 px | cuatro de cinco (33 a 98 px) |
| 414 px | 338 px | cuatro de cinco (20 a 87 px) |

O sea: 14 de los 17.5 segundos del ciclo, con el titular recortado.

**Partir NO reintroduce CLS, y es el punto.** Las cinco frases viven en LA MISMA
celda, así que la fila mide lo que la más ALTA en todo momento y la línea base de
la primera no se mueve nunca. Lo único que cambia es que en un teléfono el bloque
ocupa dos líneas. Medido después: **CLS 0.0000**, y a 1440 la celda sigue midiendo
997 px y llegando a x=1093 — exactamente lo que este archivo ya documentaba, o sea
**en escritorio no cambió un píxel**.

Tampoco hace falta guion: la palabra más larga («responder.», 210–226 px) cabe en
la columna más estrecha (252 px) en todos los anchos. `text-wrap: balance` reparte
las dos líneas.

⚠ **Si añades una frase al morph, mide su PALABRA más larga contra 252 px**, no la
frase entera. La frase ya puede partir; una palabra no.

### Por qué la sonda no lo veía, y qué se cambió para que lo vea

`check:overflow` preguntaba **quién recorta** y excusaba a todo elemento con un
ancestro de `overflow-x: hidden|clip`. Dos ancestros excusaban al titular a la vez,
y **los dos son legítimos**:

1. `overflow-x: clip` en el `body`, que es la red de seguridad del proyecto.
2. `overflow-hidden` en la sección del héroe, que existe para que el retrato
   sangre al canto de la pantalla.

El reporte decía literalmente «culpables=0 (contenidos: clip=259)». **259
excusados, y uno era el titular.**

La pregunta correcta no es quién recorta sino **QUÉ se recorta**: una caja
decorativa que sangra al canto es intención del diseño; una línea de texto cortada
es un defecto, siempre, sin importar quién la corte. Hay una segunda pasada con
tres filtros:

- **Solo elementos que llevan texto** — nodos de texto propios, o un
  pseudo-elemento cuyo `content` resuelve a una cadena. Lo segundo no es teórico:
  las cuatro frases de paso viajan en `data-w` y las pinta `content: attr()`, así
  que una sonda que solo mire nodos de texto no las ve.
- **Nada que se MUEVA.** Una marquesina está cortada por definición. Pero el filtro
  tiene que ser «anima `transform`», no «está animado»: las frases del morph
  también llevan una animación infinita —el cruce de opacidad— y con el filtro
  ancho quedaban excusadas otra vez. Se inspeccionan los keyframes.
- **Nada dentro de un carril desplazable**: ahí el contenido de más se alcanza
  desplazando, no se pierde.

**Verificado en los dos sentidos, que es la única prueba que vale de un chequeo:**
con el arreglo puesto pasa las 33 rutas en 7 anchos; **reintroduciendo `nowrap` a
propósito falla con exit 1** y reporta «78 px de texto fuera del encuadre» a 390 y
67 a 414 — las mismas cifras medidas a mano.

Y de paso **`WIDTHS` empieza ahora en 320**, que cierra el hueco que este archivo
tenía declarado como deuda («check:overflow empieza a probar en 360»).

## Cuatro defectos más de esta ronda

- **El panel móvil tenía la misma jerarquía roja que el desplegable.** Los cuatro
  hijos de «Trayectoria» no llevaban marca, así que su texto arrancaba en x=120
  mientras el rótulo de su propio grupo estaba en x=130: **los hijos quedaban menos
  indentados que el padre** y se leían como hermanos suyos. Ahora llevan la misma
  gramática que escritorio —`.drop-row` con la letra del canal o el tick de 1 px—
  y las ocho filas de los dos grupos caen al mismo x. La sangría la da la MARCA, no
  un `pl-*` en la lista: un padding indentaba el texto de Servicios (que ya tenía su
  letra) y no el de Trayectoria (que no tenía nada).

- **«DESCARGAR EN PDF → →», dos flechas.** `.pull-tab::after` ya pinta la flecha y
  yo añadí otra en el JSX al migrar el botón de imprimir y el CTA del panel móvil.
  Los dos consumidores viejos de la clase —/contacto y el pie— nunca la pusieron.
  **La flecha es parte de la pestaña, no del texto.**

- **La ficha del despacho imprimía el rótulo «Stack» sin un solo valor**, y con él
  112 px de aire hasta el borde de la sección. `check:layout` lo reportaba como
  SECCIÓN MUDA y tenía razón: `stack: []` en `data/companies.ts`. Ahora el rótulo,
  los dos renglones del margen y el `keywords` del JSON-LD **solo se emiten si hay
  stack** — el `keywords` salía como `""`, una propiedad vacía declarada. Es la
  regla que este proyecto ya escribió tres veces: si un dato no está en el repo, no
  aparece **ni su etiqueta**.

- **El rótulo del instrumento era la `<figcaption>` y el pie real un `<p> `suelto.**
  Una `<figure>` admite UNA sola `<figcaption>`, primer o último hijo, así que solo
  una de las dos líneas podía serlo — y la que describe la figura es la de abajo,
  no la etiqueta del panel. Un lector de pantalla anunciaba «Google Search Console ·
  rendimiento» como pie de una imagen cuyo texto explicativo estaba tres nodos más
  allá. Invertido.

## Verificación — en este orden

```bash
npx tsc --noEmit --incremental false
npm run lint
npm run palette:check                                # contraste, incluidos compuestos
npm run check:blog                                   # los 100 artículos renderizan sin residuos
npx next build
npm run check:perf     http://localhost:PUERTO/es    # presupuesto: 20 en reposo · hoy va en 0
npm run check:layout   http://localhost:PUERTO /es   # huecos, cortes, cintas rotas
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

## El pie está migrado

Era el último rincón en «aurora, cristal y profundidad»: un panel de cristal con borde de
cuatro lados y reflejo diagonal al 55%, un cuadro redondeado con las iniciales, dos capas
de textura de la aurora y cinco iconos con un alias de azul heredado. Ahora son cuatro
columnas con su regla superior, la lista de navegación partida en dos con `columns-2` —así
las cuatro acaban a la misma altura y desaparece la franja muerta que quedaba debajo— y
`.sheet` como único margen.

## La evidencia — tres capturas reales, y por qué llevan placa

`data/evidence.ts` + `components/instrument/evidence.tsx` + `.evidence-doc`.

Reportado tres veces: «no se ven en ningún lado las imágenes de mejoras en Google Search
Console, del Core Web Vitals ni del alcance, y esas son muy importantes». Lo eran y no
estaban. Ahora hay tres, y **son reales**: capturas del panel de Search Console de
`manuelsolis.com`, la propiedad que el dueño administra como Director de Tecnologías del
despacho (`data/experience.ts`).

> ⚠ Antes de esto llegaron otras once imágenes que **no** eran capturas: traían manifiesto
> C2PA/JUMBF de OpenAI y una de ellas el texto literal `blurred-domain-example.com`. Se
> rechazaron dos veces y no están en el repo. La lección operativa: **una captura de
> instrumento se verifica con `exiftool`/JUMBF antes de publicarla**, no con la vista.

| Archivo | Qué mide | Dónde vive |
|---|---|---|
| `search-console-clics-impresiones-12-meses-…` | 30.5K clics · 1.4M impresiones · CTR 2.2% · posición 11.5, 12 meses | **portada**, sección «El registro» |
| `core-web-vitals-urls-buenas-search-console-…` | 133 URLs buenas en escritorio, desde el nivel de 60 el 2 jun 2026 · fuente Chrome UX Report | **/seo-tecnico**, debajo de lo que el servicio promete |
| `core-web-vitals-grupo-de-urls-search-console-…` | 99 el 31 jul → 133 el 30 ago · grupo de 131 URLs con una de ejemplo | **/proyectos/law-offices-manuel-solis** |

### La lectura va en TEXTO y la captura debajo

Es la decisión que define el componente, y son tres razones medidas:

1. **Un buscador no lee los píxeles de una gráfica.** Servir «1.4M impresiones» solo dentro
   de un WebP es servirlo a nadie: el dato más fuerte del sitio quedaría fuera del índice.
2. **A 375 px una captura de 1592 va al 24%.** El «133» de Search Console mide 44 px en el
   archivo y ahí bajaría a 10. Medido en captura: en móvil la imagen es ilegible y las
   cuatro cifras de la placa se leen a tamaño completo. Esa comparación ES el argumento del
   diseño.
3. Es la tesis del sitio aplicada a sí misma: el veredicto se lee contra una regla, no
   dentro de una tarjeta. La placa de datos ES esa regla.

### Tres reglas del dato

- **Toda cifra de `readings` está IMPRESA en su propia imagen.** Si Google escribe «30.5K»,
  el repo dice «30.5K» — no 30 500, que sería inventar precisión que el panel no da. La
  única derivada es `+34`, y sale de restar dos números impresos (133 y 99) en la MISMA
  página donde las dos capturas están a la vista.
- **La propiedad se declara en el pie.** No son números de este dominio, y callarlo sería la
  clase de afirmación sin respaldo que este repo lleva tres rondas quitando.
- **La captura solo se recortó y se tapó cromo.** Fuera la columna de navegación (~24% del
  ancho, cero datos, ilegible en un teléfono) y el bloque de una ventana del sistema que
  cortaba por la mitad la fila de iconos. **Ni un píxel de dato, eje, rótulo o cifra.**

**Y ningún filtro de color.** Los dos retratos llevan `grayscale` y `sepia` porque su luz es
azul y este negro es cálido. Una gráfica cuyas SERIES son de color —azul los clics, morado
las impresiones, verde las URLs buenas— **no se tiñe: sería alterar la evidencia para que
combine.** `.evidence-doc` tampoco atenúa en reposo, a diferencia de `.credential`, que vive
al 92%: la cifra medida es el argumento de la sección.

El archivo trae horneado un margen del 4.5% del color de fondo del panel para que la máscara
de cantos se coma ese margen y no el eje. Sin él, difuminar el canto se come el rótulo.

## El desplegable del nav era del sistema anterior

Reportado: «no me gusta cómo se ve el desplegado de las opciones en servicios y trayectoria
cuando pongo el mouse encima». Medido en captura a 1440 con el puntero encima, y eran
**seis** defectos concretos:

| Estaba | Se veía | Va |
|---|---|---|
| fondo en rgba al 86–90% + `backdrop-filter: blur(13px)` | **el masthead se leía A TRAVÉS del menú** — «que tu» cruzando la fila de «Dashboards» | humo OPACO, el único escalón de superficie del sistema |
| cristal dentro de cristal (cuelga de `.chrome-glass`) | se pagaba dos veces por verse peor | sin `backdrop-filter` |
| `border-radius: … 1.5rem 1.5rem` | `rounded-2xl` exacto, la forma que la regla cero prohíbe por su nombre | radio 0, y por canto el GROSOR DEL PAPEL (`.plate`: 1 px claro arriba, 1 px oscuro abajo) |
| sombra de 50 px de radio | una tarjeta flotando del nav | penumbra sin desplazamiento: el aire bajo una hoja levantada |
| `.enter` en el panel **y** en cada fila, con retardos | cuatro filas trasladándose 24 px DENTRO de un panel que también se trasladaba 24; la última no se asentaba hasta los **585 ms** | `.drop-unroll`: `clip-path` en 200 ms, de una pieza, y las filas no se mueven |
| `.drop::before` con radio 999 px y dos `inset` | un **chip gris redondeado** alrededor de «Servicios» y «Trayectoria», y solo en 2 de los 7 enlaces | el cuerpo radial apagado en los cantos con máscara: un brillo, no un marco |

El comentario del JSX **afirmaba que el panel era opaco** mientras el CSS lo hacía de
cristal. El archivo se contradecía consigo mismo.

### Y las filas no decían a qué grupo pertenecían

`.drop-row`. En Trayectoria eran cuatro etiquetas flotando sin marca, sin letra y sin regla.
Ahora es la gramática de `.band`: regla superior por renglón y la marca **al mismo x en los
dos menús** — la letra del canal donde hay canal (`a`–`d`), un tick de 1 px de `1.125rem`
—el ancho exacto de `.nav-ch`— donde no. Sin ese tick, Trayectoria caía 1.75 rem a la
izquierda y los dos paneles no se reconocían como el mismo objeto. Las páginas de
trayectoria siguen SIN letra: no son canales ni una secuencia.

El hover era `bg-brand-wash`, o sea humo a sangre detrás del texto: una píldora, y del mismo
color que la superficie nueva del panel, o sea invisible. Ahora es la PLUMA (`.channel-pen`),
con su gemela en `:focus-visible`.

**Dos trampas medidas, las dos del mismo tipo — un token vale para la superficie para la que
se midió:**

- ⚠ **`.drop-row:first-child` casa con LAS CUATRO filas.** El renglón es el `<a>` dentro del
  `<li>`, así que todos son el primer hijo de su propio `<li>`: el selector apagaba las
  cuatro reglas. Tiene que ser `li:first-child > .drop-row`. Se detectó en captura, no
  leyendo el código.
- ⚠ **Sobre HUMO, `--hairline` mide 1.13:1 y `--hairline-strong` 1.43.** Los dos por debajo
  de lo que un trazo de 1 px necesita. Ceniza (4.4) sí se lee y convierte el menú en tabla.
  Papel al 20% cae en 1.7. Es la misma lección que `--ink-plate`.

## La regla que separa dos temas caía en medio de 160 px

Reportado: «mejora la separación de las cosas y cómo están colocadas, porque no se entiende
en casi ningún lado qué corresponde a qué». Medido con `getComputedStyle` sobre las
secciones de /servicios y /premios: **cada una era `py-20`**, o sea 80 px de relleno arriba
y 80 abajo. Con la regla de separación en `border-top`, eso deja el trazo **exactamente
equidistante** entre el contenido que cierra y el rótulo que abre.

Una regla a la misma distancia de las dos cosas no dice a cuál pertenece. En imprenta el
trazo que abre una sección va PEGADO a lo que introduce y LEJOS de lo que cierra.

**98 secciones** con `border-t border-hairline` pasaron a padding asimétrico, ~1.7:1, con el
total casi igual:

| era | ahora | regla → rótulo | contenido → siguiente regla |
|---|---|---|---|
| `py-20` | `pb-24 pt-14` | 56 px | 96 px |
| `py-16` | `pb-20 pt-11` | 44 px | 80 px |
| `py-24` | `pb-28 pt-16` | 64 px | 112 px |
| `py-10` | `pb-12 pt-7` | 28 px | 48 px |

**La `.plate` NO cambia.** Es una superficie invertida, y el cambio de superficie ES el
separador: ahí el `py-20` simétrico es correcto.

### Dos carriles de datos EMPAREJADOS no pueden entenderse

En /certificaciones había dos cintas: `ribbonNames` arriba y `ribbonIssuers` abajo, las dos
derivadas del MISMO array **por índice**, o sea pensadas para leerse como pares. Y corrían a
distinta velocidad y en direcciones OPUESTAS (`large` da 64 px/s, `reverse` un 72% de eso
hacia atrás), así que el nombre de una credencial y su emisor se separaban un poco más en
cada frame y no volvían a coincidir nunca. Medido en captura: encima de «TOEFL – Certificación
de Inglés» pasaba el rótulo del PMP.

Es el caso más literal del defecto que se reportó, y no era espaciado: **por construcción**.
Fusionadas en UNA cinta donde cada item es `nombre · emisor · año`, nada puede desalinearse.

**Y cuatro páginas pasaban el MISMO array a las dos cintas** —/seo-tecnico, /sobre-mi,
/desarrollo-web y /automatizacion-ia (esta con `[...items].reverse()`, que es el mismo array
otra vez)—. Con la duplicación interna de `Ribbon` para cerrar el bucle, **cada etiqueta
salía cuatro veces en el HTML servido**: exactamente el defecto que la portada ya tiene
documentado como corregido. Repartidas en mitades sale dos veces y los dos carriles siguen a
distinta velocidad, porque `reverse` no cambia.

## Los botones de shadcn: el nav NO estaba migrado

La sección de abajo dice «el nav está migrado — era el último rincón». Era falso, y lo
destapó el brief: «ve si no hay nada roto, como el contáctame».

**El enlace más pulsado del sitio** —«Contrátame» en la barra— venía del `<Button>` del
sistema anterior y traía, medido en el HTML servido: `rounded-lg`,
`bg-[image:var(--grad-fill)]`, `hover:shadow-glow-brand`, `.sheen` y
`hover:[transform:translateY(-2px)]`.

El puente de tokens neutralizaba tres de las cinco —`--grad-fill` resuelve a un COLOR, así
que `bg-[image:…]` caía a `none`; `--shadow-glow-brand` es `none`; el `::after` de `.sheen`
está apagado con `!important`—. **Las otras dos seguían vivas y se veían:**

- `text-white` = `#ffffff`. Este sistema no tiene blanco puro: su tinta es `--paper`,
  `#ebe6d9`. El CTA era el ÚNICO texto blanco de la barra, al lado de la marca en papel.
- El salto de 2 px al pasar el puntero. Nada en «Papel Ahumado» se levanta.

Lo mismo el conmutador de idioma (`variant="ghost"`: `rounded-lg` + `hover:bg-ground-tint`,
un lavado de fondo dentro de una caja redondeada) y el botón de imprimir el CV.

Los tres migrados: el CTA del nav al vocabulario de la fila (tinta plena, peso alto, la
flecha que avanza), el del panel móvil y el de imprimir a **`.pull-tab`** —que es el «botón»
documentado de este sistema— y el idioma a un enlace de nav como los demás. Con eso
`components/ui/button.tsx` se quedó sin un solo consumidor.

### Y con él se fueron ocho archivos más

`components/ui/` entero: `badge`, `card`, `disclosure`, `field`, `glass-panel`, `input`,
`metric`, `textarea`. **Cero importadores, verificado en todo el repo.** El motivo es el
mismo que documenta «Siete archivos de código muerto, fuera»: eran trampas. `glass-panel`,
`card` y `badge` reintroducen `rounded`, `shadow` y `.glass` en cuanto alguien los importe
por descuido.

Con eso `@radix-ui/react-slot` y `class-variance-authority` quedan sin uso, además de
`embla-carousel-react` y `@radix-ui/react-separator` que ya estaban. **No se desinstalaron**:
no viajan al navegador y tocar el lockfile merece revisión aparte.

También se retiró `docs/IMAGENES.md` y `scripts/generate-image-manifest.mjs`: describían
`<ImageSlot>`, que se borró hace dos rondas, y el documento anunciaba «31 huecos, 0 con
imagen» mientras `docs/MEDIA.md` —generado del dato que de verdad pinta las páginas— dice
otra cosa. Dos inventarios de lo mismo y uno de los dos mentía.

> ⚠ **Turbopack cachea el CSS más fuerte de lo que dice esta guía.** La nota de «Trampas»
> dice que `touch` no invalida y que hay que cambiar contenido. **No basta:** en esta ronda
> `.drop-panel` se recompiló y `.drop-row`, añadida quince minutos después al MISMO bloque,
> no llegó nunca a la hoja servida — `grep -c drop-row` sobre el `.css` daba 0. Hubo que
> matar el proceso y borrar `.next/dev`. **Si un cambio de CSS no aparece, compruébalo
> contra la hoja servida antes de dudar del selector.**

## El nav está migrado — pero no era el último rincón

> ⚠ Este título fue falso durante dos rondas: el `<Button>` de shadcn del CTA sobrevivió.
> Ver «Los botones de shadcn» arriba.


Como el pie en su día, el nav sobrevivió a dos rediseños porque es el componente que
nadie vuelve a mirar. Llevaba, **visible en captura**, un icono de lucide dentro de un
recuadro redondeado con sombra que se inclinaba 6° y crecía al pasar el puntero: palabra
por palabra el patrón que la **regla cero** de este archivo prohíbe.

Lo que entró en su lugar es el vocabulario que el resto del sitio ya tenía:

| Iba | Va | Por qué |
|---|---|---|
| 4 iconos en los servicios | **la letra del canal**, `a`–`d` | Son los canales a–d del registro: así se llaman en /servicios, en la placa de la portada y en el dial. Por primera vez el menú y la página dicen lo mismo |
| 4 iconos en trayectoria | **nada** | No son canales ni una secuencia, y este proyecto prohíbe numerar lo que no lo es. Una fila sin marca es la gramática de `.band` |
| `<ChevronDown>` | `.caret` | Una punta de pluma: dos reglas de 1 px que se encuentran en un vértice |
| `<Menu>` / `<X>` | `.bars` | Tres reglas de 1 px —el vocabulario del riel— que se cruzan en una × |
| `<ArrowRight>` ×3 | el glifo `→` | Ya es el idioma del resto del sitio |
| `<Globe>` del idioma | nada | El componente ya resolvía los dos anchos: nombre completo en escritorio, código de dos letras en móvil. El icono repetía la etiqueta de al lado |
| `<Printer>` del CV | nada | Su propio encabezado presumía de «cero kilobytes de JavaScript extra»; ahora es cierto |

**El estado lo lee el CSS de `aria-expanded`**, que ya estaba en los botones porque lo pide
la accesibilidad: no hay una prop nueva ni un nodo que se intercambie. Antes el conmutador
móvil cambiaba de elemento en cada pulsación.

**⚠ Y el ahorro de JS es 3.9 kB, no 30.** Se estimó «~30 kB» porque el chunk que contenía
lucide pesaba 29.8 kB — pero doce iconos de lucide son doce arrays de coordenadas, y ese
chunk llevaba otras cosas. Medido antes y después sobre el HTML servido: **671.9 kB → 668.0
kB, y un chunk menos.** La razón para hacerlo es la consistencia con el sistema, no el
rendimiento. Decir lo contrario sería exactamente el tipo de cifra sin respaldo que este
proyecto no admite.

Lucide **sigue instalado y sigue usándose**, en `components/layout/footer.tsx` (GitHub y
LinkedIn), `components/layout/breadcrumbs.tsx` y `data/services.ts`. Los tres son de
SERVIDOR: su SVG se imprime en el HTML y **no viaja un byte al cliente**. Lo que se retiró
es lucide de los componentes marcados `'use client'`, que eran los únicos que lo enviaban
al navegador.

## Siete archivos de código muerto, fuera

Sobrevivían del sistema anterior sin que nadie los importara — verificado en todo el repo,
no solo en `app/` y `components/`:

```
components/motion/tilt-3d.tsx        components/ui/carousel.tsx
components/motion/pointer-glow.tsx   components/ui/separator.tsx
components/motion/counter.tsx        components/ui/image-slot.tsx
components/sections/contact-form.tsx
```

No inflaban el bundle —Next solo empaqueta lo alcanzable— así que borrarlos no cambia una
métrica. **El motivo es otro: eran trampas.** `contact-form.tsx` es el compositor de
`mailto:` que `lead-form.tsx` reemplazó, y este archivo ya documentaba que quien no tiene
cliente de correo se quedaba sin enviar; volver a importarlo por descuido habría
reintroducido ese defecto. Y los cinco de `motion/` y `ui/` traían de vuelta `rounded`,
`shadow-lift` y el giro al hacer hover.

`components/layout/breadcrumbs.tsx` **se queda** aunque nadie lo importe: está documentado
arriba como decisión, porque su JSON-LD sigue vivo en `lib/schema.ts`.

**Quedan dos dependencias sin uso** tras esto: `embla-carousel-react` y
`@radix-ui/react-separator`. No se desinstalaron porque no viajan al navegador y tocar el
lockfile es un cambio que merece revisión aparte. Un `npm uninstall` de las dos es seguro
cuando se quiera.

## Deuda conocida

- ~~Hay una sola foto, 800×800 con fondo de oficina.~~ **Resuelto, y por duplicado.**
  `carlos-anaya-ruiz-retrato.webp` (recorte con alfa, 1000×1663) va en el héroe;
  `carlos-anaya-ruiz-bn.webp` (400×400) va en «el operador», /sobre-mi y el CV. Queda
  `carlos-anaya-ruiz.jpg` porque `SEO_IMAGES.avatar` lo referencia desde el JSON-LD y
  el OG, donde se quiere un cuadrado opaco: **cambiarlo es la siguiente mejora barata**.
- **La foto en blanco y negro son 400×400.** A 15rem (240 px) va bien en 1× y aceptable
  en 2×. **No la sirvas más grande que 15rem** en ningún sitio nuevo, o se va a ver
  blanda.
- ~~A 320 px la fila del nav desbordaba 6 px y ningún chequeo lo veía, porque
  `check:overflow` empieza a probar en 360.~~ **El hueco del chequeo está cerrado:
  `WIDTHS` empieza en 320.** El desborde del nav ya estaba arreglado —el riel baja a
  28 px y el margen de `.sheet` a 16 por debajo de 22.5rem— y ahora la sonda lo
  comprueba en cada corrida en vez de dejarlo a la memoria de quien toque el nav.
- **Las etiquetas de año del registro se pisaban** por debajo de 48rem: 18 px de solape
  a 320 px, se leía «20221», porque cinco cifras de cuatro dígitos no caben en 248 px
  de eje. Ahora van giradas (`.axis-year`), que es lo que hace un instrumento cuando el
  eje va justo.
- **Los titulares se partían el documento a 320 px.** «Premios y reconocimientos» a
  44 px pide 333 px y la columna mide 252: **81 px de desborde horizontal**. Era
  ANTERIOR a esta ronda y ningún chequeo lo veía —`check:overflow` empieza en 360, y
  a 360 la palabra cabe por doce píxeles. Ahora `h1` y `h2` llevan `hyphens: auto`
  por debajo de 30rem: parte por sílabas, que es lo que hace una caja de imprenta.
  **Si añades un titular con una palabra de más de 14 letras, mídelo a 320.**
- **Un círculo rotado tiene caja de cuadrado.** Cuesta 3 px de desborde y se arregla
  recortando el contenedor. Si vuelves a rotar algo a tamaño completo, mídelo.
- **La tarea larga NO es solo de la portada, y esto corrige lo que decía aquí.** Se midió
  por ruta, tres corridas cada una, con un observador propio desde el primer frame:

  | Ruta | corrida 1 (frío) | corridas 2 y 3 |
  |---|---|---|
  | /es | 111 ms | ninguna |
  | /es/contacto | 75 ms | ninguna |
  | /es/premios | 68 ms | ninguna |
  | /es/privacidad | 60 ms | ninguna |

  El patrón es inequívoco: **aparece en TODAS las rutas, solo en la primera carga de un
  perfil limpio, y su tamaño sigue al tamaño de la página.** No es la instrumentación del
  probe ni `<Marks>`: es el parseo y la hidratación de React en frío. La versión anterior de
  esta nota decía «solo en la portada» y era falso — se había medido solo ahí.

  **No se puede quitar sin quitar la interactividad.** Son ~668 kB de JS sin comprimir, y el
  desglose está medido: los tres chunks mayores (219 + 128 + 110 kB) son React 19 y el
  runtime del App Router. Se comprobó buscando dentro de ellos: **no hay lucide, ni el
  diccionario de `next-intl`, ni datos de `data/`.** El piso es el piso.

  Lo que sí se puede decir con datos: el usuario nunca espera esa tarea, porque ocurre
  **antes** de que pueda interactuar, y el LCP en esa misma corrida en frío es de 144–224 ms.
  Las corridas 2 y 3 no tienen ninguna.
- ~~El hueco `home-evidencia`, el más importante del sitio.~~ **Resuelto con tres capturas
  reales de Search Console.** Ver «La evidencia» arriba. Con eso el registro de medios queda
  en **12 pendientes y 5 puestos**, no 40.
- **Faltan 12 imágenes y una son las claves.** `docs/CONECTAR.md` y `docs/MEDIA.md` son
  la lista para el dueño; hasta que llegue, el código de los tres canales está escrito y
  desplegable pero **`ch c` no se pinta** y el formulario dice honestamente que la
  recepción no está conectada. Eso es lo correcto, no un pendiente de código.
- **La copia de las 14 páginas que no son la portada sigue siendo pobre**, y no se puede
  arreglar sola: mejorarla pide **hechos reales** —resultados de cliente, plazos,
  precios, nombres— que no se inventan. El vocabulario, las bandas de canales y los
  huecos de imagen ya están; lo que falta es el contenido, y es del dueño.
- ~~El rediseño compositivo por página no está a la profundidad de la portada.~~
  **Resuelto con el segundo margen.** Las páginas que estaban en una columna llevan
  `.ledger` y su propio instrumento; /cv y /sobre-mi, que ya tenían dos columnas,
  recibieron el tramo. Lo que NO se igualó es el HÉROE: la portada tiene retrato con
  alfa, titular que muta y lectura en vivo, y esos tres viven solo ahí a propósito.
- **El margen se compone de renglones cortos, y eso es un límite real.** `--margin-w`
  son 18rem: una frase de más de ~220 caracteres en `.margin-prose` empieza a hacer
  una columna de sopa. Si un dato no cabe en tres líneas, no es dato de margen.
- **El artículo 10 no tiene portada.** Llegaron 99 imágenes para 100 artículos. La
  página se dibuja sin ella y no se rompe nada, pero es el único hueco visible del blog.
  Se llena poniendo el archivo en `assets/blog-covers-originales/`, añadiendo su entrada
  a `data/blog-covers-map.json` y corriendo `npm run blog:covers`.
- **Los artículos miden ~1 000 palabras, no las 1 800–2 500 que dice el índice maestro.**
  Media real: 997; el más corto 795 y el más largo 1 235. El índice declara objetivos que
  el contenido entregado no alcanza. No se rellenó para llegar a la cifra —mil palabras
  útiles compiten mejor que dos mil con paja— pero para las SERP más disputadas del
  clúster de IA puede quedarse corto, y eso se sabrá midiendo, no discutiendo.
- **El aviso de privacidad menciona el boletín pero no el envío de artículos.** Hoy el
  texto cubre el alta a la lista; ahora la lista además RECIBE un correo dos veces por
  semana. Es la misma finalidad y el mismo encargado, así que no hay una afirmación falsa,
  pero la redacción se queda corta respecto a lo que el sistema hace. **Revisar antes de
  conectar la audiencia de Resend.**
- `data/experience.ts` termina en abril 2025. La cinta muestra ese hueco tal cual porque el
  instrumento no puede mentir. Si hay consultoría en curso, va en ese archivo y la banda
  aparece sola.

## Lo que solo puede contestar el dueño

La ronda de contenido quitó lo falso. **Lo que falta no se puede escribir sin
hechos que no están en el repo**, y cada uno bloquea algo concreto:

1. **¿Cuál era el puesto real en Amazon?** `experience.ts` reclama Product Owner
   bajo Agile-Scrum y trazabilidad HACCP/ISO 22000; `companies.ts` describe un SDE
   de backend. Un SDE que además es Product Owner y supervisa normas de inocuidad
   alimentaria es una combinación que **hay que confirmar, no reescribir a
   ciegas.** Sin esta respuesta no se puede unificar la fuente de los dos stacks.
2. **¿Existe el certificado del NASA Space Apps, y qué dice literalmente?** Si
   existe, se copia su texto exacto y se llena `awards.ts:image`. Y si es la
   afirmación estelar del sitio, el hueco `premios-diplomas` no debería seguir en
   `priority: 'baja'`.
3. ~~**¿Número de certificación PMP y fecha de emisión?**~~ **CONTESTADO el
   2026-09-02, y la respuesta cierra el tema.** El dueño confirmó que tiene la
   certificación del PMI emitida y vigente, y que **no va a publicar el folio ni
   la fecha**. Se le preguntó entre tres opciones explícitas —la tiene sin dar
   folio, solo tiene el curso de preparación de 35 PDU, o está en trámite— y
   eligió la primera.

   **Las 29 afirmaciones de «Certificado PMP» del repo se quedan intactas**, y
   eso incluye el `hasCredential` del JSON-LD, el `<title>` de
   /certificaciones, `llms.txt`, las cuatro tarjetas OG y el `summary` de
   `data/personal.ts`. Son ciertas.

   Lo que sigue sin poder escribirse, y no es un pendiente sino el estado
   correcto: la fila dice «sin fecha» y no «Vigente», el `hasCredential` va sin
   `identifier`/`validFrom`/`expires`, y no hay enlace al registro del PMI
   —que se consulta por número—. ⚠ **No reabrir.** El detalle está en
   `docs/CREDENCIALES.md`.
4. **¿Se conecta Supabase?** Mientras `SUPABASE_URL` esté vacía, el aviso lo
   declara «previsto y no conectado» y la cláusula de seguridad no afirma nada
   sobre row level security. ⚠ Al conectarlo: comprobar RLS, nombrar al proveedor
   en «quién más participa» y mover `LAST_UPDATED`, **en el mismo commit.**
5. **`data/skills.ts`, entrada por entrada.** Hay 38 nombres que no aparecen en
   ningún archivo del repo. La pregunta operativa es una sola: «¿de cuál de estas
   podrías hablar quince minutos con un técnico?» Lo que no se sostenga, se borra
   — la regla ya está escrita en el propio archivo.
