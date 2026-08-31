# El registro de encargos — 20+ trabajos, todos reales

Este archivo es la **fuente para el dueño**. Se llena a mano; de aquí sale
`data/engagements.ts`, y de ese archivo sale la página. Es el mismo patrón que
`docs/MEDIA.md` y `docs/CONECTAR.md`: un dato, un generador, cero posibilidad de
que la lista y la página discrepen.

## Por qué este archivo existe

Se pidió meter «unas 20 empresas y trabajos pequeños» **inventados**. No se hizo, y
la razón no es de estilo: este sitio es la web comercial de una persona real y su
tesis literal es *«credenciales que se pueden comprobar… para que no tengas que
creerme»*. Ya se borró `impact` del premio de la NASA y la palabra «Vigente» del PMP
por no poder respaldarlos. Veinte clientes inventados matan las afirmaciones
**verdaderas** el día que un prospecto busque una y no exista — y el daño no cae en
el sitio, cae en quien contrata.

**Lo que sí resuelve el 90% del deseo: el trabajo real, anonimizado donde haya
acuerdo de confidencialidad.** Eso es práctica normal y perfectamente honesta:

> ❌ «Farmacias del Valle S.A. de C.V.» ← inventado, verificable, falso
> ✅ «Cadena de farmacias, CDMX — nombre bajo acuerdo» ← real, no verificable, honesto

La segunda forma es **más fuerte** que un nombre falso, porque el rótulo «nombre bajo
acuerdo» es una afirmación cierta que además señala que hubo un contrato.

## La regla de oro al llenar esto

**Si no lo hiciste, no va.** Y si lo hiciste pero no lo mediste, la columna
`resultado` va vacía — la página entonces no afirma nada sobre el resultado, igual
que `awards.ts` no afirma un impacto que no puede citar. Un encargo sin cifra sigue
valiendo: dice qué construiste, para qué sector y cuánto duró.

## La tabla

Copia este bloque y llénalo. Mínimo 20 filas. Las columnas marcadas ⚠ son las que
la página **no puede** inventar.

| # | cliente ⚠ | anón. | sector ⚠ | país | año ⚠ | semanas ⚠ | tipo ⚠ | qué entregaste ⚠ | stack | resultado (si lo mediste) | servicio |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 |  | sí/no |  | MX |  |  |  |  |  |  |  |
| 2 |  | sí/no |  | MX |  |  |  |  |  |  |  |
| … |  |  |  |  |  |  |  |  |  |  |  |

### Qué va en cada columna

| Columna | Qué es | Por qué la página la necesita |
|---|---|---|
| `cliente` | El nombre real, **o** el descriptor del sector si hay NDA («cadena de farmacias», «despacho contable», «importadora de autopartes») | Es la fila del registro |
| `anón.` | `sí` si el nombre va anonimizado | La página **rotula** «nombre bajo acuerdo». Se declara, no se esconde |
| `sector` | Giro en dos o tres palabras | Agrupa el registro sin inventar categorías |
| `país` | `MX`, `US`, `TW`… | Alimenta el mapa de presencia que ya existe en `/proyectos` |
| `año` | Año de entrega | Es la **posición** de la marca en el eje de tiempo |
| `semanas` | Duración real | Es el **largo** de la marca. El dibujo no puede desmentir al dato |
| `tipo` | `sitio-web` · `software-interno` · `automatizacion` · `dashboard` · `seo` · `integracion` | Es el canal del registro |
| `qué entregaste` | Una frase de hechos, sin adjetivos: «catálogo de 400 SKU con carrito y pasarela», «lector de facturas XML que carga a Contpaq» | Es la única prosa de la fila |
| `stack` | Tecnologías reales, separadas por coma | Cruza con `data/skills.ts` y respalda las habilidades listadas |
| `resultado` | **Solo si lo mediste.** «de 11 s a 1.4 s de carga», «4 h/semana de captura eliminadas». Vacío si no hay número | Sin cifra, la página no afirma resultado |
| `servicio` | `seo-tecnico` · `desarrollo-web` · `automatizacion-ia` · `dashboards`, o vacío | Es el enlace interno que rinde: 20 filas apuntando a las 4 páginas que facturan |

### Dos ejemplos de FORMA (no son datos reales, no se publican)

Están aquí solo para que se vea el nivel de concreción que hace falta. **No los
copies: bórralos al llenar la tabla.**

| # | cliente | anón. | sector | país | año | semanas | tipo | qué entregaste | stack | resultado | servicio |
|---|---|---|---|---|---|---|---|---|---|---|---|
| — | Cadena de farmacias | sí | Retail salud | MX | 2024 | 6 | software-interno | Control de caducidades por lote con alertas y corte diario | Next.js, Postgres | 3 h/semana de conteo manual eliminadas | dashboards |
| — | Despacho contable | sí | Servicios profesionales | MX | 2023 | 3 | automatizacion | Lector de CFDI que concilia contra el estado de cuenta | Python, Pandas | *(no se midió)* | automatizacion-ia |

## Cómo se convierte en página

Cuando la tabla esté llena:

1. `data/engagements.ts` — el registro tipado, generado de esta tabla.
2. La página **no es una rejilla de tarjetas**. Es un **registro**: filas `.band`
   ordenadas por año, con el margen `.ledger` llevando las cuentas (cuántos por
   tipo, cuántos por sector, el rango de años).
3. El instrumento del margen es **`<Span>`**, que ya existe: un eje de tiempo con
   una marca por encargo, y **el largo de cada marca es `semanas`**. Así el dibujo
   sale del dato y no puede mentir — que es la lección que dejó el dial cuando
   rotulaba «a–e» dibujando cuatro.
4. Cada fila con `servicio` enlaza a su página de servicio. Veinte encargos son
   veinte enlaces internos hacia las cuatro páginas que facturan.
5. Los `país` alimentan el mapa que ya vive en `/proyectos`.

> El nombre de la página y su sitio en el nav se deciden contigo: `/encargos`
> compitiendo con `/proyectos`, o una sección **dentro** de `/proyectos` donde los
> 5 proyectos insignia se quedan arriba y el registro va debajo. La segunda no
> añade una entrada al nav, que ya desbordaba 6 px a 320 px una vez.

## Lo que este archivo NO permite

- Filas sin `año` o sin `semanas`: sin ellas no hay posición ni largo, y entonces la
  marca sería decorativa. Una marca decorativa en un eje rompe el instrumento.
- Un `resultado` estimado, redondeado «para que suene mejor» o traído de un caso
  ajeno. Si no lo mediste, se queda vacío: **la columna vacía es la respuesta
  correcta**, no un hueco que haya que rellenar.
- Logos de cliente sin permiso escrito. Un logo es marca registrada y su uso implica
  endoso; el nombre en texto bajo acuerdo, no.
