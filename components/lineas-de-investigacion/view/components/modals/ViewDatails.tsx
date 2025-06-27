'use client'
import React from 'react'
import { Eye, Download, FileText } from 'lucide-react'
import { useGlobalStatic, type DataItem } from '../../../context/Global'
import Modal from '../../../../ux/modal'
import { Badge } from '../../../../ux'
import './css/viewDetails.css'

interface ViewDetailsProps {
    item: DataItem;
}

const ViewDetails: React.FC<ViewDetailsProps> = ({ item }) => {
    const { badges } = useGlobalStatic();

    // Función auxiliar para verificar si un valor es un rol válido
    const isValidRole = (value: any): value is keyof typeof badges.roles => {
        return typeof value === 'string' && value in badges.roles
    }

    // Función auxiliar para verificar si un valor es un estado válido
    const isValidStatus = (value: any): value is keyof typeof badges.estados => {
        return typeof value === 'string' && value in badges.estados
    }

    const handleDownloadDocument = () => {
        // Simulate document download
        console.log(`Downloading document: ${item.doc}`);
        // In a real app, you would trigger the actual download here
    };

    const formatPhone = (phone: string) => {
        // Format phone number for better display
        return phone;
    };

    const formatEmail = (email: string) => {
        return email;
    };

    const modalProps = {
        title: "",
        icon: <Eye size={16} />,
        buttonClassName: "action-btn",
        buttonText: "Cerrar",
        onclick: () => { } // Just close the modal
    };

    return (
        <Modal {...modalProps}>
            <div className="view-details-container">
                {/* ID Field */}
                <div className="detail-field">
                    <span className="field-label">
                        ID:
                    </span>
                    <span className="field-value field-value--id">
                        #{item.id}
                    </span>
                </div>

                {/* Email Field */}
                <div className="detail-field">
                    <span className="field-label">
                        EMAIL:
                    </span>
                    <a
                        href={`mailto:${item.correo}`}
                        className="email-link"
                    >
                        {formatEmail(item.correo)}
                    </a>
                </div>

                {/* Phone Field */}
                <div className="detail-field">
                    <span className="field-label">
                        TELÉFONO:
                    </span>
                    <span className="field-value">
                        {formatPhone(item.telefono)}
                    </span>
                </div>

                {/* Cedula Field */}
                <div className="detail-field">
                    <span className="field-label">
                        CÉDULA:
                    </span>
                    <span className="field-value">
                        {item.cedula}
                    </span>
                </div>

                {/* Limite Field */}
                <div className="detail-field">
                    <span className="field-label">
                        LÍMITE:
                    </span>
                    <span className="field-value field-value--limite">
                        {item.limite}
                    </span>
                </div>

                {/* Rol Field */}
                <div className="detail-field">
                    <span className="field-label">
                        ROL:
                    </span>
                    {isValidRole(item.rol) ? (
                        <Badge
                            customColor={badges.roles[item.rol].color}
                            width="110px"
                        >
                            {badges.roles[item.rol].name}
                        </Badge>
                    ) : (
                        <span className="field-value">{item.rol}</span>
                    )}
                </div>

                {/* Estado Field */}
                <div className="detail-field">
                    <span className="field-label">
                        ESTADO:
                    </span>
                    {isValidStatus(item.estado) ? (
                        <Badge
                            customColor={badges.estados[item.estado].color}
                            width="110px"
                        >
                            {badges.estados[item.estado].name}
                        </Badge>
                    ) : (
                        <span className="field-value">{item.estado}</span>
                    )}
                </div>

                {/* Document Section */}
                {item.doc && (
                    <div className="document-section">
                        <div className="document-header">
                            <div className="document-info">
                                <div className="document-icon">
                                    <FileText size={20} color="white" />
                                </div>
                                <div className="document-details">
                                    <div className="document-title">
                                        Documento PDF
                                    </div>
                                    <div className="document-filename">
                                        {item.doc}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleDownloadDocument}
                                className="download-button"
                            >
                                <Download size={16} />
                                Descargar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default ViewDetails;
