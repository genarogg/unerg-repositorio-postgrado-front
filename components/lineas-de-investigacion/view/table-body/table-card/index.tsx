"use client"

import { Check } from "lucide-react"
import { Badge, Switch } from "../../../../ux"
import ActionRow from "../../components/actions/ActionRow"
import { useGlobal, useGlobalStatic, type DataItem, type UserStatus } from "../../../context/Global"
import "./tablet-card.css"

export default function TableCardView() {
    const { data, isItemSelected, toggleSelectItem, updateItem } = useGlobal()
    const { configured, badges } = useGlobalStatic()

    const { select } = configured
    const { estados, roles } = badges

    // Función auxiliar para verificar si un valor es un rol válido
    const isValidRole = (value: any): value is keyof typeof roles => {
        return typeof value === 'string' && value in roles
    }

    // Función auxiliar para verificar si un valor es un estado válido
    const isValidStatus = (value: any): value is keyof typeof estados => {
        return typeof value === 'string' && value in estados
    }

    const handleStatusToggle = (item: DataItem) => {
        const newStatus: UserStatus = item.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO"
        updateItem(item.id, { estado: newStatus })
    }

    return (
        <div className="card-view-container">
            {data.items.map((item: DataItem) => (
                <div key={item.id} className={`item-card ${isItemSelected(item) ? "selected" : ""}`}>
                    {/* Status indicator */}
                    <div className="status-indicator"></div>

                    {/* Header de la tarjeta */}
                    <div className="card-header">
                        <div className="card-title-section">
                            {select && (
                                <button
                                    className={`card-select-btn ${isItemSelected(item) ? "selected" : ""}`}
                                    onClick={() => toggleSelectItem(item)}
                                    title="Seleccionar elemento"
                                >
                                    {isItemSelected(item) && <Check size={14} />}
                                </button>
                            )}
                            <h3 className="card-title">{item.nombre}</h3>
                        </div>

                        {/* Switch de estado */}
                        <div className="status-switch-container">
                            <span className={`status-text ${item.estado === "ACTIVO" ? "active" : "inactive"}`}>
                                {item.estado}
                            </span>
                            <Switch
                                isOn={item.estado === "ACTIVO"}
                                onToggle={() => handleStatusToggle(item)}
                            />
                        </div>
                    </div>

                    {/* Contenido de la tarjeta */}
                    <div className="card-content">
                        <div className="card-field">
                            <span className="field-label">ID:</span>
                            <span className="field-value id-value">#{item.id}</span>
                        </div>

                        <div className="card-field">
                            <span className="field-label">Email:</span>
                            <span className="field-value email-value">{item.correo}</span>
                        </div>

                        <div className="card-field">
                            <span className="field-label">Teléfono:</span>
                            <span className="field-value">{item.telefono}</span>
                        </div>

                        <div className="card-field">
                            <span className="field-label">Cédula:</span>
                            <span className="field-value">{item.cedula}</span>
                        </div>

                        <div className="card-field">
                            <span className="field-label">Rol:</span>
                            <div className="field-value">
                                {isValidRole(item.rol) ? (
                                    <Badge customColor={roles[item.rol].color} width="90px">
                                        {roles[item.rol].name}
                                    </Badge>
                                ) : (
                                    <span>{item.rol}</span>
                                )}
                            </div>
                        </div>

                        <div className="card-field">
                            <span className="field-label">Estado:</span>
                            <div className="field-value">
                                {isValidStatus(item.estado) ? (
                                    <Badge customColor={estados[item.estado].color} width="90px">
                                        {estados[item.estado].name}
                                    </Badge>
                                ) : (
                                    <span>{item.estado}</span>
                                )}
                            </div>
                        </div>

                        <div className="card-field">
                            <span className="field-label">Límite:</span>
                            <span className="field-value">{item.limite}</span>
                        </div>

                        <div className="card-field">
                            <span className="field-label">Documento:</span>
                            <span className="field-value">{item.doc}</span>
                        </div>

                        {/* Barra de acciones */}
                        <div className="card-table-actions">
                            <ActionRow item={item} />
                        </div>
                    </div>
                </div>
            ))}

            {data.items.length === 0 && (
                <div className="no-cards">
                    <p>No se encontraron elementos que coincidan con la búsqueda.</p>
                </div>
            )}
        </div>
    )
}
