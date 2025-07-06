"use client"

import { memo, useCallback, useMemo, useState } from "react"
import { FileText } from "lucide-react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../../ux/select"
import { useGlobal, useGlobalStatic } from "../../../context/Global"

import "./actions-row.css"

import AggEditar from "../modals/AggEditar"
import ViewDetails from "../modals/ViewDatails"

// Interface para las respuestas del backend
interface ApiResponse {
  type: "success" | "error"
  message: string
  data?: any
}

// Memoizamos los componentes internos para evitar re-creaciones
const DescargarReporte = memo(({ itemId }: { itemId: number }) => {
  const handleDownload = useCallback(() => {
    console.log("Descargar reporte", itemId)
  }, [itemId])

  return (
    <button title="Descargar reporte" className="action-btn" onClick={handleDownload}>
      <FileText size={16} />
    </button>
  )
})

const ChangeRol = memo(({ item, roles, onRoleChange }: any) => {
  // Memoizamos las opciones del select
  const roleOptions = useMemo(
    () =>
      Object.entries(roles).map(([key]) => (
        <SelectItem key={key} value={key}>
          {key}
        </SelectItem>
      )),
    [roles],
  )

  return (
    <Select width={"140px"} value={item.rol} onValueChange={onRoleChange}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>{roleOptions}</SelectContent>
    </Select>
  )
})

// Componente para cambiar estado con integración al backend
const ChangeEstado = memo(({ item, estados, onEstadoChange }: any) => {
  const [isUpdating, setIsUpdating] = useState(false)

  // Memoizamos las opciones del select
  const estadoOptions = useMemo(
    () =>
      Object.entries(estados).map(([key]) => (
        <SelectItem key={key} value={key}>
          {key}
        </SelectItem>
      )),
    [estados],
  )

  return (
    <Select width={"140px"} value={item.estado} onValueChange={onEstadoChange} >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>{estadoOptions}</SelectContent>
    </Select>
  )
})

// Componente principal optimizado
const ActionsCell = memo(({ item }: any) => {
  // OPTIMIZACIÓN CRÍTICA: Selector más específico para evitar re-renders
  const updateItem = useGlobal(useCallback((state) => state.updateItem, []))

  // OPTIMIZACIÓN: Selectores más específicos para badges y rowActions
  const roles = useGlobalStatic(useCallback((state) => state.badges.roles, []))
  const estados = useGlobalStatic(useCallback((state) => state.badges.estados, []))
  const rowActions = useGlobalStatic(useCallback((state) => state.configured.rowActions, []))

  // Estado para manejar loading de peticiones
  const [isUpdatingEstado, setIsUpdatingEstado] = useState(false)

  // OPTIMIZACIÓN: Memoizar rowActions para evitar recálculos
  const availableActions = useMemo(() => {
    if (!rowActions) return { changeRol: false, view: false, report: false, edit: false, changeEstado: false }

    const actionMap = new Map(rowActions.map((action: any) => [action.name, true]))

    return {
      changeRol: actionMap.has("changeRol"),
      view: actionMap.has("view"),
      report: actionMap.has("report"),
      edit: actionMap.has("edit"),
      changeEstado: actionMap.has("changeEstado"),
    }
  }, [rowActions])

  // Función para hacer peticiones al backend
  const makeApiRequest = useCallback(async (url: string, data: any): Promise<ApiResponse> => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result: ApiResponse = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Error en la petición")
      }

      return result
    } catch (error) {
      console.error("Error en la petición:", error)
      throw error
    }
  }, [])

  // Memoizamos el handler para evitar re-creaciones
  const handleRoleChange = useCallback(
    (value: any) => {
      const newRole = Array.isArray(value) ? value[0] : value
      updateItem(item.id, { rol: newRole })
    },
    [item.id, updateItem],
  )

  // Handler mejorado para cambio de estado con integración al backend
  const handleEstadoChange = useCallback(
    async (value: any) => {
      const newEstado = Array.isArray(value) ? value[0] : value

      // Prevenir cambios si ya está actualizando
      if (isUpdatingEstado) {
        return
      }

      setIsUpdatingEstado(true)

      try {
        // Simular token (en una aplicación real, esto vendría del contexto de autenticación)
        const token = localStorage.getItem("auth_token") || ""

        if (!token) {
          alert("Error: No se encontró el token de autenticación")
          return
        }

        // Preparar datos para el backend
        const updateData = {
          token,
          id: item.id,
          estado: newEstado === "ACTIVO", // Convertir a boolean para el backend
        }

        // Hacer petición al backend
        const result = await makeApiRequest("http://localhost:4000/lineas-de-investigacion/update", updateData)

        if (result.type === "success") {
          // Solo actualizar el estado local si la petición fue exitosa
          updateItem(item.id, { estado: newEstado })

          // Opcional: Mostrar mensaje de éxito (puedes comentar esta línea si no quieres el alert)
          // alert(`Estado actualizado a ${newEstado} exitosamente`)
        } else {
          // Mostrar error del servidor
          alert(`Error al actualizar estado: ${result.message}`)
        }
      } catch (error: any) {
        console.error("Error al actualizar estado:", error)
        alert(`Error al actualizar el estado: ${error.message}`)
      } finally {
        setIsUpdatingEstado(false)
      }
    },
    [item.id, updateItem, isUpdatingEstado, makeApiRequest],
  )

  return (
    <div className="actions-cell">
      {availableActions.changeRol && <ChangeRol item={item} roles={roles} onRoleChange={handleRoleChange} />}
      {availableActions.changeEstado && (
        <div style={{ position: "relative" }}>
          <ChangeEstado item={item} estados={estados} onEstadoChange={handleEstadoChange} />
          {/* Indicador visual de loading */}
          {isUpdatingEstado && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                right: "8px",
                transform: "translateY(-50%)",
                width: "12px",
                height: "12px",
                border: "2px solid #f3f3f3",
                borderTop: "2px solid #3498db",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                pointerEvents: "none",
                zIndex: 10,
              }}
            />
          )}
        </div>
      )}
      <div className="action-buttons-container">
        {availableActions.view && <ViewDetails item={item} />}
        {availableActions.report && <DescargarReporte itemId={item.id} />}
        {availableActions.edit && <AggEditar item={item} />}
      </div>
    </div>
  )
})

// Establecemos displayName para debugging
ActionsCell.displayName = "ActionsCell"
ChangeRol.displayName = "ChangeRol"
DescargarReporte.displayName = "DescargarReporte"
ChangeEstado.displayName = "ChangeEstado"

export default ActionsCell
