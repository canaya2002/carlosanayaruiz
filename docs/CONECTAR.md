# Conectar la página de contacto

Todo el código está escrito y desplegable. Lo único que falta son **claves y
URLs**. Esta es la lista completa, con el enlace exacto de cada pantalla donde
se saca cada valor.

Cada cosa **degrada sola**: sin su clave, el canal no se pinta o dice
honestamente que no está conectado. Nada se rompe y nada finge.

---

## Resumen: qué me tienes que dar

| # | Variable | Para qué | Si no la das |
|---|---|---|---|
| 1 | `NEXT_PUBLIC_CAL_LINK` | Agendar reunión | La fila «agendar» **no aparece** |
| 2 | `RESEND_API_KEY` + `CONTACT_FROM` | Recibir el formulario | El formulario dice que no está conectado y ofrece WhatsApp |
| 3 | `NEWSLETTER_ENDPOINT` + `NEWSLETTER_TOKEN` | Boletín | El alta dice que la lista no está conectada |
| 4 | *(nada)* | WhatsApp | **Ya funciona** |
| 5 | *(opcional)* Supabase | Copia de los mensajes | Solo llega el correo, que es lo que importa |

**Tiempo de tu lado: 25–40 minutos**, y casi todo es esperar a que propague el
DNS de Resend.

**Orden recomendado:** 1 → 2 → 3. El 4 ya está. El 5, cuando quieras.

---

## 1 · Cal.com — agendar una reunión

**Lo más rápido de todo y gratis.**

| Paso | Enlace exacto |
|---|---|
| Crear cuenta | <https://app.cal.com/signup> |
| Crear el tipo de evento | <https://app.cal.com/event-types> → **+ New** |
| Conectar tu calendario | <https://app.cal.com/apps/categories/calendar> |
| Ver tu enlace público | <https://app.cal.com/event-types> → el evento → **Preview** |

1. Crea un evento de **30 minutos**. Nombre sugerido: «Primera lectura».
2. Conecta Google Calendar o Outlook, o te va a agendar encima de tus juntas.
3. Copia lo que va **después de `cal.com/`** en la URL pública.

Si tu enlace es `https://cal.com/carlosanaya/30min`, lo que necesito es:

```
NEXT_PUBLIC_CAL_LINK=carlosanaya/30min
```

⚠ **Solo la parte final, sin `https://cal.com/`.** El código quita el prefijo si
se lo pones, pero es una red de seguridad, no la forma correcta.

Con eso aparece la fila **ch c · Agendar una llamada** en `/contacto` y en las
cuatro páginas de servicio.

> **Por qué un enlace y no el embed.** `@calcom/embed-react` mete una librería, un
> iframe y un script de terceros que compiten por el hilo principal justo donde se
> mide el LCP. En un sitio cuyo producto **son** los Core Web Vitals, eso es una
> contradicción que cualquier prospecto mide con PageSpeed en treinta segundos. El
> enlace cuesta cero, funciona sin JavaScript y lleva al mismo calendario. Si aun
> así lo quieres embebido, se puede cargar **solo al hacer clic** — dímelo.

---

## 2 · Resend — recibir el formulario

El formulario ya valida, ya tiene cebo antibot y ya manda. Solo le falta la
llave.

| Paso | Enlace exacto |
|---|---|
| Crear cuenta (gratis, 3 000 correos/mes) | <https://resend.com/signup> |
| Añadir el dominio | <https://resend.com/domains> → **Add Domain** |
| Crear la API key | <https://resend.com/api-keys> → **Create API Key** |
| Ver si un correo salió | <https://resend.com/emails> |

### 2.1 · Verifica el dominio

1. En <https://resend.com/domains> → **Add Domain** → `carlosanayaweb.com`.
2. Resend te da 3 registros DNS: **DKIM**, **SPF** y opcionalmente **DMARC**.
3. Pégalos donde tengas el DNS del dominio. Espera a que la pantalla de Resend
   ponga el dominio en **Verified** — normalmente minutos, hasta 24 h en el peor
   caso.

⚠ **Este paso no se puede saltar.** Sin dominio verificado la API responde
**403** y el formulario dirá «algo falló de mi lado». Es el único punto de toda
la lista donde hay que esperar.

### 2.2 · La clave

