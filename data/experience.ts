import { forLocale, type Localized, type Locale, type YearMonth } from './types'

/** Stable, locale-independent keys. Used as React keys and schema identifiers. */
export type ExperienceId =
  | 'solis-tech'
  | 'amazon-sde'
  | 'pmp-master'
  | 'wanhai-it'

/** ISO 3166-1 alpha-2 for the countries in this record. */
export type WorkCountry = 'MX' | 'US'

/**
 * A role is either finished (it has an end date and is not current) or ongoing
 * (no end date, and current). Modelling it as a union makes the third,
 * contradictory state — `current: true` next to a filled `endDate` — impossible
 * to write, which is the kind of inconsistency that leaks straight into JSON-LD.
 */
export type EmploymentPeriod =
  | { startDate: YearMonth; endDate: YearMonth; current: false }
  | { startDate: YearMonth; endDate: null; current: true }

interface ExperienceRecord {
  id: ExperienceId
  company: string
  position: string
  /** Localised display label for the place of work. */
  location: string
  /** Locale-independent country, for schema and filtering. */
  country: WorkCountry
  description: string
  highlights: string[]
  technologies?: string[]
}

export type Experience = ExperienceRecord & EmploymentPeriod

const experienceData: Localized<Experience[]> = {
  es: [
    /* EL PUESTO ACTUAL. Cierra el hueco de quince meses que la cinta de
       trayectoria dibujaba desde abr 2025 — y que el instrumento mostraba tal
       cual porque no puede mentir.

       Es el PRIMER registro con `current: true` del archivo, así que es el
       primero que ejercita la rama `endDate: null` de `EmploymentPeriod` y el
       `endDate ?? hoy` del tramo de /cv y /sobre-mi.

       ⚠ DOS COSAS QUE FALTAN Y NO SE INVENTAN:
       · `highlights` está vacío a propósito. El dueño dio el puesto, la firma y
         las fechas; nada más. Un logro escrito por mí aquí sería exactamente la
         clase de afirmación sin respaldo que este repo quita. La lista se pinta
         solo si tiene elementos (`highlights.length > 0` en /cv y /sobre-mi),
         así que vacío no deja hueco.
       · El puesto es HÍBRIDO en Estados Unidos, confirmado por el dueño, así
         que `country` es US. Eso mueve el registro de México a Estados Unidos
         en el mapa de presencia y en el JSON-LD, y le quita el pin de CDMX que
         tuvo un momento. */
    {
      id: 'solis-tech',
      company: 'Law Offices of Manuel Solis',
      position: 'Director de Tecnologías',
      location: 'Estados Unidos (híbrido)',
      country: 'US',
      startDate: '2025-06',
      endDate: null,
      current: true,
      description:
        'Dirección del área de tecnología de la firma: arquitectura de los sistemas internos, plataforma web y automatización de procesos.',
      highlights: [],
    },
    {
      id: 'amazon-sde',
      company: 'Amazon',
      /* El título va como lo dictó el dueño, que lo confirmó dos veces. La
         forma canónica de Amazon es «Software Development Engineer II» —de ahí
         la abreviatura SDE 2— y así estuvo escrito un momento; se revirtió a
         petición suya. Es su CV. */
      position: 'Software Developer Engineer 2',
      location: 'Estados Unidos',
      country: 'US',
      startDate: '2023-11',
      endDate: '2025-04',
      current: false,
      description: 'Desarrollo de software a escala, analítica de datos y automatización de procesos logísticos en entornos de alta disponibilidad.',
      highlights: [
        'Optimicé procesos logísticos usando Python (Pandas, Scikit-learn) para ETL y modelos predictivos de demanda e inventario',
        'Desarrollé un sistema de BI en Power BI con esquema de estrella y consultas DAX complejas, integrando fuentes vía SQL y APIs REST',
        'Lideré proyectos comerciales como Product Owner bajo Agile-Scrum, gestionando backlog y Sprints en Jira',
        'Supervisé la implementación técnica de sistemas de trazabilidad (HACCP, ISO 22000)',
      ],
      technologies: ['Python', 'Pandas', 'Scikit-learn', 'Power BI', 'DAX', 'SQL', 'APIs REST', 'Jira', 'Scrum'],
    },
    {
      id: 'pmp-master',
      company: 'Master Loyalty Group',
      position: 'PMP – Project Manager',
      location: 'México',
      country: 'MX',
      startDate: '2022-09',
      endDate: '2023-08',
      current: false,
      description: 'Gestión de proyectos B2B de software aplicando PMBOK para planificación, ejecución y control.',
      highlights: [
        'Gestioné 5 proyectos B2B (hasta $50,000 USD) con WBS, Risk Register, MS Project y técnicas EVM',
        'Lideré equipos de desarrollo (.NET Core, Angular, RxJS) y QA (Selenium)',
        'Implementé dashboards en Power BI con DirectQuery a Azure DevOps y SQL Server',
      ],
      technologies: ['.NET Core', 'Angular', 'RxJS', 'Selenium', 'Power BI', 'Azure DevOps', 'SQL Server', 'MS Project'],
    },
    {
      id: 'wanhai-it',
      company: 'Wan Hai Lines',
      position: 'IT Manager',
      location: 'México',
      country: 'MX',
      startDate: '2021-02',
      endDate: '2022-08',
      current: false,
      description: 'Dirección del área de TI a nivel nacional, integración de sistemas y gestión de infraestructura.',
      highlights: [
        'Dirigí integración de sistemas EDI (ANSI X12) con SAP S/4HANA mediante IDocs',
        'Construí pipelines CI/CD con Jenkinsfiles (Groovy) para aplicaciones .NET',
        'Administré infraestructura de red (Cisco Catalyst, VLANs, ACLs) y seguridad (FortiGate, VPNs IPsec)',
      ],
      technologies: ['SAP S/4HANA', 'EDI', 'Jenkins', '.NET', 'Cisco', 'FortiGate', 'Groovy'],
    },
  ],
  en: [
    /* See the Spanish entry for why `highlights` is empty and why `country` is
       US. Both halves must stay in sync: the two locales are compared by index
       in several places. */
    {
      id: 'solis-tech',
      company: 'Law Offices of Manuel Solis',
      position: 'Director of Technology',
      location: 'United States (hybrid)',
      country: 'US',
      startDate: '2025-06',
      endDate: null,
      current: true,
      description:
        "Head of the firm's technology function: architecture of the internal systems, the web platform, and process automation.",
      highlights: [],
    },
    {
      id: 'amazon-sde',
      company: 'Amazon',
      position: 'Software Developer Engineer 2',
      location: 'United States',
      country: 'US',
      startDate: '2023-11',
      endDate: '2025-04',
      current: false,
      description: 'Software development at scale, data analytics, and logistics process automation in high-availability environments.',
      highlights: [
        'Optimized logistics processes using Python (Pandas, Scikit-learn) for ETL and predictive demand/inventory models',
        'Built a BI system in Power BI with star schema and complex DAX queries, integrating sources via SQL and REST APIs',
        'Led commercial projects as Product Owner under Agile-Scrum, managing backlog and Sprints in Jira',
        'Oversaw technical implementation of traceability systems (HACCP, ISO 22000)',
      ],
      technologies: ['Python', 'Pandas', 'Scikit-learn', 'Power BI', 'DAX', 'SQL', 'REST APIs', 'Jira', 'Scrum'],
    },
    {
      id: 'pmp-master',
      company: 'Master Loyalty Group',
      position: 'PMP – Project Manager',
      location: 'Mexico',
      country: 'MX',
      startDate: '2022-09',
      endDate: '2023-08',
      current: false,
      description: 'B2B software project management applying PMBOK for planning, execution, and control.',
      highlights: [
        'Managed 5 B2B projects (up to $50,000 USD) with WBS, Risk Register, MS Project and EVM techniques',
        'Led development teams (.NET Core, Angular, RxJS) and QA (Selenium)',
        'Implemented Power BI dashboards with DirectQuery to Azure DevOps and SQL Server',
      ],
      technologies: ['.NET Core', 'Angular', 'RxJS', 'Selenium', 'Power BI', 'Azure DevOps', 'SQL Server', 'MS Project'],
    },
    {
      id: 'wanhai-it',
      company: 'Wan Hai Lines',
      position: 'IT Manager',
      location: 'Mexico',
      country: 'MX',
      startDate: '2021-02',
      endDate: '2022-08',
      current: false,
      description: 'National IT leadership, systems integration, and infrastructure management.',
      highlights: [
        'Led EDI systems integration (ANSI X12) with SAP S/4HANA via IDocs mapping',
        'Built CI/CD pipelines with Jenkinsfiles (Groovy) for .NET applications',
        'Managed network infrastructure (Cisco Catalyst, VLANs, ACLs) and security (FortiGate, IPsec VPNs)',
      ],
      technologies: ['SAP S/4HANA', 'EDI', 'Jenkins', '.NET', 'Cisco', 'FortiGate', 'Groovy'],
    },
  ],
}

export function getExperiences(locale: Locale): Experience[] {
  return forLocale(experienceData, locale)
}
