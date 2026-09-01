/**
 * ════════════════════════════════════════════════════════════════
 * EL RENDERIZADOR DE MARKDOWN DEL BLOG
 *
 * ── POR QUÉ NO HAY LIBRERÍA ──
 * No es dogma. Un renderizador genérico (`marked`, `remark`) emite `<h2>`,
 * `<table>` y `<pre>` sin una sola clase, así que habría que encadenarle una
 * pasada de rehype para vestirlos con el vocabulario de «Papel Ahumado» — más
 * código del que hay aquí, y con una dependencia encima. Escribiéndolo, cada
 * elemento sale ya con la clase que le toca.
 *
 * Y el subconjunto está MEDIDO sobre los 100 artículos, no supuesto:
 *
 *   vallas de código   396 (198 bloques, todas balanceadas, 11 lenguajes)
 *   ###                780      ####                29
 *   listas con -     1 113      listas 1.          238
 *   filas de tabla     309      **negrita**      2 774
 *   `código`           608      > cita               2
 *   ---                974      enlaces               0      imágenes  0
 *   *itálica*          158 en 9 artículos    ## en el cuerpo  3 (art. 091)
 *
 * Las dos últimas filas faltaban en la versión anterior de este censo, y las
 * dos eran defectos activos: los 158 asteriscos salían crudos en la página y
 * los tres `##` aplanaban la jerarquía del 091. Un censo incompleto es lo que
 * hace que un renderizador propio parezca más seguro de lo que es.
 *
 * No hay enlaces ni imágenes en el cuerpo de ningún artículo, así que este
 * renderizador no los implementa. Si algún día entra uno, `check:blog` lo
 * reporta como sintaxis sin cubrir en vez de imprimirlo crudo.
 *
 * ⚠ Esa última frase FUE FALSA durante una ronda entera. La detección vivía
 * dentro de la rama del párrafo, después de que listas, tablas, encabezados y
 * el bloque de FAQ ya hubieran emitido, así que un enlace en una viñeta salía
 * crudo con `uncovered` vacío — y en una pregunta del FAQ entraba crudo dentro
 * del JSON-LD. Ahora es un barrido previo sobre el markdown de entrada
 * (`barrerSinCubrir`) y sí es verdad: verificado con once casos sintéticos.
 *
 * ── LA VALLA DE CÓDIGO VA PRIMERO, Y NO ES UN DETALLE ──
 * Cinco artículos llevan `## Stack`, `## Propósito`… DENTRO de un bloque
 * ```markdown: son plantillas de ejemplo. Si los encabezados se procesaran
 * antes que las vallas, esos ejemplos se convertirían en encabezados reales
 * del artículo y contaminarían el índice y la jerarquía. Por eso el bucle
 * consume el bloque entero en cuanto ve la valla de apertura.
 *
 * ── LA JERARQUÍA SE DESPLAZA UN NIVEL ──
 * En la fuente el título del artículo es `##` y las secciones son `###`. El
 * título lo pinta la página como el único `<h1>`, así que aquí `###` sale
 * como `<h2>` y `####` como `<h3>`. Sin el desplazamiento la página tendría
 * un `<h1>` seguido de `<h3>` sin `<h2>` en medio, que es exactamente lo que
 * la sonda de SEO reporta como salto de jerarquía.
 * ════════════════════════════════════════════════════════════════
 */

export interface ArticleHeading {
  /** Ancla, para el índice lateral. */
  id: string
  text: string
  /** 2 = sección, 3 = subsección. */
  level: 2 | 3
}

export interface FaqPair {
  question: string
  answer: string
}

export interface RenderedArticle {
  html: string
  headings: ArticleHeading[]
  /** Alimenta el schema FAQPage. Los 100 artículos tienen bloque de FAQ. */
  faq: FaqPair[]
  /**
   * Sintaxis encontrada que este renderizador no cubre. Vacío en los 100
   * artículos de hoy; `check:blog` falla si deja de estarlo.
   */
  uncovered: string[]
}

