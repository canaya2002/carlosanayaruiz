# Dónde se quedó esto — contexto para la siguiente sesión

> Última actualización: 20 de agosto de 2026 · commit `9cff4b9` · desplegado en
> producción (`www.carlosanayaruiz.com`).

Si eres otro Claude retomando este proyecto en otra máquina: **lee esto y luego
`CLAUDE.md`.** Este archivo dice en qué estado quedó todo y qué está bloqueado;
`CLAUDE.md` dice cómo está construido y qué reglas no se rompen.

---

## Qué pasó en la sesión anterior

El dueño rechazó el sistema «aurora + cristal» con estas palabras: *«es simple,
aburrida, sin vida, sin diseño profesional, el fondo parece de Home Depot,
HORRIBLE»*. Tenía razón y era medible:

- Los ocho colores de marca eran valores default de Tailwind **sin una sola
  modificación** (`--brand` era `blue-600`, `--sky` era `sky-500`, `--cyan` era
  `cyan-400`, `--positive` era `emerald-700`).
- La sección de servicios era literalmente lo que el propio `CLAUDE.md` lista
  como default prohibido de IA: tarjetas `rounded-2xl` en rejilla de tres con
  iconos de lucide dentro de círculos.

Se reemplazó por **«Papel Ahumado»**, aprobado por el dueño sobre una alternativa
llamada «Hora local». El sistema completo está documentado en `CLAUDE.md`.

Después el dueño pidió una segunda ronda: más movimiento, volumen sin cajas,
quitar Fiverr, quitar las migas de pan, arreglar carruseles rotos, eliminar
huecos vacíos y marcar dónde van las imágenes. Todo eso está hecho y verificado.

---

## Estado actual — verificado, no asumido

| Comprobación | Resultado |
|---|---|
| `npx tsc --noEmit` | 0 errores |
| `npx eslint .` | 0 problemas |
| `npm run palette:check` | pasa, todos los pisos de contraste |
| `npm run check:layout` | **0 hallazgos** en 17 URLs × 2 anchos |
| `npm run check:overflow` | 0 px en 360/390/414/768/1024/1440 |
| `npm run check:nav` | los dos desplegables abren y cierran con Escape |
| `npm run check:perf` (producción) | **14 / 20** en reposo · 0 layouts · 0 tareas largas |
| `next build` | exit 0, 16 páginas × 2 idiomas prerenderizadas |

**Las 16 páginas están migradas.** No queda nada del sistema anterior salvo
comentarios que documentan qué se quitó.

---

## Lo que está BLOQUEADO esperando al dueño

> Las tipografías ya no bloquean: se resolvieron con caras gratuitas.

Nada de esto lo puede resolver un agente. Si el dueño no los ha mandado, el
sitio funciona igual pero incompleto.

1. ~~Las dos tipografías de pago.~~ **RESUELTO.** El dueño decidió no comprarlas.
   El sistema corre con **Archivo + Chivo Mono** (Omnibus-Type, Buenos Aires) y
   **Fraunces** itálica, las tres gratuitas y **definitivas**. Archivo se dibujó
   para reproducción impresa, que es la tesis del sitio, y Chivo Mono es de la
   misma casa. No hay nada pendiente aquí.

2. **La sesión de fotos.** Hoy hay UNA foto: `public/carlos-anaya-ruiz.jpg`,
   800×800, con fondo de oficina desenfocado. El duotono de media tinta la
   convierte en material deliberado y funciona, pero es la mejora de mayor
   impacto pendiente. El brief está en `data/media-slots.ts`, slot
   `home-portrait`.

3. **29 archivos de imagen y video.** Todos listados en `docs/MEDIA.md`, que se
   GENERA con `npm run media:manifest` desde `data/media-slots.ts`. No edites
   `docs/MEDIA.md` a mano.

---

## Cómo se llena un hueco de medio

1. Pon el archivo en la ruta exacta que dice el registro, dentro de `public/`.
2. En `data/media-slots.ts`, cambia `filled: false` a `true` en ese slot.
3. `npm run media:manifest` para regenerar el documento.

El hueco desaparece y la imagen entra **sin mover el layout ni un píxel**,
porque la relación de aspecto ya estaba reservada con `aspect-ratio`.

---

## Decisiones que NO hay que revertir

Cada una tiene una medición detrás. Revertirlas reintroduce un defecto que ya
costó encontrar.

- **El coste de una animación infinita escala con la FRECUENCIA del ciclo**, no
  con la propiedad ni con el elemento. Medido: el mismo punto a 2.4 s costaba 23
  recálculos en reposo y a 12 s costaba 5. El modelo es ≈ 57 ÷ duración. Por eso
  el parpadeo de estado es un pulso corto dentro de un ciclo de 8 s, y por eso
  las cintas a 64 s salen gratis. **No aceleres el parpadeo.**

