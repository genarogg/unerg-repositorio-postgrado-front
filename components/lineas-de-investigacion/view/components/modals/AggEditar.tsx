"use client"
import type React from "react"
import { useState, useEffect, useCallback, useMemo, memo, useRef, useImperativeHandle, forwardRef } from "react"
import { SquarePen, UserPlus, Shield, User } from "lucide-react"
import { useGlobal, useGlobalStatic, type DataItem, type UserStatus } from "../../../context/Global"
import Modal from "../../../../ux/modal"
import Input from "../../../../ux/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectLabel,
  SelectSeparator,
  SelectItem,
} from "../../../../ux/select"

interface AggEditarProps {
  item?: DataItem
}

// Interface para el formulario simplificado
interface FormData {
  nombre: string
  estado: UserStatus
}

// Interface para el ref del formulario
interface FormRef {
  handleSave: () => Promise<boolean>
  isLoading: boolean
  validateForm: () => boolean
}

// Interface para las respuestas del backend
interface ApiResponse {
  type: "success" | "error"
  message: string
  data?: any
}

// 🔥 OPTIMIZACIÓN CRÍTICA: Componente del formulario con forwardRef
const AggEditarForm = memo(
  forwardRef<FormRef, AggEditarProps>(({ item }, ref) => {
    // 🔥 OPTIMIZACIÓN CRÍTICA: Usar métodos específicos de Zustand
    const updateItem = useGlobal((state) => state.updateItem)
    const setData = useGlobal((state) => state.setData)
    const dataItems = useGlobal((state) => state.data.items)

    // 🔥 OPTIMIZACIÓN: Suscripción selectiva al estado estático
    const badges = useGlobalStatic((state) => state.badges)

    const isEditMode = !!item

    const [isLoading, setIsLoading] = useState(false)
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})

    const [formData, setFormData] = useState<FormData>({
      nombre: "",
      estado: "ACTIVO",
    })

    // 🔥 OPTIMIZACIÓN: Memoizar resetForm
    const resetForm = useCallback(() => {
      setFormData({
        nombre: "",
        estado: "ACTIVO",
      })
      setFormErrors({})
    }, [])

    // 🔥 OPTIMIZACIÓN CRÍTICA: useEffect con dependencias específicas
    useEffect(() => {
      if (isEditMode && item) {
        // Solo actualizar si los datos realmente cambiaron
        const newFormData = {
          nombre: item.nombre || "",
          estado: item.estado || "ACTIVO",
        }

        setFormData(newFormData)
        setFormErrors({})
      } else if (!isEditMode) {
        resetForm()
      }
    }, [item, isEditMode, resetForm])

    // 🔥 OPTIMIZACIÓN: Memoizar handlers
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))

        // Limpiar error del campo cuando el usuario empiece a escribir
        if (formErrors[name]) {
          setFormErrors((prev) => ({ ...prev, [name]: "" }))
        }
      },
      [formErrors],
    )

    const handleEstadoChange = useCallback((value: string | string[]) => {
      const stateValue = Array.isArray(value) ? value[0] : value

      // Type guard para validar que el estado es válido
      const isValidStatus = (val: string): val is UserStatus => {
        return val === "ACTIVO" || val === "INACTIVO"
      }

      if (isValidStatus(stateValue)) {
        setFormData((prev) => ({ ...prev, estado: stateValue }))
      }
    }, [])

    // 🔥 OPTIMIZACIÓN CORREGIDA: Generar ID basado en el máximo existente + 1
    const generateId = useCallback(() => {
      if (dataItems.length === 0) {
        return 1 // Si no hay elementos, comenzar con 1
      }

      // Encontrar el ID máximo y sumarle 1
      const maxId = Math.max(...dataItems.map((item) => item.id))
      return maxId + 1
    }, [dataItems])

    // Función para validar el formulario
    const validateForm = useCallback((): boolean => {
      const errors: { [key: string]: string } = {}

      // Validar nombre
      if (!formData.nombre.trim()) {
        errors.nombre = "El nombre es requerido"
      } else if (formData.nombre.trim().length < 3) {
        errors.nombre = "El nombre debe tener al menos 3 caracteres"
      } else if (formData.nombre.trim().length > 100) {
        errors.nombre = "El nombre no puede exceder 100 caracteres"
      }

      setFormErrors(errors)
      return Object.keys(errors).length === 0
    }, [formData])

    // Función para hacer la petición al backend
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

    const handleSave = useCallback(async (): Promise<boolean> => {
      // Validar formulario
      if (!validateForm()) {
        alert("Por favor, corrige los errores en el formulario antes de continuar.")
        return false
      }

      setIsLoading(true)

      try {
        // Simular token (en una aplicación real, esto vendría del contexto de autenticación)
        const token = localStorage.getItem("auth_token") || ""

        if (!token) {
          alert("Error: No se encontró el token de autenticación")
          return false
        }

        if (isEditMode) {
          if (!item?.id) {
            alert("Error: No se puede actualizar, ID del item no encontrado")
            return false
          }

          // Petición para actualizar
          const updateData = {
            token,
            id: item.id,
            nombre: formData.nombre.trim(),
            estado: formData.estado === "ACTIVO",
          }

          console.log("Datos de actualización:", updateData)

          const result = await makeApiRequest("http://localhost:4000/lineas-de-investigacion/update", updateData)

          if (result.type === "success") {
            // Actualizar en el estado local
            updateItem(item.id, {
              nombre: formData.nombre.trim(),
              estado: formData.estado,
            })

            alert("Línea de investigación actualizada exitosamente")
            return true
          } else {
            alert(`Error al actualizar: ${result.message}`)
            return false
          }
        } else {
          // Petición para crear
          const createData = {
            token,
            nombre: formData.nombre.trim(),
          }

          const result = await makeApiRequest("http://localhost:4000/lineas-de-investigacion/create", createData)

          if (result.type === "success") {
            // Agregar al estado local con los datos devueltos por el backend
            const newItem: DataItem = {
              id: result.data?.id || generateId(),
              nombre: result.data?.nombre || formData.nombre.trim(),
              estado: result.data?.estado ? "ACTIVO" : "INACTIVO",
              // Campos opcionales para compatibilidad
              correo: "",
              telefono: "",
              cedula: "",
              rol: "EDITOR",
              limite: 0,
              doc: "",
            }

            const updatedItems = [newItem, ...dataItems]
            setData({ items: updatedItems })

            alert("Línea de investigación creada exitosamente")
            return true
          } else {
            alert(`Error al crear: ${result.message}`)
            return false
          }
        }
      } catch (error: any) {
        console.error(`Error al ${isEditMode ? "actualizar" : "crear"} línea de investigación:`, error)
        alert(`Error al ${isEditMode ? "actualizar" : "crear"} la línea de investigación: ${error.message}`)
        return false
      } finally {
        setIsLoading(false)
      }
    }, [formData, isEditMode, item?.id, updateItem, setData, generateId, dataItems, validateForm, makeApiRequest])

    // 🔥 NUEVO: Exponer funciones a través del ref
    useImperativeHandle(
      ref,
      () => ({
        handleSave,
        isLoading,
        validateForm,
      }),
      [handleSave, isLoading, validateForm],
    )

    return (
      <div className="user-form">
        <div style={{ marginBottom: "42px", marginTop: "32px" }}>
          <Input
            name="nombre"
            type="text"
            placeholder="Ingrese el nombre de la línea de investigación"
            required
            onChange={handleChange}
            value={formData.nombre}
            disabled={isLoading}
            icon={<User size={16} />}
            hasContentState={true}
            error={formErrors.nombre}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#374151",
            }}
          >
            <Shield size={16} style={{ marginRight: "8px", marginLeft: "10px" }} />
            Estado de la línea de investigación
          </label>
          <Select value={formData.estado} onValueChange={handleEstadoChange}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectLabel>Estados disponibles</SelectLabel>
              <SelectSeparator />
              <SelectItem value="ACTIVO">
                <span style={{ color: badges.estados.ACTIVO.color }}>{badges.estados.ACTIVO.name}</span>
              </SelectItem>
              <SelectItem value="INACTIVO">
                <span style={{ color: badges.estados.INACTIVO.color }}>{badges.estados.INACTIVO.name}</span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    )
  }),
)

