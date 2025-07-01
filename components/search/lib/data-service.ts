import { createSearchIndex } from "./search-index"
import type { SearchItem } from "./types"

// Create a singleton instance of the search index
const searchIndex = createSearchIndex()

// Sample data for demonstration and fallback - Carreras Universitarias
const sampleData: SearchItem[] = [
  // Ingeniería de Sistemas
  {
    id: "1",
    title: "Sistema de Gestión Académica para Universidades",
    carrera: "Ingeniería de Sistemas",
    tipo: "Tesis",
    autor: {
      nombre: "Carlos Rodríguez",
      cedula: "12345678",
      correo: "carlos.rodriguez@email.com",
    },
  },
  {
    id: "2",
    title: "Aplicación Móvil para Control de Inventarios",
    carrera: "Ingeniería de Sistemas",
    tipo: "Proyecto de Grado",
    autor: {
      nombre: "Ana García",
      cedula: "23456789",
      correo: "ana.garcia@email.com",
    },
  },
  {
    id: "3",
    title: "Inteligencia Artificial en el Diagnóstico Médico",
    carrera: "Ingeniería de Sistemas",
    tipo: "Investigación",
    autor: {
      nombre: "Miguel Torres",
      cedula: "34567890",
      correo: "miguel.torres@email.com",
    },
  },
  {
    id: "4",
    title: "Blockchain para Sistemas de Votación Electrónica",
    carrera: "Ingeniería de Sistemas",
    tipo: "Tesis",
    autor: {
      nombre: "Laura Mendoza",
      cedula: "45678901",
      correo: "laura.mendoza@email.com",
    },
  },
  {
    id: "5",
    title: "Desarrollo de API REST para E-commerce",
    carrera: "Ingeniería de Sistemas",
    tipo: "Proyecto de Grado",
    autor: {
      nombre: "David Silva",
      cedula: "56789012",
      correo: "david.silva@email.com",
    },
  },

  // Medicina
  {
    id: "6",
    title: "Efectos de la Telemedicina en Pacientes Rurales",
    carrera: "Medicina",
    tipo: "Tesis",
    autor: {
      nombre: "María Fernández",
      cedula: "67890123",
      correo: "maria.fernandez@email.com",
    },
  },
  {
    id: "7",
    title: "Prevalencia de Diabetes en Adultos Mayores",
    carrera: "Medicina",
    tipo: "Investigación",
    autor: {
      nombre: "José Martínez",
      cedula: "78901234",
      correo: "jose.martinez@email.com",
    },
  },
  {
    id: "8",
    title: "Nuevos Tratamientos para la Hipertensión Arterial",
    carrera: "Medicina",
    tipo: "Monografía",
    autor: {
      nombre: "Carmen López",
      cedula: "89012345",
      correo: "carmen.lopez@email.com",
    },
  },
  {
    id: "9",
    title: "Impacto del COVID-19 en la Salud Mental",
    carrera: "Medicina",
    tipo: "Investigación",
    autor: {
      nombre: "Roberto Díaz",
      cedula: "90123456",
      correo: "roberto.diaz@email.com",
    },
  },

  // Derecho
  {
    id: "10",
    title: "Marco Jurídico de la Protección de Datos Personales",
    carrera: "Derecho",
    tipo: "Tesis",
    autor: {
      nombre: "Patricia Ruiz",
      cedula: "01234567",
      correo: "patricia.ruiz@email.com",
    },
  },
  {
    id: "11",
    title: "Derechos Humanos en el Sistema Penitenciario",
    carrera: "Derecho",
    tipo: "Monografía",
    autor: {
      nombre: "Fernando Castro",
      cedula: "12340567",
      correo: "fernando.castro@email.com",
    },
  },
  {
    id: "12",
    title: "Análisis del Derecho Laboral en el Teletrabajo",
    carrera: "Derecho",
    tipo: "Ensayo",
    autor: {
      nombre: "Gabriela Moreno",
      cedula: "23450678",
      correo: "gabriela.moreno@email.com",
    },
  },
  {
    id: "13",
    title: "Justicia Restaurativa en Menores Infractores",
    carrera: "Derecho",
    tipo: "Tesis",
    autor: {
      nombre: "Andrés Vargas",
      cedula: "34560789",
      correo: "andres.vargas@email.com",
    },
  },

  // Psicología
  {
    id: "14",
    title: "Terapia Cognitivo-Conductual en Adolescentes",
    carrera: "Psicología",
    tipo: "Tesis",
    autor: {
      nombre: "Sofía Herrera",
      cedula: "45670890",
      correo: "sofia.herrera@email.com",
    },
  },
  {
    id: "15",
    title: "Impacto Psicológico del Bullying Escolar",
    carrera: "Psicología",
    tipo: "Investigación",
    autor: {
      nombre: "Ricardo Peña",
      cedula: "56780901",
      correo: "ricardo.pena@email.com",
    },
  },
  {
    id: "16",
    title: "Neuropsicología del Aprendizaje en Niños",
    carrera: "Psicología",
    tipo: "Monografía",
    autor: {
      nombre: "Valentina Jiménez",
      cedula: "67890012",
      correo: "valentina.jimenez@email.com",
    },
  },
  {
    id: "17",
    title: "Psicología Positiva en el Ambiente Laboral",
    carrera: "Psicología",
    tipo: "Proyecto de Grado",
    autor: {
      nombre: "Alejandro Ramos",
      cedula: "78900123",
      correo: "alejandro.ramos@email.com",
    },
  },

  // Administración de Empresas
  {
    id: "18",
    title: "Estrategias de Marketing Digital para PYMES",
    carrera: "Administración de Empresas",
    tipo: "Proyecto de Grado",
    autor: {
      nombre: "Isabella Cruz",
      cedula: "89010234",
      correo: "isabella.cruz@email.com",
    },
  },
  {
    id: "19",
    title: "Gestión del Talento Humano en la Era Digital",
    carrera: "Administración de Empresas",
    tipo: "Tesis",
    autor: {
      nombre: "Sebastián Ortiz",
      cedula: "90120345",
      correo: "sebastian.ortiz@email.com",
    },
  },
  {
    id: "20",
    title: "Análisis Financiero de Empresas Familiares",
    carrera: "Administración de Empresas",
    tipo: "Investigación",
    autor: {
      nombre: "Camila Vega",
      cedula: "01230456",
      correo: "camila.vega@email.com",
    },
  },
  {
    id: "21",
    title: "Responsabilidad Social Empresarial en Colombia",
    carrera: "Administración de Empresas",
    tipo: "Monografía",
    autor: {
      nombre: "Daniel Rojas",
      cedula: "12340567",
      correo: "daniel.rojas@email.com",
    },
  },

  // Arquitectura
  {
    id: "22",
    title: "Diseño Sostenible en Vivienda de Interés Social",
    carrera: "Arquitectura",
    tipo: "Tesis",
    autor: {
      nombre: "Natalia Guerrero",
      cedula: "23450678",
      correo: "natalia.guerrero@email.com",
    },
  },
  {
    id: "23",
    title: "Arquitectura Bioclimática en Zonas Tropicales",
    carrera: "Arquitectura",
    tipo: "Proyecto de Grado",
    autor: {
      nombre: "Julián Sánchez",
      cedula: "34560789",
      correo: "julian.sanchez@email.com",
    },
  },
  {
    id: "24",
    title: "Revitalización de Centros Históricos Urbanos",
    carrera: "Arquitectura",
    tipo: "Investigación",
    autor: {
      nombre: "Mariana Delgado",
      cedula: "45670890",
      correo: "mariana.delgado@email.com",
    },
  },

  // Contaduría Pública
  {
    id: "25",
    title: "Implementación de NIIF en Empresas Colombianas",
    carrera: "Contaduría Pública",
    tipo: "Tesis",
    autor: {
      nombre: "Esteban Molina",
      cedula: "56780901",
      correo: "esteban.molina@email.com",
    },
  },
  {
    id: "26",
    title: "Auditoría Forense en Casos de Corrupción",
    carrera: "Contaduría Pública",
    tipo: "Investigación",
    autor: {
      nombre: "Lucía Ramírez",
      cedula: "67890012",
      correo: "lucia.ramirez@email.com",
    },
  },
  {
    id: "27",
    title: "Control Interno en Entidades Públicas",
    carrera: "Contaduría Pública",
    tipo: "Monografía",
    autor: {
      nombre: "Mauricio Aguilar",
      cedula: "78900123",
      correo: "mauricio.aguilar@email.com",
    },
  },

  // Enfermería
  {
    id: "28",
    title: "Cuidados Paliativos en Pacientes Oncológicos",
    carrera: "Enfermería",
    tipo: "Tesis",
    autor: {
      nombre: "Andrea Castillo",
      cedula: "89010234",
      correo: "andrea.castillo@email.com",
    },
  },
  {
    id: "29",
    title: "Prevención de Infecciones Nosocomiales",
    carrera: "Enfermería",
    tipo: "Proyecto de Grado",
    autor: {
      nombre: "Carlos Medina",
      cedula: "90120345",
      correo: "carlos.medina@email.com",
    },
  },
  {
    id: "30",
    title: "Enfermería Comunitaria en Zonas Rurales",
    carrera: "Enfermería",
    tipo: "Investigación",
    autor: {
      nombre: "Diana Paredes",
      cedula: "01230456",
      correo: "diana.paredes@email.com",
    },
  },

  // Ingeniería Civil
  {
    id: "31",
    title: "Análisis Sísmico de Estructuras de Concreto",
    carrera: "Ingeniería Civil",
    tipo: "Tesis",
    autor: {
      nombre: "Felipe Navarro",
      cedula: "12340567",
      correo: "felipe.navarro@email.com",
    },
  },
  {
    id: "32",
    title: "Gestión de Recursos Hídricos Urbanos",
    carrera: "Ingeniería Civil",
    tipo: "Proyecto de Grado",
    autor: {
      nombre: "Paola Quintero",
      cedula: "23450678",
      correo: "paola.quintero@email.com",
    },
  },
  {
    id: "33",
    title: "Materiales Sostenibles en la Construcción",
    carrera: "Ingeniería Civil",
    tipo: "Investigación",
    autor: {
      nombre: "Rodrigo Espinoza",
      cedula: "34560789",
      correo: "rodrigo.espinoza@email.com",
    },
  },

  // Comunicación Social
  {
    id: "34",
    title: "Impacto de las Redes Sociales en la Opinión Pública",
    carrera: "Comunicación Social",
    tipo: "Tesis",
    autor: {
      nombre: "Alejandra Campos",
      cedula: "45670890",
      correo: "alejandra.campos@email.com",
    },
  },
  {
    id: "35",
    title: "Periodismo Digital y Fake News",
    carrera: "Comunicación Social",
    tipo: "Investigación",
    autor: {
      nombre: "Tomás Restrepo",
      cedula: "56780901",
      correo: "tomas.restrepo@email.com",
    },
  },

  // Más datos para completar 60+
  {
    id: "36",
    title: "Machine Learning en Sistemas de Recomendación",
    carrera: "Ingeniería de Sistemas",
    tipo: "Tesis",
    autor: {
      nombre: "Cristian Vargas",
      cedula: "67890012",
      correo: "cristian.vargas@email.com",
    },
  },
  {
    id: "37",
    title: "Ciberseguridad en Infraestructuras Críticas",
    carrera: "Ingeniería de Sistemas",
    tipo: "Investigación",
    autor: {
      nombre: "Melissa Gómez",
      cedula: "78900123",
      correo: "melissa.gomez@email.com",
    },
  },
  {
    id: "38",
    title: "Cardiología Preventiva en Jóvenes Deportistas",
    carrera: "Medicina",
    tipo: "Tesis",
    autor: {
      nombre: "Eduardo Salazar",
      cedula: "89010234",
      correo: "eduardo.salazar@email.com",
    },
  },
  {
    id: "39",
    title: "Medicina Personalizada y Genómica",
    carrera: "Medicina",
    tipo: "Investigación",
    autor: {
      nombre: "Valeria Osorio",
      cedula: "90120345",
      correo: "valeria.osorio@email.com",
    },
  },
  {
    id: "40",
    title: "Derecho Ambiental y Cambio Climático",
    carrera: "Derecho",
    tipo: "Tesis",
    autor: {
      nombre: "Nicolás Herrera",
      cedula: "01230456",
      correo: "nicolas.herrera@email.com",
    },
  },
  {
    id: "41",
    title: "Mediación Familiar en Conflictos de Custodia",
    carrera: "Derecho",
    tipo: "Monografía",
    autor: {
      nombre: "Stephanie Morales",
      cedula: "12340567",
      correo: "stephanie.morales@email.com",
    },
  },
  {
    id: "42",
    title: "Psicoterapia Grupal en Adicciones",
    carrera: "Psicología",
    tipo: "Tesis",
    autor: {
      nombre: "Mateo Cardona",
      cedula: "23450678",
      correo: "mateo.cardona@email.com",
    },
  },
  {
    id: "43",
    title: "Evaluación Neuropsicológica en Demencias",
    carrera: "Psicología",
    tipo: "Investigación",
    autor: {
      nombre: "Catalina Mejía",
      cedula: "34560789",
      correo: "catalina.mejia@email.com",
    },
  },
  {
    id: "44",
    title: "Transformación Digital en Empresas Tradicionales",
    carrera: "Administración de Empresas",
    tipo: "Tesis",
    autor: {
      nombre: "Santiago Ríos",
      cedula: "45670890",
      correo: "santiago.rios@email.com",
    },
  },
  {
    id: "45",
    title: "Emprendimiento Social y Economía Circular",
    carrera: "Administración de Empresas",
    tipo: "Proyecto de Grado",
    autor: {
      nombre: "Manuela Cortés",
      cedula: "56780901",
      correo: "manuela.cortes@email.com",
    },
  },
  {
    id: "46",
    title: "Arquitectura Paramétrica y Fabricación Digital",
    carrera: "Arquitectura",
    tipo: "Tesis",
    autor: {
      nombre: "Emilio Vargas",
      cedula: "67890012",
      correo: "emilio.vargas@email.com",
    },
  },
  {
    id: "47",
    title: "Espacios Públicos Inclusivos y Accesibles",
    carrera: "Arquitectura",
    tipo: "Proyecto de Grado",
    autor: {
      nombre: "Fernanda Leal",
      cedula: "78900123",
      correo: "fernanda.leal@email.com",
    },
  },
  {
    id: "48",
    title: "Contabilidad Ambiental en Empresas Mineras",
    carrera: "Contaduría Pública",
    tipo: "Tesis",
    autor: {
      nombre: "Germán Acosta",
      cedula: "89010234",
      correo: "german.acosta@email.com",
    },
  },
  {
    id: "49",
    title: "Costos ABC en Empresas de Servicios",
    carrera: "Contaduría Pública",
    tipo: "Investigación",
    autor: {
      nombre: "Lorena Pacheco",
      cedula: "90120345",
      correo: "lorena.pacheco@email.com",
    },
  },
  {
    id: "50",
    title: "Enfermería en Cuidados Intensivos Neonatales",
    carrera: "Enfermería",
    tipo: "Tesis",
    autor: {
      nombre: "Óscar Duarte",
      cedula: "01230456",
      correo: "oscar.duarte@email.com",
    },
  },
  {
    id: "51",
    title: "Promoción de la Salud en Comunidades Indígenas",
    carrera: "Enfermería",
    tipo: "Investigación",
    autor: {
      nombre: "Yuliana Zapata",
      cedula: "12340567",
      correo: "yuliana.zapata@email.com",
    },
  },
  {
    id: "52",
    title: "Puentes Colgantes con Materiales Compuestos",
    carrera: "Ingeniería Civil",
    tipo: "Tesis",
    autor: {
      nombre: "Iván Montoya",
      cedula: "23450678",
      correo: "ivan.montoya@email.com",
    },
  },
  {
    id: "53",
    title: "Pavimentos Permeables para Ciudades Sostenibles",
    carrera: "Ingeniería Civil",
    tipo: "Proyecto de Grado",
    autor: {
      nombre: "Ximena Cárdenas",
      cedula: "34560789",
      correo: "ximena.cardenas@email.com",
    },
  },
  {
    id: "54",
    title: "Comunicación Estratégica en Crisis Empresariales",
    carrera: "Comunicación Social",
    tipo: "Tesis",
    autor: {
      nombre: "Álvaro Pineda",
      cedula: "45670890",
      correo: "alvaro.pineda@email.com",
    },
  },
  {
    id: "55",
    title: "Narrativas Transmedia en el Entretenimiento",
    carrera: "Comunicación Social",
    tipo: "Investigación",
    autor: {
      nombre: "Beatriz Solano",
      cedula: "56780901",
      correo: "beatriz.solano@email.com",
    },
  },
  {
    id: "56",
    title: "Desarrollo de Videojuegos Educativos",
    carrera: "Ingeniería de Sistemas",
    tipo: "Proyecto de Grado",
    autor: {
      nombre: "Héctor Ramírez",
      cedula: "67890012",
      correo: "hector.ramirez@email.com",
    },
  },
  {
    id: "57",
    title: "Internet of Things en Smart Cities",
    carrera: "Ingeniería de Sistemas",
    tipo: "Investigación",
    autor: {
      nombre: "Ingrid Moreno",
      cedula: "78900123",
      correo: "ingrid.moreno@email.com",
    },
  },
  {
    id: "58",
    title: "Oncología Pediátrica y Calidad de Vida",
    carrera: "Medicina",
    tipo: "Tesis",
    autor: {
      nombre: "Jaime Castañeda",
      cedula: "89010234",
      correo: "jaime.castaneda@email.com",
    },
  },
  {
    id: "59",
    title: "Medicina Regenerativa con Células Madre",
    carrera: "Medicina",
    tipo: "Investigación",
    autor: {
      nombre: "Karina Velasco",
      cedula: "90120345",
      correo: "karina.velasco@email.com",
    },
  },
  {
    id: "60",
    title: "Derecho Digital y Protección del Consumidor",
    carrera: "Derecho",
    tipo: "Tesis",
    autor: {
      nombre: "Leonardo Garzón",
      cedula: "01230456",
      correo: "leonardo.garzon@email.com",
    },
  },
  {
    id: "61",
    title: "Psicología del Deporte en Atletas de Alto Rendimiento",
    carrera: "Psicología",
    tipo: "Tesis",
    autor: {
      nombre: "Mónica Herrera",
      cedula: "12340567",
      correo: "monica.herrera@email.com",
    },
  },
  {
    id: "62",
    title: "Gestión de la Innovación en Startups",
    carrera: "Administración de Empresas",
    tipo: "Investigación",
    autor: {
      nombre: "Nelson Ortega",
      cedula: "23450678",
      correo: "nelson.ortega@email.com",
    },
  },
  {
    id: "63",
    title: "Arquitectura Vernácula y Identidad Cultural",
    carrera: "Arquitectura",
    tipo: "Monografía",
    autor: {
      nombre: "Olga Pedraza",
      cedula: "34560789",
      correo: "olga.pedraza@email.com",
    },
  },
  {
    id: "64",
    title: "Auditoría de Sistemas de Información",
    carrera: "Contaduría Pública",
    tipo: "Proyecto de Grado",
    autor: {
      nombre: "Pablo Rincón",
      cedula: "45670890",
      correo: "pablo.rincon@email.com",
    },
  },
  {
    id: "65",
    title: "Enfermería Geriátrica y Envejecimiento Activo",
    carrera: "Enfermería",
    tipo: "Monografía",
    autor: {
      nombre: "Quira Mendoza",
      cedula: "56780901",
      correo: "quira.mendoza@email.com",
    },
  },
]

// Cache management
interface DataCache {
  data: SearchItem[]
  lastUpdated: Date
  source: "external" | "fallback"
}

let dataCache: DataCache | null = null

// Simulate external data source
async function fetchExternalData(): Promise<SearchItem[]> {
  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulate random success/failure (80% success rate for demo)
    if (Math.random() > 0.2) {
      // Simulate external data with some variations
      const externalData: SearchItem[] = [
        ...sampleData,
        {
          id: "ext-1",
          title: "Realidad Virtual en Educación Médica",
          carrera: "Medicina",
          tipo: "Tesis",
          autor: {
            nombre: "Ricardo Nuevo",
            cedula: "99999999",
            correo: "ricardo.nuevo@email.com",
          },
        },
        {
          id: "ext-2",
          title: "Blockchain en Contratos Inteligentes",
          carrera: "Derecho",
          tipo: "Investigación",
          autor: {
            nombre: "Sandra Innovadora",
            cedula: "88888888",
            correo: "sandra.innovadora@email.com",
          },
        },
        {
          id: "ext-3",
          title: "Arquitectura Regenerativa y Biomimética",
          carrera: "Arquitectura",
          tipo: "Proyecto de Grado",
          autor: {
            nombre: "Tomás Futuro",
            cedula: "77777777",
            correo: "tomas.futuro@email.com",
          },
        },
      ]

      console.log("✅ External data fetched successfully")
      return externalData
    } else {
      throw new Error("External API unavailable")
    }
  } catch (error) {
    console.error("❌ Failed to fetch external data:", error)
    throw error
  }
}

