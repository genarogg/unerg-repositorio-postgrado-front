"use client"
import type React from "react"
import { useMemo, useEffect, useState } from "react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../../../../ux/select"
import { useGlobalFilter, useGlobal } from "../../../../../context/Global"

type SelectFiltersProps = {}

interface LineaInvestigacion {
  id: number
  nombre: string
  estado: boolean
}

interface ApiResponse {
  type: string
  message: string
  data: LineaInvestigacion[]
}

const SelectFilters: React.FC<SelectFiltersProps> = () => {
  const { filterValue, setPeriodoAcademico, setLineaDeInvestigacion } = useGlobalFilter()
  const { data } = useGlobal()
  const [lineasDeInvestigacion, setLineasDeInvestigacion] = useState<LineaInvestigacion[]>([])
  const [loading, setLoading] = useState(false)

  // Extraer opciones únicas de los datos cargados
  const periodosAcademicos = useMemo(() => {
    const periodos = data.items.map((item) => item.periodoAcademico).filter(Boolean)
    return [...new Set(periodos)].sort()
  }, [data.items])

  // Fetch líneas de investigación
  useEffect(() => {
    const fetchLineasDeInvestigacion = async () => {
      setLoading(true)
      try {
        const response = await fetch('http://localhost:4000/lineas-de-investigacion/get-all')
        if (!response.ok) {
          throw new Error('Error al obtener líneas de investigación')
        }
        const response2 = await response.json()
        
        console.log("Respuesta del servidor:", response2)
        
        // Extraer el array de datos de la respuesta
        const lineasData = response2.data
        
        // Validar que lineasData sea un array
        if (!Array.isArray(lineasData)) {
          console.error('Los datos no son un array:', lineasData)
          setLineasDeInvestigacion([])
          return
        }
        
        console.log("Array de líneas:", lineasData)
        
        // Filtrar solo las líneas activas y ordenar por nombre
        const lineasActivas = lineasData
          .filter((linea: LineaInvestigacion) => linea && linea.estado === true)
          .sort((a: LineaInvestigacion, b: LineaInvestigacion) => a.nombre.localeCompare(b.nombre))
        
        setLineasDeInvestigacion(lineasActivas)
        console.log("Líneas activas filtradas:", lineasActivas)
      } catch (error) {
        console.error('Error al cargar líneas de investigación:', error)
        setLineasDeInvestigacion([])
      } finally {
        setLoading(false)
      }
    }

    fetchLineasDeInvestigacion()
  }, [])

  const handlePeriodoChange = (value: string | string[]) => {
    const periodoValue = Array.isArray(value) ? value[0] : value
    const finalValue = periodoValue === "Todos" ? "" : periodoValue
    setPeriodoAcademico(finalValue)
  }

  const handleLineaChange = (value: string | string[]) => {
    const lineaValue = Array.isArray(value) ? value[0] : value
    const finalValue = lineaValue === "Todos" ? "" : lineaValue
    setLineaDeInvestigacion(finalValue)
  }

  const SelectPeriodo = () => {
    return (
      <div className="table-periodo-filter-container">
        <Select value={filterValue.periodoAcademico || ""} onValueChange={handlePeriodoChange} width="170px">
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos</SelectItem>
            {periodosAcademicos.map((periodo) => (
              <SelectItem key={periodo} value={periodo}>
                {periodo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  const SelectLinea = () => {
    return (
      <div className="table-linea-filter-container">
        <Select 
          value={filterValue.lineaDeInvestigacion || ""} 
          onValueChange={handleLineaChange} 
          width="350px"

        >
          <SelectTrigger>
            <SelectValue placeholder={loading ? "Cargando..." : "Filtrar por línea"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos</SelectItem>
            {lineasDeInvestigacion.map((linea) => (
              <SelectItem key={linea.id} value={linea.id.toString()}>
                {linea.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  return (
    <div className="select-filters-container" style={{ display: "flex", gap: "12px", alignItems: "center" }}>
      {/* <SelectPeriodo /> */}
      {/* <SelectLinea /> */}
    </div>
  )
}

export default SelectFilters