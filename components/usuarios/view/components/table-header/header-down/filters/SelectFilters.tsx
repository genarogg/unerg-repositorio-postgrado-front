"use client"
import type React from "react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../../../../ux/select"
import { useGlobalStatic, useGlobalFilter } from "../../../../../context/Global"
import type { UserRole } from "../../../../../context/Global"

type SelectFiltersProps = {}

const SelectFilters: React.FC<SelectFiltersProps> = () => {
  const { filterValue, setRol } = useGlobalFilter()
  const { roles, badges } = useGlobalStatic()

  const handleRolChange = (value: string | string[]) => {
    const rolValue = Array.isArray(value) ? value[0] : value

    const isValidRole = (val: string): val is UserRole | "" => {
      return val === "" || val === "Todos" || Object.values(roles).includes(val as UserRole)
    }

    if (isValidRole(rolValue)) {
      const finalRolValue = rolValue === "" ? "" : (rolValue as UserRole | "")
      setRol(finalRolValue)
    }
  }

  const SelectRol = () => {
    return (
      <div className="table-role-filter-container">
        <Select value={filterValue.rol || ""} onValueChange={handleRolChange} width="170px">
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos</SelectItem>
            {(Object.entries(roles) as [keyof typeof roles, UserRole][]).map(([key, value]) => (
              <SelectItem key={key} value={value}>
                {badges.roles[key]?.name || value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  return (
    <div className="select-filters-container" style={{ display: "flex", gap: "12px", alignItems: "center" }}>
      <SelectRol />
    </div>
  )
}

export default SelectFilters
