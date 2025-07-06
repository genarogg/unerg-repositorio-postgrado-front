"use client"
import { useState, useEffect } from "react"
import "./documentos.css"

import { SearchBar } from "../../search/SearchBar/SearchBar"

// Tipos para la respuesta del API
interface LineaInvestigacion {
    id: number
    nombre: string
}

interface PeriodoAcademico {
    id: number
    periodo: string
}

interface Trabajo {
    id: number
    titulo: string
    autor: string
    lineaDeInvestigacionId: number
    estado: "PENDIENTE" | "VALIDADO" | "RECHAZADO"
    doc: string
    periodoAcademicoId: number
    resumen: string
    lineaDeInvestigacion: LineaInvestigacion
    periodoAcademico: PeriodoAcademico
}

interface ApiResponse {
    type: string
    message: string
    data: {
        trabajos: Trabajo[]
    }
}

export default function DocumentosPage() {
    const [trabajos, setTrabajos] = useState<Trabajo[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [paginaActual, setPaginaActual] = useState(1)
    const [filtroArea, setFiltroArea] = useState("")
    const [filtroEstado, setFiltroEstado] = useState("")
    const documentosPorPagina = 20


    const searchPlaceholders = [
        "Buscar postgrados en salud...",
        "Especializaciones en derecho...",
        "Maestrías en ingeniería...",
        "Estudios avanzados en psicología...",
        "Postgrados en administración...",
        "Programas de comunicación...",
    ]

    // Función para obtener los trabajos del API
    const fetchTrabajos = async () => {
        try {
            setLoading(true)
            const response = await fetch("http://localhost:4000/trabajos/get-all")

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`)
            }

            const data: ApiResponse = await response.json()

            if (data.type === "success") {
                setTrabajos(data.data.trabajos)
            } else {
                throw new Error(data.message || "Error al obtener los trabajos")
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido")
            console.error("Error fetching trabajos:", err)
        } finally {
            setLoading(false)
        }
    }

    // Cargar trabajos al montar el componente
    useEffect(() => {
        fetchTrabajos()
    }, [])

    // Filtrar trabajos por área y estado
    const trabajosFiltrados = trabajos.filter((trabajo) => {
        const coincideArea =
            filtroArea === "" || trabajo.lineaDeInvestigacion.nombre.toLowerCase().includes(filtroArea.toLowerCase())
        const coincideEstado = filtroEstado === "" || trabajo.estado === filtroEstado
        return coincideArea && coincideEstado
    })

    // Calcular trabajos para la página actual
    const indiceInicio = (paginaActual - 1) * documentosPorPagina
    const indiceFin = indiceInicio + documentosPorPagina
    const trabajosPagina = trabajosFiltrados.slice(indiceInicio, indiceFin)

    // Calcular número total de páginas
    const totalPaginas = Math.ceil(trabajosFiltrados.length / documentosPorPagina)

    // Obtener áreas únicas para el filtro
    const areasUnicas = [...new Set(trabajos.map((trabajo) => trabajo.lineaDeInvestigacion.nombre))]

    // Obtener estados únicos para el filtro
    const estadosUnicos = [...new Set(trabajos.map((trabajo) => trabajo.estado))]

    const cambiarPagina = (nuevaPagina: number) => {
        setPaginaActual(nuevaPagina)
        if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" })
        }
    }

    const cambiarFiltroArea = (area: string) => {
        setFiltroArea(area)
        setPaginaActual(1)
    }

    const cambiarFiltroEstado = (estado: string) => {
        setFiltroEstado(estado)
        setPaginaActual(1)
    }

    // Función para obtener el color del estado
    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case "VALIDADO":
                return "bg-green-100 text-green-800"
            case "PENDIENTE":
                return "bg-yellow-100 text-yellow-800"
            case "RECHAZADO":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    // Función para truncar el resumen
    const truncarTexto = (texto: string, maxLength = 150) => {
        if (texto.length <= maxLength) return texto
        return texto.substring(0, maxLength) + "..."
    }

  

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                    <button
                        onClick={fetchTrabajos}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen ">
            <main className="main-content">

                <div style ={{ marginBottom: "50px" }}>
                    <SearchBar placeholders={searchPlaceholders} typingSpeed={80} typingDelay={1500} debounceTime={2000} />
                </div>

                <div className="documentos-grid">
                    {trabajosPagina.map((trabajo) => (
                        <article key={trabajo.id} className="documento-card">
                            <div className="card-header">
                                <span className="area-tag">{trabajo.lineaDeInvestigacion.nombre}</span>
                                <div className="flex flex-col items-end gap-1">
                                    
                                    <time className="fecha-publicacion">{trabajo.periodoAcademico.periodo}</time>
                                </div>
                            </div>

                            <h2 className="documento-titulo">
                                <a href={`/trabajo/${trabajo.id}`} className="titulo-link">
                                    {trabajo.titulo}
                                </a>
                            </h2>

                            <div className="autor-info">
                                <div className="autor-avatar">
                                    <span>{trabajo.autor.charAt(0)}</span>
                                </div>
                                <span className="autor-nombre">{trabajo.autor}</span>
                            </div>

                            <p className="documento-descripcion">{truncarTexto(trabajo.resumen)}</p>

                            <div className="card-footer">
                                <div className="flex justify-between items-center w-full">
                                 
                                    <a href={`/documentos/${trabajo.id}`} className="leer-mas-btn">
                                        Ver detalles
                                        <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="m9 18 6-6-6-6" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {trabajosFiltrados.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">
                            No se encontraron trabajos que coincidan con los filtros seleccionados.
                        </p>
                    </div>
                )}

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
