# Credenciales — lo que dice cada documento, palabra por palabra

Este archivo es la **transcripción literal** de las once imágenes que entregó el
dueño, leídas una por una. De aquí sale lo que el sitio puede afirmar, y nada más.

**La regla que gobierna este archivo:** el sitio se titula *«Credenciales que se
pueden comprobar… para que no tengas que creerme»*. Así que aquí va la cita
exacta, el emisor exacto, la fecha exacta y —cuando existe— la **URL de
verificación**. Lo que no está en el documento, no se afirma.

Generado y optimizado con `npm run credenciales`. Los `.webp` viven en
`public/credenciales/`. Los originales siguen en `~/Downloads` y **no** están en
el repo.

---

## ⚠ PRIMERO: el PMP no está entre estos documentos

De las once imágenes, la única relacionada con el PMP es un **curso de
preparación de Udemy**:

> **PMP Certification Exam Prep Course 35 PDU Contact Hours/PDU**
> TIA Education, Andrew Ramdayal · Udemy · 27 de mayo de 2025 · 35 horas

Las 35 horas de contacto son el **requisito para presentar el examen** del PMI,
no la credencial. Y el sitio afirma hoy, en **veinte sitios**, tener el PMP:

| Dónde | Qué dice |
|---|---|
| `lib/schema.ts:418` | `hasCredential: 'Project Management Professional (PMP)'` — dato estructurado |
| `data/personal.ts:68/84` | «Certificado PMP» / «PMP certified» en el resumen |
| `data/experience.ts:57/111` | `position: 'PMP – Project Manager'` |
| `data/companies.ts:112` | «el marco del PMBOK **con el que me certifiqué como PMP**» |
| `messages/*.json:200` | «Ingeniero en tecnologías computacionales. Consultor SEO técnico. **Certificado PMP.**» |
| `lib/constants.ts:284/291` | «certificado PMP» en la meta descripción y el OG |
| `app/[locale]/certificaciones/page.tsx:117` | la fila del PMP, con `date: null` |

### ✅ RESUELTO — 2026-09-02

**El dueño confirmó que tiene la certificación del PMI emitida y vigente, y
que no va a publicar el folio ni la fecha.** Preguntado explícitamente entre
tres opciones —«la tengo, no doy el folio», «solo el curso de preparación» y
«está en trámite»— eligió la primera.

**Consecuencia: las 29 afirmaciones se quedan como están.** «Certificado PMP»
es cierto, así que no se toca ni el `hasCredential` del JSON-LD, ni el
`<title>` de /certificaciones, ni `llms.txt`, ni las cuatro tarjetas OG, ni el
`summary` de `data/personal.ts`.

Lo único que NO se puede escribir sin el folio, y por eso no está:

- La fila de /certificaciones dice «sin fecha» y no «Vigente». Sin fecha de
  emisión no hay periodo que afirmar, y la página se titula «Credenciales que
  se pueden comprobar»: una vigencia sin fecha es lo único de esa página que no
  se puede comprobar. Se queda así.
- El `hasCredential` va sin `identifier`, `validFrom` ni `expires`.
- No hay enlace al registro público del PMI, porque ese registro se consulta
  por número.

> ⚠ **NO REABRIR ESTA PREGUNTA.** Está contestada. Si algún día llega el folio,
> lo que se desbloquea está en la lista de arriba y es un cambio de diez
> minutos. Hasta entonces, el estado actual es el correcto y deliberado.

El PMI mantiene un registro público de titulares, así que la afirmación es
comprobable por cualquiera que tenga el número — y quien no lo tenga no puede
refutarla. Ese es el equilibrio que el dueño eligió, con la información en la
mano.

---

## 1. El premio — NASA International Space Apps Challenge

**Este es el documento más valioso del lote**, y responde a la pregunta que
`CLAUDE.md` tenía abierta: *«¿Existe el certificado del NASA Space Apps, y qué
dice literalmente?»*

| Campo | Valor literal del documento |
|---|---|
| Distinción | **GALACTIC PROBLEM SOLVER** |
| Emisor | The 2024 NASA International Space Apps Challenge |
| Otorgado a | Carlos Anaya Ruiz |
| **Cita literal** | «for outstanding participation and efforts to address challenges we face on Earth and in space» |
| Firma | Dr. Keith Gaddis, Program Scientist, NASA International Space Apps Challenge |
| **Fecha** | **October 5–6, 2024** |

