"use client"
import type React from "react"
import { useState, useEffect, useCallback, useMemo, memo, useRef, useImperativeHandle, forwardRef } from "react"
import { SquarePen, Plus, FileText, User, BookOpen, Target, Calendar, AlignLeft } from "lucide-react"
import { useGlobal, useGlobalStatic, type DataItem } from "../../../context/Global"
import Modal from "../../../../ux/modal"
import Input from "../../../../ux/input"
import InputFile from "../../../../ux/input-file"
import Textarea from "../../../../ux/textarea"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectLabel,
  SelectSeparator,
  SelectItem,
} from "../../../../ux/select"
import type { TrabajoStatus } from "../../../context/Global"

interface AggEditarProps {
  item?: DataItem
}

// Interface para las líneas de investigación
interface LineaInvestigacion {
  id: number
  nombre: string
  estado: boolean
}

// Interface para los períodos académicos
interface PeriodoAcademico {
  id: number
  periodo: string
  _count?: {
    Trabajos: number
  }
}

// Interface para la respuesta del API de líneas
interface ApiResponseLineas {
  type: string
  message: string
  data: LineaInvestigacion[]
}

// Interface para la respuesta del API de períodos
interface ApiResponsePeriodos {
  type: string
  message: string
  data: {
    periodos: PeriodoAcademico[]
    total: number
  }
}

// Interface para el formulario
interface FormData {
  titulo: string
  autor: string
  lineaDeInvestigacion: string
  estado: TrabajoStatus
  periodoAcademico: string
  pdfUrl?: string
  resumen?: string
}

// Interface para el ref del formulario
interface FormRef {
  handleSave: () => Promise<boolean>
  isLoading: boolean
  resetForm: () => void
}

