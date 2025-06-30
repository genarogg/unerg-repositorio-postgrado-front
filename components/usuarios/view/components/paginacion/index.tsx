"use client"
import type React from "react"
import { useMemo } from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { useGlobal } from "../../../context/Global"
import useData from "../../../context/data/useData"
import "./pagination.css"

interface PaginacionProps {
    maxPagesToShow?: number
    showEllipsis?: boolean
    showInfo?: boolean
    showControls?: boolean
    compact?: boolean
    itemsPerPage?: number
}

const Paginacion: React.FC<PaginacionProps> = ({
    maxPagesToShow = 5,
    showEllipsis = true,
    showInfo = true,
    showControls = true,
    compact = false,
    itemsPerPage = 100,
}) => {
    const { data } = useGlobal()
    const { initialData } = useData()

    const { page, loading, items, totalItems, totalPages } = data

    // Usar totalPages del estado global si está disponible, sino calcularlo
    const calculatedTotalPages = totalPages || Math.ceil((totalItems || items.length) / itemsPerPage) || 1

    // Información de paginación
    const paginationInfo = useMemo(() => {
        const startItem = (page - 1) * itemsPerPage + 1
        const endItem = Math.min(page * itemsPerPage, totalItems || items.length)
        const total = totalItems || items.length

        return {
            currentPage: page,
            totalPages: calculatedTotalPages,
            startItem,
            endItem,
            totalItems: total,
            hasPrev: page > 1,
            hasNext: page < calculatedTotalPages,
        }
    }, [page, calculatedTotalPages, items.length, totalItems, itemsPerPage])

    // Generar números de página a mostrar
    const pageNumbers = useMemo(() => {
        const pages: (number | string)[] = []
        const maxPages = compact ? 3 : maxPagesToShow

        if (calculatedTotalPages <= maxPages) {
            // Mostrar todas las páginas si son pocas
            for (let i = 1; i <= calculatedTotalPages; i++) {
                pages.push(i)
            }
        } else {
            // Lógica compleja para mostrar páginas con elipsis
            const halfMax = Math.floor(maxPages / 2)
            let startPage = Math.max(1, page - halfMax)
            let endPage = Math.min(calculatedTotalPages, page + halfMax)

            // Ajustar si estamos cerca del inicio
            if (page <= halfMax) {
                endPage = Math.min(calculatedTotalPages, maxPages)
            }

            // Ajustar si estamos cerca del final
            if (page > calculatedTotalPages - halfMax) {
                startPage = Math.max(1, calculatedTotalPages - maxPages + 1)
            }

            // Agregar primera página y elipsis si es necesario
            if (startPage > 1) {
                pages.push(1)
                if (startPage > 2 && showEllipsis) {
                    pages.push("ellipsis-start")
                }
            }

            // Agregar páginas del rango
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i)
            }

            // Agregar elipsis y última página si es necesario
            if (endPage < calculatedTotalPages) {
                if (endPage < calculatedTotalPages - 1 && showEllipsis) {
                    pages.push("ellipsis-end")
                }
                pages.push(calculatedTotalPages)
            }
        }

        return pages
    }, [page, calculatedTotalPages, maxPagesToShow, compact, showEllipsis])

    // Funciones de control
    const goToPage = async (newPage: number) => {
        if (newPage >= 1 && newPage <= calculatedTotalPages && newPage !== page) {
            await initialData(newPage, itemsPerPage)
        }
    }

    const goPrev = () => {
        if (paginationInfo.hasPrev) {
            goToPage(page - 1)
        }
    }

    const goNext = () => {
        if (paginationInfo.hasNext) {
            goToPage(page + 1)
        }
    }

    // Texto de información
    const paginationText = `Mostrando ${paginationInfo.startItem} a ${paginationInfo.endItem} de ${paginationInfo.totalItems} resultados`
    

    // No mostrar si está cargando, vacío o solo hay una página
    if (loading || (totalItems || items.length) === 0) {
        return null
    }

    return (
        <div className={`table-pagination-container ${compact ? "compact" : ""}`}>
            {/* Información de paginación */}
            {showInfo && (
                <div className="table-pagination-info">
                    <span className="pagination-info-text">{paginationText}</span>
                </div>
            )}

            {/* Controles de paginación */}
            {showControls && (
                <div className="table-pagination-controls">
                    {/* Botón Anterior */}
                    <button
                        className="table-pagination-btn table-pagination-prev"
                        onClick={goPrev}
                        disabled={!paginationInfo.hasPrev}
                        title="Página anterior"
                    >
                        <ChevronLeft size={16} />
                    </button>

                    {/* Números de página */}
                    {pageNumbers.map((pageNum, index) =>
                        typeof pageNum === "number" ? (
                            <button
                                key={`page-${pageNum}`}
                                className={`table-pagination-btn table-page-number ${pageNum === paginationInfo.currentPage ? "active" : ""
                                    }`}
                                onClick={() => goToPage(pageNum)}
                                title={`Ir a la página ${pageNum}`}
                            >
                                {pageNum}
                            </button>
                        ) : (
                            <span key={`ellipsis-${index}`} className="table-pagination-ellipsis">
                                <MoreHorizontal size={16} />
                            </span>
                        ),
                    )}

                    {/* Botón Siguiente */}
                    <button
                        className="table-pagination-btn table-pagination-next"
                        onClick={goNext}
                        disabled={!paginationInfo.hasNext}
                        title="Página siguiente"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    )
}

export default Paginacion