// Check if data needs refresh (daily at 1 AM)
function shouldRefreshData(): boolean {
  if (!dataCache) return true

  const now = new Date()
  const lastUpdate = dataCache.lastUpdated

  // Check if it's past 1 AM today and we haven't updated today
  const today1AM = new Date()
  today1AM.setHours(1, 0, 0, 0)

  // If current time is past 1 AM and last update was before today's 1 AM
  if (now >= today1AM && lastUpdate < today1AM) {
    return true
  }

  // If current time is before 1 AM, check if last update was before yesterday's 1 AM
  const yesterday1AM = new Date(today1AM)
  yesterday1AM.setDate(yesterday1AM.getDate() - 1)

  if (now < today1AM && lastUpdate < yesterday1AM) {
    return true
  }

  return false
}

// Get data with caching and fallback
export async function getSearchData(): Promise<{
  data: SearchItem[]
  source: "external" | "fallback"
  lastUpdated: Date
}> {
  // Return cached data if it's still fresh
  if (dataCache && !shouldRefreshData()) {
    console.log("📦 Using cached data from:", dataCache.source)
    return {
      data: dataCache.data,
      source: dataCache.source,
      lastUpdated: dataCache.lastUpdated,
    }
  }

  console.log("🔄 Refreshing data...")

  try {
    // Try to fetch external data
    const externalData = await fetchExternalData()

    dataCache = {
      data: externalData,
      lastUpdated: new Date(),
      source: "external",
    }

    console.log("✅ Data updated from external source")
  } catch (error) {
    console.warn("⚠️ External data fetch failed, using fallback data")

    // Use fallback data if external fetch fails
    dataCache = {
      data: sampleData,
      lastUpdated: new Date(),
      source: "fallback",
    }
  }

  return {
    data: dataCache.data,
    source: dataCache.source,
    lastUpdated: dataCache.lastUpdated,
  }
}

