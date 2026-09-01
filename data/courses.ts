/**
 * ════════════════════════════════════════════════════════════════
 * CURSOS CON CERTIFICADO — el registro de formación
 *
 * Transcritos del documento, uno por uno. La transcripción completa —con la
 * firma, el instructor y el número de referencia— está en
 * `docs/CREDENCIALES.md`.
 *
 * ── POR QUÉ NO VAN EN `data/awards.ts` ──
 * Ese archivo modela tres cosas (`recognition`, `competition`, `certification`)
 * y su propio comentario advierte que meterlas bajo un mismo encabezado
 * exagera dos. Un curso de Udemy no es ninguna de las tres: no es un premio, no
 * es una competencia y no es un examen acreditado. Llamarlo «certificación» al
 * lado del TOEFL lo subiría un escalón que no le toca — el mismo inflado que se
 * corrigió en el premio del NASA.
 *
 * Lo que SÍ es, y es fuerte por sí solo: 265.5 horas fechadas, con instructor
 * nombrado y —en siete de diez— folio y URL de verificación pública. Por eso la
 * página los rotula «curso» y muestra las horas.
 *
 * ── LA REGLA DE ESTE ARCHIVO ──
 * Nada que no esté impreso en el documento. Tres entradas llegaron a 488×363
 * con el folio ilegible y el dueño no tiene los originales, así que van sin
 * `credentialId` y sin `image`: la fila existe, dice sus horas y su fecha, y NO
 * ofrece un enlace de verificación que no puede cumplir.
 *
 * Los títulos no se traducen: son el nombre propio del curso, tal como está
 * impreso. Lo que se traduce son las etiquetas, y esas viven en la página.
 * ════════════════════════════════════════════════════════════════
 */

export interface Course {
  /** Clave estable. Sirve de React key y de ancla. */
  id: string
  /** Título literal del certificado. */
  title: string
  /** Instructores, tal como los nombra el documento. */
  instructors: string
  /** Plataforma emisora. */
  platform: string
  /** `YYYY-MM-DD`: el documento trae día exacto. */
  date: string
  /** Horas totales que declara el certificado. */
  hours: number
  /**
   * Folio del certificado. Ausente cuando la imagen llegó ilegible — y sin
   * folio no hay URL de verificación, así que la fila no la ofrece.
   */
  credentialId?: string
  /** Ruta en `public/`. Ausente cuando no hay archivo usable. */
  image?: string
  /** Dimensiones nativas, para reservar el espacio y no mover el layout. */
  width?: number
  height?: number
  /** Texto alternativo. Obligatorio: sin esto la imagen no es indexable. */
  alt: string
}

const DIR = '/credenciales'

