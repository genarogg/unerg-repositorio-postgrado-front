"use client"
import type React from "react"
import { Eye, Download, FileText } from "lucide-react"
import { useGlobalStatic, type DataItem } from "../../../context/Global"
import Modal from "../../../../ux/modal"
import { Badge } from "../../../../ux"
import "./css/viewDetails.css"

interface ViewDetailsProps {
  item: DataItem
}

const ViewDetails: React.FC<ViewDetailsProps> = ({ item }) => {
  const { badges } = useGlobalStatic()

  // Función auxiliar para verificar si un valor es un estado válido
  const isValidStatus = (value: any): value is keyof typeof badges.estados => {
    return typeof value === "string" && value in badges.estados
  }

  const handleDownloadDocument = () => {
    if (item.pdfUrl) {
      // Simular descarga del documento
      console.log(`Downloading document: ${item.pdfUrl}`)
      // En una app real, aquí se activaría la descarga real
      window.open(`/pdfs/${item.pdfUrl}`, "_blank")
    }
  }

  const modalProps = {
    title: "",
    icon: <Eye size={16} />,
    buttonClassName: "action-btn",
    buttonText: "Cerrar",
    onclick: () => {}, // Solo cerrar el modal
  }

  return (
    <Modal {...modalProps}>
      <div className="view-details-container">
        {/* ID Field */}
        <div className="detail-field">
          <span className="field-label">ID:</span>
          <span className="field-value field-value--id">#{item.id}</span>
        </div>

        {/* Título Field */}
        <div className="detail-field">
          <span className="field-label">TÍTULO:</span>
          <span className="field-value">{item.titulo}</span>
        </div>

        {/* Autor Field */}
        <div className="detail-field">
          <span className="field-label">AUTOR:</span>
          <span className="field-value">{item.autor}</span>
        </div>

        {/* Línea de Investigación Field */}
        <div className="detail-field">
          <span className="field-label">LÍNEA DE INVESTIGACIÓN:</span>
          <span className="field-value">{item.lineaDeInvestigacion}</span>
        </div>

        {/* Período Académico Field */}
        <div className="detail-field">
          <span className="field-label">PERÍODO ACADÉMICO:</span>
          <span className="field-value">{item.periodoAcademico}</span>
        </div>

        {/* Estado Field */}
        <div className="detail-field">
          <span className="field-label">ESTADO:</span>
          {isValidStatus(item.estado) ? (
            <Badge customColor={badges.estados[item.estado].color} width="110px">
              {badges.estados[item.estado].name}
            </Badge>
          ) : (
            <span className="field-value">{item.estado}</span>
          )}
        </div>

        {/* Document Section */}
        {item.pdfUrl && (
          <div className="document-section">
            <div className="document-header">
              <div className="document-info">
                <div className="document-icon">
                  <FileText size={20} color="white" />
                </div>
                <div className="document-details">
                  <div className="document-title">Documento del Trabajo</div>
                  <div className="document-filename">{item.pdfUrl}</div>
                </div>
              </div>
              <button onClick={handleDownloadDocument} className="download-button">
                <Download size={16} />
                Descargar
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default ViewDetails
