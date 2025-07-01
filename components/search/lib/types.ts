export interface SearchItem {
  id: string
  title: string
  carrera?: string
  tipo?: string
  autor?: {
    nombre: string
    cedula: string
    correo: string
  }
  [key: string]: any
}

export interface SearchIndex {
  items: SearchItem[]
  addItem: (item: SearchItem) => void
  addItems: (items: SearchItem[]) => void
  search: (query: string, options?: SearchOptions) => SearchItem[]
  getItem: (id: string) => SearchItem | undefined
  removeItem: (id: string) => void
  clear: () => void
}

export interface SearchOptions {
  limit?: number
  fields?: string[]
  boost?: Record<string, number>
  fuzzy?: boolean | number
  prefix?: boolean
}
