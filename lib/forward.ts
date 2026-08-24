import { createHmac, randomUUID } from 'node:crypto'
import type { Lead } from '@/lib/contact'
import { envOpt, envOr } from '@/lib/env'

/**
 * ════════════════════════════════════════════════════════════════
 * EL PUENTE — reenvía cada mensaje del formulario a otro sistema
 *
 * Cuando alguien llena el formulario de contacto, además del correo y de la
 * copia opcional en Supabase, el mensaje se manda a un endpoint HTTP propio:
 * un CRM, un n8n, una Server Action de otro proyecto, una Cloud Function, lo
 * que sea.
 *
 * ── POR QUÉ ES GENÉRICO Y NO ESPECÍFICO ──
 * Está escrito para no tener que tocarlo cuando se conozca el destino: TODO se
 * configura por variables de entorno — URL, método, autenticación, forma del
 * cuerpo y hasta el nombre de cada campo. Cambiar de sistema receptor, o
 * apuntar a uno de pruebas, es cambiar una variable y redesplegar.
 *
 * Esa decisión tiene una razón concreta: un puente cableado a un contrato
 * concreto se rompe la primera vez que el otro lado renombra un campo, y
 * entonces se pierden mensajes sin que nadie se entere.
 *
 * ── EL VISITANTE NO ESPERA A ESTO ──
 * Corre dentro de `after()` de Next, que ejecuta trabajo DESPUÉS de haber
 * enviado la respuesta. Es la diferencia entre un formulario que responde en
 * 300 ms y uno que se queda pensando seis segundos porque el sistema del otro
 * lado va lento. Y permite reintentar sin que nadie mire una ruedita.
 *
 * Antes de `after()` las alternativas eran malas: esperar (el visitante paga la
 * latencia del tercero) o disparar sin esperar (en serverless la función puede
 * congelarse antes de que la petición salga, y el mensaje se pierde en
 * silencio).
 *
 * ── EL CORREO YA SALIÓ, ASÍ QUE ESTO NUNCA PIERDE UN LEAD ──
 * El reenvío corre DESPUÉS del correo y no puede cambiar lo que ve el
 * visitante. Si el sistema receptor está caído, el mensaje ya está en la
 * bandeja: se perdió la automatización, no el cliente. Ese orden es
 * deliberado y es el mismo que ya seguía la copia en Supabase.
 * ════════════════════════════════════════════════════════════════
 */

export type ForwardResult =
  | { estado: 'ok'; intentos: number; status: number; ms: number }
  | { estado: 'sin-configurar' }
  | { estado: 'fallo'; intentos: number; status?: number; error: string; ms: number }

interface ForwardConfig {
  url: string
  method: string
  auth: 'none' | 'bearer' | 'header' | 'basic' | 'hmac'
  token?: string
  headerName: string
  hmacHeader: string
  format: 'json' | 'form'
  /** Renombrado de campos: { nombre: 'name', email: 'email_address' } */
  fields: Record<string, string>
  /**
   * Lista blanca de campos base a enviar. Vacía = todos.
   *
   * Existe porque un receptor real casi nunca quiere los diez campos que este
   * puente sabe mandar. El de Carlos documenta cinco y su validador —Zod—
   * descarta lo que no reconoce; otro con `.strict()` devolvería 422 por cada
   * lead. Mandar solo lo que el contrato del otro lado nombra es la diferencia
   * entre una integración que aguanta y una que se rompe el día que el
   * receptor endurece su esquema.
   */
  only: readonly string[]
  /** Campos fijos que se añaden al cuerpo: { source: 'portafolio' } */
  extra: Record<string, unknown>
  timeoutMs: number
  intentos: number
}

/** JSON de una variable de entorno, tolerante: si viene roto, se ignora. */
function parseJsonEnv(
  raw: string | undefined,
  varName: string
): Record<string, never> | Record<string, unknown> {
  if (!raw) return {}
  try {
    const v = JSON.parse(raw)
    if (v && typeof v === 'object' && !Array.isArray(v)) return v
    console.error(`[forward] ${varName} no es un objeto JSON; se ignora`)
    return {}
  } catch {
    // No se lanza: una variable mal escrita no puede tirar el formulario.
    console.error(`[forward] ${varName} no es JSON válido; se ignora`)
    return {}
  }
}