/* ── Escapado ──────────────────────────────────────────────────────
   Se escapa TODO el texto antes de aplicar cualquier marca. `**` y las
   comillas invertidas no contienen caracteres escapables, así que el orden
   es seguro: escapar primero no rompe el marcado, y aplicar marcado primero
   sí rompería el escapado. */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * Marcado en línea: `código` y **negrita**, en ese orden.
 *
 * El código va primero para que un `**` dentro de un fragmento de código no
 * se lea como negrita. Se protege con un marcador que no puede aparecer en el
 * texto ya escapado (lleva `\u0000`).
 */
function inline(text: string): string {
  const codes: string[] = []
  let out = escapeHtml(text).replace(/`([^`]+)`/g, (_m, code: string) => {
    codes.push(code)
    return `\u0000C${codes.length - 1}\u0000`
  })

  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')

  /**
   * ── LA ITÁLICA, DESPUÉS DE LA NEGRITA ──
   * Va después a propósito: si se hiciera antes, el primer asterisco de un
   * `**negrita**` abriría una itálica y se comería el marcado.
   *
   * Estaba sin implementar y no era teórico: medidos con este mismo
   * renderizador, 158 asteriscos salían CRUDOS en 9 artículos —066 (42),
   * 007 (30), 088 (26), 016 (20), 063, 099, 064, 009, 081— y en varios la
   * itálica envuelve frases completas, no una etiqueta suelta. `check:blog`
   * daba OK porque solo buscaba `**`.
   *
   * `(?<![*\w])` evita abrir dentro de una palabra (`n*m`) y detrás de un
   * asterisco; `(?!\*)` evita cerrar contra el primero de un `**`. No hay
   * ningún `***` en el corpus, así que el orden es seguro.
   */
  out = out.replace(/(?<![*\w])\*([^*\n]+)\*(?!\*)/g, '<em>$1</em>')

  return out.replace(/\u0000C(\d+)\u0000/g, (_m, i: string) => {
    return `<code>${codes[Number(i)]}</code>`
  })
}

/** Ancla estable a partir del texto del encabezado. */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
}

/** Quita el marcado en línea para usar el texto como dato (schema, índice). */
export function plainText(text: string): string {
  return text
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    // La itálica también: esto alimenta el schema FAQPage y las anclas del
    // índice, y ahí un asterisco es basura. Hoy no hay ningún caso (0 de 304
    // preguntas y 0 de 812 encabezados), así que es preventivo.
    .replace(/(?<![*\w])\*([^*\n]+)\*(?!\*)/g, '$1')
    .trim()
}

/**
 * Barrido PREVIO de sintaxis que este renderizador no implementa.
 *
 * Se hace sobre el markdown de entrada y no sobre el HTML de salida, y fuera
 * de las vallas de código —ahí un corchete o una tilde son contenido—. Es la
 * única forma de que `check:blog` vea un enlace metido en una viñeta, en una
 * celda de tabla, en un encabezado o en una pregunta del bloque de FAQ.
 *
 * Hoy el corpus da 0 hallazgos. El valor está en el día que alguien edite un
 * artículo y meta un enlace: sale reportado en vez de impreso en crudo.
 */
function barrerSinCubrir(lines: readonly string[]): string[] {
  const fuera: string[] = []
  let enValla = false

  for (let i = 0; i < lines.length; i++) {
    const t = lines[i]!.trim()

    if (/^```/.test(t)) {
      // La apertura es laxa y el cierre estricto, igual que en el bucle
      // principal: si no, este barrido y el render discreparían.
      if (!enValla) enValla = true
      else if (/^```\s*$/.test(t)) enValla = false
      continue
    }
    if (enValla) continue

    const donde = `línea ${i + 1}`
    if (/!\[[^\]]*\]\(/.test(t)) fuera.push(`imagen (${donde}): ${t.slice(0, 70)}`)
    else if (/\[[^\]]+\]\([^)]+\)/.test(t))
      fuera.push(`enlace (${donde}): ${t.slice(0, 70)}`)
    if (/^#{5,}\s/.test(t)) fuera.push(`encabezado de nivel 5+ (${donde})`)
    if (/~~[^~]+~~/.test(t)) fuera.push(`tachado (${donde})`)
    // Un `##` en el cuerpo aplana la jerarquía: el renderizador mapea
    // ###->h2 y ####->h3, así que ## y ### caen los dos en h2. Es la
    // suposición sobre la que descansa el mapeo, y ya se rompió una vez
    // (artículo 091, tres grupos indistinguibles de sus once ítems).
    if (/^##\s/.test(t)) fuera.push(`## en el cuerpo (${donde}): aplana la jerarquía, usa ### o ####`)
  }

  return fuera
}

export function renderArticle(markdown: string): RenderedArticle {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  const out: string[] = []
  const headings: ArticleHeading[] = []
  const faq: FaqPair[] = []
  const uncovered: string[] = barrerSinCubrir(lines)
  const usedIds = new Set<string>()

  /** ¿Vamos dentro del bloque de preguntas frecuentes? */
  let inFaq = false

  const uniqueId = (base: string) => {
    let id = base || 'seccion'
    let k = 2
    while (usedIds.has(id)) id = `${base}-${k++}`
    usedIds.add(id)
    return id
  }

  let i = 0
  while (i < lines.length) {
    const line = lines[i]!
    const trimmed = line.trim()

    /* ── 1. VALLA DE CÓDIGO — antes que nada ─────────────────────── */
    /**
     * ── LA APERTURA ES LAXA Y EL CIERRE ESTRICTO, Y ESO ES LA CLAVE ──
     *
     * Antes la apertura exigía `/^```([a-zA-Z0-9]*)\s*$/`, así que una valla
     * con info string —```js title="app.tsx"`, ```objective-c`,
     * ```bash {highlight}`— NO se reconocía como apertura, caía a párrafo
     * con los backticks a la vista, y entonces la valla de CIERRE pasaba a
     * actuar como apertura y se tragaba el resto del artículo dentro de un
     * bloque de código: encabezados fuera del índice y fuera del schema.
     *
     * Hoy las 396 vallas del corpus están limpias, así que era una trampa
     * armada para la primera edición.
     *
     * El cierre se queda ESTRICTO (`/^```\s*$/`) por la razón inversa: si se
     * relajara también, dos aperturas seguidas volverían a invertir el
     * documento. CommonMark dice lo mismo — una valla de cierre no lleva
     * info string.
     */
    const fence = trimmed.match(/^```\s*([^\s`]*)/)
    if (fence) {
      // Solo lo que puede ser un nombre de lenguaje llega a la etiqueta.
      const lang = (fence[1] ?? '').replace(/[^a-zA-Z0-9+#-]/g, '')
      const buf: string[] = []
      const aperturaEn = i
      i++
      while (i < lines.length && !/^```\s*$/.test(lines[i]!.trim())) {
        buf.push(lines[i]!)
        i++
      }
      if (i >= lines.length) {
        // Se acabó el archivo sin valla de cierre. Se renderiza lo que hay
        // —perder texto sería peor— pero se reporta, porque un bloque abierto
        // significa que el resto del artículo está dentro de un <pre>.
        uncovered.push(`valla de código sin cerrar (línea ${aperturaEn + 1})`)
      }
      i++ // consume la valla de cierre
      const label = lang
        ? `<span class="code-lang" aria-hidden="true">${escapeHtml(lang)}</span>`
        : ''
      out.push(
        `<div class="code">${label}<pre><code>${escapeHtml(buf.join('\n'))}</code></pre></div>`
      )
      continue
    }

    /* ── 2. Línea vacía ──────────────────────────────────────────── */
    if (!trimmed) {
      i++
      continue
    }

    /* ── 3. Encabezados ──────────────────────────────────────────── */
    const h = trimmed.match(/^(#{2,4})\s+(.+)$/)
    if (h) {
      const hashes = h[1]!.length
      const raw = h[2]!.trim()
      const text = plainText(raw)
      // ## en la fuente sería un segundo título de artículo: no debería
      // existir fuera de un bloque de código, y si aparece se trata como
      // sección para no perder el contenido.
      const level: 2 | 3 = hashes >= 4 ? 3 : 2
      const id = uniqueId(slugifyHeading(text))
      headings.push({ id, text, level })
      inFaq = /^preguntas frecuentes$/i.test(text)
      out.push(`<h${level} id="${id}">${inline(raw)}</h${level}>`)
      i++
      continue
    }

    /* ── 4. Regla horizontal ─────────────────────────────────────
       Hay 974 en los 100 artículos y su único trabajo es separar de la
       sección siguiente. Cuando lo que viene detrás ya es un encabezado,
       la regla es redundante —el encabezado ya abre— y dibujarla dejaría
       dos separadores a un centímetro. Solo se pinta cuando separa algo
       que no es un encabezado. */
    if (/^-{3,}$/.test(trimmed)) {
      let j = i + 1
      while (j < lines.length && !lines[j]!.trim()) j++
      const next = lines[j]?.trim() ?? ''
      if (!/^#{2,4}\s/.test(next) && next) out.push('<hr class="rule" />')
      i++
      continue
    }

    /* ── 5. Tabla ────────────────────────────────────────────────
       Va envuelta en un contenedor con scroll propio: una tabla ancha
       nunca puede hacer que el documento se desplace en horizontal, que
       es lo que mide `check:overflow`. */
    if (trimmed.startsWith('|')) {
      const rows: string[][] = []
      let sepAt = -1
      while (i < lines.length && lines[i]!.trim().startsWith('|')) {
        const cells = lines[i]!
          .trim()
          .replace(/^\||\|$/g, '')
          .split('|')
          .map((c) => c.trim())
        /**
         * Una fila de guiones solo cuenta como SEPARADORA si aún no hay
         * ninguna y está en la posición 1, que es donde GFM la exige.
         *
         * Antes cualquier fila de guiones reasignaba `sepAt`, así que una
         * fila de guiones a media tabla borraba el `<thead>` de la tabla
         * entera. Y `-{2,}` no reconocía `| - | - |`, que GFM sí acepta:
         * salía sin cabecera y con una fila de guiones impresa.
         */
        const esSeparadora = cells.every((c) => /^:?-{1,}:?$/.test(c))
        if (esSeparadora && sepAt === -1 && rows.length === 1) {
          sepAt = rows.length
        } else if (esSeparadora) {
          uncovered.push('fila de guiones fuera de la posición 1 en una tabla')
          rows.push(cells)
        } else {
          rows.push(cells)
        }
        i++
      }
      if (rows.length) {
        const head = sepAt === 1 ? rows[0]! : null
        const body = sepAt === 1 ? rows.slice(1) : rows
        const thead = head
          ? `<thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead>`
          : ''
        const tbody = `<tbody>${body
          .map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`)
          .join('')}</tbody>`
        out.push(`<div class="table-wrap"><table>${thead}${tbody}</table></div>`)
      }
      continue
    }

    /* ── 6. Lista sin orden ──────────────────────────────────────── */
    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = []
      while (i < lines.length && /^[-*]\s+/.test(lines[i]!.trim())) {
        items.push(lines[i]!.trim().replace(/^[-*]\s+/, ''))
        i++
      }
      out.push(`<ul>${items.map((t) => `<li>${inline(t)}</li>`).join('')}</ul>`)
      continue
    }

    /* ── 7. Lista ordenada ───────────────────────────────────────
       `start` se conserva: hay artículos con listas que continúan tras un
       párrafo intercalado, y reiniciarlas en 1 cambiaría lo que dice el
       texto («el paso 7» dejaría de ser el séptimo). */
    if (/^\d+\.\s+/.test(trimmed)) {
      const first = Number(trimmed.match(/^(\d+)\./)![1])
      const items: string[] = []
      while (i < lines.length && /^\d+\.\s+/.test(lines[i]!.trim())) {
        items.push(lines[i]!.trim().replace(/^\d+\.\s+/, ''))
        i++
      }
      const startAttr = first !== 1 ? ` start="${first}"` : ''
      out.push(
        `<ol${startAttr}>${items.map((t) => `<li>${inline(t)}</li>`).join('')}</ol>`
      )
      continue
    }

    /* ── 8. Cita ─────────────────────────────────────────────────── */
    if (trimmed.startsWith('>')) {
      const buf: string[] = []
      while (i < lines.length && lines[i]!.trim().startsWith('>')) {
        buf.push(lines[i]!.trim().replace(/^>\s?/, ''))
        i++
      }
      out.push(`<blockquote>${inline(buf.join(' '))}</blockquote>`)
      continue
    }

    /* ── 9. Párrafo ──────────────────────────────────────────────
       Se acumulan las líneas seguidas: en markdown un salto simple no
       abre párrafo. */
    const buf: string[] = [trimmed]
    i++
    while (i < lines.length) {
      const t = lines[i]!.trim()
      if (
        !t ||
        /^```/.test(t) ||
        /^#{2,4}\s/.test(t) ||
        /^-{3,}$/.test(t) ||
        t.startsWith('|') ||
        /^[-*]\s+/.test(t) ||
        /^\d+\.\s+/.test(t) ||
        t.startsWith('>')
      )
        break
      buf.push(t)
      i++
    }

    /* El bloque de FAQ viene como «**Pregunta**» y la respuesta en la línea
       siguiente. Se recoge para el schema FAQPage y se imprime con su propia
       marca, para que la pregunta se lea como pregunta. */
    if (inFaq && /^\*\*.+\*\*$/.test(buf[0]!)) {
      const question = plainText(buf[0]!)
      const answer = plainText(buf.slice(1).join(' '))
      if (question && answer) {
        faq.push({ question, answer })

        /* LA PREGUNTA ES UN ENCABEZADO, no un párrafo en negrita.
           Iba como `<p class="q"><strong>…</strong></p>`, y son 305 preguntas
           repartidas en los 100 artículos: cada una se declara como nodo
           `Question` de un `FAQPage` en el JSON-LD, así que el documento
           afirmaba en datos estructurados una jerarquía que su propio HTML no
           tenía. Un rich result de FAQ se apoya en las dos señales.

           `h3` y no `h2` porque la sección «Preguntas frecuentes» ya es el `h2`
           que abre este bloque —`inFaq` se activa justo en él— así que h2 → h3
           no salta ningún nivel.

           El `**` exterior se retira: dentro de un encabezado la negrita es
           redundante. El formato INTERIOR se conserva, porque `inline` sigue
           corriendo sobre el contenido.

           Y lleva `id`, con el mismo slugificador y el mismo `uniqueId` que los
           encabezados de sección: cada pregunta pasa a ser enlazable, que es
           justo lo que un fragmento de FAQ necesita.

           NO se empuja a `headings`: el índice del margen lista solo `h2` a
           propósito, y meter 305 preguntas ahí lo convertiría en otro artículo.

           El CSS no se mueve: `.article .qa .q` ya fija `font-size: 1rem` y
           gana por especificidad (tres clases) a cualquier `.article h3`. */
        const inner = buf[0]!.replace(/^\*\*(.+)\*\*$/, '$1')
        const qId = uniqueId(slugifyHeading(question))
        out.push(
          `<div class="qa"><h3 class="q" id="${qId}">${inline(inner)}</h3><p class="a">${inline(
            buf.slice(1).join(' ')
          )}</p></div>`
        )
        continue
      }
    }

    /* La detección de sintaxis sin cubrir NO va aquí: iba, y por eso solo
       veía párrafos. Ahora la hace `barrerSinCubrir` sobre el markdown de
       entrada, antes de que cualquier rama emita. */
    out.push(`<p>${inline(buf.join(' '))}</p>`)
  }

  return { html: out.join('\n'), headings, faq, uncovered }
}
