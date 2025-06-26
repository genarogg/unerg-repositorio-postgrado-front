"use client"
import type React from "react"
import { Eye } from "lucide-react"
import { useGlobalStatic, type DataItem } from "../../../context/Global"
import Modal from "../../../../ux/modal"
import { Badge } from "../../../../ux"
import "./css/viewDetails.css"

interface ViewDetailsProps {
  item: DataItem
}

const ViewDetails: React.FC<ViewDetailsProps> = ({ item }) => {
  const { badges } = useGlobalStatic()

  // Función auxiliar para verificar si un valor es un rol válido
  const isValidRole = (value: any): value is keyof typeof badges.roles => {
    return typeof value === "string" && value in badges.roles
  }

  // Función auxiliar para verificar si un valor es un estado válido
  const isValidStatus = (value: any): value is keyof typeof badges.estados => {
    return typeof value === "string" && value in badges.estados
  }

  const handleDownloadDocument = () => {
    // Simulate document download
    console.log(`Downloading document for user: ${item.name} ${item.lastName}`)
    // In a real app, you would trigger the actual download here
  }

  const formatEmail = (email: string) => {
    return email
  }

  const modalProps = {
    title: "",
    icon: <Eye size={16} />,
    buttonClassName: "action-btn",
    buttonText: "Cerrar",
    onclick: () => {}, // Just close the modal
  }

  return (
    <Modal {...modalProps}>
      <div className="view-details-container">
        {/* ID Field */}
        <div className="detail-field">
          <span className="field-label">ID:</span>
          <span className="field-value field-value--id">#{item.id}</span>
        </div>

        {/* Name Field */}
        <div className="detail-field">
          <span className="field-label">NOMBRE:</span>
          <span className="field-value">{item.name}</span>
        </div>

        {/* Last Name Field */}
        <div className="detail-field">
          <span className="field-label">APELLIDO:</span>
          <span className="field-value">{item.lastName}</span>
        </div>

        {/* Email Field */}
        <div className="detail-field">
          <span className="field-label">EMAIL:</span>
          <a href={`mailto:${item.email}`} className="email-link">
            {formatEmail(item.email)}
          </a>
        </div>

        {/* Cedula Field */}
        <div className="detail-field">
          <span className="field-label">CÉDULA:</span>
          <span className="field-value">{item.cedula}</span>
        </div>

        {/* Rol Field */}
        <div className="detail-field">
          <span className="field-label">ROL:</span>
          {isValidRole(item.role) ? (
            <Badge customColor={badges.roles[item.role].color} width="110px">
              {badges.roles[item.role].name}
            </Badge>
          ) : (
            <span className="field-value">{item.role}</span>
          )}
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
      </div>
    </Modal>
  )
}

export default ViewDetails
