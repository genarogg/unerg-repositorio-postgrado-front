"use client"
import type React from "react"
import { useState, useEffect, useCallback, useMemo, memo, useRef, useImperativeHandle, forwardRef } from "react"
import { Edit, UserPlus, Shield, User, Mail, CreditCard, AlertCircle, CheckCircle, Lock } from "lucide-react"
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
  password?: string // Solo para nuevos usuarios
}

// Tipos de errores específicos
type ValidationErrorType =
  | "required_name"
  | "required_lastName"
  | "required_email"
  | "required_cedula"
  | "required_role"
  | "required_password"
  | "invalid_name"
  | "invalid_lastName"
  | "invalid_email"
  | "invalid_cedula_length"
  | "invalid_cedula_format"
  | "invalid_password"
  | "email_already_exists"
  | "server_error"

interface ValidationError {
  type: ValidationErrorType
  message: string
  severity: "error" | "warning"
}

// Interface para el ref del formulario
interface FormRef {
  handleSave: () => Promise<void>
  isLoading: boolean
  validateForClose: () => boolean
}

// Interface para la respuesta del backend (registro)
interface BackendResponse {
  message: string
  type: "success" | "error"
  data?: {
    token: string
    usuario: {
      id: number
      name: string
      lastName: string
      email: string
      cedula: string
      estado: boolean
      role: string
    }
  }
}

// Interface para la respuesta del backend (actualización)
interface UpdateBackendResponse {
  message: string
  type: "success" | "error"
  data?: {
    usuario: {
      id: number
      name: string
      lastName: string
      email: string
      cedula: string
      estado: boolean
      role: string
    }
  }
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
    const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
    const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormData, string>>>({})

    const [formData, setFormData] = useState<FormData>({
      name: "",
      lastName: "",
      email: "",
      role: undefined,
      cedula: "",
      estado: "ACTIVO",
      password: "", // Solo para nuevos usuarios
    })

    // Función para generar contraseña temporal
    const generateTemporaryPassword = useCallback((): string => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
      let password = ""
      for (let i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return password
    }, [])

    // Función para obtener mensajes de error personalizados
    const getErrorMessage = useCallback((type: ValidationErrorType): ValidationError => {
      const errorMessages: Record<ValidationErrorType, ValidationError> = {
        required_name: {
          type: "required_name",
          message: "El nombre es obligatorio",
          severity: "error",
        },
        required_lastName: {
          type: "required_lastName",
          message: "El apellido es obligatorio",
          severity: "error",
        },
        required_email: {
          type: "required_email",
          message: "El correo electrónico es obligatorio",
          severity: "error",
        },
        required_cedula: {
          type: "required_cedula",
          message: "La cédula es obligatoria",
          severity: "error",
        },
        required_role: {
          type: "required_role",
          message: "Debes seleccionar un rol para el usuario",
          severity: "error",
        },
        required_password: {
          type: "required_password",
          message: "La contraseña es obligatoria para nuevos usuarios",
          severity: "error",
        },
        invalid_name: {
          type: "invalid_name",
          message: "El nombre no puede contener números ni caracteres especiales",
          severity: "error",
        },
        invalid_lastName: {
          type: "invalid_lastName",
          message: "El apellido no puede contener números ni caracteres especiales",
          severity: "error",
        },
        invalid_email: {
          type: "invalid_email",
          message: "Ingresa un correo electrónico válido (ejemplo: usuario@dominio.com)",
          severity: "error",
        },
        invalid_cedula_length: {
          type: "invalid_cedula_length",
          message: "La cédula debe tener exactamente 7 u 8 dígitos",
          severity: "error",
        },
        invalid_cedula_format: {
          type: "invalid_cedula_format",
          message: "La cédula solo puede contener números",
          severity: "error",
        },
        invalid_password: {
          type: "invalid_password",
          message: "La contraseña debe tener al menos 6 caracteres",
          severity: "error",
        },
        email_already_exists: {
          type: "email_already_exists",
          message: "Este correo electrónico ya está registrado. Usa otro correo diferente",
          severity: "error",
        },
        server_error: {
          type: "server_error",
          message: "Error del servidor. Inténtalo de nuevo más tarde",
          severity: "error",
        },
      }
      return errorMessages[type]
    }, [])