En <https://resend.com/api-keys> → **Create API Key** → permiso **Sending
access**. Copia el valor (empieza por `re_`); **solo se muestra una vez.**

```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
CONTACT_FROM=sitio@carlosanayaweb.com
CONTACT_TO=carlos@carlosanayaweb.com
```

- `CONTACT_FROM` **tiene que ser del dominio verificado**. Puede ser un buzón que
  no exista (`sitio@`, `no-reply@`): es el remitente, no un destino.
- `CONTACT_TO` es opcional; si no lo pones, va al correo de `lib/constants.ts`.

El correo llega con **`Reply-To` del visitante**, así que contestas con
«Responder» sin copiar direcciones a mano. El asunto ya trae el nombre y **de qué
página** salió el mensaje.

---

## 3 · El boletín

Resend también sirve, y así es una sola cuenta y una sola clave.

| Paso | Enlace exacto |
|---|---|
| Crear la audiencia | <https://resend.com/audiences> → **Create Audience** |
| Copiar su ID | La misma pantalla, al entrar a la audiencia (un UUID) |

```
NEWSLETTER_ENDPOINT=https://api.resend.com/audiences/EL-UUID-AQUI/contacts
NEWSLETTER_TOKEN=re_xxxxxxxxxxxxxxxxxxxx
```

El token puede ser **el mismo** de arriba. `NEWSLETTER_FIELD` no hace falta:
Resend espera el campo `email`, que es el que se manda por omisión.

**Si prefieres otro proveedor** no hay que cambiar código, solo el endpoint:

| Proveedor | `NEWSLETTER_ENDPOINT` | `NEWSLETTER_FIELD` |
|---|---|---|
| Resend | `https://api.resend.com/audiences/<ID>/contacts` | *(vacío)* |
| Buttondown | `https://api.buttondown.email/v1/subscribers` | `email_address` |
| Brevo | `https://api.brevo.com/v3/contacts` | *(vacío)* |

---

## 4 · WhatsApp — ya funciona

**No necesito nada.** El número sale de `NAP` en `lib/constants.ts`
(+52 55 4416 7974) y el enlace se abre **con el mensaje ya escrito, distinto en
cada página**: quien escribe desde `/dashboards` llega diciendo que viene de ahí.

Solo si tu número de negocio es otro:

```
NEXT_PUBLIC_WHATSAPP=+52XXXXXXXXXX
```

Si quieres que el chat abra con tu catálogo o tu perfil de empresa, eso se
configura en la app, no aquí: <https://business.whatsapp.com/>

---

## 5 · Supabase — opcional, y de verdad opcional

| Paso | Enlace exacto |
|---|---|
| Tus proyectos | <https://supabase.com/dashboard/projects> |
| Editor SQL | Proyecto → **SQL Editor** → **New query** |
| La URL y las llaves | Proyecto → **Project Settings → API** |

Dijiste que ya tienes Supabase, así que está soportado. Pero conviene decirlo
claro: **un formulario de contacto no necesita base de datos, necesita que el
correo llegue.** Supabase aquí es respaldo e historial, no la vía de entrega.

Y está montado en ese orden: **si la fila falla pero el correo salió, el mensaje
llegó** y el visitante ve «llegó». Al revés sería perder un cliente por un
problema de infraestructura.

Si lo quieres, pega esto en el **SQL Editor**:

```sql
create table public.leads (
  id         bigint generated always as identity primary key,
  creado_en  timestamptz not null default now(),
  nombre     text not null,
  email      text not null,
  asunto     text,
  sitio      text,
  mensaje    text not null,
  origen     text,
  locale     text not null default 'es'
);

-- El sitio escribe con la service role key, que salta RLS. Aun así se activa:
-- así ninguna clave pública puede leer los mensajes si algún día se expone una.
alter table public.leads enable row level security;
```

Y de **Project Settings → API**:

```
SUPABASE_URL=https://xxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
SUPABASE_LEADS_TABLE=leads
```

> ⚠ **`SUPABASE_SERVICE_ROLE_KEY` nunca lleva el prefijo `NEXT_PUBLIC_`.** Ese
> prefijo la mandaría al navegador de todo el mundo, y esa llave salta RLS: sería
> dar lectura y escritura de tu base a cualquiera que abra el inspector.

---

## Dónde se pegan

### En local

Copia `.env.example` a `.env.local` y rellena. `.env.local` ya está en
`.gitignore`.

