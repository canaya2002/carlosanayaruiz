import type { BlogPost } from '@/data/blog'
import { postUrl } from '@/lib/blog'
import { SITE_CONFIG, NAP } from '@/lib/constants'
import { envOpt } from '@/lib/env'

/**
 * ════════════════════════════════════════════════════════════════
 * EL ENVÍO DEL ARTÍCULO A LOS SUSCRIPTORES — Resend Broadcasts
 *
 * Cuando un artículo se publica, quien está en la lista recibe un correo con
 * él. Eso es lo que se pidió, y es la razón de que el boletín existiera antes
 * que los artículos: una lista que empieza a llenarse antes de tener contenido
 * vale más que un formulario impecable el día del lanzamiento.
 *
 * ── SIN SDK, COMO EL RESTO ──
 * Tres `fetch` a la API de Resend. El SDK oficial no aporta nada que estas
 * treinta líneas no hagan, y `lib/contact.ts` y `lib/newsletter.ts` ya
 * establecieron el patrón en este repo.
 *
 * ── LA IDEMPOTENCIA, SIN BASE DE DATOS ──
 * Esto es lo delicado. Mandar el mismo artículo dos veces a toda la lista es
 * el tipo de error que hace que la gente se dé de baja, y no se puede
 * deshacer.
 *
 * El estado vive en Resend: cada difusión se crea con el nombre
 * `blog-{NNN}-{slug}`, y ese nombre ES el registro de qué se envió. No hace
 * falta una tabla propia — que además podría decir «enviado» cuando el envío
 * falló.
 *
 * Pero «existe» NO es «se envió», y esa distinción es todo el diseño:
 *
 *   · una difusión con estado distinto de `draft` → ya salió, no se toca
 *   · una difusión en `draft` → se creó y el envío falló: se REUTILIZA su id
 *     y se reintenta el envío. Reintentar sobre un borrador no puede duplicar,
 *     porque tras un envío correcto ya no es un borrador
 *
 * Sin esa segunda rama, un `POST /broadcasts` con éxito seguido de un
 * `/send` fallido dejaba un borrador que hacía que TODA ejecución posterior
 * respondiera «ya enviado». Ese artículo no se mandaba nunca.
 *
 * ── LA CARRERA, RESUELTA SIN CERROJO ──
 * Listar y después crear no es atómico: dos ejecuciones simultáneas —una
 * llamada manual con el secreto mientras corre el cron— pueden listar las dos
 * antes de que ninguna cree, y acabar creando dos difusiones con el mismo
 * nombre (Resend no lo impide).
 *
 * Así que la acción irreversible se hace DESPUÉS de que la colisión sea
 * visible: se crea el borrador, se vuelve a listar y, si hay gemelos, solo
 * envía el de `id` menor; el perdedor borra su propio borrador y se retira.
 * El desempate es una función pura del estado listado, así que las dos
 * ejecuciones eligen el mismo ganador sin hablar entre ellas.
 *
 * ── QUÉ PASA SIN CONFIGURAR ──
 * Devuelve 'sin-configurar' y no falla. Igual que todo lo demás en este
 * repo: sin su clave, la pieza dice honestamente que no está conectada en vez
 * de fingir que funcionó.
 * ════════════════════════════════════════════════════════════════
 */

const API = 'https://api.resend.com'

export type BroadcastResult =
  | 'enviado'
  | 'ya-enviado'
  | 'sin-configurar'
  | 'error'

interface Config {
  key: string
  audienceId: string
  from: string
}

function readConfig(): Config | null {
  const key = envOpt(process.env.RESEND_API_KEY)
  const audienceId = envOpt(process.env.RESEND_AUDIENCE_ID)
  const from =
    envOpt(process.env.NEWSLETTER_FROM) ?? envOpt(process.env.CONTACT_FROM)
  if (!key || !audienceId || !from) return null
  return { key, audienceId, from }
}

export function isBroadcastConfigured(): boolean {
  return readConfig() !== null
}

/**
 * ── EL LÍMITE DE 70 CARACTERES, DESCUBIERTO LLAMANDO A LA API ──
 *
 * Resend rechaza con 422 cualquier difusión cuyo `name` pase de 70
 * caracteres: «Field name has a maximum of 70 items». No está en la parte de
 * la documentación que se lee al montar esto; salió al mandar una prueba de
 * verdad.
 *
 * Medido sobre los 100 artículos: el nombre más largo es de 55 caracteres, así
 * que hoy ninguno falla. Pero un artículo futuro con un slug largo rompería el
 * envío EL DÍA DE SU PUBLICACIÓN, que es el peor momento posible para
 * descubrirlo. De ahí el tope.
 */
const MAX_NOMBRE = 70

/**
 * Nombre estable de la difusión de un artículo. Es la CLAVE DE IDEMPOTENCIA.
 *
 * Lleva el número del artículo delante del slug por una razón concreta: hace
 * que recortar sea seguro. Dos slugs largos podrían coincidir en sus primeros
 * sesenta caracteres, y entonces el segundo artículo se consideraría «ya
 * enviado» y nadie recibiría su correo. Con el número, dos nombres recortados
 * no pueden colisionar nunca.
 *
 * ⚠ ESTO NO SE CAMBIA una vez que se haya mandado el primer correo. El nombre
 *   ES el registro de qué se envió: cambiar la forma de calcularlo haría que
 *   todos los artículos ya enviados parecieran no enviados, y el siguiente
 *   cron los mandaría otra vez todos de golpe.
 */
export function broadcastName(post: BlogPost): string {
  return `blog-${String(post.n).padStart(3, '0')}-${post.slug}`.slice(
    0,
    MAX_NOMBRE
  )
}

async function resend(
  cfg: Config,
  path: string,
  init?: { method?: string; body?: unknown }
) {
  const res = await fetch(`${API}${path}`, {
    method: init?.method ?? 'GET',
    headers: {
      Authorization: `Bearer ${cfg.key}`,
      'Content-Type': 'application/json',
    },
    ...(init?.body ? { body: JSON.stringify(init.body) } : {}),
    // Nunca se cachea: es una API de escritura y una lectura de estado.
    cache: 'no-store',
  })
  const text = await res.text()
  let json: unknown = null
  try {
    json = text ? JSON.parse(text) : null
  } catch {
    /* Resend siempre responde JSON; si no, el texto crudo va al error. */
  }
  return { ok: res.ok, status: res.status, json, text }
}

interface FilaDifusion {
  id?: string
  name?: string
  status?: string
}

/**
 * Todas las difusiones que se llaman así. Puede haber más de una: ver la
 * carrera en la cabecera del archivo.
 *
 * ── POR QUÉ RECORRE PÁGINAS Y NO SE FÍA DE LA PRIMERA ──
 * `GET /broadcasts` devuelve una página de resultados. La versión anterior de
 * esta función leía solo esa primera página, y eso es una bomba de relojería:
 * con cien artículos publicados a lo largo de un año, la difusión que se busca
 * acaba fuera de la primera página, la comprobación responde «no existe» y el
 * cron manda el mismo artículo DOS VECES a toda la lista.
 *
 * No es hipotético: es lo que pasa a partir del artículo número N, donde N es
 * el tamaño de página de la API — un número que no controlamos y que puede
 * cambiar sin avisar.
 *
 * Se piden páginas con cursor mientras la API siga dando resultados. Los
 * parámetros que no entienda simplemente los ignora, así que esto también
 * funciona si el endpoint nunca pagina.
 *
 * Y si NO se puede comprobar, no se envía: un duplicado a toda la lista es
 * peor que un envío que se reintenta en la siguiente ejecución del cron.
 */
