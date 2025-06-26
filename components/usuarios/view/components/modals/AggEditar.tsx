"use client"
import type React from "react"
import { useState, useEffect, useCallback, useMemo, memo, useRef, useImperativeHandle, forwardRef } from "react"
import { Edit, UserPlus, Shield, User, Mail, CreditCard } from "lucide-react"
import { useGlobal, useGlobalStatic, type DataItem, type UserRole, type UserStatus } from "../../../context/Global"
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

// Interface para el formulario
interface FormData {
  name: string
  lastName: string
  email: string
  role: UserRole | undefined
  cedula: string
  estado: UserStatus
}

// Interface para el ref del formulario
interface FormRef {
  handleSave: () => Promise<void>
  isLoading: boolean
}

// Componente del formulario con forwardRef
const AggEditarForm = memo(
  forwardRef<FormRef, AggEditarProps>(({ item }, ref) => {
    const updateItem = useGlobal((state) => state.updateItem)
    const setData = useGlobal((state) => state.setData)
    const dataItems = useGlobal((state) => state.data.items)

    const roles = useGlobalStatic((state) => state.roles)
    const badges = useGlobalStatic((state) => state.badges)

    const isEditMode = !!item

    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState<FormData>({
      name: "",
      lastName: "",
      email: "",
      role: undefined,
      cedula: "",
      estado: "ACTIVO",
    })

    const resetForm = useCallback(() => {
      setFormData({
        name: "",
        lastName: "",
        email: "",
        role: undefined,
        cedula: "",
        estado: "ACTIVO",
      })
    }, [])

    useEffect(() => {
      if (isEditMode && item) {
        const newFormData = {
          name: item.name || "",
          lastName: item.lastName || "",
          email: item.email || "",
          role: item.role,
          cedula: item.cedula || "",
          estado: item.estado || "ACTIVO",
        }

        setFormData(newFormData)
      } else if (!isEditMode) {
        resetForm()
      }
    }, [item, isEditMode, resetForm])

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))
    }, [])

    const handleSelectChange = useCallback(
      (value: string | string[]) => {
        const roleValue = Array.isArray(value) ? value[0] : value

        const isValidRole = (val: string): val is UserRole => {
          return Object.values(roles).includes(val as UserRole)
        }

        if (isValidRole(roleValue)) {
          setFormData((prev) => ({ ...prev, role: roleValue }))
        }
      },
      [roles],
    )

    const handleEstadoChange = useCallback((value: string | string[]) => {
      const stateValue = Array.isArray(value) ? value[0] : value

      const isValidStatus = (val: string): val is UserStatus => {
        return val === "ACTIVO" || val === "INACTIVO"
      }

      if (isValidStatus(stateValue)) {
        setFormData((prev) => ({ ...prev, estado: stateValue }))
      }
    }, [])

    const generateId = useCallback(() => {
      if (dataItems.length === 0) {
        return 1
      }

      const maxId = Math.max(...dataItems.map((item) => item.id))
      return maxId + 1
    }, [dataItems])

    const handleSave = useCallback(async () => {
      if (!formData.role) {
        console.error("El rol es requerido")
        return
      }

      setIsLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const itemData = { ...formData, role: formData.role }

        if (isEditMode) {
          if (!item?.id) throw new Error("No se puede actualizar: ID del item no encontrado")

          updateItem(item.id, itemData)
        } else {
          const newItem: DataItem = {
            id: generateId(),
            ...itemData,
          }

          const updatedItems = [newItem, ...dataItems]
          setData({ items: updatedItems })
        }
      } catch (error) {
        console.error(`Error al ${isEditMode ? "actualizar" : "agregar"} usuario:`, error)
      } finally {
        setIsLoading(false)
      }
    }, [formData, isEditMode, item?.id, updateItem, setData, generateId, dataItems])

    useImperativeHandle(
      ref,
      () => ({
        handleSave,
        isLoading,
      }),
      [handleSave, isLoading],
    )

    const roleOptions = useMemo(
      () =>
        (Object.entries(roles) as [keyof typeof roles, UserRole][]).map(([key, value]) => (
          <SelectItem key={key} value={value}>
            {badges.roles[key]?.name || value}
          </SelectItem>
        )),
      [roles, badges.roles],
    )

    return (
      <div className="user-form">
        <div style={{ marginBottom: "42px", marginTop: "32px" }}>
          <Input
            name="name"
            type="text"
            placeholder="Ingrese el nombre"
            required
            onChange={handleChange}
            value={formData.name}
            disabled={isLoading}
            icon={<User size={16} />}
            hasContentState={true}
          />
        </div>
        <div style={{ marginBottom: "42px" }}>
          <Input
            name="lastName"
            type="text"
            placeholder="Ingrese el apellido"
            required
            onChange={handleChange}
            value={formData.lastName}
            disabled={isLoading}
            icon={<User size={16} />}
            hasContentState={true}
          />
        </div>
        <div style={{ marginBottom: "42px" }}>
          <Input
            name="email"
            type="email"
            placeholder="ejemplo@correo.com"
            required
            onChange={handleChange}
            value={formData.email}
            disabled={isLoading}
            icon={<Mail size={16} />}
            hasContentState={true}
          />
        </div>
        <div style={{ marginBottom: "42px" }}>
          <Input
            name="cedula"
            type="text"
            placeholder="12345678"
            required
            onChange={handleChange}
            value={formData.cedula}
            disabled={isLoading}
            icon={<CreditCard size={16} />}
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
            Rol del usuario
          </label>
          <Select value={formData.role || ""} onValueChange={handleSelectChange}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectLabel>Roles disponibles</SelectLabel>
              <SelectSeparator />
              {roleOptions}
            </SelectContent>
          </Select>
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
            Estado del usuario
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

AggEditarForm.displayName = "AggEditarForm"

// Componente principal conectado al formulario
const AggEditar: React.FC<AggEditarProps> = memo(({ item }) => {
  const isEditMode = !!item
  const formRef = useRef<FormRef>(null)

  const handleSave = useCallback(async () => {
    if (formRef.current) {
      await formRef.current.handleSave()
    }
  }, [])

  const isLoading = formRef.current?.isLoading || false

  const modalProps = useMemo(
    () => ({
      title: isEditMode ? "" : "Agregar Usuario",
      icon: isEditMode ? <Edit size={16} /> : <UserPlus size={16} />,
      buttonClassName: `table-modal-btn save-user-btn ${isEditMode ? "action-btn" : ""}`,
      buttonText: isLoading
        ? isEditMode
          ? "Actualizando..."
          : "Guardando..."
        : isEditMode
          ? "Guardar Cambios"
          : "Guardar Usuario",
      onclick: handleSave,
      cancel: isEditMode,
      lazy: true,
    }),
    [isEditMode, isLoading, handleSave],
  )

  const renderForm = useCallback(() => {
    return <AggEditarForm ref={formRef} item={item} />
  }, [item])

  return <Modal {...modalProps}>{renderForm}</Modal>
})

AggEditar.displayName = "AggEditar"

export default AggEditar