function readConfig(): ForwardConfig | null {
  const url = envOpt(process.env.LEAD_WEBHOOK_URL)
  if (!url) return null

  /**
   * Solo https, y solo desde variable de entorno.
   *
   * La URL nunca viene de datos del visitante, así que no hay SSRF por
   * entrada de usuario. Este filtro cubre el otro caso: un `http://` por
   * descuido mandaría nombre, correo y mensaje en claro por la red.
   *
   * ÚNICA excepción: `localhost` y `127.0.0.1` en desarrollo, para poder probar
   * el puente contra un receptor local antes de tener el real. Ese tráfico no
   * sale de la máquina, así que no hay nada que interceptar — y se cierra
   * fuera de desarrollo para que no pueda quedarse abierta por descuido.
   */
  const esLocal = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(url)
  const enDesarrollo = process.env.NODE_ENV !== 'production'
  if (!/^https:\/\//i.test(url) && !(esLocal && enDesarrollo)) {
    console.error(
      '[forward] LEAD_WEBHOOK_URL debe empezar por https:// (http:// solo se acepta contra localhost y solo en desarrollo)'
    )
    return null
  }

  const auth = envOr(process.env.LEAD_WEBHOOK_AUTH, 'bearer').toLowerCase()
  if (!['none', 'bearer', 'header', 'basic', 'hmac'].includes(auth)) {
    console.error(`[forward] LEAD_WEBHOOK_AUTH "${auth}" no es válido`)
    return null
  }

  /**
   * El modo de autenticación EXIGE su credencial.
   *
   * Antes solo se validaba el nombre del modo, así que `AUTH=hmac` con el
   * token ausente —un typo en el nombre de la variable— dejaba la pieza
   * «configurada» y mandaba la petición sin firmar. Los cuatro `if
   * (cfg.token)` de `buildHeaders` fallaban en abierto.
   *
   * Configuración incompleta = pieza apagada, nunca pieza a medias. Es la
   * misma regla que el resto del repo aplica a Cal.com y al boletín.
   */
  if (auth !== 'none' && !envOpt(process.env.LEAD_WEBHOOK_TOKEN)) {
    console.error(
      `[forward] LEAD_WEBHOOK_AUTH="${auth}" exige LEAD_WEBHOOK_TOKEN, que falta o está vacío. El puente queda APAGADO en vez de mandar peticiones sin autenticar.`
    )
    return null
  }

  /* El modo `header` exige además el NOMBRE de la cabecera, y por la misma
     razón. Antes caía a `x-api-key` por omisión: con LEAD_WEBHOOK_HEADER en
     blanco el secreto salía bajo un nombre que el receptor no mira, así que
     contestaba 401 a cada lead y nada decía por qué. No es una fuga —el
     secreto va al mismo destino— pero sí es la «pieza a medias» que la regla
     de arriba prohíbe: una config incompleta tiene que apagar el puente, no
     adivinar. Los otros modos no lo necesitan: `bearer` y `basic` tienen
     una cabecera fijada por su propio estándar, y `hmac` sí puede caer a
     `x-signature` porque ese nombre no decide si la petición se autentica,
     solo dónde viaja la firma. */
  if (auth === 'header' && !envOpt(process.env.LEAD_WEBHOOK_HEADER)) {
    console.error(
      '[forward] LEAD_WEBHOOK_AUTH="header" exige LEAD_WEBHOOK_HEADER, que falta o está vacío. Sin el nombre de la cabecera el secreto viajaría bajo uno que el receptor no lee, así que el puente queda APAGADO.'
    )
    return null
  }

  const format = envOr(process.env.LEAD_WEBHOOK_FORMAT, 'json').toLowerCase()
  if (format !== 'json' && format !== 'form') {
    console.error(`[forward] LEAD_WEBHOOK_FORMAT "${format}" no es válido`)
    return null
  }

  const timeoutMs = Number(envOr(process.env.LEAD_WEBHOOK_TIMEOUT_MS, '8000'))
  const intentos = Number(envOr(process.env.LEAD_WEBHOOK_RETRIES, '3'))

  return {
    url,
    method: envOr(process.env.LEAD_WEBHOOK_METHOD, 'POST').toUpperCase(),
    auth: auth as ForwardConfig['auth'],
    token: envOpt(process.env.LEAD_WEBHOOK_TOKEN),
    headerName: envOr(process.env.LEAD_WEBHOOK_HEADER, 'x-api-key'),
    hmacHeader: envOr(process.env.LEAD_WEBHOOK_HMAC_HEADER, 'x-signature'),
    format: format as ForwardConfig['format'],
    fields: parseJsonEnv(
      envOpt(process.env.LEAD_WEBHOOK_FIELDS),
      'LEAD_WEBHOOK_FIELDS'
    ) as Record<string, string>,
    only: (envOpt(process.env.LEAD_WEBHOOK_ONLY) ?? '')
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean),
    extra: parseJsonEnv(
      envOpt(process.env.LEAD_WEBHOOK_EXTRA),
      'LEAD_WEBHOOK_EXTRA'
    ),
    timeoutMs: Number.isFinite(timeoutMs) ? Math.min(Math.max(timeoutMs, 1000), 25000) : 8000,
    intentos: Number.isFinite(intentos) ? Math.min(Math.max(intentos, 1), 5) : 3,
  }
}