- **Nunca atenúes texto con `opacity`.** Se probó `.62` en las marcas
  secundarias y `palette:check` lo tumbó: el umbral cae a 4.09 y el minio a
  2.86. Ni al 85% el minio alcanza 4.5. La jerarquía se hace con grosor y
  tamaño.

- **Nunca animes el eje `wdth` de una variable con el scroll.** Refluye el texto
  y un reflujo por scroll cuenta para CLS.

- **Las palabras del saludo van en `data-w` y las pinta CSS con
  `content: attr()`.** Como nodos de texto reales contaminaban el `<h1>`
  indexable con nueve idiomas. `aria-hidden` arregla el lector de pantalla y no
  arregla nada para un crawler.

- **El eje graduado del riel se acota al héroe** (`--tape-span`, `--hero-h`). Un
  eje de tiempo a lo largo de toda la página no mide nada, y antes se veía vacío
  y cortado.

- **El instrumento en vivo (`Marks`) va SOLO en la home.** En las 16 páginas
  dejaría de ser una demostración y pasaría a ser adorno.

- **Solo tres métricas en la lectura.** INP es una duración, no un instante:
  mezclarlo en una escala de tiempo sería mentir sobre lo que la escala significa.

- **Las migas de pan visibles se quitaron, el `BreadcrumbList` JSON-LD NO.** El
  rich result de Google sigue intacto. El componente
  `components/layout/breadcrumbs.tsx` quedó huérfano, sin importar de nadie.

- **Fiverr se eliminó del sitio entero**, incluido el `sameAs` del schema. El
  dueño no tiene Fiverr. Un `sameAs` falso debilita la resolución de entidad.

---

## Herramientas nuevas de este proyecto

```bash
npm run check:layout http://localhost:3000 /es /es/servicios   # cortes, huecos, cintas rotas, encabezados
npm run media:manifest                                          # regenera docs/MEDIA.md
npm run check:perf   http://localhost:PUERTO/es                 # presupuesto: 20 recálculos en reposo
npm run check:overflow http://localhost:PUERTO/es
npm run check:nav    http://localhost:PUERTO/es
npm run palette:check
```

**Salida útil:** `next dev` y `next build` se pisan por `.next`. Para compilar
sin apagar el server de desarrollo:

```bash
NEXT_DIST_DIR=.next-build npx next build
NEXT_DIST_DIR=.next-build npx next start -p 3002
```

---

## Trampas que ya costaron tiempo

- **Nunca uses `sed` ni `node -e` con expresiones regulares ávidas sobre un
  archivo fuente.** Una regex se comió 300 líneas de
  `app/[locale]/proyectos/page.tsx` en esta sesión. Se recuperó del transcript
  del agente que lo había escrito, pero fue suerte. Usa la herramienta Edit con
  cadenas exactas.

- **Turbopack cachea un error de CSS** y `touch` no lo invalida: hay que cambiar
  el contenido del archivo.

- **Git Bash convierte `/es` en una ruta de Windows.** Los scripts que reciben
  rutas de URL necesitan `MSYS_NO_PATHCONV=1`.

- **Un absoluto se mide contra la caja de PADDING.** `right: 0` dentro de una
  sección con padding lo pega al borde del viewport, y sin `top: 0` arranca en
  su posición estática. Los dos bugs ya ocurrieron.

- **`@theme inline` es obligatorio** cuando el valor lleva `var()`. Con `@theme`
  a secas el sitio se renderiza en Segoe UI.

---

## Archivos sin subir a propósito

`SKILL.md`, `design-review.md` y `app/globals.css.bak` están en el working tree
sin commitear. Los dos primeros son del entorno local del dueño; el tercero es
un respaldo del CSS anterior al rediseño y se puede borrar cuando haya
confianza en el resultado.

---

## Lo siguiente, si nadie dice otra cosa

1. Esperar los archivos de medios y llenarlos (mecánico, ver arriba).
2. Cuando lleguen las fuentes de pago, cambiar las tres variables y volver a
   correr `palette:check` y `check:layout` — un cambio de cara mueve las
   métricas de texto y puede reintroducir desbordes.
3. `data/experience.ts` termina en abril de 2025. Si el dueño lleva consultoría
   desde entonces, va en ese archivo y la banda del registro aparece sola. **No
   la inventes.**
4. `data/companies.ts` no tiene ningún registro con `kind: 'cliente'`. Mientras
   no lo haya, el sitio no puede mostrar casos de cliente y no debe fingirlos.