export const COURSES: readonly Course[] = [
  {
    id: 'full-stack-bootcamp',
    title: 'The Complete Full-Stack Web Development Bootcamp',
    instructors: 'Dr. Angela Yu',
    platform: 'Udemy',
    date: '2025-05-13',
    hours: 61.5,
    credentialId: 'UC-5385c27e-285a-47f9-ba20-68fe94f35715',
    image: `${DIR}/certificado-full-stack-web-development-bootcamp-carlos-anaya-ruiz.webp`,
    width: 1142,
    height: 818,
    alt: 'Certificado de Udemy del bootcamp completo de desarrollo web full-stack, 61.5 horas, a nombre de Carlos Anaya Ruiz',
  },
  {
    id: 'master-react',
    title: 'Master en React: Aprender ReactJS, Hooks, MERN, NodeJS, JWT+',
    instructors: 'Víctor Robles',
    platform: 'Udemy',
    date: '2025-05-27',
    hours: 39.5,
    credentialId: 'UC-ba70b1b3-6c75-4941-b832-b6a29f933da8',
    image: `${DIR}/certificado-master-react-hooks-mern-nodejs-carlos-anaya-ruiz.webp`,
    width: 1600,
    height: 1152,
    alt: 'Certificado de Udemy del máster en React, Hooks, MERN y NodeJS, 39.5 horas, a nombre de Carlos Anaya Ruiz',
  },
  {
    id: 'nextjs-produccion',
    title: 'Next.js: El framework de React para producción',
    instructors: 'Fernando Herrera · DevTalles',
    platform: 'Udemy',
    date: '2025-05-27',
    hours: 36.5,
    alt: 'Certificado de Udemy del curso de Next.js para producción',
  },
  {
    id: 'pmp-exam-prep',
    title: 'PMP Certification Exam Prep Course · 35 PDU Contact Hours',
    instructors: 'TIA Education · Andrew Ramdayal',
    platform: 'Udemy',
    date: '2025-05-27',
    hours: 35,
    alt: 'Certificado de Udemy del curso de preparación para el examen PMP, 35 horas de contacto PDU',
  },
  {
    id: 'ia-deep-learning',
    title: 'Inteligencia Artificial y Deep Learning desde cero en Python',
    instructors: 'Santiago Hernández',
    platform: 'Udemy',
    date: '2025-05-13',
    hours: 27,
    credentialId: 'UC-cd3ca6fb-98a0-496a-80fd-bf3f496933c4',
    image: `${DIR}/certificado-inteligencia-artificial-deep-learning-python-carlos-anaya-ruiz.webp`,
    width: 704,
    height: 508,
    alt: 'Certificado de Udemy del curso de inteligencia artificial y deep learning en Python, 27 horas, a nombre de Carlos Anaya Ruiz',
  },
  {
    id: 'javascript-total',
    title: 'JavaScript TOTAL · De Cero a Programador Web en 18 Días',
    instructors: 'Federico Garay · Escuela Directa',
    platform: 'Udemy',
    date: '2025-05-27',
    hours: 26.5,
    credentialId: 'UC-abf12e2a-096e-43eb-8392-51295714498e',
    image: `${DIR}/certificado-javascript-total-carlos-anaya-ruiz.webp`,
    width: 707,
    height: 508,
    alt: 'Certificado de Udemy del curso JavaScript TOTAL, 26.5 horas, a nombre de Carlos Anaya Ruiz',
  },
  {
    id: 'ia-negocios',
    title: 'Inteligencia Artificial aplicada a Negocios y Empresas',
    instructors: 'SuperDataScience Team · Juan Gabriel Gomila Salas',
    platform: 'Udemy',
    date: '2025-05-27',
    hours: 20.5,
    credentialId: 'UC-f2c98a99-73e5-410d-8683-f0b9884d9cfd',
    image: `${DIR}/certificado-inteligencia-artificial-negocios-empresas-carlos-anaya-ruiz.webp`,
    width: 1600,
    height: 1152,
    alt: 'Certificado de Udemy del curso de inteligencia artificial aplicada a negocios y empresas, 20.5 horas, a nombre de Carlos Anaya Ruiz',
  },
  {
    id: 'firebase-in-depth',
    title: 'Firebase In Depth',
    instructors: 'Angular University',
    platform: 'Udemy',
    date: '2025-05-27',
    hours: 10,
    credentialId: 'UC-9b9f517d-a436-463c-a414-3da8762c603a',
    image: `${DIR}/certificado-firebase-in-depth-carlos-anaya-ruiz.webp`,
    width: 1600,
    height: 1151,
    alt: 'Certificado de Udemy del curso Firebase In Depth de Angular University, 10 horas, a nombre de Carlos Anaya Ruiz',
  },
  {
    id: 'docker-devops',
    title: 'Docker for the Absolute Beginner · Hands On · DevOps',
    instructors: 'Mumshad Mannambeth · KodeKloud Training',
    platform: 'Udemy',
    date: '2025-05-27',
    hours: 4.5,
    credentialId: 'UC-f5ac9b26-fe71-4103-9d0d-6ed2929eeada',
    image: `${DIR}/certificado-docker-devops-carlos-anaya-ruiz.webp`,
    width: 705,
    height: 508,
    alt: 'Certificado de Udemy del curso de Docker y DevOps de KodeKloud, 4.5 horas, a nombre de Carlos Anaya Ruiz',
  },
  {
    id: 'scrum-practico',
    title: 'SCRUM Práctico en Proyectos de Software',
    instructors: 'Hector Bravo',
    platform: 'Udemy',
    date: '2025-05-27',
    hours: 4.5,
    alt: 'Certificado de Udemy del curso de SCRUM práctico en proyectos de software',
  },
]

/**
 * La URL pública de verificación de Udemy.
 *
 * Es lo que convierte la fila en una afirmación comprobable, que es lo que el
 * h1 de /certificaciones promete. Sin folio no hay enlace, y esa es la razón de
 * que devuelva `undefined` en vez de una URL a medias.
 */
export function courseVerifyUrl(course: Course): string | undefined {
  return course.credentialId
    ? `https://ude.my/${course.credentialId}`
    : undefined
}

/** Horas totales, contadas del dato. Nunca escritas a mano. */
export const COURSE_HOURS = COURSES.reduce((total, c) => total + c.hours, 0)

/** Cuántos traen folio, o sea cuántos se pueden verificar en línea. */
export const COURSES_VERIFIABLE = COURSES.filter((c) => c.credentialId).length

/** Los que tienen imagen del documento. */
export const COURSES_WITH_IMAGE = COURSES.filter((c) => c.image).length
