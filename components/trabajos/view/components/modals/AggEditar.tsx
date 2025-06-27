"use client"
import type React from "react"
import { useState, useEffect, useCallback, useMemo, memo, useRef, useImperativeHandle, forwardRef } from "react"
import { SquarePen, Plus, FileText, User, BookOpen, Target, Calendar } from "lucide-react"
import { useGlobal, useGlobalStatic, type DataItem, type TrabajoStatus } from "../../../context/Global"
import Modal from "../../../../ux/modal"
import Input from "../../../../ux/input"
import InputFile from "../../../../ux/input-file"
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
  handleSave: () => Promise<void>
  isLoading: boolean
}

// 🔥 OPTIMIZACIÓN CRÍTICA: Componente del formulario con forwardRef
const AggEditarForm = memo(
  forwardRef<FormRef, AggEditarProps>(({ item }, ref) => {
    // 🔥 OPTIMIZACIÓN: Usar métodos específicos de Zustand
    const updateItem = useGlobal((state) => state.updateItem)
    const setData = useGlobal((state) => state.setData)
    const dataItems = useGlobal((state) => state.data.items)

    // 🔥 OPTIMIZACIÓN: Suscripción selectiva al estado estático
    const badges = useGlobalStatic((state) => state.badges)

    const isEditMode = !!item

    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState<FormData>({
      titulo: "",
      autor: "",
      lineaDeInvestigacion: "",
      estado: "PENDIENTE",
      periodoAcademico: "",
      pdfUrl: "",
      resumen: "",
    })

    // Datos de ejemplo
    const lineasDeInvestigacion = [
      "Inteligencia Artificial",
      "Desarrollo Web",
      "Ciberseguridad",
      "Bases de Datos",
      "Cloud Computing",
      "IoT",
      "Blockchain",
      "Realidad Virtual",
      "Big Data",
      "Desarrollo de Videojuegos",
    ]

    const periodosAcademicos = ["2024-1", "2024-2", "2023-1", "2023-2"]

    // 🔥 OPTIMIZACIÓN: Memoizar resetForm
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

    // 🔥 OPTIMIZACIÓN CRÍTICA: useEffect con dependencias específicas
    useEffect(() => {
      if (isEditMode && item) {
        const newFormData = {
          titulo: item.titulo || "",
          autor: item.autor || "",
          lineaDeInvestigacion: item.lineaDeInvestigacion || "",
          estado: item.estado || "PENDIENTE",
          periodoAcademico: item.periodoAcademico || "",
          pdfUrl: item.pdfUrl || "",
          resumen: item.resumen || "",
        }

        setFormData(newFormData)
        setSelectedFile(null)
      } else if (!isEditMode) {
        resetForm()
      }
    }, [
      item?.id,
      item?.titulo,
      item?.autor,
      item?.lineaDeInvestigacion,
      item?.estado,
      item?.periodoAcademico,
      item?.pdfUrl,
      isEditMode,
      resetForm,
    ])

    // 🔥 OPTIMIZACIÓN: Memoizar handlers
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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

    // 🔥 OPTIMIZACIÓN: Memoizar handleFileChange
    const handleFileChange = useCallback((file: File | null) => {
      setSelectedFile(file)
      if (file) {
        setFormData((prev) => ({ ...prev, pdfUrl: file.name }))
      } else {
        setFormData((prev) => ({ ...prev, pdfUrl: "" }))
      }
    }, [])

    // 🔥 OPTIMIZACIÓN CORREGIDA: Generar ID basado en el máximo existente + 1
    const generateId = useCallback(() => {
      if (dataItems.length === 0) {
        return 1
      }

      const maxId = Math.max(...dataItems.map((item) => item.id))
      return maxId + 1
    }, [dataItems])

    const uploadFile = useCallback(async (file: File): Promise<string> => {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      return file.name
    }, [])

    const handleSave = useCallback(async () => {
      // Validaciones
      if (!formData.titulo || !formData.autor || !formData.lineaDeInvestigacion || !formData.periodoAcademico) {
        console.error("Todos los campos son requeridos")
        return
      }

      setIsLoading(true)
      try {
        let pdfUrl = formData.pdfUrl
        if (selectedFile) {
          pdfUrl = await uploadFile(selectedFile)
        }
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const itemData = { ...formData, pdfUrl }

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
        console.error(`Error al ${isEditMode ? "actualizar" : "agregar"} trabajo:`, error)
      } finally {
        setIsLoading(false)
      }
    }, [formData, selectedFile, uploadFile, isEditMode, item?.id, updateItem, setData, generateId, dataItems])

    // 🔥 NUEVO: Exponer funciones a través del ref
    useImperativeHandle(
      ref,
      () => ({
        handleSave,
        isLoading,
      }),
      [handleSave, isLoading],
    )

    // 🔥 OPTIMIZACIÓN: Memoizar placeholder del archivo
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
          <Select value={formData.lineaDeInvestigacion || ""} onValueChange={handleLineaChange}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar línea de investigación" />
            </SelectTrigger>
            <SelectContent>
              <SelectLabel>Líneas disponibles</SelectLabel>
              <SelectSeparator />
              {lineasDeInvestigacion.map((linea) => (
                <SelectItem key={linea} value={linea}>
                  {linea}
                </SelectItem>
              ))}
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
            <Calendar size={16} style={{ marginRight: "8px", marginLeft: "10px" }} />
            Período académico
          </label>
          <Select value={formData.periodoAcademico || ""} onValueChange={handlePeriodoChange}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar período académico" />
            </SelectTrigger>
            <SelectContent>
              <SelectLabel>Períodos disponibles</SelectLabel>
              <SelectSeparator />
              {periodosAcademicos.map((periodo) => (
                <SelectItem key={periodo} value={periodo}>
                  {periodo}
                </SelectItem>
              ))}
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

        <div style={{ marginBottom: "7px" }}>
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
      action: handleSave,
      cancel: isEditMode,
      lazy: true,
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
