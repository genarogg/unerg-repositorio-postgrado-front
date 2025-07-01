"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { CheckboxGroup } from "../ux"
import { Database, BookOpen, FileText, Calendar, AlertCircle, Loader2 } from "lucide-react"
import "./reportes.css"

import decodeBase64Pdf from "./decodeBase64Pdf"

// Tipos para la configuración del reporte
interface ReportConfig {
  name: string
  description: string
  entities: string[]
  selectedLineas: string[]
  selectedPeriodos: string[]
}

// Tipos para los datos del backend
interface PeriodoAcademico {
  id: number
  periodo: string
  _count: {
    Trabajos: number
  }
}

interface LineaInvestigacion {
  id: number
  nombre: string
  estado: boolean
}

interface PeriodosResponse {
  type: string
  message: string
  data: {
    periodos: PeriodoAcademico[]
    total: number
  }
}

interface LineasResponse {
  type: string
  message: string
  data: LineaInvestigacion[]
}

// Tipo para el payload del reporte
interface ReportePayload {
  lineasInvestigacion: number[]
  periodosAcademicos: number[]
  configuracion?: {
    incluirEstadisticas: boolean
    formato: 'PDF' | 'EXCEL' | 'JSON'
  }
}

// Tipo para la respuesta del reporte
// interface ReporteResponse {
//   type: string
//   message: string
//   data?: {
//     reporteUrl?: string
//     reporteId?: string
//     estadisticas?: any
//   }
// }

interface ReporteResponse {
  type: string
  message: string
  data?: {
    reporteUrl?: string
    reporteId?: string
    estadisticas?: any
    pdfBase64?: string  // Agregar esta propiedad si el PDF viene aquí
  }
}

// Configuración de entidades y campos disponibles
const ENTITIES_CONFIG = {
  lineasInvestigacion: {
    label: "Líneas de Investigación",
    icon: <BookOpen size={16} />,
    fields: {
      id: { label: "ID", type: "number" },
      nombre: { label: "Nombre", type: "string" },
      estado: { label: "Estado", type: "boolean" },
      usuarioId: { label: "Usuario ID", type: "number" },
      "usuario.name": { label: "Nombre Usuario", type: "string" },
      "usuario.email": { label: "Email Usuario", type: "string" },
    },
  },
  trabajos: {
    label: "Trabajos",
    icon: <FileText size={16} />,
    fields: {
      id: { label: "ID", type: "number" },
      titulo: { label: "Título", type: "string" },
      autor: { label: "Autor", type: "string" },
      estado: { label: "Estado", type: "enum", options: ["PENDIENTE", "VALIDADO", "RECHAZADO"] },
      resumen: { label: "Resumen", type: "text" },
      lineaDeInvestigacionId: { label: "Línea de Investigación ID", type: "number" },
      "lineaDeInvestigacion.nombre": { label: "Línea de Investigación", type: "string" },
      periodoAcademicoId: { label: "Período Académico ID", type: "number" },
      "periodoAcademico.periodo": { label: "Período Académico", type: "string" },
    },
  },
  periodosAcademicos: {
    label: "Períodos Académicos",
    icon: <Calendar size={16} />,
    fields: {
      id: { label: "ID", type: "number" },
      periodo: { label: "Período", type: "string" },
    },
  },
}