```bash
cp .env.example .env.local
```

### En Vercel

<https://vercel.com/dashboard> → tu proyecto → **Settings → Environment
Variables**.

| Variable | En qué entornos |
|---|---|
| Las `NEXT_PUBLIC_*` | Production, Preview y Development |
| Las demás | Production y Preview |

⚠ **Un redeploy después.** Las variables se leen en el build, así que hasta que
no vuelvas a desplegar el sitio sigue como estaba: **Deployments → el último →
⋯ → Redeploy.**

---

## Cómo comprobar que quedó

| Qué | Cómo |
|---|---|
| Cal.com | Abre `/es/contacto`. Si aparece **ch c**, está leyendo la variable |
| Formulario | Envíate un mensaje. Debe decir «Llegó» y el correo caer en tu bandeja |
| El correo salió | <https://resend.com/emails> — ahí se ve cada envío y su estado |
| `Reply-To` | Responde ese correo: debe ir al visitante, no a ti |
| Boletín | Suscríbete en el pie. Debe decir «Listo» y aparecer en <https://resend.com/audiences> |
| WhatsApp | Clic en **ch b**: debe abrir el chat con el mensaje ya escrito |
| Supabase | `select * from leads order by creado_en desc limit 5;` |

Si algo dice «no está conectado», es la variable: el código ya está.

---

## El botón «¿Eres cliente?»

Ya está puesto, y **no necesita ninguna clave**: apunta a
<https://carlosanayaweb.com>, que vive en `SOCIAL_LINKS.clientPortal` en
`lib/constants.ts`. Si el portal de clientes cambia de dirección, **se cambia en
ese único sitio** y las dos apariciones lo siguen.

Aparece en dos lugares, y las dos son a propósito:

1. **Lo primero del margen derecho de `/contacto`.** Ahí el margen separa las dos
   intenciones: a la izquierda quien viene a contratar, a la derecha quien ya es
   cliente. Sin eso las dos compiten por el mismo formulario, y la que pierde es
   la que paga.
2. **En el pie de las 15 páginas**, junto al tiempo de respuesta — no entre los
   enlaces de navegación, porque no es un destino más del sitio.

**No se puso en la barra de navegación**, y es una decisión medida: la fila del
nav ya desbordó 6 px a 320 px una vez, y el chequeo automático empieza a probar en
360. Si lo quieres arriba, se puede — pero hay que medirlo a 320 a mano. Dímelo.

---

## Lo que hace falta de tu lado, y no es técnico

Las **imágenes**. La lista completa está en [`docs/MEDIA.md`](./MEDIA.md), que se
genera del mismo dato que pinta las páginas, así que no puede desincronizarse.
Hoy son **40 archivos pendientes**, y no todos valen lo mismo:

1. **`home-evidencia`** — una curva real de Search Console o CrUX con su eje de
   tiempo. **Si solo consigues un archivo de toda la lista, que sea este:** es la
   prueba de todo lo demás que dice el sitio.
2. Los **ocho de servicios** (dos por servicio): el crawl, el schema, el
   Lighthouse, el PR, el flujo, el chat, el dashboard, el modelo.
3. Las **capturas de proyectos**. Con NDA, difumina cifras y nombres.

Ponlos en la ruta indicada dentro de `public/`, cambia `filled: false` a `true` en
`data/media-slots.ts`, y entran **sin que el layout se mueva un píxel**. Mientras
no existan, cada hueco se pinta como un renglón con su ruta exacta, no como una
caja vacía.

Y hay un dato que **sí es tuyo y no una imagen**: en `data/companies.ts` sigue
habiendo una entrada con el slug `nombre-del-cliente`. Es un marcador de posición.
Dime el nombre real —o si va con NDA y cómo quieres nombrarlo— y se cambia.

---

## Lo que ya está hecho y no necesita nada

- Los tres canales de contacto, con su mensaje prellenado por página.
- El formulario, con validación de servidor y cebo antibot.
- El boletín, en el pie de las 15 páginas.
- El botón «¿Eres cliente?», en `/contacto` y en el pie.
- El aviso de privacidad, con la sección del boletín conforme a la LFPDPPP.
- SEO: **0 hallazgos en 16 rutas y los dos idiomas.**
- Core Web Vitals: LCP ~100–170 ms, CLS 0.0000, 0 layouts en reposo.