export function isForwardConfigured(): boolean {
  return readConfig() !== null
}

/**
 * El cuerpo que se manda.
 *
 * `eventId` va en `base` porque es la forma correcta de deduplicar: el mismo
 * id en todos los reintentos deja que el receptor descarte el duplicado que
 * nace de un timeout —la petición SÍ llegó, la respuesta se perdió— sin tener
 * que adivinar.
 *
 * ⚠ PERO CON LA CONFIGURACIÓN DE HOY NO VIAJA, y el comentario anterior decía
 * lo contrario. `LEAD_WEBHOOK_ONLY` lo filtra, y a propósito: el contrato del
 * receptor no declara `event_id`, así que mandarlo sería el campo de sobra
 * que `only` existe para evitar. Quien deduplica es él, por correo y minuto
 * —comprobado: un POST repetido contesta `duplicado: true`—.
 *
 * Lo que eso deja vivo es una ventana estrecha: si el intento 1 agota los 8 s
 * de timeout y el reintento cae ya en el minuto siguiente, su deduplicación no
 * lo ve y entra un lead repetido. No se puede cerrar desde este lado sin
 * mandarle un campo que su esquema no conoce. **Si el receptor llega a
 * declarar `event_id`, añadirlo a `LEAD_WEBHOOK_ONLY` cierra la ventana y no
 * hay que tocar código.**
 */
export function buildPayload(
  lead: Lead,
  cfg: ForwardConfig,
  eventId: string
): Record<string, unknown> {
  const base: Record<string, unknown> = {
    event_id: eventId,
    event: 'lead.created',
    enviado_en: new Date().toISOString(),
    nombre: lead.nombre,
    email: lead.email,
    asunto: lead.asunto ?? null,
    sitio: lead.sitio ?? null,
    mensaje: lead.mensaje,
    origen: lead.origen ?? null,
    locale: lead.locale,
  }

  /* El filtro va ANTES del renombrado, y el orden importa: la lista blanca se
     escribe con los nombres de ORIGEN —los que este puente conoce— no con los
     del receptor. Al revés habría que saber el renombrado para escribir la
     lista, y las dos variables quedarían acopladas. */
  const seleccion = cfg.only.length
    ? Object.fromEntries(
        Object.entries(base).filter(([k]) => cfg.only.includes(k))
      )
    : base

  // Renombrado configurable. Las claves que no aparezcan en el mapa se quedan
  // con su nombre original.
  const mapped: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(seleccion)) {
    mapped[cfg.fields[key] ?? key] = value
  }

  return { ...mapped, ...cfg.extra }
}