- **Archivo:** `public/credenciales/certificado-nasa-space-apps-galactic-problem-solver-carlos-anaya-ruiz.webp` (1600×900, 77 kB)
- **`alt` (es):** «Certificado Galactic Problem Solver del NASA International Space Apps Challenge 2024 otorgado a Carlos Anaya Ruiz»
- **`alt` (en):** «Galactic Problem Solver certificate from the 2024 NASA International Space Apps Challenge awarded to Carlos Anaya Ruiz»
- **Va en:** `/premios` (fila principal), `/sobre-mi`, `/cv`, `/proyectos/aurascope`
- **Hueco que cierra:** `premios-diplomas` de `data/media-slots.ts`

**Lo que ahora SÍ se puede escribir, y antes no:** `awards.ts` tenía el campo
`impact` borrado a propósito porque «Galactic Problem Solver por contribución
técnica con datasets complejos y visualizaciones» era una *interpretación*. Con
el documento en mano, la cita literal se puede poner **entre comillas y
atribuida**, que es exactamente lo que faltaba.

**Y corrige la fecha:** el certificado dice **5–6 de octubre de 2024**;
`awards.ts` tenía `2024-10`, que es correcto pero menos preciso.

---

## 2. Los diez certificados de Udemy — 265.5 horas

Todos con **URL de verificación pública**, que es lo que la página
`/certificaciones` prometía y no tenía.

> **Cómo llamarlos, y esto importa:** son **certificados de finalización de
> curso**, no certificaciones profesionales. `data/awards.ts` distingue
> `certification` («un examen aprobado o una credencial») de las otras dos
> categorías; un curso de Udemy no es ninguna de las tres. Llamarlos
> «certificaciones» al lado del TOEFL los sube un escalón que no les toca — el
> mismo inflado que se corrigió en el NASA. Por eso van con la etiqueta
> **«curso · Udemy»** y sus horas a la vista, que es un dato fuerte por sí solo.

| # | Título literal | Instructores | Fecha | Horas | Nº de certificado |
|---|---|---|---|---|---|
| 1 | The Complete Full-Stack Web Development Bootcamp | Dr. Angela Yu | 13 may 2025 | **61.5** | `UC-5385c27e-285a-47f9-ba20-68fe94f35715` |
| 2 | Master en React: Aprender ReactJS, Hooks, MERN, NodeJS, JWT+ | Víctor Robles | 27 may 2025 | **39.5** | `UC-ba70b1b3-6c75-4941-b832-b6a29f933da8` |
| 3 | Next.js: El framework de React para producción | Fernando Herrera · DevTalles | 27 may 2025 | **36.5** | ⚠ ilegible en la imagen |
| 4 | PMP Certification Exam Prep Course 35 PDU Contact Hours/PDU | TIA Education · Andrew Ramdayal | 27 may 2025 | **35** | ⚠ ilegible en la imagen |
| 5 | Inteligencia Artificial y Deep Learning desde cero en Python | Santiago Hernández | 13 may 2025 | **27** | `UC-cd3ca6fb-98a0-496a-80fd-bf3f496933c4` |
| 6 | JavaScript TOTAL - De Cero a Programador Web en 18 Días | Federico Garay · Escuela Directa | 27 may 2025 | **26.5** | `UC-abf12e2a-096e-43eb-8392-51295714498e` |
| 7 | Inteligencia Artificial aplicada a Negocios y Empresas | SuperDataScience Team · Juan Gabriel Gomila Salas | 27 may 2025 | **20.5** | `UC-f2c98a99-73e5-410d-8683-f0b9884d9cfd` |
| 8 | Firebase In Depth | Angular University | 27 may 2025 | **10** | `UC-9b9f517d-a436-463c-a414-3da8762c603a` |
| 9 | Docker for the Absolute Beginner - Hands On - DevOps | Mumshad Mannambeth · KodeKloud Training | 27 may 2025 | **4.5** | `UC-f5ac9b26-fe71-4103-9d0d-6ed2929eeada` |
| 10 | SCRUM Práctico en Proyectos de Software | Hector Bravo | 27 may 2025 | **4.5** | ⚠ ilegible en la imagen |

**La URL de verificación se arma así:** `https://ude.my/{número}`. Con eso cada
fila de `/certificaciones` deja de ser una afirmación y pasa a ser un enlace.

### Nombres de archivo y etiquetas

Convención: la misma del blog, `{slug}-carlos-anaya-ruiz.webp` — el nombre viaja
con el archivo si alguien lo descarga.

