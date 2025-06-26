"use client"

import { memo, useCallback, useMemo } from "react"
import { useGlobalStatic } from "../../../context/Global"

import "./actions-row.css"

import AggEditar from "../modals/AggEditar"
import ChangePasswordModal from "../modals/ChangePasswordModal"

// Componente para cambio de contraseña
const ChangePassword = memo(({ item }: { item: any }) => {
  return <ChangePasswordModal item={item} />
})

// Componente principal optimizado
const ActionsCell = memo(({ item }: any) => {
  // OPTIMIZACIÓN: Selectores más específicos para rowActions
  const rowActions = useGlobalStatic(useCallback((state) => state.configured.rowActions, []))

  // OPTIMIZACIÓN: Memoizar rowActions para evitar recálculos
  const availableActions = useMemo(() => {
    if (!rowActions) return { changePassword: false, edit: false }

    const actionMap = new Map(rowActions.map((action: any) => [action.name, true]))

    return {
      changePassword: actionMap.has("changePassword"),
      edit: actionMap.has("edit"),
    }
  }, [rowActions])

  return (
    <div className="actions-cell">
      <div className="action-buttons-container">
        {availableActions.changePassword && <ChangePassword item={item} />}
        {availableActions.edit && <AggEditar item={item} />}
      </div>
    </div>
  )
})

// Establecemos displayName para debugging
ActionsCell.displayName = "ActionsCell"
ChangePassword.displayName = "ChangePassword"

export default ActionsCell