async function buscar(cfg: Config, name: string): Promise<FilaDifusion[]> {
  const encontradas: FilaDifusion[] = []
  let after: string | undefined

  // Tope de 20 páginas de 100: con cien difusiones no se llega ni de lejos, y
  // evita un bucle infinito si la API devolviera siempre el mismo cursor.
  for (let pagina = 0; pagina < 20; pagina++) {
    const query = new URLSearchParams({ limit: '100' })
    if (after) query.set('after', after)
    const r = await resend(cfg, `/broadcasts?${query.toString()}`)
    if (!r.ok) {
      // Si no se puede comprobar, NO se envía. Un duplicado a toda la lista es
      // peor que un envío que se reintenta en la siguiente ejecución.
      throw new Error(`no se pudo listar difusiones: ${r.status} ${r.text}`)
    }
    const cuerpo = r.json as
      | { data?: FilaDifusion[]; has_more?: boolean }
      | null
    const data = cuerpo?.data ?? []
    for (const b of data) if (b.name === name) encontradas.push(b)

    const ultimo = data[data.length - 1]
    if (!cuerpo?.has_more || !ultimo?.id || data.length === 0) return encontradas
    after = ultimo.id
  }
  throw new Error('demasiadas páginas de difusiones al comprobar idempotencia')
}

/**
 * El correo.
 *
 * HTML deliberadamente simple: tabla de un solo carril, estilos en línea, sin
 * imágenes de fondo ni media queries. Un cliente de correo no es un navegador
 * — Outlook sigue renderizando con Word— y un diseño elaborado que se rompe
 * en la mitad de las bandejas es peor que uno sobrio que se ve igual en todas.
 *
 * La portada SÍ va, porque es una imagen normal con `alt` y ancho fijo, que es
 * lo único que todos los clientes tratan igual.
 */