// Establecer displayName para debugging
AggEditarForm.displayName = "AggEditarForm"

// 🔥 OPTIMIZACIÓN CRÍTICA: Componente principal conectado al formulario
const AggEditar: React.FC<AggEditarProps> = memo(({ item }) => {
  const isEditMode = !!item
  const formRef = useRef<FormRef>(null)

  // 🔥 SOLUCIONADO: handleSave ahora conecta con el formulario y valida antes de cerrar
  const handleSave = useCallback(async () => {
    if (formRef.current) {
      return await formRef.current.handleSave()
    }
    return false
  }, [])

  // 🔥 NUEVA: Función de validación para el modal
  const onValidateClose = useCallback((): boolean => {
    if (formRef.current) {
      return formRef.current.validateForm()
    }
    return true
  }, [])

  // 🔥 OPTIMIZACIÓN: Obtener isLoading del formulario
  const isLoading = formRef.current?.isLoading || false

  // 🔥 OPTIMIZACIÓN: Memoizar props del modal
  const modalProps = useMemo(
    () => ({
      title: isEditMode ? "" : "Agregar Línea de Investigación",
      icon: isEditMode ? <SquarePen size={16} /> : <UserPlus size={16} />,
      buttonClassName: `table-modal-btn save-user-btn ${isEditMode ? "action-btn" : ""}`,
      buttonText: isLoading
        ? isEditMode
          ? "Actualizando..."
          : "Guardando..."
        : isEditMode
          ? "Guardar Cambios"
          : "Guardar Línea",
      onclick: handleSave,
      cancel: isEditMode,
      lazy: true, // 🔥 CRÍTICO: Activar lazy loading
      onValidateClose, // 🔥 NUEVA: Función de validación antes de cerrar
    }),
    [isEditMode, isLoading, handleSave, onValidateClose],
  )

  // 🔥 OPTIMIZACIÓN CRÍTICA: Renderizar el formulario como función lazy
  const renderForm = useCallback(() => {
    return <AggEditarForm ref={formRef} item={item} />
  }, [item])

  return <Modal {...modalProps}>{renderForm}</Modal>
})

// Establecer displayName para debugging
AggEditar.displayName = "AggEditar"

export default AggEditar
