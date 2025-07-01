"use client"
import { useState } from "react"
import "./documentos.css"

// Datos de ejemplo para simular documentos
const documentosEjemplo = Array.from({ length: 85 }, (_, i) => ({
    id: i + 1,
    titulo: [
        "Avances en Inteligencia Artificial Aplicada",
        "Machine Learning en el Sector Salud",
        "Blockchain y Criptomonedas: Análisis Económico",
        "Computación Cuántica: Fundamentos y Aplicaciones",
        "Robótica Autónoma en la Industria 4.0",
        "Big Data y Análisis Predictivo",
        "Ciberseguridad en la Era Digital",
        "Internet de las Cosas (IoT) y Smart Cities",
        "Realidad Virtual y Aumentada en Educación",
        "Biotecnología y Ingeniería Genética",
        "Energías Renovables y Sostenibilidad",
        "Nanotecnología en Medicina",
        "Sistemas Distribuidos y Cloud Computing",
        "Procesamiento de Lenguaje Natural",
        "Visión por Computadora y Reconocimiento de Patrones",
    ][i % 15],
    autor: [
        "Dr. María Rodríguez",
        "Prof. Carlos Mendoza",
        "Dra. Ana García",
        "Dr. Luis Fernández",
        "Prof. Elena Martín",
        "Dr. Roberto Silva",
        "Dra. Carmen López",
        "Prof. Miguel Torres",
        "Dr. Patricia Ruiz",
        "Prof. Andrés Morales",
    ][i % 10],
    areaInvestigacion: [
        "Inteligencia Artificial",
        "Ciencias de la Computación",
        "Biotecnología",
        "Ingeniería",
        "Medicina",
        "Física Cuántica",
        "Economía Digital",
        "Robótica",
        "Ciberseguridad",
        "Energías Renovables",
    ][i % 10],
    descripcion:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    fechaPublicacion: new Date(
        2024,
        (i * 3 + 2) % 12,
        ((i * 7 + 5) % 28) + 1,
    ).toLocaleDateString("es-ES"),
    url: "#",
}))

export default function DocumentosPage() {
    const [paginaActual, setPaginaActual] = useState(1)
    const [filtroArea, setFiltroArea] = useState("")
    const documentosPorPagina = 20

    // Filtrar documentos por área si hay filtro activo
    const documentosFiltrados = filtroArea
        ? documentosEjemplo.filter((doc) => doc.areaInvestigacion.toLowerCase().includes(filtroArea.toLowerCase()))
        : documentosEjemplo

    // Calcular documentos para la página actual
    const indiceInicio = (paginaActual - 1) * documentosPorPagina
    const indiceFin = indiceInicio + documentosPorPagina
    const documentosPagina = documentosFiltrados.slice(indiceInicio, indiceFin)

    // Calcular número total de páginas
    const totalPaginas = Math.ceil(documentosFiltrados.length / documentosPorPagina)

    // Obtener áreas únicas para el filtro
    const areasUnicas = [...new Set(documentosEjemplo.map((doc) => doc.areaInvestigacion))]

    const cambiarPagina = (nuevaPagina: any) => {
        setPaginaActual(nuevaPagina)
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: "smooth" })
        }
    }

    const cambiarFiltro = (area: any) => {
        setFiltroArea(area)
        setPaginaActual(1)
    }

    return (
        <div className="min-h-screen bg-gray-50">


            <main className="main-content">
                <div className="filters-section">
                    <div className="filter-group">
                        <label className="filter-label">Filtrar por área:</label>
                        <select className="filter-select" value={filtroArea} onChange={(e) => cambiarFiltro(e.target.value)}>
                            <option value="">Todas las áreas</option>
                            {areasUnicas.map((area) => (
                                <option key={area} value={area}>
                                    {area}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="results-info">
                        Mostrando {indiceInicio + 1}-{Math.min(indiceFin, documentosFiltrados.length)} de{" "}
                        {documentosFiltrados.length} documentos
                    </div>
                </div>

                <div className="documentos-grid">
                    {documentosPagina.map((documento) => (
                        <article key={documento.id} className="documento-card">
                            <div className="card-header">
                                <span className="area-tag">{documento.areaInvestigacion}</span>
                                <time className="fecha-publicacion">{documento.fechaPublicacion}</time>
                            </div>

                            <h2 className="documento-titulo">
                                <a href={`/documento/${documento.id}`} className="titulo-link">
                                    {documento.titulo}
                                </a>
                            </h2>

                            <div className="autor-info">
                                <div className="autor-avatar">
                                    <span>{documento.autor.charAt(0)}</span>
                                </div>
                                <span className="autor-nombre">{documento.autor}</span>
                            </div>

                            <p className="documento-descripcion">{documento.descripcion}</p>

                            <div className="card-footer">
                                <a href={`/documentos/${documento.id}`} className="leer-mas-btn">
                                    Leer más
                                    <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="m9 18 6-6-6-6" />
                                    </svg>
                                </a>
                            </div>
                        </article>
                    ))}
                </div>

                {totalPaginas > 1 && (
                    <div className="paginacion">
                        <button
                            className={`pagina-btn ${paginaActual === 1 ? "disabled" : ""}`}
                            onClick={() => cambiarPagina(paginaActual - 1)}
                            disabled={paginaActual === 1}
                        >
                            <svg className="pagina-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                            Anterior
                        </button>

                        <div className="paginas-numeros">
                            {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                                let numeroPagina
                                if (totalPaginas <= 5) {
                                    numeroPagina = i + 1
                                } else if (paginaActual <= 3) {
                                    numeroPagina = i + 1
                                } else if (paginaActual >= totalPaginas - 2) {
                                    numeroPagina = totalPaginas - 4 + i
                                } else {
                                    numeroPagina = paginaActual - 2 + i
                                }

                                return (
                                    <button
                                        key={numeroPagina}
                                        className={`numero-btn ${paginaActual === numeroPagina ? "activo" : ""}`}
                                        onClick={() => cambiarPagina(numeroPagina)}
                                    >
                                        {numeroPagina}
                                    </button>
                                )
                            })}
                        </div>

                        <button
                            className={`pagina-btn ${paginaActual === totalPaginas ? "disabled" : ""}`}
                            onClick={() => cambiarPagina(paginaActual + 1)}
                            disabled={paginaActual === totalPaginas}
                        >
                            Siguiente
                            <svg className="pagina-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="m9 18 6-6-6-6" />
                            </svg>
                        </button>
                    </div>
                )}
            </main>
        </div>
    )
}