function emailHtml(post: BlogPost): string {
  const url = postUrl(post)
  const utm = `${url}?utm_source=newsletter&utm_medium=email&utm_campaign=blog`
  const soot = '#12100e'
  const paper = '#ebe6d9'
  const ash = '#8c877a'

  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width" />
<title>${escapeHtml(post.title)}</title></head>
<body style="margin:0;padding:0;background:${soot};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${soot};">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">

  <tr><td style="padding-bottom:24px;font:400 11px/1.4 ui-monospace,Menlo,monospace;letter-spacing:.16em;text-transform:uppercase;color:${ash};">
    ${escapeHtml(post.cluster)}
  </td></tr>

  ${
    post.cover
      ? `<tr><td style="padding-bottom:24px;">
    <a href="${utm}" style="text-decoration:none;">
      <img src="${SITE_CONFIG.url}${post.cover}" alt="${escapeHtml(post.coverAlt ?? post.title)}" width="560" style="display:block;width:100%;max-width:560px;height:auto;border:0;" />
    </a>
  </td></tr>`
      : ''
  }

  <tr><td style="padding-bottom:16px;font:600 26px/1.22 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${paper};">
    <a href="${utm}" style="color:${paper};text-decoration:none;">${escapeHtml(post.title)}</a>
  </td></tr>

  <tr><td style="padding-bottom:24px;font:400 16px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#b3aea0;">
    ${escapeHtml(post.description)}
  </td></tr>

  <tr><td style="padding-bottom:32px;">
    <a href="${utm}" style="display:inline-block;border-top:1px solid ${ash};padding-top:12px;font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.16em;text-transform:uppercase;color:${paper};text-decoration:none;">
      Leer el artículo &rarr;
    </a>
    <span style="display:block;padding-top:10px;font:400 12px/1.4 ui-monospace,Menlo,monospace;color:${ash};">
      ${post.readingMinutes} min de lectura
    </span>
  </td></tr>

  <tr><td style="border-top:1px solid #23201c;padding-top:20px;font:400 12px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${ash};">
    Recibes esto porque te suscribiste en ${SITE_CONFIG.url.replace('https://', '')}.<br />
    ${escapeHtml(SITE_CONFIG.name)} · ${escapeHtml(NAP.locality)}<br />
    <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:${ash};text-decoration:underline;">Darse de baja</a>
  </td></tr>

</table></td></tr></table></body></html>`
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Versión en texto plano. Un correo sin ella pierde puntos de entregabilidad. */
function emailText(post: BlogPost): string {
  const utm = `${postUrl(post)}?utm_source=newsletter&utm_medium=email&utm_campaign=blog`
  return [
    post.cluster.toUpperCase(),
    '',
    post.title,
    '',
    post.description,
    '',
    `Leer el artículo (${post.readingMinutes} min): ${utm}`,
    '',
    '—',
    `Recibes esto porque te suscribiste en ${SITE_CONFIG.url.replace('https://', '')}.`,
    `${SITE_CONFIG.name} · ${NAP.locality}`,
    'Darse de baja: {{{RESEND_UNSUBSCRIBE_URL}}}',
  ].join('\n')
}

/**
 * Crea la difusión como BORRADOR y NO la envía.
 *
 * Para /api/probar-boletin: sirve para revisar en el panel de Resend cómo se
 * ve el correo antes de que salga de verdad.
 *
 * Usa el prefijo `prueba-` en el nombre a propósito. Si usara el mismo nombre
 * que el cron, la comprobación de idempotencia encontraría el borrador y el
 * cron se saltaría el envío real el día que tocara: la herramienta de prueba
 * habría silenciado la publicación.
 */
export async function previewBroadcast(
  post: BlogPost,
  /**
   * Si es true, además de crear el borrador lo ENVÍA a la audiencia.
   *
   * Sigue usando el nombre `prueba-…`, así que un envío de prueba NUNCA
   * consume la clave de idempotencia del cron. Ese detalle importa: con el
   * nombre real, mandar una prueba del artículo 1 haría que el martes el cron
   * viera «ya existe» y se saltara el envío de verdad.
   */
  enviar = false
): Promise<{
  ok: boolean
  name: string
  id?: string
  status?: number
  detalle?: string
  enviado?: boolean
}> {
  const cfg = readConfig()
  /* Marca de tiempo en el nombre: Resend rechaza dos difusiones con el mismo
     nombre, así que sin ella la segunda prueba del mismo artículo fallaría.

     Y el recorte se hace ANTES de pegar el sufijo, no después: recortando al
     final se perdería la marca de tiempo y la segunda prueba volvería a
     chocar. Esto es exactamente el 422 que devolvió Resend en la primera
     prueba de envío — 71 caracteres, uno de más. */
  const sufijo = `-${Date.now().toString(36)}`
  const name =
    `prueba-${broadcastName(post)}`.slice(0, MAX_NOMBRE - sufijo.length) +
    sufijo
  if (!cfg) return { ok: false, name, detalle: 'sin configurar' }

  const r = await resend(cfg, '/broadcasts', {
    method: 'POST',
    body: {
      name,
      audience_id: cfg.audienceId,
      from: cfg.from,
      subject: `[PRUEBA] ${post.title}`,
      reply_to: NAP.email,
      html: emailHtml(post),
      text: emailText(post),
    },
  })

  const id = (r.json as { id?: string } | null)?.id

  if (!r.ok || !id) {
    return { ok: false, name, id, status: r.status, detalle: r.text.slice(0, 500) }
  }

  if (!enviar) {
    return { ok: true, name, id, status: r.status, detalle: r.text.slice(0, 500) }
  }

  const env = await resend(cfg, `/broadcasts/${id}/send`, {
    method: 'POST',
    body: {},
  })

  return {
    ok: env.ok,
    name,
    id,
    status: env.status,
    detalle: env.text.slice(0, 500),
    enviado: env.ok,
  }
}

/**
 * Crea y envía la difusión de un artículo. Idempotente por nombre.
 */
export async function sendPostBroadcast(
  post: BlogPost
): Promise<BroadcastResult> {
  const cfg = readConfig()
  if (!cfg) return 'sin-configurar'

  const name = broadcastName(post)

  try {
    /* ── 1. ¿Ya hay algo con este nombre? ────────────────────────── */
    const previas = await buscar(cfg, name)

    // Cualquier estado que no sea borrador significa que ya salió.
    const yaSalio = previas.find((b) => b.status && b.status !== 'draft')
    if (yaSalio) return 'ya-enviado'

    /* ── 2. Un borrador huérfano: se reutiliza su id ──────────────
       Es el caso de «crear funcionó y enviar falló». Reintentar el envío
       sobre un borrador no puede duplicar nada: si el envío sale bien, el
       estado deja de ser borrador y la próxima ejecución lo verá. */
    let id = previas.find((b) => b.status === 'draft')?.id

    if (id) {
      console.warn(
        `[broadcast] había un borrador sin enviar de ${name}: se reintenta el envío`
      )
    } else {
      /* ── 3. Crear el borrador ──────────────────────────────────── */
      const creado = await resend(cfg, '/broadcasts', {
        method: 'POST',
        body: {
          name,
          audience_id: cfg.audienceId,
          from: cfg.from,
          subject: post.title,
          reply_to: NAP.email,
          html: emailHtml(post),
          text: emailText(post),
        },
      })

      if (!creado.ok) {
        console.error('[broadcast] crear falló', creado.status, creado.text)
        return 'error'
      }

      id = (creado.json as { id?: string } | null)?.id
      if (!id) {
        console.error('[broadcast] la respuesta no trae id', creado.text)
        return 'error'
      }

      /* ── 4. EL DESEMPATE ──────────────────────────────────────────
         Se vuelve a listar DESPUÉS de crear. Si dos ejecuciones corrieron a la
         vez, ahora las dos ven los dos gemelos y las dos eligen el mismo
         ganador —el de `id` menor— porque el criterio es una función pura del
         estado listado. El perdedor borra su propio borrador y se retira.

         Este paso es lo que hace que la acción irreversible (`/send`) ocurra
         después de que la colisión sea visible, y por eso no hace falta un
         cerrojo ni una base de datos. */
      const gemelos = await buscar(cfg, name)
      const conId = gemelos.filter((b): b is FilaDifusion & { id: string } =>
        Boolean(b.id)
      )

      if (conId.length > 1) {
        const ganador = conId.map((b) => b.id).sort()[0]!
        if (ganador !== id) {
          console.warn(
            `[broadcast] carrera detectada en ${name}: gano ${ganador}, borro mi borrador ${id}`
          )
          await resend(cfg, `/broadcasts/${id}`, { method: 'DELETE' })
          return 'ya-enviado'
        }
        // Soy el ganador: los borradores perdedores los borra su propia
        // ejecución. Si alguna murió antes de borrarlo, queda un borrador
        // huérfano que NO se enviará nunca — visible en el panel, inofensivo.
        console.warn(
          `[broadcast] carrera detectada en ${name}: gano yo (${id}) y envío`
        )
      }
    }

    /* ── 5. Enviar ───────────────────────────────────────────────── */
    const enviado = await resend(cfg, `/broadcasts/${id}/send`, {
      method: 'POST',
      body: {},
    })

    if (!enviado.ok) {
      /* El borrador queda. La siguiente ejecución lo encontrará en `draft` y
         reintentará el envío — que es exactamente lo que hay que hacer, y lo
         que antes no pasaba: antes cualquier difusión existente contaba como
         enviada y el artículo no salía nunca. */
      console.error(
        `[broadcast] borrador creado pero NO enviado (se reintentará): ${name} ${enviado.status} ${enviado.text.slice(0, 200)}`
      )
      return 'error'
    }

    return 'enviado'
  } catch (e) {
    console.error('[broadcast]', e)
    return 'error'
  }
}
