"use client"
import type React from "react"
import { useState, useCallback, useEffect, useRef } from "react"
import { Calendar, AlertCircle, CheckCircle } from "lucide-react"
import Modal from "../../../../ux/modal"
import InputList from "../../../../ux/input-list"

interface InputListItem {
  text: string
  active: boolean
  id?: number // ID para períodos existentes
}

interface PeriodoAcademico {
  id: number
  periodo: string
  createdAt?: string
  updatedAt?: string
}

interface ApiResponse {
  type: "success" | "error"
  message: string
  data?: {
    periodos: PeriodoAcademico[]
    total?: number
  }
}

const AgregarPeriodo: React.FC = () => {
  const [periodos, setPeriodos] = useState<InputListItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [shouldCloseModal, setShouldCloseModal] = useState(false) // ✨ Estado para controlar el cierre

  // Cargar períodos existentes al montar el componente
  useEffect(() => {
    loadExistingPeriodos()
  }, [])

  const loadExistingPeriodos = async () => {
    try {
      setIsLoadingData(true)
      setLoadError(null)

      console.log("📥 Cargando períodos académicos desde el servidor...")

      const response = await fetch("https://repositorio.unerg.tech/periodo/get-all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("📊 Respuesta del servidor:", response.status)

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status} ${response.statusText}`)
      }

      const data: ApiResponse = await response.json()
      console.log("📋 Datos recibidos:", data)

      if (data.type === "success" && data.data?.periodos) {
        const periodosFormateados = data.data.periodos.map((periodo) => ({
          text: periodo.periodo,
          active: true, // Siempre activo ya que no usamos toggle
          id: periodo.id,
        }))

        setPeriodos(periodosFormateados)

        console.log(`✅ ${periodosFormateados.length} períodos cargados exitosamente:`, periodosFormateados)

        if (data.data.total !== undefined) {
          console.log(`📊 Total de períodos en BD: ${data.data.total}`)
        }
      } else if (data.type === "success" && (!data.data?.periodos || data.data.periodos.length === 0)) {
        // Caso cuando no hay períodos pero la respuesta es exitosa
        setPeriodos([])
        console.log("📝 No hay períodos académicos registrados")
      } else {
        // Caso cuando hay un error en la respuesta
        throw new Error(data.message || "Formato de respuesta inválido")
      }
    } catch (error) {
      console.error("❌ Error al cargar períodos académicos:", error)

      const errorMessage = error instanceof Error ? error.message : "Error desconocido al cargar períodos"
      setLoadError(errorMessage)

      // En caso de error, mantener períodos existentes si los hay
      if (periodos.length === 0) {
        setPeriodos([])
      }
    } finally {
      setIsLoadingData(false)
    }
  }

  const handlePeriodosChange = useCallback((newPeriodos: InputListItem[]) => {
    setPeriodos(newPeriodos)
  }, [])

  const updatePeriodo = async (id: number, nuevoPeriodo: string) => {
    try {
      console.log(`📤 Actualizando período ID ${id} a: ${nuevoPeriodo}`)

      const response = await fetch("https://repositorio.unerg.tech/periodo/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          periodo: nuevoPeriodo.trim(),
        }),
      })

      const data = await response.json()
      console.log(`📊 Respuesta actualización ID ${id}:`, response.status, data)

      console.log(`📋 Datos de respuesta:`, data)

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error("Ya existe otro período académico con ese nombre")
        } else if (response.status === 404) {
          throw new Error("Período académico no encontrado")
        } 
      }

      console.log(`✅ Período ID ${id} actualizado exitosamente`)
      return true
    } catch (error) {
      console.error(`❌ Error al actualizar período ID ${id}:`, error)
      throw error
    }
  }

  const createPeriodo = async (nuevoPeriodo: string) => {
    try {
      console.log(`📤 Creando nuevo período: ${nuevoPeriodo}`)

      const response = await fetch("https://repositorio.unerg.tech/periodo/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()
      console.log(`📊 Respuesta creación:`, response.status, data)

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error("El período académico ya existe")
        } else {
          throw new Error(data.message || `Error ${response.status}`)
        }
      }

      console.log(`✅ Período creado exitosamente:`, data.data?.periodoAcademico)
      return data.data?.periodoAcademico
    } catch (error) {
      console.error(`❌ Error al crear período:`, error)
      throw error
    }
  }

  // ✨ Función principal que maneja la validación del cierre
  const handleSave = useCallback(() => {
    console.log("🚀 Iniciando validación de guardado...")

    if (periodos.length === 0) {
      alert("No hay períodos para guardar")
      return false // No cerrar el modal
    }

    // Iniciar el proceso de guardado asíncrono
    performSave()
    
    // Retornar el estado actual: si shouldCloseModal es true, cerrar; si no, mantener abierto
    return shouldCloseModal
  }, [periodos, shouldCloseModal])

  // ✨ Función para manejar el guardado asíncrono
  const performSave = useCallback(async () => {
    setIsLoading(true)
    setShouldCloseModal(false) // Asegurar que el modal no se cierre mientras se guarda
    console.log("📝 Períodos a procesar:", periodos)

    try {
      const resultados = []
      const errores = []

      for (const periodo of periodos) {
        if (!periodo.text.trim()) continue // Saltar períodos vacíos

        try {
          if (periodo.id) {
            // Actualizar período existente
            await updatePeriodo(periodo.id, periodo.text)
            resultados.push(`Actualizado: ${periodo.text}`)
          } else {
            // Crear nuevo período
            const nuevoPeriodo = await createPeriodo(periodo.text)
            resultados.push(`Creado: ${periodo.text}`)

            // Actualizar el período en el estado local con el ID recibido
            setPeriodos((prev) =>
              prev.map((p) => (p.text === periodo.text && !p.id ? { ...p, id: nuevoPeriodo.id } : p)),
            )
          }
        } catch (error) {
          console.error(`❌ Error al procesar período ${periodo.text}:`, error)
          errores.push(`${periodo.text}: ${error instanceof Error ? error.message : "Error desconocido"}`)
        }
      }

      // Mostrar resultados
      let mensaje = ""

      if (resultados.length > 0) {
        mensaje += `✅ Operaciones exitosas:\n${resultados.join("\n")}`
      }

      if (errores.length > 0) {
        if (mensaje) mensaje += "\n\n"
        mensaje += `⚠️ Errores encontrados:\n${errores.join("\n")}`
      }

      if (resultados.length === 0 && errores.length > 0) {
        alert(`Error al procesar períodos:\n${errores.join("\n")}`)
        setShouldCloseModal(false) // No cerrar modal si todos los períodos fallaron
      } else {
        alert(mensaje)

        // Recargar la lista después de guardar exitosamente
        if (resultados.length > 0) {
          await loadExistingPeriodos()
          setShouldCloseModal(true) // ✨ Permitir cerrar el modal después del éxito
          
          // ✨ Forzar una nueva validación para cerrar el modal
          setTimeout(() => {
            // Simular otro click en guardar para que se ejecute onValidateClose con shouldCloseModal = true
            const saveButton = document.querySelector('.modal-save-button') as HTMLButtonElement
            if (saveButton) {
              saveButton.click()
            }
          }, 100)
        }
      }
    } catch (error) {
      console.error("❌ Error general al guardar períodos:", error)
      alert(`Error al guardar períodos: ${error instanceof Error ? error.message : "Error desconocido"}`)
      setShouldCloseModal(false) // No cerrar modal en caso de error general
    } finally {
      setIsLoading(false)
      console.log("✅ Proceso de guardado finalizado")
    }
  }, [periodos])

  const modalProps = {
    title: "Períodos Académicos",
    icon: <Calendar size={16} />,
    buttonClassName: "table-modal-btn periodo-btn",
    buttonText: isLoading ? "Guardando..." : "Guardar Cambios",
    onValidateClose: handleSave, // ✨ Usar la función de validación correctamente
    cancel: true,
    lazy: true,
    preventClose: isLoading || isLoadingData, // Prevenir cierre durante carga
  }

  // Renderizar contenido del modal
  const renderModalContent = () => {
    if (isLoadingData) {
      return (
        <div
          style={{
            padding: "40px 20px",
            textAlign: "center",
            color: "#6b7280",
            fontSize: "14px",
          }}
        >
          <div style={{ marginBottom: "12px" }}>
            <div style={{ 
              width: "24px", 
              height: "24px", 
              border: "3px solid #e5e7eb", 
              borderTop: "3px solid #3b82f6", 
              borderRadius: "50%", 
              animation: "spin 1s linear infinite",
              margin: "0 auto"
            }} />
          </div>
          Cargando períodos académicos...
        </div>
      )
    }

    if (loadError) {
      return (
        <div
          style={{
            padding: "20px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              padding: "16px",
              backgroundColor: "#fef2f2",
              borderRadius: "8px",
              border: "1px solid #fecaca",
              marginBottom: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px" }}>
              <AlertCircle size={20} style={{ color: "#ef4444", marginRight: "8px" }} />
              <strong style={{ color: "#dc2626" }}>Error al cargar períodos</strong>
            </div>
            <p style={{ color: "#dc2626", fontSize: "14px", margin: 0 }}>{loadError}</p>
          </div>

          <button
            onClick={() => loadExistingPeriodos()}
            style={{
              padding: "10px 20px",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              margin: "0 auto",
            }}
          >
            Reintentar
          </button>
        </div>
      )
    }

    return (
      <>
        <InputList
          title="Períodos Académicos"
          items={periodos}
          onChange={handlePeriodosChange}
          maxItems={50}
          emptyMessage="No hay períodos académicos registrados. Agrega algunos para comenzar."
          allowEdit={true}
          showActiveToggle={false}
          allowDelete={false}
        />

        {/* Información de estado durante la carga */}
        {isLoading && (
          <div
            style={{
              marginTop: "12px",
              padding: "12px",
              backgroundColor: "#fef3c7",
              borderRadius: "6px",
              fontSize: "14px",
              color: "#92400e",
              textAlign: "center",
            }}
          >
            <strong>Procesando períodos...</strong> Por favor espera.
          </div>
        )}
      </>
    )
  }

  return (
    <Modal {...modalProps}>
      <div className="agregar-periodo-container">
        {renderModalContent()}
      </div>
    </Modal>
  )
}

export default AgregarPeriodo