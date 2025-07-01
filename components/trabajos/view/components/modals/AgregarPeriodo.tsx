"use client"
import type React from "react"
import { useState, useCallback } from "react"
import { Calendar } from "lucide-react"
import Modal from "../../../../ux/modal"
import InputList from "../../../../ux/input-list"

interface InputListItem {
  text: string
  active: boolean
}

const AgregarPeriodo: React.FC = () => {
  const [periodos, setPeriodos] = useState<InputListItem[]>([
    { text: "2024-1", active: true },
    { text: "2024-2", active: true },
    { text: "2023-1", active: false },
    { text: "2023-2", active: true },
  ])

  const handlePeriodosChange = useCallback((newPeriodos: InputListItem[]) => {
    setPeriodos(newPeriodos)
  }, [])

  const handleSave = useCallback(() => {
    // Aquí puedes agregar la lógica para guardar los períodos
    console.log("Períodos guardados:", periodos)

    // Ejemplo de cómo podrías enviar los datos a una API
    // const activePeriodos = periodos.filter(p => p.active)
    // await savePeriodos(activePeriodos)
  }, [periodos])

  const modalProps = {
    title: "Agregar Periodo",
    icon: <Calendar size={16} />,
    buttonClassName: "table-modal-btn periodo-btn",
    buttonText: "Guardar Períodos",
    onclick: handleSave,
    cancel: true,
    lazy: true,
  }

  return (
    <Modal {...modalProps}>
      <div className="agregar-periodo-container">
        <InputList
          title="Períodos Académicos"
          placeholder="Ej: 2024-1, 2025-1..."
          items={periodos}
          onChange={handlePeriodosChange}
          maxItems={20}
          emptyMessage="No hay períodos académicos agregados."
          allowEdit={true}
          showActiveToggle={true}
        />

        <div
          style={{
            marginTop: "16px",
            padding: "12px",
            backgroundColor: "#f0f9ff",
            borderRadius: "6px",
            fontSize: "14px",
            color: "#0369a1",
          }}
        >
          <strong>Nota:</strong> Los períodos marcados como activos aparecerán en los filtros de búsqueda.
        </div>
      </div>
    </Modal>
  )
}

export default AgregarPeriodo
