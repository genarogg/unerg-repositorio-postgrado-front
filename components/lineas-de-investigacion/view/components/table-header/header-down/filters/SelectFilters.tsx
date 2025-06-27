"use client"
import type React from "react"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "../../../../../../ux/select"
import { useGlobalStatic, useGlobalFilter } from "../../../../../context/Global"
import type { UserRole, UserStatus } from "../../../../../context/Global"

type SelectFiltersProps = {}

const SelectFilters: React.FC<SelectFiltersProps> = () => {
    const { filterValue, setRol, setEstado } = useGlobalFilter()
    const { roles, estados, badges } = useGlobalStatic()

    const handleRolChange = (value: string | string[]) => {
        const rolValue = Array.isArray(value) ? value[0] : value
        
        // Type guard para asegurar que el valor es válido
        const isValidRole = (val: string): val is UserRole | "" => {
            return val === "" || val === "Todos" || Object.values(roles).includes(val as UserRole)
        }
        
        if (isValidRole(rolValue)) {
            const finalRolValue = rolValue === "Todos" ? "" : (rolValue as UserRole | "")
            setRol(finalRolValue)
        }
    }

    const handleEstadoChange = (value: string | string[]) => {
        const estadoValue = Array.isArray(value) ? value[0] : value
        
        // Type guard para asegurar que el valor es válido
        const isValidStatus = (val: string): val is UserStatus | "" => {
            return val === "" || val === "Todos" || Object.values(estados).includes(val as UserStatus)
        }
        
        if (isValidStatus(estadoValue)) {
            const finalEstadoValue = estadoValue === "Todos" ? "" : (estadoValue as UserStatus | "")
            setEstado(finalEstadoValue)
        }
    }

    const SelectRol = () => {
        return (
            <div className="table-role-filter-container">
                <Select 
                    value={filterValue.rol || ""} 
                    onValueChange={handleRolChange} 
                    width="170px"
                >
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

    const SelectEstado = () => {
        return (
            <div className="table-status-filter-container">
                <Select 
                    value={filterValue.estado || ""} 
                    onValueChange={handleEstadoChange} 
                    width="170px"
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Filtrar por estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Todos">Todos</SelectItem>
                        {(Object.entries(estados) as [keyof typeof estados, UserStatus][]).map(([key, value]) => (
                            <SelectItem key={key} value={value}>
                                {badges.estados[key]?.name || value}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        )
    }

    return (
        <div 
            className="select-filters-container" 
            style={{ display: "flex", gap: "12px", alignItems: "center" }}
        >
            <SelectEstado />
            <SelectRol />
        </div>
    )
}

export default SelectFilters