| Archivo en `public/credenciales/` | Tamaño | `alt` propuesto |
|---|---|---|
| `certificado-full-stack-web-development-bootcamp-carlos-anaya-ruiz.webp` | 1288×958 · 31 kB | Certificado de Udemy del bootcamp completo de desarrollo web full-stack, 61.5 horas, a nombre de Carlos Anaya Ruiz |
| `certificado-master-react-hooks-mern-nodejs-carlos-anaya-ruiz.webp` | 1600×1189 · 44 kB | Certificado de Udemy del máster en React, Hooks, MERN y NodeJS, 39.5 horas, a nombre de Carlos Anaya Ruiz |
| `certificado-nextjs-framework-react-produccion-carlos-anaya-ruiz.webp` | 488×363 · 10 kB ⚠ | Certificado de Udemy del curso de Next.js para producción, 36.5 horas, a nombre de Carlos Anaya Ruiz |
| `certificado-pmp-exam-prep-35-pdu-carlos-anaya-ruiz.webp` | 488×363 · 12 kB ⚠ | Certificado de Udemy del curso de preparación para el examen PMP, 35 horas de contacto PDU, a nombre de Carlos Anaya Ruiz |
| `certificado-inteligencia-artificial-deep-learning-python-carlos-anaya-ruiz.webp` | 800×595 · 20 kB | Certificado de Udemy del curso de inteligencia artificial y deep learning en Python, 27 horas, a nombre de Carlos Anaya Ruiz |
| `certificado-javascript-total-carlos-anaya-ruiz.webp` | 800×595 · 20 kB | Certificado de Udemy del curso JavaScript TOTAL, 26.5 horas, a nombre de Carlos Anaya Ruiz |
| `certificado-inteligencia-artificial-negocios-empresas-carlos-anaya-ruiz.webp` | 1600×1189 · 44 kB | Certificado de Udemy del curso de inteligencia artificial aplicada a negocios y empresas, 20.5 horas, a nombre de Carlos Anaya Ruiz |
| `certificado-firebase-in-depth-carlos-anaya-ruiz.webp` | 1600×1189 · 30 kB | Certificado de Udemy del curso Firebase In Depth de Angular University, 10 horas, a nombre de Carlos Anaya Ruiz |
| `certificado-docker-devops-carlos-anaya-ruiz.webp` | 800×595 · 20 kB | Certificado de Udemy del curso de Docker y DevOps de KodeKloud, 4.5 horas, a nombre de Carlos Anaya Ruiz |
| `certificado-scrum-practico-proyectos-software-carlos-anaya-ruiz.webp` | 488×363 · 9 kB ⚠ | Certificado de Udemy del curso de SCRUM práctico en proyectos de software, 4.5 horas, a nombre de Carlos Anaya Ruiz |

### ⚠ Tres están a muy baja resolución

`nextjs`, `pmp-exam-prep` y `scrum` llegaron a **488×363**. A ese tamaño no se
pueden mostrar más grandes que ~240 px de ancho sin verse blandas — la misma
regla que ya está escrita para la foto en blanco y negro de 400×400. **Si las
vuelves a exportar desde Udemy en tamaño completo, se reemplazan corriendo
`npm run credenciales` otra vez** (es idempotente).

Y de esos tres no se pudo leer el número de certificado, así que **son los tres
que se quedan sin URL de verificación** hasta que lleguen legibles.

---

## 3. Lo que estas credenciales arreglan del sitio

| Problema que ya estaba documentado | Cómo lo cierra esto |
|---|---|
| `/certificaciones` se titula «que se pueden comprobar» y **no ofrecía una sola vía de verificación** | 7 de 10 cursos traen número y URL pública |
| `awards.ts:image` vacío en las tres entradas | el NASA ya tiene su archivo |
| El NASA sin cita literal (se borró `impact` por eso) | la cita exacta, entre comillas y atribuida a Dr. Keith Gaddis |
| Hueco `premios-diplomas` en prioridad baja | se llena con el certificado del NASA |
| `data/skills.ts` con 38 entradas sin respaldo en ningún archivo | Docker, Firebase, Next.js, React, MERN, NodeJS, JWT, Python/Deep Learning y Scrum quedan respaldados por un certificado con folio |
| El hueco de 16 meses desde abr 2025 | mayo de 2025 deja de estar vacío: 265.5 horas de formación fechadas |

---

## 4. Lo que estas once imágenes NO son

Para que no se use lo que no hay:

- **No son experiencia laboral.** Un curso no es un cliente ni un empleo. Siguen
  faltando empresas reales — ver `docs/ENCARGOS.md`.
- **No son proyectos.** Ninguna prueba que algo se construyera y funcionara en
  producción.
- **No sustituyen el PMP.** Ver el aviso de arriba.
- **No son resultados medidos.** Ninguna trae una cifra de negocio.
