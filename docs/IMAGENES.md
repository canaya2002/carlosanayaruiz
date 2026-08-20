# Inventario de imágenes

> GENERADO — no editar a mano. Regenera con `npm run images:manifest`.

Cada fila es un hueco de imagen real del sitio, encontrado escaneando los
`<ImageSlot>` del código. La columna **ruta** es dónde va el archivo,
contando desde la carpeta `public/`.

## Resumen

- Huecos totales: **31**
- Ya con imagen: **0**
- Vacíos: **7**
- Con ruta dinámica (una por cada dato): **24**

## Cómo llenar uno

1. Guarda el archivo en la ruta exacta de la tabla, dentro de `public/`.
2. En `data/companies.ts`, agrega la ruta al array `shots` de esa entrada
   (los huecos de proyecto se llenan desde ahí).
3. Vuelve a desplegar. El patrón generado desaparece solo.

## Las etiquetas que se ven en el sitio

Mientras un hueco está vacío, el sitio dibuja un patrón de color y ENCIMA
escribe la ruta del archivo que falta. Sirve para saber dónde pegar cada
imagen sin abrir el código.

Para apagar esas etiquetas cuando ya no las necesites:

```bash
# .env.local, o en las variables de entorno de Vercel
NEXT_PUBLIC_SHOW_SLOTS=0
```

Con las etiquetas apagadas el hueco sigue dibujando el patrón, así que la
página nunca se ve rota — solo deja de anunciar rutas a los visitantes.

## Tabla

| Estado | Ruta | Qué es | Tamaño | Dónde está |
| --- | --- | --- | --- | --- |
| 🔁 patrón | _dinámica_ | — | 1200×750 | `app/[locale]/premios/page.tsx:136` |
| 🔁 patrón | _dinámica_ | Foto del reconocimiento | 1200×750 | `app/[locale]/premios/page.tsx:385` |
| 🔁 patrón | _dinámica_ | Foto del reconocimiento | 1200×750 | `app/[locale]/premios/page.tsx:578` |
| 🔁 patrón | _dinámica_ | Portada del proyecto | 1200×750 | `app/[locale]/proyectos/page.tsx:426` |
| 🔁 patrón | _dinámica_ | — | 1200×750 | `app/[locale]/proyectos/[slug]/page.tsx:699` |
| 🔁 patrón | `public/certificaciones/${credential.id}.png` | Diploma | 1000×750 | `app/[locale]/certificaciones/page.tsx:500` |
| 🔁 patrón | `public/certificaciones/${credential.id}.png` | Diploma | 1200×900 | `app/[locale]/cv/page.tsx:1126` |
| 🔁 patrón | `public/certificaciones/${credential.id}.png` | Diploma | 1200×900 | `app/[locale]/sobre-mi/page.tsx:728` |
| ⬜ vacía | `public/certificaciones/carpeta-de-certificados.png` | Captura de la carpeta | 1200×750 | `app/[locale]/certificaciones/page.tsx:655` |
| ⬜ vacía | `public/contacto/cdmx.png` | — | 1200×800 | `app/[locale]/contacto/page.tsx:370` |
| ⬜ vacía | `public/inicio/captura-core-web-vitals.png` | Captura de Core Web Vitals | 1200×750 | `app/[locale]/page.tsx:357` |
| ⬜ vacía | `public/inicio/portada-proyectos.png` | Portada de proyectos | 1200×750 | `app/[locale]/page.tsx:665` |
| 🔁 patrón | `public/libros/${featured.slug}.png` | — | 800×1200 | `app/[locale]/libros/page.tsx:292` |
| 🔁 patrón | `public/libros/recursos/${resource.slug}.png` | — | 1200×750 | `app/[locale]/libros/page.tsx:565` |
| 🔁 patrón | `public/logos/${company.slug}.png` | Logo | 320×160 | `app/[locale]/page.tsx:407` |
| 🔁 patrón | `public/logos/${company.slug}.png` | Logo | 400×400 | `app/[locale]/proyectos/[slug]/page.tsx:550` |
| 🔁 patrón | `public/logos/${employer.slug}.png` | Logo | 320×160 | `app/[locale]/cv/page.tsx:908` |
| 🔁 patrón | `public/premios/${award.id}.png` | Reconocimiento | 1200×750 | `app/[locale]/cv/page.tsx:1216` |
| 🔁 patrón | `public/premios/${award.id}.png` | Reconocimiento | 1200×750 | `app/[locale]/sobre-mi/page.tsx:919` |
| 🔁 patrón | `public/servicios/${service.id}.png` | — | 1200×750 | `app/[locale]/automatizacion-ia/page.tsx:321` |
| 🔁 patrón | `public/servicios/${service.id}.png` | — | 1200×750 | `app/[locale]/dashboards/page.tsx:331` |
| 🔁 patrón | `public/servicios/${service.id}.png` | — | 1200×750 | `app/[locale]/desarrollo-web/page.tsx:324` |
| 🔁 patrón | `public/servicios/${service.id}.png` | — | 1200×750 | `app/[locale]/seo-tecnico/page.tsx:344` |
| 🔁 patrón | `public/servicios/${service.id}.png` | — | 1200×750 | `app/[locale]/servicios/page.tsx:608` |
| 🔁 patrón | `public/servicios/${service.id}/fase-${index + 1}.png` | — | 1200×750 | `app/[locale]/automatizacion-ia/page.tsx:521` |
| 🔁 patrón | `public/servicios/${service.id}/fase-${index + 1}.png` | — | 1200×750 | `app/[locale]/dashboards/page.tsx:521` |
| 🔁 patrón | `public/servicios/${service.id}/fase-${index + 1}.png` | — | 1200×750 | `app/[locale]/desarrollo-web/page.tsx:505` |
| 🔁 patrón | `public/servicios/${service.id}/fase-${index + 1}.png` | — | 1200×750 | `app/[locale]/seo-tecnico/page.tsx:532` |
| ⬜ vacía | `public/servicios/portada-servicios.png` | — | 1200×750 | `app/[locale]/servicios/page.tsx:318` |
| ⬜ vacía | `public/sobre-mi/setup.png` | Espacio de trabajo | 1200×900 | `app/[locale]/sobre-mi/page.tsx:808` |
| ⬜ vacía | `public/sobre-mi/trabajando.png` | Foto trabajando | 1200×750 | `app/[locale]/sobre-mi/page.tsx:433` |

## Tamaños recomendados

No hace falta que sean exactos: `next/image` reescala y sirve AVIF/WebP.
Lo que importa es que la proporción coincida, para que no se recorte nada
que quieras mostrar.

| Uso | Proporción | Ancho mínimo |
| --- | --- | --- |
| Captura de proyecto | 16:10 | 1200 px |
| Portada de proyecto | 16:10 | 1200 px |
| Certificado / diploma | 4:3 o A4 | 1000 px |
| Premio / reconocimiento | 16:10 | 1200 px |
| Retrato | 1:1 | 800 px |
| Logo de empresa | libre, con fondo transparente | 400 px |

## PDFs

Van en `public/pdf/` y se declaran en el array `docs` de la entrada
correspondiente en `data/companies.ts`:

```ts
docs: [{ label: 'Auditoría (PDF)', href: '/pdf/auditoria-cliente.pdf' }],
```
