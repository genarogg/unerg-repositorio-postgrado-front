"use client"

import { memo, useCallback, useMemo } from "react"
import { FileText } from "lucide-react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../../ux/select"
import { useGlobal, useGlobalStatic } from "../../../context/Global"

import "./actions-row.css"

import AggEditar from "../modals/AggEditar"
import ViewDetails from "../modals/ViewDatails"

// Componente para visualizar PDF
const VisualizarPDF = memo(({ item }: { item: any }) => {
  const handleViewPDF = useCallback(() => {
    if (item.pdfUrl) {
      // Aquí podrías abrir el PDF en una nueva ventana o modal
      window.open(`/pdfs/${item.pdfUrl}`, "_blank")
    } else {
      console.log("No hay PDF disponible para este trabajo")
    }
  }, [item.pdfUrl])

  return (
    <button title="Ver documento PDF" className="action-btn" onClick={handleViewPDF}>
      <FileText size={16} />
    </button>
  )
})

const ChangeEstado = memo(({ item, estados, onEstadoChange }: any) => {
  // Memoizamos las opciones del select con los estados correctos
  const estadoOptions = useMemo(
    () => [
      <SelectItem key="PENDIENTE" value="PENDIENTE">
        PENDIENTE
      </SelectItem>,
      <SelectItem key="VALIDADO" value="VALIDADO">
        VALIDADO
      </SelectItem>,
      <SelectItem key="RECHAZADO" value="RECHAZADO">
        RECHAZADO
      </SelectItem>,
    ],
    [],
  )

  return (
    <Select width={"140px"} value={item.estado} onValueChange={onEstadoChange}>
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
  const estados = useGlobalStatic(useCallback((state) => state.badges.estados, []))
  const rowActions = useGlobalStatic(useCallback((state) => state.configured.rowActions, []))

  // OPTIMIZACIÓN: Memoizar rowActions para evitar recálculos
  const availableActions = useMemo(() => {
    if (!rowActions) return { changeEstado: false, doc: false, edit: false, view: false }

    const actionMap = new Map(rowActions.map((action: any) => [action.name, true]))

    return {
      changeEstado: actionMap.has("changeEstado"),
      doc: actionMap.has("doc"),
      edit: actionMap.has("edit"),
      view: actionMap.has("view"),
    }
  }, [rowActions])

  // Memoizamos el handler para evitar re-creaciones
  const handleEstadoChange = useCallback(
    (value: any) => {
      const newEstado = Array.isArray(value) ? value[0] : value
      updateItem(item.id, { estado: newEstado })
    },
    [item.id, updateItem],
  )

  return (
    <div className="actions-cell">
      {availableActions.changeEstado && (
        <ChangeEstado item={item} estados={estados} onEstadoChange={handleEstadoChange} />
      )}
      <div className="action-buttons-container">
        {availableActions.doc && <VisualizarPDF item={item} />}
        {availableActions.edit && <AggEditar item={item} />}
        {availableActions.view && <ViewDetails item={item} />}
      </div>
    </div>
  )
})

// Establecemos displayName para debugging
ActionsCell.displayName = "ActionsCell"
ChangeEstado.displayName = "ChangeEstado"
VisualizarPDF.displayName = "VisualizarPDF"

export default ActionsCell
