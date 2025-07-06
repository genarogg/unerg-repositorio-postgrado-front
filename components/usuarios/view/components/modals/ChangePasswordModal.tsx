"use client"
import type React from "react"
import { useState, useCallback, memo, useRef, useImperativeHandle, forwardRef } from "react"
import { useMemo } from "react"

import { LockKeyhole } from "lucide-react"
import { useGlobal, type DataItem } from "../../../context/Global"
import Modal from "../../../../ux/modal"
import Input from "../../../../ux/input"

interface ChangePasswordProps {
  item: DataItem
}

// Interface para el formulario
interface PasswordFormData {
  newPassword: string
  confirmPassword: string
}

// Interface para el ref del formulario
interface PasswordFormRef {
  handleSave: () => Promise<void>
  isLoading: boolean
  validateForClose: () => boolean // Agregar esta línea
}

// Componente del formulario con forwardRef
const ChangePasswordForm = memo(
  forwardRef<PasswordFormRef, ChangePasswordProps>(({ item }, ref) => {
    const updateItem = useGlobal((state) => state.updateItem)

    const [isLoading, setIsLoading] = useState(false)
    const [showPasswords, setShowPasswords] = useState({
      new: false,
      confirm: false,
    })
    const [errors, setErrors] = useState<Partial<PasswordFormData>>({})

    const [formData, setFormData] = useState<PasswordFormData>({
      newPassword: "",
      confirmPassword: "",
    })

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))

        // Limpiar errores cuando el usuario empiece a escribir
        if (errors[name as keyof PasswordFormData]) {
          setErrors((prev) => ({ ...prev, [name]: undefined }))
        }
      },
      [errors],
    )

    const togglePasswordVisibility = useCallback((field: "new" | "confirm") => {
      setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
    }, [])

    const validateForm = useCallback((): boolean => {
      const newErrors: Partial<PasswordFormData> = {}

      // Validar nueva contraseña
      if (!formData.newPassword) {
        newErrors.newPassword = "La nueva contraseña es requerida"
      } else if (formData.newPassword.length < 6) {
        newErrors.newPassword = "La contraseña debe tener al menos 6 caracteres"
      } else if (formData.newPassword.length > 50) {
        newErrors.newPassword = "La contraseña no puede tener más de 50 caracteres"
      }

      // Validar confirmación de contraseña
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Confirma la nueva contraseña"
      } else if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Las contraseñas no coinciden"
      }

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    }, [formData])

    // Agregar esta función dentro del componente ChangePasswordForm, después de validateForm
    const validateForClose = useCallback((): boolean => {
      return validateForm()
    }, [validateForm])

    const handleSave = useCallback(async () => {
      if (!validateForm()) {
        return
      }

      setIsLoading(true)
      try {
        // Llamada a la API para cambiar la contraseña
        const response = await fetch("http://localhost:4000/auth/change-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: item.id,
            nuevaContrasena: formData.newPassword,
          }),
        })

        const result = await response.json()

        if (!response.ok || result.type === "error") {
          throw new Error(result.message || "Error al cambiar la contraseña")
        }

        console.log("Contraseña cambiada exitosamente:", result.message)

        // Resetear formulario después del éxito
        setFormData({
          newPassword: "",
          confirmPassword: "",
        })

        // Limpiar errores
        setErrors({})

        // Opcional: Mostrar mensaje de éxito (puedes implementar un toast o notificación)
        alert("Contraseña cambiada exitosamente")
      } catch (error: any) {
        console.error("Error al cambiar contraseña:", error)

        // Mostrar error específico del backend
        setErrors({
          newPassword: error.message || "Error al cambiar la contraseña. Inténtalo de nuevo.",
        })
      } finally {
        setIsLoading(false)
      }
    }, [formData, validateForm, item.id])

    // Actualizar useImperativeHandle para incluir validateForClose
    useImperativeHandle(
      ref,
      () => ({
        handleSave,
        isLoading,
        validateForClose, // Agregar esta línea
      }),
      [handleSave, isLoading, validateForClose], // Agregar validateForClose a las dependencias
    )

    return (
      <div className="password-form">
        <div style={{ marginBottom: "24px", textAlign: "center" }}>
          <h3 style={{ margin: "0 0 8px 0", color: "#374151" }}>
            Cambiar contraseña de {item.name} {item.lastName}
          </h3>
          <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>{item.email}</p>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <Input
            name="newPassword"
            type="password"
            placeholder="Nueva contraseña (mín. 6 caracteres)"
            required
            onChange={handleChange}
            value={formData.newPassword}
            disabled={isLoading}
            icon={<LockKeyhole size={16} />}
            error={errors.newPassword}
            hasContentState={true}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <Input
            name="confirmPassword"
            type="password"
            placeholder="Confirmar nueva contraseña"
            required
            onChange={handleChange}
            value={formData.confirmPassword}
            disabled={isLoading}
            icon={<LockKeyhole size={16} />}
            error={errors.confirmPassword}
            hasContentState={true}
          />
        </div>

        {Object.keys(errors).length > 0 && (
          <div
            style={{
              padding: "12px",
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "6px",
              marginBottom: "16px",
            }}
          >
            <p style={{ margin: 0, color: "#dc2626", fontSize: "14px" }}>
              Por favor corrige los errores antes de continuar
            </p>
          </div>
        )}
      </div>
    )
  }),
)

ChangePasswordForm.displayName = "ChangePasswordForm"

// Componente principal del modal
const ChangePasswordModal: React.FC<ChangePasswordProps> = memo(({ item }) => {
  const formRef = useRef<PasswordFormRef>(null)

  const handleSave = useCallback(async () => {
    if (formRef.current) {
      await formRef.current.handleSave()
    }
  }, [])

  // Agregar esta función dentro del componente ChangePasswordModal, después de handleSave
  const handleValidateClose = useCallback(() => {
    if (formRef.current) {
      return formRef.current.validateForClose()
    }
    return true // Si no hay ref, permitir cerrar
  }, [])

  const isLoading = formRef.current?.isLoading || false

  const modalProps = useMemo(
    () => ({
      title: "",
      icon: <LockKeyhole size={16} />,
      buttonClassName: "action-btn",
      buttonText: isLoading ? "Cambiando..." : "Cambiar Contraseña",
      onclick: handleSave,
      cancel: true,
      cancelText: "Cancelar",
      lazy: true,
      onValidateClose: handleValidateClose, // Agregar esta línea
    }),
    [isLoading, handleSave, handleValidateClose], // Agregar handleValidateClose a las dependencias
  )

  const renderForm = useCallback(() => {
    return <ChangePasswordForm ref={formRef} item={item} />
  }, [item])

  return <Modal {...modalProps}>{renderForm}</Modal>
})

ChangePasswordModal.displayName = "ChangePasswordModal"

export default ChangePasswordModal
