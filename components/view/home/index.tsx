"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SearchBar } from "../../search/SearchBar/SearchBar"
import { ModernStatsCard } from "./ModernStatsCard"
import type { Variants } from "framer-motion"

import "./css/dashboard.css"

interface CareerStat {
  id: number
  cantidadTrabajos: number
  porcentaje: number
  lineaDeInvestigacion: {
    id: number
    nombre: string
    estado: boolean
  }
  color?: string // Lo mantenemos para los colores de la UI
}

interface DashboardStats {
  totalTrabajos: number
  cantidadLineas: number
  estadisticas: CareerStat[]
}

interface BackendResponse {
  type: string
  message: string
  data: {
    estadisticas: CareerStat[]
    totalTrabajos: number
    cantidadLineas: number
  }
}

const InteractiveSearchDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("http://localhost:4000/estadisticas/get-all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",

        },
      })

      console.log("🔄 Fetching dashboard stats...", response)

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`)
      }

      const backendResponse: BackendResponse = await response.json()

      // Verificar que la respuesta sea exitosa
      if (backendResponse.type !== "success") {
        throw new Error(backendResponse.message || "Error en la respuesta del servidor")
      }

      // Array de colores para asignar a cada línea de investigación
      const colors = [
        "#8B5CF6", // Púrpura
        "#EC4899", // Rosa
        "#06B6D4", // Cian
        "#10B981", // Verde esmeralda
        "#F59E0B", // Ámbar
        "#EF4444", // Rojo
        "#6366F1", // Índigo
        "#84CC16", // Lima
        "#F97316", // Naranja
        "#8B5CF6", // Púrpura (repetir)
        "#6366F1", // Índigo
        "#EC4899", // Rosa
        "#06B6D4", // Cian
        "#10B981", // Verde esmeralda
        "#F59E0B", // Ámbar
        "#EF4444", // Rojo
        "#6366F1", // Índigo
        "#84CC16", // Lima
      ]

      // Filtrar solo las líneas de investigación activas y asignar colores
      const estadisticasActivas = backendResponse.data.estadisticas
        .filter((stat) => stat.lineaDeInvestigacion.estado)
        .map((stat, index) => ({
          ...stat,
          color: colors[index % colors.length],
        }))

      const data: DashboardStats = {
        totalTrabajos: backendResponse.data.totalTrabajos,
        cantidadLineas: backendResponse.data.cantidadLineas,
        estadisticas: estadisticasActivas,
      }

      setStats(data)
      console.log("✅ Estadísticas cargadas correctamente:", data)
    } catch (error) {
      console.error("❌ Error fetching dashboard stats:", error)

      // Establecer mensaje de error más específico
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Error desconocido al cargar las estadísticas")
      }

      // Opcional: Usar datos de fallback en caso de error
      // setStats(fallbackData)
    } finally {
      setLoading(false)
    }
  }

  // Función para reintentar la carga
  const handleRetry = () => {
    fetchDashboardStats()
  }

  const searchPlaceholders = [
    "Buscar postgrados en salud...",
    "Especializaciones en derecho...",
    "Maestrías en ingeniería...",
    "Estudios avanzados en psicología...",
    "Postgrados en administración...",
    "Programas de comunicación...",
  ]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  }

  const searchVariants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 80,
        damping: 12,
        delay: 0.3,
      },
    },
  }

  const statsGridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.5,
      },
    },
  }

  const cardVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  const loadingVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.3,
      },
    },
  }

  return (
    <motion.div className="dashboard-container" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div className="dashboard-title" variants={containerVariants}>
        <h1>Repositorio Academico</h1>
      </motion.div>

      <div className="dashboard-header">
        <motion.div className="search-section" variants={searchVariants}>
          <SearchBar placeholders={searchPlaceholders} typingSpeed={80} typingDelay={1500} debounceTime={2000} />
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            className="loading-container"
            variants={loadingVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            key="loading"
          >
            <motion.div
              className="loading-spinner"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              Cargando estadísticas...
            </motion.p>
          </motion.div>
        ) : error ? (
          <motion.div
            className="error-container"
            variants={loadingVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            key="error"
          >
            <div className="error-content">
              <div className="error-icon">⚠️</div>
              <div className="error-title">Error al cargar las estadísticas</div>
              <div className="error-message">{error}</div>
              <button className="retry-button" onClick={handleRetry}>
                🔄 Reintentar
              </button>
            </div>
          </motion.div>
        ) : (
          stats && (
            <motion.div
              className="stats-section"
              variants={loadingVariants}
              initial="hidden"
              animate="visible"
              key="stats"
            >
              <motion.div className="stats-grid" variants={statsGridVariants}>
                {stats.estadisticas.map((estadistica, index) => (
                  <motion.div key={estadistica.id} variants={cardVariants}>
                    <ModernStatsCard
                      categoria={estadistica.lineaDeInvestigacion.nombre}
                      cantidad={estadistica.cantidadTrabajos}
                      porcentaje={estadistica.porcentaje}
                      color={estadistica.color || "#8B5CF6"}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* Información adicional */}
              <motion.div
                className="stats-summary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <div className="summary-item">
                  <span className="summary-label">Total de trabajos:</span>
                  <span className="summary-value">{stats.totalTrabajos}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Líneas de investigación:</span>
                  <span className="summary-value">{stats.cantidadLineas}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Líneas activas:</span>
                  <span className="summary-value">{stats.estadisticas.length}</span>
                </div>
              </motion.div>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default InteractiveSearchDashboard