function buildHeaders(cfg: ForwardConfig, body: string): Record<string, string> {
  const headers: Record<string, string> = {
    'content-type':
      cfg.format === 'json'
        ? 'application/json'
        : 'application/x-www-form-urlencoded',
    accept: 'application/json, text/plain;q=0.9, */*;q=0.1',
    'user-agent': 'carlosanayaruiz.com/lead-forward',
  }

  switch (cfg.auth) {
    case 'bearer':
      if (cfg.token) headers.authorization = `Bearer ${cfg.token}`
      break
    case 'header':
      if (cfg.token) headers[cfg.headerName.toLowerCase()] = cfg.token
      break
    case 'basic':
      if (cfg.token)
        headers.authorization = `Basic ${Buffer.from(cfg.token).toString('base64')}`
      break
    case 'hmac':
      // Firma HMAC-SHA256 en hexadecimal SOBRE EL CUERPO EXACTO que se manda.
      // El receptor recalcula sobre los bytes crudos que recibe: si se firmara
      // el objeto antes de serializar, cualquier diferencia de serialización
      // invalidaría la firma.
      if (cfg.token) {
        headers[cfg.hmacHeader.toLowerCase()] = createHmac('sha256', cfg.token)
          .update(body, 'utf8')
          .digest('hex')
      }
      break
    case 'none':
      break
  }

  return headers
}

function encodeBody(payload: Record<string, unknown>, cfg: ForwardConfig): string {
  if (cfg.format === 'form') {
    const p = new URLSearchParams()
    for (const [k, v] of Object.entries(payload)) {
      p.set(k, v === null || v === undefined ? '' : String(v))
    }
    return p.toString()
  }
  return JSON.stringify(payload)
}

/**
 * Manda el lead al sistema externo, con reintentos.
 *
 * NO lanza nunca. Devuelve el resultado para que quien lo llame pueda
 * registrarlo o mostrarlo — pero el resultado no puede cambiar lo que ve el
 * visitante, porque a estas alturas el correo ya salió.
 *
 * Los reintentos solo ocurren en fallos TRANSITORIOS: error de red, timeout, o
 * 5xx / 408 / 429 del receptor. Un 4xx distinto de esos es un contrato que no
 * cuadra —campo obligatorio ausente, token inválido— y reintentarlo tres veces
 * solo multiplica el ruido en los registros del otro lado.
 */
