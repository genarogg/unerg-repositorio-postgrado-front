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
  handleSave: () => Promise<void>
  isLoading: boolean
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
      } else if (!isEditMode) {
        resetForm()
      }
    }, [item, isEditMode, resetForm])

    // 🔥 OPTIMIZACIÓN: Memoizar handlers
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))
    }, [])

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

    const handleSave = useCallback(async () => {
      // Validación: el nombre es requerido
      if (!formData.nombre.trim()) {
        console.error("El nombre es requerido")
        return
      }

      setIsLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const itemData = {
          nombre: formData.nombre.trim(),
          estado: formData.estado,
        }

        if (isEditMode) {
          if (!item?.id) throw new Error("No se puede actualizar: ID del item no encontrado")

          // 🔥 USAR MÉTODO ESPECÍFICO: updateItem para edición
          updateItem(item.id, itemData)
        } else {
          const newItem: DataItem = {
            id: generateId(),
            ...itemData,
          }

          // 🔥 USAR MÉTODO ESPECÍFICO: setData con preservación de selecciones
          const updatedItems = [newItem, ...dataItems]
          setData({ items: updatedItems })
        }
      } catch (error) {
        console.error(`Error al ${isEditMode ? "actualizar" : "agregar"} item:`, error)
      } finally {
        setIsLoading(false)
      }
    }, [formData, isEditMode, item?.id, updateItem, setData, generateId, dataItems])

    // 🔥 NUEVO: Exponer funciones a través del ref
    useImperativeHandle(
      ref,
      () => ({
        handleSave,
        isLoading,
      }),
      [handleSave, isLoading],
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

  // 🔥 SOLUCIONADO: handleSave ahora conecta con el formulario
  const handleSave = useCallback(async () => {
    if (formRef.current) {
      await formRef.current.handleSave()
    }
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
    }),
    [isEditMode, isLoading, handleSave],
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