// 🔥 COMPONENTE DEL FORMULARIO CON BASE64 CORREGIDO
const AggEditarForm = memo(
  forwardRef<FormRef, AggEditarProps>(({ item }, ref) => {
    // Zustand methods
    const updateItem = useGlobal((state) => state.updateItem)
    const setData = useGlobal((state) => state.setData)
    const dataItems = useGlobal((state) => state.data.items)
    const badges = useGlobalStatic((state) => state.badges)

    const isEditMode = !!item

    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [lineasDeInvestigacion, setLineasDeInvestigacion] = useState<LineaInvestigacion[]>([])
    const [loadingLineas, setLoadingLineas] = useState(false)
    const [periodosAcademicos, setPeriodosAcademicos] = useState<PeriodoAcademico[]>([])
    const [loadingPeriodos, setLoadingPeriodos] = useState(false)

    const [formData, setFormData] = useState<FormData>({
      titulo: "",
      autor: "",
      lineaDeInvestigacion: "",
      estado: "PENDIENTE",
      periodoAcademico: "",
      pdfUrl: "",
      resumen: "",
    })

    // 🔥 FUNCIÓN CORREGIDA: Convertir archivo a base64
    const convertFileToBase64 = useCallback(async (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = () => {
          try {
            const base64 = reader.result as string
            // Remover el prefijo "data:application/pdf;base64," para obtener solo el contenido base64
            const base64Content = base64.split(',')[1] || base64
            console.log("✅ Archivo convertido a base64 exitosamente")
            resolve(base64Content)
          } catch (error) {
            console.error("❌ Error al procesar base64:", error)
            reject(new Error('Error al procesar el archivo'))
          }
        }

        reader.onerror = () => {
          console.error("❌ Error al leer el archivo")
          reject(new Error('Error al leer el archivo'))
        }

        // Convertir archivo a base64
        reader.readAsDataURL(file)
      })
    }, [])

    // Fetch líneas de investigación
    const fetchLineasDeInvestigacion = useCallback(async () => {
      setLoadingLineas(true)
      try {
        const response = await fetch('http://localhost:4000/lineas-de-investigacion/get-all')
        if (!response.ok) {
          throw new Error('Error al obtener líneas de investigación')
        }

        const responseData: ApiResponseLineas = await response.json()
        console.log("Respuesta líneas de investigación:", responseData)

        const lineasData = responseData.data

        if (!Array.isArray(lineasData)) {
          console.error('Los datos no son un array:', lineasData)
          setLineasDeInvestigacion([])
          return
        }

        const lineasActivas = lineasData
          .filter((linea: LineaInvestigacion) => linea && linea.estado === true)
          .sort((a: LineaInvestigacion, b: LineaInvestigacion) => a.nombre.localeCompare(b.nombre))

        setLineasDeInvestigacion(lineasActivas)
        console.log("Líneas activas cargadas:", lineasActivas)
      } catch (error) {
        console.error('Error al cargar líneas de investigación:', error)
        setLineasDeInvestigacion([])
      } finally {
        setLoadingLineas(false)
      }
    }, [])

    // Fetch períodos académicos
    const fetchPeriodosAcademicos = useCallback(async () => {
      setLoadingPeriodos(true)
      try {
        const response = await fetch('http://localhost:4000/periodo/get-all')
        if (!response.ok) {
          throw new Error('Error al obtener períodos académicos')
        }

        const responseData: ApiResponsePeriodos = await response.json()
        console.log("Respuesta períodos académicos:", responseData)

        const periodosData = responseData.data?.periodos

        if (!Array.isArray(periodosData)) {
          console.error('Los datos de períodos no son un array:', periodosData)
          setPeriodosAcademicos([])
          return
        }

        const periodosOrdenados = periodosData
          .filter((periodo: PeriodoAcademico) => periodo && periodo.periodo)
          .sort((a: PeriodoAcademico, b: PeriodoAcademico) => {
            const aEsAcademico = /^\d{4}-[12]$/.test(a.periodo)
            const bEsAcademico = /^\d{4}-[12]$/.test(b.periodo)

            if (aEsAcademico && bEsAcademico) {
              return b.periodo.localeCompare(a.periodo)
            } else if (aEsAcademico && !bEsAcademico) {
              return -1
            } else if (!aEsAcademico && bEsAcademico) {
              return 1
            } else {
              return a.periodo.localeCompare(b.periodo)
            }
          })

        setPeriodosAcademicos(periodosOrdenados)
        console.log("Períodos cargados:", periodosOrdenados)
      } catch (error) {
        console.error('Error al cargar períodos académicos:', error)
        setPeriodosAcademicos([])
      } finally {
        setLoadingPeriodos(false)
      }
    }, [])

    // Cargar datos al montar el componente
    useEffect(() => {
      fetchLineasDeInvestigacion()
      fetchPeriodosAcademicos()
    }, [fetchLineasDeInvestigacion, fetchPeriodosAcademicos])

    // Reset form
    const resetForm = useCallback(() => {
      setFormData({
        titulo: "",
        autor: "",
        lineaDeInvestigacion: "",
        estado: "PENDIENTE",
        periodoAcademico: "",
        pdfUrl: "",
        resumen: "",
      })
      setSelectedFile(null)
    }, [])

    // Initialize form data
    useEffect(() => {
      if (isEditMode && item) {
        const newFormData = {
          titulo: item.titulo || "",
          autor: item.autor || "",
          lineaDeInvestigacion: item.lineaDeInvestigacionId?.toString() || "",
          estado: item.estado || "PENDIENTE",
          periodoAcademico: item.periodoAcademicoId?.toString() || "",
          pdfUrl: item.pdfUrl || "",
          resumen: item.resumen || "",
        }

        setFormData(newFormData)
        setSelectedFile(null)
      } else if (!isEditMode) {
        resetForm()
      }
    }, [item, isEditMode, resetForm])

    // Event handlers
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))
    }, [])

    // 🆕 Handler para el textarea del resumen
    const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))
    }, [])

    const handleEstadoChange = useCallback((value: string | string[]) => {
      const estadoValue = Array.isArray(value) ? value[0] : value
      const isValidStatus = (val: string): val is TrabajoStatus => {
        return val === "PENDIENTE" || val === "VALIDADO" || val === "RECHAZADO"
      }

      if (isValidStatus(estadoValue)) {
        setFormData((prev) => ({ ...prev, estado: estadoValue }))
      }
    }, [])

    const handleLineaChange = useCallback((value: string | string[]) => {
      const lineaValue = Array.isArray(value) ? value[0] : value
      setFormData((prev) => ({ ...prev, lineaDeInvestigacion: lineaValue }))
    }, [])

    const handlePeriodoChange = useCallback((value: string | string[]) => {
      const periodoValue = Array.isArray(value) ? value[0] : value
      setFormData((prev) => ({ ...prev, periodoAcademico: periodoValue }))
    }, [])

    const handleFileChange = useCallback((file: File | null) => {
      setSelectedFile(file)
      if (file) {
        setFormData((prev) => ({ ...prev, pdfUrl: file.name }))
      } else {
        setFormData((prev) => ({ ...prev, pdfUrl: "" }))
      }
    }, [])

    // 🔥 FUNCIÓN PRINCIPAL CORREGIDA: handleSave con base64
    const handleSave = useCallback(async (): Promise<boolean> => {
      console.log("🚀 Iniciando guardado del trabajo...")
      console.log("📝 Datos del formulario:", formData)

      // Validaciones
      if (!formData.titulo.trim()) {
        console.error("❌ Error: El título es requerido")
        alert("El título es requerido")
        return false
      }

      if (!formData.autor.trim()) {
        console.error("❌ Error: El autor es requerido")
        alert("El autor es requerido")
        return false
      }

      if (!formData.lineaDeInvestigacion) {
        console.error("❌ Error: La línea de investigación es requerida")
        alert("La línea de investigación es requerida")
        return false
      }

      if (!formData.periodoAcademico) {
        console.error("❌ Error: El período académico es requerido")
        alert("El período académico es requerido")
        return false
      }

      // Validación de archivo en modo creación
      if (!isEditMode && !selectedFile) {
        console.error("❌ Error: El archivo PDF es requerido")
        alert("El archivo PDF es requerido")
        return false
      }

      setIsLoading(true)
      console.log("⏳ Estado de carga activado")

      try {
        let pdfBase64Content: string | undefined = undefined
        let fileName = formData.pdfUrl || ""

        // 🔥 PROCESAR ARCHIVO PDF A BASE64
        if (selectedFile) {
          console.log("📎 Convirtiendo archivo a base64:", selectedFile.name)

          try {
            pdfBase64Content = await convertFileToBase64(selectedFile)
            fileName = selectedFile.name
            console.log("✅ Archivo convertido exitosamente, tamaño base64:", pdfBase64Content.length)
          } catch (fileError) {
            console.error("❌ Error al convertir archivo:", fileError)
            alert("Error al procesar el archivo PDF. Verifique que sea un archivo válido.")
            return false
          }
        }

        if (isEditMode) {
          if (!item?.id) {
            throw new Error("No se puede actualizar: ID del item no encontrado")
          }

          console.log("✏️ Modo edición - Actualizando trabajo con ID:", item.id)

          // 🔥 PAYLOAD DE ACTUALIZACIÓN CON BASE64
          const updatePayload = {
            titulo: formData.titulo.trim(),
            autor: formData.autor.trim(),
            lineaDeInvestigacionId: parseInt(formData.lineaDeInvestigacion),
            estado: formData.estado,
            periodoAcademicoId: parseInt(formData.periodoAcademico),
            doc: fileName,
            pdfBase64: pdfBase64Content, // 🔥 CONTENIDO BASE64 DEL PDF
            resumen: formData.resumen?.trim() || "",
          }

          console.log("📤 Payload de actualización:", {
            ...updatePayload,
            pdfBase64: pdfBase64Content ? `[BASE64_CONTENT_${pdfBase64Content.length}_CHARS]` : 'Sin cambios'
          })

          const response = await fetch(`http://localhost:4000/trabajos/update/${item.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatePayload),
          })

          console.log("🌐 Respuesta del servidor (actualización):", response.status)

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }))
            throw new Error(errorData.message || "Error al actualizar el trabajo")
          }

          const updatedData = await response.json()
          console.log("✅ Trabajo actualizado exitosamente:", updatedData)

          // Actualizar en el estado local
          updateItem(item.id, {
            titulo: formData.titulo,
            autor: formData.autor,
            lineaDeInvestigacion: updatedData.data?.lineaDeInvestigacion?.nombre ||
              lineasDeInvestigacion.find(l => l.id === parseInt(formData.lineaDeInvestigacion))?.nombre ||
              formData.lineaDeInvestigacion,
            lineaDeInvestigacionId: parseInt(formData.lineaDeInvestigacion),
            periodoAcademico: updatedData.data?.periodoAcademico?.periodo ||
              periodosAcademicos.find(p => p.id === parseInt(formData.periodoAcademico))?.periodo ||
              formData.periodoAcademico,
            periodoAcademicoId: parseInt(formData.periodoAcademico),
            estado: formData.estado,
            pdfUrl: fileName,
            resumen: formData.resumen,
          })

          console.log("🔄 Estado local actualizado")
          alert("Trabajo actualizado exitosamente")

        } else {
          console.log("➕ Modo creación - Creando nuevo trabajo")

          // 🔥 PAYLOAD DE CREACIÓN CON BASE64
          const createPayload = {
            token: localStorage.getItem("auth_token") || "",
            titulo: formData.titulo.trim(),
            autor: formData.autor.trim(),
            lineaDeInvestigacionId: parseInt(formData.lineaDeInvestigacion),
            estado: formData.estado,
            periodoAcademicoId: parseInt(formData.periodoAcademico),
            doc: fileName,
            pdfBase64: pdfBase64Content, // 🔥 CONTENIDO BASE64 DEL PDF
            resumen: formData.resumen?.trim() || "",
          }

          console.log("📤 Payload de creación:", {
            ...createPayload,
            pdfBase64: pdfBase64Content ? `[BASE64_CONTENT_${pdfBase64Content.length}_CHARS]` : 'No content'
          })

          const response = await fetch("http://localhost:4000/trabajos/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(createPayload),
          })

          console.log("🌐 Respuesta del servidor (creación):", response.status)

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }))
            console.error("❌ Error del servidor:", errorData)
            throw new Error(errorData.message || "Error al crear el trabajo")
          }

          const createdData = await response.json()
          console.log("✅ Trabajo creado exitosamente:", createdData)

          // Agregar al estado local con los datos del backend
          const newItem: DataItem = {
            id: createdData.data.id,
            titulo: createdData.data.titulo,
            autor: createdData.data.autor,
            lineaDeInvestigacion: createdData.data.lineaDeInvestigacion?.nombre ||
              lineasDeInvestigacion.find(l => l.id === parseInt(formData.lineaDeInvestigacion))?.nombre ||
              formData.lineaDeInvestigacion,
            lineaDeInvestigacionId: createdData.data.lineaDeInvestigacionId,
            periodoAcademico: createdData.data.periodoAcademico?.periodo ||
              periodosAcademicos.find(p => p.id === parseInt(formData.periodoAcademico))?.periodo ||
              formData.periodoAcademico,
            periodoAcademicoId: createdData.data.periodoAcademicoId,
            estado: createdData.data.estado.toUpperCase() as TrabajoStatus,
            pdfUrl: createdData.data.doc,
            resumen: createdData.data.resumen,
          }

          const updatedItems = [newItem, ...dataItems]
          setData({ items: updatedItems })

          console.log("🔄 Estado local actualizado con nuevo item")
          alert("Trabajo creado exitosamente")

          resetForm()
        }

        return true

      } catch (error) {
        console.error(`❌ Error al ${isEditMode ? "actualizar" : "crear"} trabajo:`, error)
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        alert(`Error al ${isEditMode ? "actualizar" : "crear"} el trabajo: ${errorMessage}`)
        return false
      } finally {
        setIsLoading(false)
        console.log("✅ Proceso de guardado finalizado")
      }
    }, [
      formData,
      selectedFile,
      convertFileToBase64,
      isEditMode,
      item?.id,
      updateItem,
      setData,
      dataItems,
      resetForm,
      lineasDeInvestigacion,
      periodosAcademicos
    ])

    // Exponer funciones a través del ref
    useImperativeHandle(
      ref,
      () => ({
        handleSave,
        isLoading,
        resetForm,
      }),
      [handleSave, isLoading, resetForm],
    )

    // Placeholder del archivo
    const filePlaceholder = useMemo(() => {
      if (isEditMode && formData.pdfUrl && !selectedFile) {
        return `Archivo actual: ${formData.pdfUrl}`
      }
      return "Haz clic para seleccionar un archivo PDF"
    }, [isEditMode, formData.pdfUrl, selectedFile])

    return (
      <div className="trabajo-form">
        <div style={{ marginBottom: "42px", marginTop: "32px" }}>
          <Input
            name="titulo"
            type="text"
            placeholder="Título del trabajo"
            required
            onChange={handleChange}
            value={formData.titulo}
            disabled={isLoading}
            icon={<BookOpen size={16} />}
            hasContentState={true}
          />
        </div>
        <div style={{ marginBottom: "42px" }}>
          <Input
            name="autor"
            type="text"
            placeholder="Nombre del autor"
            required
            onChange={handleChange}
            value={formData.autor}
            disabled={isLoading}
            icon={<User size={16} />}
            hasContentState={true}
          />
        </div>

        {/* Select de líneas de investigación */}
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
            <Target size={16} style={{ marginRight: "8px", marginLeft: "10px" }} />
            Línea de investigación
          </label>
          <Select
            value={formData.lineaDeInvestigacion || ""}
            onValueChange={handleLineaChange}
            width="370px"
          >
            <SelectTrigger>
              <SelectValue placeholder={loadingLineas ? "Cargando líneas..." : "Seleccionar línea de investigación"} />
            </SelectTrigger>
            <SelectContent>
              <SelectLabel>Líneas disponibles</SelectLabel>
              <SelectSeparator />
              {lineasDeInvestigacion.map((linea) => (
                <SelectItem key={linea.id} value={linea.id.toString()}>
                  {linea.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Select de períodos académicos */}
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
            <Calendar size={16} style={{ marginRight: "8px", marginLeft: "10px" }} />
            Período académico
          </label>
          <Select
            value={formData.periodoAcademico || ""}
            onValueChange={handlePeriodoChange}
            width="370px"
          >
            <SelectTrigger>
              <SelectValue placeholder={loadingPeriodos ? "Cargando períodos..." : "Seleccionar período académico"} />
            </SelectTrigger>
            <SelectContent>
              <SelectLabel>Períodos disponibles</SelectLabel>
              <SelectSeparator />
              {periodosAcademicos.map((periodo) => (
                <SelectItem key={periodo.id} value={periodo.id.toString()}>
                  {periodo.periodo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Select de estado */}
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
            <FileText size={16} style={{ marginRight: "8px", marginLeft: "10px" }} />
            Estado del trabajo
          </label>
          <Select value={formData.estado} onValueChange={handleEstadoChange}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectLabel>Estados disponibles</SelectLabel>
              <SelectSeparator />
              <SelectItem value="PENDIENTE">
                <span style={{ color: badges.estados.PENDIENTE.color }}>{badges.estados.PENDIENTE.name}</span>
              </SelectItem>
              <SelectItem value="VALIDADO">
                <span style={{ color: badges.estados.VALIDADO.color }}>{badges.estados.VALIDADO.name}</span>
              </SelectItem>
              <SelectItem value="RECHAZADO">
                <span style={{ color: badges.estados.RECHAZADO.color }}>{badges.estados.RECHAZADO.name}</span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 🆕 Campo de resumen usando Textarea */}
        <div style={{ marginBottom: "7px" }}>
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
            <AlignLeft size={16} style={{ marginRight: "8px", marginLeft: "10px" }} />
            Resumen del trabajo
          </label>
          <Textarea
            name="resumen"
            placeholder="Escriba un resumen del trabajo (opcional)"
            value={formData.resumen || ""}
            onChange={handleTextareaChange}
            disabled={isLoading}
            rows={4}
            maxLength={500}
            style={{
              width: "100%",
              minHeight: "100px",
              resize: "vertical"
            }}
          />
          <div style={{
            fontSize: "12px",
            color: "#6B7280",
            marginTop: "4px",
            textAlign: "right"
          }}>
            {formData.resumen?.length || 0}/500 caracteres
          </div>
        </div>

        {/* Input de archivo */}
        <div style={{ marginBottom: "15px" }}>
          <InputFile
            name="pdfUrl"
            label="Documento PDF del trabajo"
            value={selectedFile}
            onChange={handleFileChange}
            accept=".pdf"
            placeholder={filePlaceholder}
            required={!isEditMode}
            disabled={isLoading}
            maxSize="Máximo 10MB"
            icon={<FileText size={16} style={{ marginLeft: "10px" }} />}
          />
        </div>


      </div>
    )
  }),
)

AggEditarForm.displayName = "AggEditarForm"

// Componente principal
const AggEditar: React.FC<AggEditarProps> = memo(({ item }) => {
  const isEditMode = !!item
  const formRef = useRef<FormRef>(null)

  const handleSave = useCallback((): boolean => {
    console.log("🎯 AggEditar.handleSave ejecutado")

    if (!formRef.current) {
      console.error("❌ formRef.current es null")
      return false
    }

    // Ejecutar guardado asíncrono
    formRef.current.handleSave().then((result) => {
      console.log("📊 Resultado del guardado:", result)
    }).catch((error) => {
      console.error("❌ Error inesperado:", error)
    })

    return true
  }, [])

  const isLoading = formRef.current?.isLoading || false

  const modalProps = useMemo(
    () => ({
      title: isEditMode ? "" : "Agregar Trabajo",
      icon: isEditMode ? <SquarePen size={16} /> : <Plus size={16} />,
      buttonClassName: `table-modal-btn save-trabajo-btn ${isEditMode ? "action-btn" : ""}`,
      buttonText: isLoading
        ? isEditMode
          ? "Actualizando..."
          : "Guardando..."
        : isEditMode
          ? "Guardar Cambios"
          : "Guardar Trabajo",
      onValidateClose: handleSave,
      cancel: isEditMode,
      lazy: true,
      preventClose: isLoading
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