    // Funciones de validación
    const validateName = useCallback(
      (name: string): ValidationError[] => {
        const errors: ValidationError[] = []

        if (!name.trim()) {
          errors.push(getErrorMessage("required_name"))
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name.trim())) {
          errors.push(getErrorMessage("invalid_name"))
        }

        return errors
      },
      [getErrorMessage],
    )

    const validateLastName = useCallback(
      (lastName: string): ValidationError[] => {
        const errors: ValidationError[] = []

        if (!lastName.trim()) {
          errors.push(getErrorMessage("required_lastName"))
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(lastName.trim())) {
          errors.push(getErrorMessage("invalid_lastName"))
        }

        return errors
      },
      [getErrorMessage],
    )

    const validateEmail = useCallback(
      (email: string): ValidationError[] => {
        const errors: ValidationError[] = []

        if (!email.trim()) {
          errors.push(getErrorMessage("required_email"))
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(email.trim())) {
            errors.push(getErrorMessage("invalid_email"))
          }
        }

        return errors
      },
      [getErrorMessage],
    )

    const validateCedula = useCallback(
      (cedula: string): ValidationError[] => {
        const errors: ValidationError[] = []

        if (!cedula.trim()) {
          errors.push(getErrorMessage("required_cedula"))
        } else {
          const cleanCedula = cedula.trim()

          if (!/^\d+$/.test(cleanCedula)) {
            errors.push(getErrorMessage("invalid_cedula_format"))
          } else if (cleanCedula.length < 7 || cleanCedula.length > 8) {
            errors.push(getErrorMessage("invalid_cedula_length"))
          }
        }

        return errors
      },
      [getErrorMessage],
    )

    const validateRole = useCallback(
      (role: UserRole | undefined): ValidationError[] => {
        const errors: ValidationError[] = []

        if (!role) {
          errors.push(getErrorMessage("required_role"))
        }

        return errors
      },
      [getErrorMessage],
    )

    const validatePassword = useCallback(
      (password: string): ValidationError[] => {
        const errors: ValidationError[] = []

        if (!isEditMode) {
          if (!password.trim()) {
            errors.push(getErrorMessage("required_password"))
          } else if (password.length < 6) {
            errors.push(getErrorMessage("invalid_password"))
          }
        }

        return errors
      },
      [getErrorMessage, isEditMode],
    )

    const resetForm = useCallback(() => {
      setFormData({
        name: "",
        lastName: "",
        email: "",
        role: undefined,
        cedula: "",
        estado: "ACTIVO",
        password: "",
      })
      setValidationErrors([])
      setFieldErrors({})
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
          password: "", // No mostrar contraseña en modo edición
        }

        setFormData(newFormData)
      } else if (!isEditMode) {
        resetForm()
        // Generar contraseña temporal para nuevos usuarios
        setFormData((prev) => ({
          ...prev,
          password: generateTemporaryPassword(),
        }))
      }
    }, [item, isEditMode, resetForm, generateTemporaryPassword])

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))

      // Limpiar errores del campo específico
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }))

      // Limpiar errores de validación relacionados
      setValidationErrors((prev) => {
        const fieldErrorTypes: Record<string, ValidationErrorType[]> = {
          name: ["required_name", "invalid_name"],
          lastName: ["required_lastName", "invalid_lastName"],
          email: ["required_email", "invalid_email", "email_already_exists"],
          cedula: ["required_cedula", "invalid_cedula_length", "invalid_cedula_format"],
          password: ["required_password", "invalid_password"],
        }

        const typesToRemove = fieldErrorTypes[name] || []
        return prev.filter((error) => !typesToRemove.includes(error.type))
      })
    }, [])

    const handleSelectChange = useCallback(
      (value: string | string[]) => {
        const roleValue = Array.isArray(value) ? value[0] : value

        const isValidRole = (val: string): val is UserRole => {
          return Object.values(roles).includes(val as UserRole)
        }

        if (isValidRole(roleValue)) {
          setFormData((prev) => ({ ...prev, role: roleValue }))

          // Limpiar errores de rol
          setFieldErrors((prev) => ({ ...prev, role: undefined }))
          setValidationErrors((prev) => prev.filter((error) => error.type !== "required_role"))
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

    const generateNewPassword = useCallback(() => {
      const newPassword = generateTemporaryPassword()
      setFormData((prev) => ({ ...prev, password: newPassword }))

      // Limpiar errores de contraseña
      setFieldErrors((prev) => ({ ...prev, password: undefined }))
      setValidationErrors((prev) =>
        prev.filter((error) => !["required_password", "invalid_password"].includes(error.type)),
      )
    }, [generateTemporaryPassword])

    const validateForm = useCallback((): boolean => {
      const allErrors: ValidationError[] = [
        ...validateName(formData.name),
        ...validateLastName(formData.lastName),
        ...validateEmail(formData.email),
        ...validateCedula(formData.cedula),
        ...validateRole(formData.role),
        ...validatePassword(formData.password || ""),
      ]

      const newFieldErrors: Partial<Record<keyof FormData, string>> = {}

      // Mapear errores a campos específicos
      allErrors.forEach((error) => {
        switch (error.type) {
          case "required_name":
          case "invalid_name":
            newFieldErrors.name = error.message
            break
          case "required_lastName":
          case "invalid_lastName":
            newFieldErrors.lastName = error.message
            break
          case "required_email":
          case "invalid_email":
          case "email_already_exists":
            newFieldErrors.email = error.message
            break
          case "required_cedula":
          case "invalid_cedula_length":
          case "invalid_cedula_format":
            newFieldErrors.cedula = error.message
            break
          case "required_role":
            newFieldErrors.role = error.message
            break
          case "required_password":
          case "invalid_password":
            newFieldErrors.password = error.message
            break
        }
      })

      setValidationErrors(allErrors)
      setFieldErrors(newFieldErrors)

      return allErrors.filter((error) => error.severity === "error").length === 0
    }, [formData, validateName, validateLastName, validateEmail, validateCedula, validateRole, validatePassword])

    const validateForClose = useCallback((): boolean => {
      return validateForm()
    }, [validateForm])

    // Función para registrar usuario en el backend
    const registerUserInBackend = useCallback(async (userData: FormData): Promise<DataItem> => {
      const API_URL = "http://localhost:4000/auth/register"

      const requestBody = {
        name: userData.name.trim(),
        lastName: userData.lastName.trim(),
        email: userData.email.trim().toLowerCase(),
        password: userData.password!,
        cedula: userData.cedula.trim(),
        estado: userData.estado === "ACTIVO",
        role: userData.role,
      }

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      const result: BackendResponse = await response.json()

      if (!response.ok || result.type === "error") {
        // Manejar errores específicos del backend
        if (response.status === 409 || result.message.includes("ya está registrado")) {
          throw new Error("EMAIL_EXISTS")
        }
        throw new Error(result.message || "Error del servidor")
      }

      if (!result.data?.usuario) {
        throw new Error("Respuesta inválida del servidor")
      }

      // Convertir la respuesta del backend al formato esperado por la aplicación
      const backendUser = result.data.usuario
      return {
        id: backendUser.id,
        name: backendUser.name,
        lastName: backendUser.lastName,
        email: backendUser.email,
        cedula: backendUser.cedula,
        role: backendUser.role as UserRole,
        estado: backendUser.estado ? "ACTIVO" : "INACTIVO",
      }
    }, [])

    // Función para actualizar usuario en el backend
    const updateUserInBackend = useCallback(async (userData: FormData, userId: number): Promise<DataItem> => {
      const API_URL = "http://localhost:4000/auth/update-user"

      const requestBody = {
        id: userId,
        name: userData.name.trim(),
        lastName: userData.lastName.trim(),
        email: userData.email.trim().toLowerCase(),
        cedula: userData.cedula.trim(),
        estado: userData.estado === "ACTIVO",
        role: userData.role,
        // No incluir password en actualizaciones (se maneja por separado)
      }

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      const result: UpdateBackendResponse = await response.json()

      if (!response.ok || result.type === "error") {
        // Manejar errores específicos del backend
        if (response.status === 409 || result.message.includes("ya está registrado")) {
          throw new Error("EMAIL_EXISTS")
        }
        if (response.status === 404) {
          throw new Error("Usuario no encontrado")
        }
        throw new Error(result.message || "Error del servidor")
      }

      if (!result.data?.usuario) {
        throw new Error("Respuesta inválida del servidor")
      }

      // Convertir la respuesta del backend al formato esperado por la aplicación
      const backendUser = result.data.usuario
      return {
        id: backendUser.id,
        name: backendUser.name,
        lastName: backendUser.lastName,
        email: backendUser.email,
        cedula: backendUser.cedula,
        role: backendUser.role as UserRole,
        estado: backendUser.estado ? "ACTIVO" : "INACTIVO",
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
      if (!validateForm()) {
        return
      }

      setIsLoading(true)
      try {
        const itemData = { ...formData, role: formData.role! }

        console.log("Datos del formulario:", itemData)

        if (isEditMode) {
          // Modo edición - actualizar en backend
          if (!item?.id) throw new Error("No se puede actualizar: ID del item no encontrado")

          try {
            const updatedUser = await updateUserInBackend(itemData, item.id)

            // Actualizar estado local con el usuario actualizado del backend
            updateItem(item.id, updatedUser)

            console.log("Usuario actualizado exitosamente:", updatedUser)
          } catch (error: any) {
            // Manejar errores específicos del backend
            if (error.message === "EMAIL_EXISTS") {
              const emailError = getErrorMessage("email_already_exists")
              setValidationErrors([emailError])
              setFieldErrors({ email: emailError.message })
            } else {
              const serverError = getErrorMessage("server_error")
              setValidationErrors([serverError])
              console.error("Error al actualizar usuario:", error.message)
            }
            return 
          }
        } else {
          // Modo agregar - registrar en backend
          try {
            const newUser = await registerUserInBackend(itemData)

            // Actualizar estado local con el usuario del backend
            const updatedItems = [newUser, ...dataItems]
            setData({ items: updatedItems })

            // Resetear formulario
            resetForm()
            // Generar nueva contraseña para el próximo usuario
            setFormData((prev) => ({
              ...prev,
              password: generateTemporaryPassword(),
            }))

            console.log("Usuario registrado exitosamente:", newUser)
          } catch (error: any) {
            // Manejar errores específicos del backend
            if (error.message === "EMAIL_EXISTS") {
              const emailError = getErrorMessage("email_already_exists")
              setValidationErrors([emailError])
              setFieldErrors({ email: emailError.message })
            } else {
              const serverError = getErrorMessage("server_error")
              setValidationErrors([serverError])
              console.error("Error al registrar usuario:", error.message)
            }
            return // No continuar si hay error
          }
        }
      } catch (error) {
        console.error(`Error al ${isEditMode ? "actualizar" : "agregar"} usuario:`, error)
        const serverError = getErrorMessage("server_error")
        setValidationErrors([serverError])
      } finally {
        setIsLoading(false)
      }
    }, [
      formData,
      validateForm,
      isEditMode,
      item?.id,
      updateItem,
      setData,
      dataItems,
      resetForm,
      registerUserInBackend,
      updateUserInBackend,
      generateTemporaryPassword,
      getErrorMessage,
    ])

    useImperativeHandle(
      ref,
      () => ({
        handleSave,
        isLoading,
        validateForClose,
      }),
      [handleSave, isLoading, validateForClose],
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

    // Componente para mostrar errores de validación
    const ValidationErrorsDisplay = memo(() => {
      if (validationErrors.length === 0) return null

      const criticalErrors = validationErrors.filter((error) => error.severity === "error")

      return (
        <div style={{ marginBottom: "16px" }}>
          {criticalErrors.length > 0 && (
            <div
              style={{
                padding: "12px",
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "6px",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <AlertCircle size={16} style={{ color: "#dc2626", marginTop: "2px", flexShrink: 0 }} />
                <div>
                  <p style={{ margin: "0 0 8px 0", color: "#dc2626", fontSize: "14px", fontWeight: "600" }}>
                    {criticalErrors.length === 1
                      ? "Error encontrado:"
                      : `${criticalErrors.length} errores encontrados:`}
                  </p>
                  <ul style={{ margin: 0, paddingLeft: "16px", color: "#dc2626", fontSize: "13px" }}>
                    {criticalErrors.map((error, index) => (
                      <li key={index} style={{ marginBottom: "4px" }}>
                        {error.message}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )
    })

    ValidationErrorsDisplay.displayName = "ValidationErrorsDisplay"

    // Verificar si el formulario está completo y válido
    const isFormValid = useMemo(() => {
      const baseValidation =
        formData.name.trim() &&
        formData.lastName.trim() &&
        formData.email.trim() &&
        formData.cedula.trim() &&
        formData.role &&
        validationErrors.filter((error) => error.severity === "error").length === 0

      if (isEditMode) {
        return baseValidation
      } else {
        return baseValidation && formData.password && formData.password.length >= 6
      }
    }, [formData, validationErrors, isEditMode])

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
            error={fieldErrors.name}
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
            error={fieldErrors.lastName}
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
            error={fieldErrors.email}
          />
        </div>
        <div style={{ marginBottom: "42px" }}>
          <Input
            name="cedula"
            type="text"
            placeholder="Cédula (7-8 dígitos)"
            required
            onChange={handleChange}
            value={formData.cedula}
            disabled={isLoading}
            icon={<CreditCard size={16} />}
            hasContentState={true}
            error={fieldErrors.cedula}
            maxLength={8}
          />
        </div>

        {/* Campo de contraseña solo para nuevos usuarios */}
        {!isEditMode && (
          <div style={{ marginBottom: "42px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <label style={{ fontSize: "14px", fontWeight: "500", color: "#374151", flex: 1 }}>
                Contraseña temporal (se enviará al usuario)
              </label>
              <button
                type="button"
                onClick={generateNewPassword}
                disabled={isLoading}
                style={{
                  padding: "4px 8px",
                  fontSize: "12px",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Generar nueva
              </button>
            </div>
            <Input
              name="password"
              type="text"
              placeholder="Contraseña temporal"
              required
              onChange={handleChange}
              value={formData.password || ""}
              disabled={isLoading}
              icon={<Lock size={16} />}
              hasContentState={true}
              error={fieldErrors.password}
            />
          </div>
        )}

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
          {fieldErrors.role && (
            <div style={{ marginTop: "4px", color: "#dc2626", fontSize: "12px" }}>{fieldErrors.role}</div>
          )}
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

        <ValidationErrorsDisplay />

        {/* Indicador de éxito cuando todo está correcto */}
        {isFormValid && (
          <div
            style={{
              padding: "12px",
              backgroundColor: "#f0fdf4",
              border: "1px solid #22c55e",
              borderRadius: "6px",
              marginBottom: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <CheckCircle size={16} style={{ color: "#22c55e", flexShrink: 0 }} />
              <p style={{ margin: 0, color: "#22c55e", fontSize: "14px", fontWeight: "500" }}>
                ¡Perfecto! Todos los campos están completos y son válidos.
                <br />
                {isEditMode ? " Los cambios serán guardados." : " El usuario será registrado en el sistema."}
              </p>
            </div>
          </div>
        )}
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

  const handleValidateClose = useCallback(() => {
    if (formRef.current) {
      return formRef.current.validateForClose()
    }
    return true
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
          : "Registrando..."
        : isEditMode
          ? "Guardar Cambios"
          : "Registrar Usuario",
      onclick: handleSave,
      cancel: isEditMode,
      lazy: true,
      onValidateClose: handleValidateClose,
    }),
    [isEditMode, isLoading, handleSave, handleValidateClose],
  )

  const renderForm = useCallback(() => {
    return <AggEditarForm ref={formRef} item={item} />
  }, [item])

  return <Modal {...modalProps}>{renderForm}</Modal>
})

AggEditar.displayName = "AggEditar"

export default AggEditar
