"use client"
import type React from "react"
import { useMemo } from "react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../../../../ux/select"
import { useGlobalFilter, useGlobal } from "../../../../../context/Global"

type SelectFiltersProps = {}

const SelectFilters: React.FC<SelectFiltersProps> = () => {
  const { filterValue, setPeriodoAcademico, setLineaDeInvestigacion } = useGlobalFilter()
  const { data } = useGlobal()

  // Extraer opciones únicas de los datos cargados
  const periodosAcademicos = useMemo(() => {
    const periodos = data.items.map((item) => item.periodoAcademico).filter(Boolean)
    return [...new Set(periodos)].sort()
  }, [data.items])

  const lineasDeInvestigacion = useMemo(() => {
    const lineas = data.items.map((item) => item.lineaDeInvestigacion).filter(Boolean)
    return [...new Set(lineas)].sort()
  }, [data.items])

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
        <Select value={filterValue.lineaDeInvestigacion || ""} onValueChange={handleLineaChange} width="200px">
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por línea" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos</SelectItem>
            {lineasDeInvestigacion.map((linea) => (
              <SelectItem key={linea} value={linea}>
                {linea}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  return (
    <div className="select-filters-container" style={{ display: "flex", gap: "12px", alignItems: "center" }}>
      <SelectPeriodo />
      <SelectLinea />
    </div>
  )
}

export default SelectFilters
