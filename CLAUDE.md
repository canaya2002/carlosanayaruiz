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

1. **`home-evidencia`** — una curva real de Search Console o CrUX con su eje de
   tiempo. Si de toda la lista llega **un solo archivo, que sea este**: es la
   prueba de todo lo demás que dice la portada.
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

## Verificación — en este orden

```bash
npx tsc --noEmit --incremental false
npm run lint
npm run palette:check                                # contraste, incluidos compuestos
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

## Deuda conocida

- ~~Hay una sola foto, 800×800 con fondo de oficina.~~ **Resuelto, y por duplicado.**
  `carlos-anaya-ruiz-retrato.webp` (recorte con alfa, 1000×1663) va en el héroe;
  `carlos-anaya-ruiz-bn.webp` (400×400) va en «el operador», /sobre-mi y el CV. Queda
  `carlos-anaya-ruiz.jpg` porque `SEO_IMAGES.avatar` lo referencia desde el JSON-LD y
  el OG, donde se quiere un cuadrado opaco: **cambiarlo es la siguiente mejora barata**.
- **La foto en blanco y negro son 400×400.** A 15rem (240 px) va bien en 1× y aceptable
  en 2×. **No la sirvas más grande que 15rem** en ningún sitio nuevo, o se va a ver
  blanda.
- **A 320 px la fila del nav desbordaba 6 px** y ningún chequeo lo veía, porque
  `check:overflow` empieza a probar en 360. Está arreglado —el riel baja a 28 px y el
  margen de `.sheet` a 16 por debajo de 22.5rem— pero **el hueco del chequeo sigue
  ahí**: si toca la fila del nav, hay que medir a 320 a mano.
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
- **Una tarea larga de ~55 ms** aparece en 3 de cada 4 corridas de `check:perf` **solo en la
  portada**. Es ANTERIOR a esta ronda —verificado haciendo `git stash` y midiendo el commit
  previo, que da 51/55/60 ms con la misma frecuencia— y no se reproduce con un observador
  propio ni al cargar ni en interacción, así que apunta a la instrumentación del probe sobre
  la única página con JS de cliente propio (`<Marks>`). Las métricas reales están holgadas:
  LCP 116–188 ms, CLS 0.0036, 0 tareas largas medidas desde el primer frame.
- **Faltan 40 imágenes y una son las claves.** `docs/CONECTAR.md` y `docs/MEDIA.md` son
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
- `data/experience.ts` termina en abril 2025. La cinta muestra ese hueco tal cual porque el
  instrumento no puede mentir. Si hay consultoría en curso, va en ese archivo y la banda
  aparece sola.
