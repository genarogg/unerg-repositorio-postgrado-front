"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SearchIcon, LoaderIcon, X, Sparkles } from "../ui/Icons/Icons"
import { Input } from "../ui/Input/Input"
import { Badge } from "../ui/Badge/Badge"
import { useDebounce } from "../hooks/useDebounce"
import type { SearchItem } from "../lib/types"
import "./searchBar.css"

interface SearchBarProps {
  placeholder?: string
  placeholders?: string[]
  typingSpeed?: number
  typingDelay?: number
  debounceTime?: number
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
  debounceTime = 2000,
}: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchItem[]>([])
  const [isLoadingResults, setIsLoadingResults] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [currentPlaceholder, setCurrentPlaceholder] = useState("")
  const [typingPlaceholder, setTypingPlaceholder] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [isFocused, setIsFocused] = useState(false)

  // Properly typed refs
  const inputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // Aplicar debounce al query para esperar 2 segundos antes de buscar
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
    if (!newQuery.trim()) {
      setResults([])
      setShowResults(false)
    }
  }

  async function performSearch(searchQuery: string) {
    if (!searchQuery.trim()) {
      setResults([])
      setShowResults(false)
      return
    }

    setIsLoadingResults(true)

    try {
      // const response = await fetch(`/api/search?query=${encodeURIComponent(searchQuery)}`)

      // if (!response.ok) throw new Error("Error searching")
      //   const data = await response.json()

      const data = [
        {
          "id": "26",
          "title": "Auditoría Forense en Casos de Corrupción",
          "carrera": "Contaduría Pública",
          "tipo": "Investigación",
          "autor": {
            "nombre": "Lucía Ramírez",
            "cedula": "67890012",
            "correo": "lucia.ramirez@email.com"
          }
        },
        {
          "id": "64",
          "title": "Auditoría de Sistemas de Información",
          "carrera": "Contaduría Pública",
          "tipo": "Proyecto de Grado",
          "autor": {
            "nombre": "Pablo Rincón",
            "cedula": "45670890",
            "correo": "pablo.rincon@email.com"
          }
        },
        {
          "id": "16",
          "title": "Neuropsicología del Aprendizaje en Niños",
          "carrera": "Psicología",
          "tipo": "Monografía",
          "autor": {
            "nombre": "Valentina Jiménez",
            "cedula": "67890012",
            "correo": "valentina.jimenez@email.com"
          }
        },
        {
          "id": "17",
          "title": "Psicología Positiva en el Ambiente Laboral",
          "carrera": "Psicología",
          "tipo": "Proyecto de Grado",
          "autor": {
            "nombre": "Alejandro Ramos",
            "cedula": "78900123",
            "correo": "alejandro.ramos@email.com"
          }
        },
        {
          "id": "30",
          "title": "Enfermería Comunitaria en Zonas Rurales",
          "carrera": "Enfermería",
          "tipo": "Investigación",
          "autor": {
            "nombre": "Diana Paredes",
            "cedula": "01230456",
            "correo": "diana.paredes@email.com"
          }
        },
        {
          "id": "38",
          "title": "Cardiología Preventiva en Jóvenes Deportistas",
          "carrera": "Medicina",
          "tipo": "Tesis",
          "autor": {
            "nombre": "Eduardo Salazar",
            "cedula": "89010234",
            "correo": "eduardo.salazar@email.com"
          }
        },
        {
          "id": "45",
          "title": "Emprendimiento Social y Economía Circular",
          "carrera": "Administración de Empresas",
          "tipo": "Proyecto de Grado",
          "autor": {
            "nombre": "Manuela Cortés",
            "cedula": "56780901",
            "correo": "manuela.cortes@email.com"
          }
        },
        {
          "id": "50",
          "title": "Enfermería en Cuidados Intensivos Neonatales",
          "carrera": "Enfermería",
          "tipo": "Tesis",
          "autor": {
            "nombre": "Óscar Duarte",
            "cedula": "01230456",
            "correo": "oscar.duarte@email.com"
          }
        },
        {
          "id": "58",
          "title": "Oncología Pediátrica y Calidad de Vida",
          "carrera": "Medicina",
          "tipo": "Tesis",
          "autor": {
            "nombre": "Jaime Castañeda",
            "cedula": "89010234",
            "correo": "jaime.castaneda@email.com"
          }
        },
        {
          "id": "61",
          "title": "Psicología del Deporte en Atletas de Alto Rendimiento",
          "carrera": "Psicología",
          "tipo": "Tesis",
          "autor": {
            "nombre": "Mónica Herrera",
            "cedula": "12340567",
            "correo": "monica.herrera@email.com"
          }
        },
        {
          "id": "65",
          "title": "Enfermería Geriátrica y Envejecimiento Activo",
          "carrera": "Enfermería",
          "tipo": "Monografía",
          "autor": {
            "nombre": "Quira Mendoza",
            "cedula": "56780901",
            "correo": "quira.mendoza@email.com"
          }
        },
        {
          "id": "2",
          "title": "Aplicación Móvil para Control de Inventarios",
          "carrera": "Ingeniería de Sistemas",
          "tipo": "Proyecto de Grado",
          "autor": {
            "nombre": "Ana García",
            "cedula": "23456789",
            "correo": "ana.garcia@email.com"
          }
        },
        {
          "id": "12",
          "title": "Análisis del Derecho Laboral en el Teletrabajo",
          "carrera": "Derecho",
          "tipo": "Ensayo",
          "autor": {
            "nombre": "Gabriela Moreno",
            "cedula": "23450678",
            "correo": "gabriela.moreno@email.com"
          }
        },
        {
          "id": "20",
          "title": "Análisis Financiero de Empresas Familiares",
          "carrera": "Administración de Empresas",
          "tipo": "Investigación",
          "autor": {
            "nombre": "Camila Vega",
            "cedula": "01230456",
            "correo": "camila.vega@email.com"
          }
        },
        {
          "id": "23",
          "title": "Arquitectura Bioclimática en Zonas Tropicales",
          "carrera": "Arquitectura",
          "tipo": "Proyecto de Grado",
          "autor": {
            "nombre": "Julián Sánchez",
            "cedula": "34560789",
            "correo": "julian.sanchez@email.com"
          }
        },
        {
          "id": "31",
          "title": "Análisis Sísmico de Estructuras de Concreto",
          "carrera": "Ingeniería Civil",
          "tipo": "Tesis",
          "autor": {
            "nombre": "Felipe Navarro",
            "cedula": "12340567",
            "correo": "felipe.navarro@email.com"
          }
        },
        {
          "id": "46",
          "title": "Arquitectura Paramétrica y Fabricación Digital",
          "carrera": "Arquitectura",
          "tipo": "Tesis",
          "autor": {
            "nombre": "Emilio Vargas",
            "cedula": "67890012",
            "correo": "emilio.vargas@email.com"
          }
        },
        {
          "id": "63",
          "title": "Arquitectura Vernácula y Identidad Cultural",
          "carrera": "Arquitectura",
          "tipo": "Monografía",
          "autor": {
            "nombre": "Olga Pedraza",
            "cedula": "34560789",
            "correo": "olga.pedraza@email.com"
          }
        },
        {
          "id": "ext-3",
          "title": "Arquitectura Regenerativa y Biomimética",
          "carrera": "Arquitectura",
          "tipo": "Proyecto de Grado",
          "autor": {
            "nombre": "Tomás Futuro",
            "cedula": "77777777",
            "correo": "tomas.futuro@email.com"
          }
        },
        {
          "id": "1",
          "title": "Sistema de Gestión Académica para Universidades",
          "carrera": "Ingeniería de Sistemas",
          "tipo": "Tesis",
          "autor": {
            "nombre": "Carlos Rodríguez",
            "cedula": "12345678",
            "correo": "carlos.rodriguez@email.com"
          }
        }
      ]

      setResults(data)
      setShowResults(true)
    } catch (error) {
      console.error("Error searching:", error)
      setResults([])
      setShowResults(false)
    } finally {
      setIsLoadingResults(false)
    }
  }

  function handleResultClick(result: SearchItem) {
    console.log("Result clicked:", result)
  }

  function handleClear() {
    setQuery("")
    setResults([])
    setShowResults(false)
  }

  // Efecto para realizar la búsqueda cuando el query con debounce cambia
  useEffect(() => {
    if (debouncedQuery.trim()) {
      performSearch(debouncedQuery)
    } else {
      setResults([])
      setShowResults(false)
    }
  }, [debouncedQuery])

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
    if (query.trim() && results.length > 0) {
      setShowResults(true)
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
                {results.length > 0 ? (
                  <>
                    <div className="results-header">
                      <div className="results-count">
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          {results.length}
                        </motion.span>
                        <span> trabajos encontrados</span>
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
                          <div className="result-content">
                            <div className="result-title">{result.title}</div>
                            <div className="result-author">
                              Por: <strong>{result.autor?.nombre}</strong>
                            </div>
                            <div className="result-meta">
                              {result.carrera && <Badge variant="secondary">{result.carrera}</Badge>}
                              {result.tipo && <Badge variant="default">{result.tipo}</Badge>}
                              {result.autor?.correo && (
                                <Badge variant="secondary" size="sm">
                                  {result.autor.correo}
                                </Badge>
                              )}
                            </div>
                          </div>
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
              2
            </motion.span>
            <span> segundos...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}