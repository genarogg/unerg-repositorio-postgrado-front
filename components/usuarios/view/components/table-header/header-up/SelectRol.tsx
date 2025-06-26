"use client"

import type React from "react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../../../ux/select"
import { useGlobalStatic, type UserRole } from "../../../../context/Global"

const SelectRol: React.FC = () => {
  const { roles, configured, setConfigured } = useGlobalStatic()
  const userRole = configured.rolUser

  // Función auxiliar para verificar si un valor es un rol válido
  const isValidRole = (value: string): value is UserRole => {
    return value === "SUPER" || value === "ASISTENTE"
  }

  const handleRoleChange = (value: string | string[]) => {
    if (typeof value === "string" && isValidRole(value)) {
      setConfigured({
        ...configured,
        rolUser: value,
      })
    }
  }

  return (
    <div className="dev-user-role-select">
      <Select value={userRole} onValueChange={handleRoleChange}>
        <SelectTrigger>
          <SelectValue placeholder="Selecciona un rol" />
        </SelectTrigger>
        <SelectContent>
          {(Object.entries(roles) as Array<[keyof typeof roles, UserRole]>).map(([key, value]) => (
            <SelectItem key={key} value={value}>
              {key.charAt(0) + key.slice(1).toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default SelectRol