const ConfiguracionReporte: React.FC = () => {
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    name: "",
    description: "",
    entities: [],
    selectedLineas: [],
    selectedPeriodos: [],
  })

  // Estados para los datos del backend
  const [lineasInvestigacion, setLineasInvestigacion] = useState<LineaInvestigacion[]>([])
  const [periodosAcademicos, setPeriodosAcademicos] = useState<PeriodoAcademico[]>([])
  const [loadingLineas, setLoadingLineas] = useState(true)
  const [loadingPeriodos, setLoadingPeriodos] = useState(true)
  const [loadingReporte, setLoadingReporte] = useState(false)
  const [errorLineas, setErrorLineas] = useState<string | null>(null)
  const [errorPeriodos, setErrorPeriodos] = useState<string | null>(null)
  const [errorReporte, setErrorReporte] = useState<string | null>(null)

  // Función para obtener líneas de investigación
  const fetchLineasInvestigacion = async () => {
    try {
      setLoadingLineas(true)
      setErrorLineas(null)

      const response = await fetch("http://localhost:4000/lineas-de-investigacion/get-all")

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }

      const data: LineasResponse = await response.json()

      if (data.type === "success") {
        // Filtrar solo las líneas activas
        const lineasActivas = data.data.filter((linea) => linea.estado === true)
        setLineasInvestigacion(lineasActivas)
      } else {
        throw new Error(data.message || "Error al obtener líneas de investigación")
      }
    } catch (error) {
      console.error("Error fetching líneas de investigación:", error)
      setErrorLineas(error instanceof Error ? error.message : "Error desconocido")
    } finally {
      setLoadingLineas(false)
    }
  }

  // Función para obtener períodos académicos
  const fetchPeriodosAcademicos = async () => {
    try {
      setLoadingPeriodos(true)
      setErrorPeriodos(null)

      const response = await fetch("http://localhost:4000/periodo/get-all")

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }

      const data: PeriodosResponse = await response.json()

      if (data.type === "success") {
        setPeriodosAcademicos(data.data.periodos)
      } else {
        throw new Error(data.message || "Error al obtener períodos académicos")
      }
    } catch (error) {
      console.error("Error fetching períodos académicos:", error)
      setErrorPeriodos(error instanceof Error ? error.message : "Error desconocido")
    } finally {
      setLoadingPeriodos(false)
    }
  }

  // Función para generar el reporte
  const generateReporte = async (payload: ReportePayload): Promise<ReporteResponse> => {
    try {
      setLoadingReporte(true)
      setErrorReporte(null)

      const response = await fetch("http://localhost:4000/reporte/generar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }

      const data: ReporteResponse = await response.json()

      // Verificar las diferentes posibilidades donde puede estar el PDF
      if (data.data) {
        if (typeof data.data === 'string') {
          // Si data es directamente el string base64
          decodeBase64Pdf(data.data, "Reporte.pdf");
        } else if (data.data.pdfBase64) {
          // Si está en la propiedad pdfBase64
          decodeBase64Pdf(data.data.pdfBase64, "Reporte.pdf");
        } else if (data.data.reporteUrl) {
          // Si está en reporteUrl
          decodeBase64Pdf(data.data.reporteUrl, "Reporte.pdf");
        } else {
          console.warn("No se encontró el PDF en base64 en la respuesta:", data);
        }
      }

      return data
    } catch (error) {
      console.error("Error generating reporte:", error)
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"
      setErrorReporte(errorMessage)
      throw error
    } finally {
      setLoadingReporte(false)
    }
  }

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchLineasInvestigacion()
    fetchPeriodosAcademicos()
  }, [])

  // Convertir datos del backend al formato esperado por CheckboxGroup
  const lineasOptions = lineasInvestigacion.map((linea) => ({
    id: linea.id.toString(),
    label: linea.nombre,
    description: `Línea de investigación ${linea.estado ? "activa" : "inactiva"}`,
  }))

  const periodosOptions = periodosAcademicos.map((periodo) => ({
    id: periodo.id.toString(),
    label: periodo.periodo,
    description: `${periodo._count.Trabajos} trabajo${periodo._count.Trabajos !== 1 ? "s" : ""} registrado${periodo._count.Trabajos !== 1 ? "s" : ""}`,
  }))

  // Opciones para selección de entidades
  const entityOptions = Object.entries(ENTITIES_CONFIG).map(([key, config]) => ({
    id: key,
    label: config.label,
    description: `Incluir datos de ${config.label.toLowerCase()}`,
  }))

  // Manejar cambios en la configuración
  const handleConfigChange = (key: keyof ReportConfig, value: any) => {
    setReportConfig((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Función para generar el reporte
  const handleGenerate = async () => {
    try {
      // Obtener los datos seleccionados con verificación de tipos
      const selectedLineasData = reportConfig.selectedLineas
        .map((id) => lineasInvestigacion.find((linea) => linea.id.toString() === id))
        .filter((linea): linea is LineaInvestigacion => linea !== undefined)

      const selectedPeriodosData = reportConfig.selectedPeriodos
        .map((id) => periodosAcademicos.find((periodo) => periodo.id.toString() === id))
        .filter((periodo): periodo is PeriodoAcademico => periodo !== undefined)

      // Preparar el payload para el backend
      const payload: ReportePayload = {
        lineasInvestigacion: selectedLineasData.map(linea => linea.id),
        periodosAcademicos: selectedPeriodosData.map(periodo => periodo.id),
        configuracion: {
          incluirEstadisticas: true,
          formato: 'JSON'
        }
      }

      console.log("Payload enviado al backend:", payload)

      // Llamar al endpoint para generar el reporte
      const reporteResponse = await generateReporte(payload)

      console.log("Respuesta del reporte:", reporteResponse)

      // Mostrar resumen de los datos seleccionados
      const selectedData = {
        lineasInvestigacion: selectedLineasData,
        periodosAcademicos: selectedPeriodosData,
        totalSelections: reportConfig.selectedLineas.length + reportConfig.selectedPeriodos.length,
        resumen: {
          lineasCount: selectedLineasData.length,
          periodosCount: selectedPeriodosData.length,
          totalTrabajos: selectedPeriodosData.reduce((total, periodo) => total + periodo._count.Trabajos, 0),
        },
      }

      console.log("Datos seleccionados para el reporte:", selectedData)

      // Mostrar mensaje de éxito
      alert(`¡Reporte generado exitosamente!

Resumen:
- ${selectedData.resumen.lineasCount} líneas de investigación
- ${selectedData.resumen.periodosCount} períodos académicos  
- ${selectedData.resumen.totalTrabajos} trabajos en total

${reporteResponse.data?.reporteId ? `ID del reporte: ${reporteResponse.data.reporteId}` : ''}
${reporteResponse.data?.reporteUrl ? `URL: ${reporteResponse.data.reporteUrl}` : ''}

Ver consola para más detalles.`)

    } catch (error) {
      console.error("Error al generar el reporte:", error)
      alert(`Error al generar el reporte: ${errorReporte || 'Error desconocido'}`)
    }
  }

  // Función para reintentar la carga de datos
  const handleRetryLineas = () => {
    fetchLineasInvestigacion()
  }

  const handleRetryPeriodos = () => {
    fetchPeriodosAcademicos()
  }

  return (
    <div className="reportes-main-container">
      <div className="reportes-card-wrapper">
        {/* Header de la tarjeta principal */}
        <div className="reportes-card-header">
          <div className="header-content">
            <div className="header-icon">
              <FileText size={24} />
            </div>
            <div className="header-text">
              <h2>Configuración de Reporte</h2>
              <p>Selecciona las líneas de investigación y períodos académicos para generar tu reporte personalizado</p>
            </div>
          </div>
        </div>

        {/* Contenido de las tarjetas */}
        <div className="reportes-card-content">
          <div className="config-grid">
            {/* Líneas de Investigación */}
            <div className="config-card">
              <div className="config-card-header">
                <BookOpen size={20} />
                <h3>Líneas de Investigación</h3>
                <div className="selection-counter">{reportConfig.selectedLineas.length} seleccionadas</div>
              </div>
              <div className="config-card-content">
                {loadingLineas ? (
                  <div className="loading-state">
                    <Loader2 size={24} className="loading-spinner" />
                    <p>Cargando líneas de investigación...</p>
                  </div>
                ) : errorLineas ? (
                  <div className="error-state">
                    <AlertCircle size={24} />
                    <p>Error al cargar líneas de investigación:</p>
                    <span className="error-message">{errorLineas}</span>
                    <button className="retry-button" onClick={handleRetryLineas}>
                      Reintentar
                    </button>
                  </div>
                ) : lineasOptions.length > 0 ? (
                  <CheckboxGroup
                    title="Selecciona las líneas de investigación"
                    subtitle="Elige qué líneas de investigación incluir en tu reporte"
                    options={lineasOptions}
                    selectedValues={reportConfig.selectedLineas}
                    onChange={(values) => handleConfigChange("selectedLineas", values)}
                    allowMultiple={true}
                    showSelectAll={true}
                  />
                ) : (
                  <div className="empty-state">
                    <BookOpen size={24} />
                    <p>No hay líneas de investigación disponibles</p>
                  </div>
                )}
              </div>
            </div>

            {/* Períodos Académicos */}
            <div className="config-card">
              <div className="config-card-header">
                <Calendar size={20} />
                <h3>Períodos Académicos</h3>
                <div className="selection-counter">{reportConfig.selectedPeriodos.length} seleccionados</div>
              </div>
              <div className="config-card-content">
                {loadingPeriodos ? (
                  <div className="loading-state">
                    <Loader2 size={24} className="loading-spinner" />
                    <p>Cargando períodos académicos...</p>
                  </div>
                ) : errorPeriodos ? (
                  <div className="error-state">
                    <AlertCircle size={24} />
                    <p>Error al cargar períodos académicos:</p>
                    <span className="error-message">{errorPeriodos}</span>
                    <button className="retry-button" onClick={handleRetryPeriodos}>
                      Reintentar
                    </button>
                  </div>
                ) : periodosOptions.length > 0 ? (
                  <CheckboxGroup
                    title="Selecciona los períodos académicos"
                    subtitle="Elige qué períodos académicos incluir en tu reporte"
                    options={periodosOptions}
                    selectedValues={reportConfig.selectedPeriodos}
                    onChange={(values) => handleConfigChange("selectedPeriodos", values)}
                    allowMultiple={true}
                    showSelectAll={true}
                  />
                ) : (
                  <div className="empty-state">
                    <Calendar size={24} />
                    <p>No hay períodos académicos disponibles</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer con botón generar */}
        <div className="reportes-card-footer">
          <div className="footer-summary">
            <div className="summary-item">
              <span className="summary-label">Líneas seleccionadas:</span>
              <span className="summary-value">{reportConfig.selectedLineas.length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Períodos seleccionados:</span>
              <span className="summary-value">{reportConfig.selectedPeriodos.length}</span>
            </div>
          </div>

          {errorReporte && (
            <div className="error-message">
              Error: {errorReporte}
            </div>
          )}

          <button
            className="generate-button"
            onClick={handleGenerate}
            disabled={
              (reportConfig.selectedLineas.length === 0 && reportConfig.selectedPeriodos.length === 0) ||
              loadingLineas ||
              loadingPeriodos ||
              loadingReporte
            }
          >
            <Database size={20} />
            {loadingReporte ? "Generando reporte..." :
              loadingLineas || loadingPeriodos ? "Cargando..." : "Generar Reporte"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfiguracionReporte