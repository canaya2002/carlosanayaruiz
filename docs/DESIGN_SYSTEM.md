# Sistema de diseño — "tech vivo"

Lenguaje visual con **color, profundidad y movimiento**. Fondo claro, gradiente
azul → violeta → cian como firma, tarjetas que flotan, números que cuentan,
secciones que entran al hacer scroll.

Reemplazó a un sistema editorial minimalista que el dueño rechazó por soso.
Cuando dudes entre lo discreto y lo vivo, elige lo vivo — pero sin romper
ninguna de las reglas de abajo.

**Referencia canónica: `app/[locale]/page.tsx`.** Está terminada. Copia de ahí
la estructura, el ritmo y el vocabulario de clases antes de inventar nada.

---

## Lo no negociable

1. **Nunca escribas un color literal.** Ni `#hex`, ni `rgb()`, ni colores de la
   paleta de Tailwind (`bg-blue-600`, `text-gray-500`). Solo los tokens
   semánticos de abajo.
2. **No existe modo oscuro.** No hay clase `.dark`, no hay variante `dark:`, no
   hay script de tema. Fue eliminado a propósito. No lo reintroduzcas.
3. **`--cyan` es solo decorativo.** Mide 2.4:1 sobre el fondo. Sirve como stop
   de gradiente de fondo o resplandor. **Nunca** texto, nunca un borde que
   signifique algo, nunca un ícono de estado. Si necesitas cian legible como
   texto: `text-cyan-ink`.
4. **El gradiente de texto se detiene en violeta.** `.grad-text` usa
   `--grad-ink` (azul → violeta), no el gradiente completo. Una letra que
   cayera en el cian sería ilegible.
5. **Solo se animan `transform`, `opacity` y `filter`.** Nada que afecte el
   layout. Este sitio vende optimización de Core Web Vitals; una animación que
   provoque CLS o suba el INP es una contradicción que se puede medir.
6. **El contenido tiene que estar en el HTML del servidor.** Nada detrás de un
   clic, un scroll o un `useEffect`. `<details>` está bien: el texto está en el
   DOM abierto o cerrado.

---

## Tokens de color

| Token | Utilidad | Uso |
|---|---|---|
| `--ground` | `bg-ground` | Fondo de página |
| `--ground-tint` | `bg-ground-tint` | Bandas alternas de sección |
| `--surface` | `bg-surface` | Tarjetas, paneles |
| `--surface-alt` | `bg-surface-alt` | Panel dentro de un panel |
| `--ink` | `text-ink` | Texto principal, títulos (15.7:1) |
| `--ink-muted` | `text-ink-muted` | Texto corrido (5.9:1) |
| `--ink-subtle` | `text-ink-subtle` | Metadatos, pies (5.0:1) |
| `--hairline` | `border-hairline` | Divisores y bordes de tarjeta — **decorativo** |
| `--hairline-strong` | `border-hairline-strong` | Divisor enfatizado — **decorativo** |
| `--control` | `border-control` | Bordes de input, textarea, botón outline (3.5:1) |
| `--brand` | `bg-brand` `text-brand` | Acción primaria, enlaces (5.0:1) |
| `--brand-strong` | `text-brand-strong` | Hover, enlaces sobre banda (6.5:1) |
| `--brand-ink` | `text-brand-ink` | Texto sobre relleno de marca |
| `--brand-wash` | `bg-brand-wash` | Fondo teñido de marca |
| `--violet` | `text-violet` | Acento secundario, íconos de lista (5.6:1) |
| `--violet-wash` | `bg-violet-wash` | Fondo teñido violeta |
| `--cyan` | `bg-cyan` | **Solo decorativo** — ver regla 3 |
| `--cyan-ink` | `text-cyan-ink` | Cian legible como texto (5.2:1) |
| `--positive` / `--danger` | `text-positive` / `text-danger` | Éxito / error de formulario |

`scripts/palette-check.mjs` verifica que estos valores sigan sincronizados con
`PALETTE_HEX` **y** que cada piso de contraste se cumpla. Córrelo si tocas un
color: `npm run palette:check`.

### Los dos tipos de borde

`--hairline` mide 1.2:1 y así debe ser: WCAG exime los bordes decorativos y el
diseño depende de que los divisores casi no se vean.

Un control de formulario no es decorativo. El borde **es** la señal de dónde
está el campo, así que aplica WCAG 1.4.11 de contraste no-textual (3:1). Para
eso existe `--control`.

- Nunca `border-hairline` en un input, textarea, select o botón outline.
- Nunca `border-control` en un divisor: se ve pesado.

---

## Gradientes

| Clase | Qué hace |
|---|---|
| `.grad-text` | Texto recortado sobre azul → violeta. Tiene `color` de respaldo, así que el texto nunca desaparece. |
| `.grad-fill` | Relleno con el gradiente completo + texto blanco. Botones, badges de ícono, barras. |
| `.grad-soft` | Versión lavada, para fondos amplios. |
| `.grad-border` | Borde con gradiente sin envoltorios extra. |
| `.grad-animate` | El gradiente respirando. Para bloques CTA grandes. |

Sobre `.grad-fill` o `.grad-animate` el texto va **blanco** (`text-white`), y un
botón se invierte a `bg-surface text-brand-strong` — un relleno de marca sobre
el gradiente desaparece.

---

## Escala tipográfica

Sora para títulos (`font-display`, ya aplicada a `h1`–`h4`), Plus Jakarta Sans
para el resto. Usa los tamaños con nombre, nunca `text-[42px]`.

| Clase | Uso |
|---|---|
| `text-hero` | Solo el `h1` de la home |
| `text-d1` | `h1` de las demás páginas, y `h2` de sección |
| `text-d2` | `h2` secundario |
| `text-d3` | `h3`, títulos de tarjeta |
| `text-lead` | El párrafo que sigue al `h1` |
| `text-base` / `text-sm` | Cuerpo / secundario |

Los números que se comparan necesitan `data-numeric` para cifras tabulares.

---

## Composición

- `.eyebrow` — la píldora con punto de gradiente que va sobre el título de
  sección. Ya trae su propio fondo y su punto; úsala, no la rehagas.
- `.card` — tarjeta con profundidad. Añade `.card-hover` para que se eleve.
  La elevación es `transform` + `box-shadow`, nunca `margin` ni `top`.
- `.prose-rich` — cuerpos de texto largo. Fija medida (68ch), ritmo, viñetas
  con gradiente, enlaces. Envuelve el texto, no estilices los hijos.
- `.mesh` — malla de blobs animada. Va como `absolute inset-0` dentro de un
  contenedor `relative isolate overflow-hidden`, con `aria-hidden`.
- `.grid-fade` — cuadrícula fina que se desvanece. Misma colocación.
- `.pointer-glow` — lo aplica el componente `<PointerGlow />`.
- `.sheen` — brillo que barre al pasar el mouse. Para botones y tarjetas.
- `.ping` — punto que late. Indicador de disponibilidad.

### Estructura de página

```
Contenedor:  mx-auto w-full max-w-6xl px-5 sm:px-8
Sección:     py-20 sm:py-24            (mayor)
             py-14 sm:py-16            (menor, primera banda de página interior)
Bandas:      alterna sin fondo y bg-ground-tint, separadas por border-y border-hairline
Encabezado:  <p className="eyebrow">…</p>
             <h2 className="mt-5 text-d1 text-ink">…</h2>
             <p className="mt-4 text-lead text-ink-muted">…</p>
```

---

## Movimiento

Dos mecanismos. Ninguno esconde contenido de un crawler.

**Entrada al cargar** — solo en la primera pantalla de la página.
`.enter`, `.enter-blur`, `.enter-scale` + `.step-1` … `.step-6` para
coreografiar (70 ms entre pasos).

**Revelado al scroll** — `.reveal`, `.reveal-scale`, `.reveal-stagger`.
Implementadas con `animation-timeline: view()`: **cero JavaScript**. En un
navegador sin soporte el bloque `@supports` simplemente no aplica y el
contenido está visible — no hay estado oculto que dependa de que algo corra.

`.reveal-stagger` escalona automáticamente hasta 6 hijos directos.

**Componentes con JS** (`components/motion/`):
- `<Counter value={4} suffix="+" />` — cuenta al entrar. El valor final se
  renderiza en el servidor, así que el HTML nunca dice 0.
- `<PointerGlow />` — resplandor que sigue al cursor. Se apaga solo en táctil.

Todo muere con `prefers-reduced-motion: reduce`, incluida la malla de fondo.

---

## Piso de accesibilidad

WCAG 2.2 AA.

- Un solo `h1` por página. Nunca saltes un nivel de encabezado.
- Íconos decorativos: `aria-hidden="true"`. Si el ícono es el único contenido
  de un control, el control necesita `aria-label`.
- Todo campo necesita `<label for>` real. El placeholder no es una etiqueta.
- Usa `<Field>` de `components/ui/field.tsx`: ya conecta label,
  `aria-describedby`, `aria-invalid` y una región `aria-live`.
- Menús y desplegables cierran con `Escape` y devuelven el foco al disparador.
- Objetivos táctiles ≥ 44 px.
- Nunca comuniques estado solo con color.
