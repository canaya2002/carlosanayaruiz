import { Locale } from './types'

export interface Experience {
  id: string
  company: string
  position: string
  location: string
  startDate: string
  endDate: string | null
  current: boolean
  description: string
  highlights: string[]
  technologies?: string[]
}

const experienceData: Record<Locale, Experience[]> = {
  es: [
    {
      id: 'amazon-sde',
      company: 'Amazon',
      position: 'Software Developer Engineer',
      location: 'Estados Unidos',
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
    {
      id: 'amazon-sde',
      company: 'Amazon',
      position: 'Software Developer Engineer',
      location: 'United States',
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
  return experienceData[locale] ?? experienceData.es
}
