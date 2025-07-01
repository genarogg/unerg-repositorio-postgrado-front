export interface SearchItem {
  id: number
  titulo: string
  autor: string
  estado: "VALIDADO" | "PENDIENTE" | "RECHAZADO"
  doc: string
  resumen: string
  lineaDeInvestigacion: {
    id: number
    nombre: string
    estado: boolean
  }
  periodoAcademico: {
    id: number
    periodo: string
  }
  
}

export interface BackendSearchResponse {
  success: boolean
  message: string
  data: {
    trabajos: SearchItem[]
  }
}

export interface SearchIndex {
  items: SearchItem[]
  addItem: (item: SearchItem) => void
  addItems: (items: SearchItem[]) => void
  search: (query: string, options?: SearchOptions) => SearchItem[]
  getItem: (id: number) => SearchItem | undefined
  removeItem: (id: number) => void
  clear: () => void
}

export interface SearchOptions {
  limit?: number
  fields?: string[]
  boost?: Record<string, number>
  fuzzy?: boolean | number
  prefix?: boolean
}