// Initialize search index with data
export async function initializeSearchIndex(): Promise<void> {
  const { data } = await getSearchData()
  searchIndex.clear()
  searchIndex.addItems(data)
  console.log(`🚀 Search index initialized with ${data.length} items`)
}

// Force refresh data (for manual updates or cron jobs)
export async function forceRefreshData(): Promise<{
  success: boolean
  source: "external" | "fallback"
  itemCount: number
}> {
  try {
    const externalData = await fetchExternalData()

    dataCache = {
      data: externalData,
      lastUpdated: new Date(),
      source: "external",
    }

    // Update search index
    searchIndex.clear()
    searchIndex.addItems(externalData)

    return {
      success: true,
      source: "external",
      itemCount: externalData.length,
    }
  } catch (error) {
    // Fallback to sample data
    dataCache = {
      data: sampleData,
      lastUpdated: new Date(),
      source: "fallback",
    }

    searchIndex.clear()
    searchIndex.addItems(sampleData)

    return {
      success: false,
      source: "fallback",
      itemCount: sampleData.length,
    }
  }
}

export function getSearchIndex() {
  return searchIndex
}

export function addItemToIndex(item: SearchItem) {
  searchIndex.addItem(item)
}

export function searchItems(query: string, options = {}) {
  return searchIndex.search(query, options)
}

export function getSuggestions(query: string) {
  return searchIndex.search(query, {
    limit: 5,
    fields: ["title", "carrera", "tipo"],
    boost: { title: 3, carrera: 2, tipo: 1 },
    prefix: true,
  })
}

// Reset search index to default data
export function resetSearchIndex() {
  searchIndex.clear()
  searchIndex.addItems(sampleData)
}

// Get cache info for debugging
export function getCacheInfo() {
  return dataCache
    ? {
        lastUpdated: dataCache.lastUpdated,
        source: dataCache.source,
        itemCount: dataCache.data.length,
        shouldRefresh: shouldRefreshData(),
      }
    : null
}