export async function forwardLead(lead: Lead): Promise<ForwardResult> {
  const cfg = readConfig()
  if (!cfg) return { estado: 'sin-configurar' }

  // Un id por MENSAJE, no por intento: es lo que hace posible deduplicar.
  const eventId = randomUUID()
  const payload = buildPayload(lead, cfg, eventId)
  const body = encodeBody(payload, cfg)
  const headers = buildHeaders(cfg, body)

  const t0 = Date.now()
  let ultimoError = 'sin intentos'
  let ultimoStatus: number | undefined

  for (let intento = 1; intento <= cfg.intentos; intento++) {
    try {
      const res = await fetch(cfg.url, {
        method: cfg.method,
        headers,
        body: cfg.method === 'GET' || cfg.method === 'HEAD' ? undefined : body,
        signal: AbortSignal.timeout(cfg.timeoutMs),
        cache: 'no-store',
        redirect: 'error',
      })

      ultimoStatus = res.status

      if (res.ok) {
        /* ── UN 2xx NO SIEMPRE ES «GUARDADO» ──
           Hay receptores que responden 200 y dentro del cuerpo dicen que no
           procesaron: el de Carlos devuelve
           `{"ok":true,"recibido":false,"motivo":"tope"}` cuando se pasa de 30
           contactos por hora. Tratarlo como éxito dejaría esa condición
           invisible.

           No se reintenta —el tope no se va a levantar en tres segundos— y no
           cambia el resultado: el correo con ese mensaje ya salió, así que el
           lead no se pierde. Pero se registra fuerte, porque es lo único que
           hace que se pueda ver. */
        const cuerpo = (await res.text().catch(() => '')).slice(0, 300)
        const rechazadoDentro = /"recibido"\s*:\s*false|"ok"\s*:\s*false/.test(
          cuerpo
        )

        if (rechazadoDentro) {
          console.error(
            `[forward] el receptor respondió ${res.status} pero NO lo procesó event=${eventId}: ${cuerpo} — el correo con este mensaje SÍ salió`
          )
          return {
            estado: 'fallo',
            intentos: intento,
            status: res.status,
            error: 'el receptor respondió 2xx pero no lo procesó: ' + cuerpo,
            ms: Date.now() - t0,
          }
        }

        // Nunca se registra el contenido del mensaje ni el correo del
        // visitante: solo el identificador del evento y la métrica.
        console.log(
          `[forward] ok event=${eventId} status=${res.status} intento=${intento} ms=${Date.now() - t0}`
        )
        return {
          estado: 'ok',
          intentos: intento,
          status: res.status,
          ms: Date.now() - t0,
        }
      }

      const transitorio = res.status >= 500 || res.status === 408 || res.status === 429
      ultimoError = `HTTP ${res.status}`

      if (!transitorio) {
        /* No se reintenta un 4xx: es un contrato que no cuadra, y repetirlo
           tres veces solo multiplica el ruido del otro lado. Pero la causa
           puede estar en ESTE lado —token equivocado, campo que el receptor
           espera con otro nombre— así que el mensaje no culpa a nadie y
           apunta a la herramienta que lo diagnostica. */
        console.error(
          `[forward] rechazado event=${eventId} status=${res.status} — 4xx, no se reintenta. Diagnostica con /api/probar-reenvio: dirá si falta un campo o si el token no cuadra.`
        )
        break
      }
    } catch (e) {
      ultimoError = e instanceof Error ? e.name + ': ' + e.message : 'error desconocido'
    }

    if (intento < cfg.intentos) {
      // Espera creciente: 400 ms, 1.2 s, 3.6 s. Corre dentro de after(), así
      // que nadie está esperando.
      await new Promise((r) => setTimeout(r, 400 * 3 ** (intento - 1)))
    }
  }

  console.error(
    `[forward] FALLÓ event=${eventId} intentos=${cfg.intentos} ultimo=${ultimoError} ms=${Date.now() - t0} — el correo con este mensaje SÍ salió`
  )

  return {
    estado: 'fallo',
    intentos: cfg.intentos,
    status: ultimoStatus,
    error: ultimoError,
    ms: Date.now() - t0,
  }
}

/**
 * Lo mismo, pero devolviendo también lo que respondió el receptor.
 *
 * Solo para la ruta de prueba: ahí lo que se quiere es ver el cuerpo de la
 * respuesta del otro sistema para saber si el contrato cuadra. En el camino
 * normal no se hace, porque el cuerpo de respuesta de un tercero no tiene por
 * qué acabar en los registros.
 */
export async function forwardLeadVerbose(lead: Lead): Promise<{
  configurado: boolean
  destino?: string
  auth?: string
  formato?: string
  cuerpoEnviado?: unknown
  status?: number
  respuesta?: string
  error?: string
  ms: number
}> {
  const cfg = readConfig()
  const t0 = Date.now()
  if (!cfg) return { configurado: false, ms: 0 }

  const eventId = randomUUID()
  const payload = buildPayload(lead, cfg, eventId)
  const body = encodeBody(payload, cfg)
  const headers = buildHeaders(cfg, body)

  try {
    const res = await fetch(cfg.url, {
      method: cfg.method,
      headers,
      body: cfg.method === 'GET' || cfg.method === 'HEAD' ? undefined : body,
      signal: AbortSignal.timeout(cfg.timeoutMs),
      cache: 'no-store',
      redirect: 'error',
    })
    const texto = (await res.text()).slice(0, 1200)
    return {
      configurado: true,
      destino: cfg.url,
      auth: cfg.auth,
      formato: cfg.format,
      cuerpoEnviado: payload,
      status: res.status,
      respuesta: texto,
      ms: Date.now() - t0,
    }
  } catch (e) {
    return {
      configurado: true,
      destino: cfg.url,
      auth: cfg.auth,
      formato: cfg.format,
      cuerpoEnviado: payload,
      error: e instanceof Error ? `${e.name}: ${e.message}` : 'error desconocido',
      ms: Date.now() - t0,
    }
  }
}
