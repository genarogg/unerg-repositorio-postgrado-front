"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SearchIcon, LoaderIcon, X, Sparkles } from "../ui/Icons/Icons"
import { Input } from "../ui/Input/Input"
import { Badge } from "../ui/Badge/Badge"
import { useDebounce } from "../hooks/useDebounce"
import type { SearchItem, BackendSearchResponse } from "../lib/types"
import "./searchBar.css"
import Link from "next/link"



interface SearchBarProps {
  placeholder?: string
  placeholders?: string[]
  typingSpeed?: number
  typingDelay?: number
  debounceTime?: number
  apiUrl?: string
}

export function SearchBar({
  placeholder = "Buscar trabajos de grado...",
  placeholders = [
    "Buscar tesis de medicina...",
    "Proyectos de ingeniería...",
    "Investigaciones de psicología...",
    "Trabajos de derecho...",
    "Monografías de arquitectura...",
    "Estudios de administración...",
  ],
  typingSpeed = 100,
  typingDelay = 2000,
  debounceTime = 1000, // Reducido a 1 segundo para mejor UX
  apiUrl = "http://localhost:4000/search/main",
}: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchItem[]>([])
  const [isLoadingResults, setIsLoadingResults] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [currentPlaceholder, setCurrentPlaceholder] = useState("")
  const [typingPlaceholder, setTypingPlaceholder] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [isFocused, setIsFocused] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [totalResults, setTotalResults] = useState(0)

  // Properly typed refs
  const inputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Aplicar debounce al query
  const debouncedQuery = useDebounce(query, debounceTime)

  // Seleccionar un placeholder aleatorio al cargar
  useEffect(() => {
    if (placeholders && placeholders.length > 0) {
      const randomIndex = Math.floor(Math.random() * placeholders.length)
      setCurrentPlaceholder(placeholders[randomIndex])
    } else {
      setCurrentPlaceholder(placeholder)
    }
  }, [placeholders, placeholder])

  // Efecto de tipeo para el placeholder
  useEffect(() => {
    if (!currentPlaceholder || !isTyping) return

    let currentIndex = 0
    let typingTimer: NodeJS.Timeout

    const typeNextChar = () => {
      if (currentIndex <= currentPlaceholder.length) {
        setTypingPlaceholder(currentPlaceholder.substring(0, currentIndex))
        currentIndex++
        typingTimer = setTimeout(typeNextChar, typingSpeed)
      } else {
        // Esperar antes de borrar
        typingTimer = setTimeout(() => {
          setIsTyping(false)
          setTimeout(() => {
            // Reiniciar el ciclo después de un tiempo
            if (placeholders && placeholders.length > 0) {
              const nextIndex = Math.floor(Math.random() * placeholders.length)
              setCurrentPlaceholder(placeholders[nextIndex])
            }
            setTypingPlaceholder("")
            currentIndex = 0
            setIsTyping(true)
          }, typingDelay)
        }, typingDelay)
      }
    }

    typingTimer = setTimeout(typeNextChar, typingSpeed)

    return () => {
      clearTimeout(typingTimer)
    }
  }, [currentPlaceholder, isTyping, typingSpeed, typingDelay, placeholders])

  // Handle query changes
  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery)
    setSearchError(null)

    if (!newQuery.trim()) {
      setResults([])
      setShowResults(false)
      setTotalResults(0)
      // Cancelar búsqueda en curso si existe
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }

  async function performSearch(searchQuery: string) {
    if (!searchQuery.trim()) {
      setResults([])
      setShowResults(false)
      setTotalResults(0)
      return
    }

    // Cancelar búsqueda anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Crear nuevo AbortController para esta búsqueda
    abortControllerRef.current = new AbortController()

    setIsLoadingResults(true)
    setSearchError(null)

    try {
      const response = await fetch(`${apiUrl}?query=${encodeURIComponent(searchQuery)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: abortControllerRef.current.signal,
      })

      console.log(response)

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`)
      }

      const data: BackendSearchResponse = await response.json()


      setResults(data.data.trabajos)
      setTotalResults(data.data.trabajos.length)
      setShowResults(true)

      console.log("✅ Búsqueda exitosa:", {
        query: searchQuery,
        results: data.data.trabajos.length,
        message: data.message,
      })
    } catch (error) {
      // No mostrar error si la búsqueda fue cancelada
      if (error instanceof Error && error.name === "AbortError") {
        console.log("🚫 Búsqueda cancelada")
        return
      }

      console.error("❌ Error en búsqueda:", error)

      if (error instanceof Error) {
        setSearchError(error.message)
      } else {
        setSearchError("Error desconocido en la búsqueda")
      }

      setResults([])
      setShowResults(true) // Mostrar panel para mostrar el error
      setTotalResults(0)
    } finally {
      setIsLoadingResults(false)
    }
  }

  function handleResultClick(result: SearchItem) {
    console.log("Trabajo seleccionado:", result)
    // Aquí puedes agregar la lógica para navegar al detalle del trabajo
    // Por ejemplo: router.push(`/trabajos/${result.id}`)
  }

  function handleClear() {
    setQuery("")
    setResults([])
    setShowResults(false)
    setSearchError(null)
    setTotalResults(0)

    // Cancelar búsqueda en curso si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }

  // Efecto para realizar la búsqueda cuando el query con debounce cambia
  useEffect(() => {
    if (debouncedQuery.trim()) {
      performSearch(debouncedQuery)
    } else {
      setResults([])
      setShowResults(false)
      setSearchError(null)
      setTotalResults(0)
    }
  }, [debouncedQuery])

  // Cleanup al desmontar el componente
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  // Prevenir el envío del formulario ya que ahora la búsqueda es automática
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle input blur to close the panel
  const handleInputBlur = () => {
    setTimeout(() => {
      const activeElement = document.activeElement
      const isWithinComponent =
        panelRef.current?.contains(activeElement) ||
        inputRef.current?.contains(activeElement) ||
        formRef.current?.contains(activeElement)

      if (!isWithinComponent) {
        setShowResults(false)
        setIsFocused(false)
      }
    }, 150)
  }

  const handleInputFocus = () => {
    setIsFocused(true)
    if (query.trim() && (results.length > 0 || searchError)) {
      setShowResults(true)
    }
  }

  // Función para truncar texto
  const truncateText = (text: string, maxLength = 150) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  // Función para obtener el color del badge según el estado
  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case "VALIDADO":
        return "success"
      case "PENDIENTE":
        return "warning"
      case "RECHAZADO":
        return "error"
      default:
        return "secondary"
    }
  }

  return (
    <div className="search-container">
      {/* Elementos decorativos de fondo */}
      <div className="search-background-elements">
        <motion.div
          className="floating-element element-1"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="floating-element element-2"
          animate={{
            y: [0, 15, 0],
            rotate: [0, -3, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="floating-element element-3"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 2, 0],
          }}
          transition={{
            duration: 7,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <motion.div
        className={`search-wrapper ${showResults ? "expanded" : ""} ${isFocused ? "focused" : ""}`}
        initial={false}
        animate={
          showResults
            ? {
              boxShadow: "0 20px 60px rgba(124, 58, 237, 0.25), 0 8px 32px rgba(0, 0, 0, 0.15)",
              y: -4,
              scale: 1.02,
            }
            : isFocused
              ? {
                boxShadow: "0 12px 40px rgba(124, 58, 237, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)",
                y: -2,
                scale: 1.01,
              }
              : {
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                y: 0,
                scale: 1,
              }
        }
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Efecto de brillo en el borde */}
        <motion.div
          className="search-glow"
          animate={{
            opacity: isFocused ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />

        <form onSubmit={handleSubmit} className="search-form" ref={formRef}>
          <div className="search-input-container">
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onBlur={handleInputBlur}
              onFocus={handleInputFocus}
              placeholder={typingPlaceholder || placeholder}
              leftIcon={<SearchIcon size={18} />}
              rightIcon={
                query ? (
                  <motion.button
                    type="button"
                    onClick={handleClear}
                    className="clear-button"
                    aria-label="Limpiar búsqueda"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={16} />
                  </motion.button>
                ) : isLoadingResults || (debouncedQuery !== query && query) ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  >
                    <LoaderIcon size={16} />
                  </motion.div>
                ) : isFocused ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="sparkles-icon"
                  >
                    <Sparkles size={16} />
                  </motion.div>
                ) : undefined
              }
            />
          </div>
        </form>

        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: -10 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="search-panel"
              ref={panelRef}
            >
              {/* Resultados */}
              <motion.div
                className="results-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {searchError ? (
                  <motion.div
                    className="search-error"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="error-icon">⚠️</div>
                    <div className="error-title">Error en la búsqueda</div>
                    <div className="error-message">{searchError}</div>
                  </motion.div>
                ) : results.length > 0 ? (
                  <>
                    <div className="results-header">
                      <div className="results-count">
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          {totalResults}
                        </motion.span>
                        <span>
                          {" "}
                          trabajo{totalResults !== 1 ? "s" : ""} encontrado{totalResults !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                    <ul className="results-list">
                      {results.map((result, index) => (
                        <motion.li
                          key={result.id}
                          className="result-item"
                          onClick={() => handleResultClick(result)}
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          whileHover={{
                            y: -2,
                            boxShadow: "0 8px 25px rgba(124, 58, 237, 0.15)",
                            borderColor: "rgba(124, 58, 237, 0.3)",
                          }}
                          transition={{ duration: 0.3, delay: index * 0.08 }}
                        >
                          <Link href={`/documentos/${result.id}`} className="result-link">


                            <div className="result-content">
                              <div className="result-title">{result.titulo}</div>
                              <div className="result-author">
                                Por: <strong>{result.autor}</strong>
                              </div>
                              {result.resumen && <div className="result-description">{truncateText(result.resumen)}</div>}
                              <div className="result-meta">
                                {result.lineaDeInvestigacion && (
                                  <Badge variant="secondary">{result.lineaDeInvestigacion.nombre}</Badge>
                                )}
                                <Badge variant={getEstadoBadgeVariant(result.estado)}>{result.estado}</Badge>
                                {result.periodoAcademico && (
                                  <Badge variant="secondary" size="sm">
                                    {result.periodoAcademico.periodo}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <motion.div
                    className="no-results"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="no-results-icon">📚</div>
                    <div className="no-results-text">No se encontraron trabajos</div>
                    <div className="no-results-subtitle">Intenta con otros términos de búsqueda</div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Indicador de búsqueda mejorado */}
      <AnimatePresence>
        {debouncedQuery !== query && query && (
          <motion.div
            className="searching-indicator"
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="searching-icon"
              animate={{ rotate: 360 }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              🔍
            </motion.div>
            <span>Buscando en </span>
            <motion.span
              className="countdown"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
              }}
            >
              1
            </motion.span>
            <span> segundo...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
