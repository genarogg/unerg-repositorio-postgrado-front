"use client"

import { motion } from "framer-motion"
import "./css/modern-stats-card.css"

interface ModernStatsCardProps {
  categoria: string
  cantidad: number
  porcentaje: number
  color: string
  isTotal?: boolean
}

export function ModernStatsCard({ categoria, cantidad, porcentaje, color, isTotal = false }: ModernStatsCardProps) {
  const cardVariants = {
    hover: {
      scale: 1.02,
      y: -4,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20,
      },
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1,
      },
    },
  }

  const circleVariants = {
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.3,
      },
    },
  }

  const numberVariants = {
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.2,
      },
    },
  }

  // Generate unique ID for clip path
  const clipId = `circle-clip-${categoria.replace(/\s+/g, "").toLowerCase()}`

  return (
    <motion.div
      className={`modern-stats-card ${isTotal ? "total-card" : "category-card"}`}
      style={{
        background: isTotal
          ? `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`
          : `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`,
        borderColor: `${color}30`,
      }}
      variants={cardVariants}
      whileHover="hover"
      whileTap="tap"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="card-content">
        <motion.div className="circle-container" variants={circleVariants}>
          <div className="circle-wrapper">
            <svg className="wave-svg" viewBox="0 0 120 120" width="80" height="80">
              <defs>
                <clipPath id={clipId}>
                  <circle cx="60" cy="60" r="38" />
                </clipPath>
              </defs>

              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="38"
                fill={isTotal ? `${color}40` : `${color}25`}
                stroke={`${color}60`}
                strokeWidth="2"
              />

              {/* Wave layers */}
              <g clipPath={`url(#${clipId})`}>
                {/* Primera capa de ondas - dos elementos para transición continua */}
                <motion.path
                  d="M-40,75 Q-25,65 -10,75 T20,75 Q35,65 50,75 T80,75 Q95,65 110,75 T140,75 L140,120 L-40,120 Z"
                  fill={`${color}70`}
                  animate={{
                    x: [0, 120],
                  }}
                  transition={{
                    x: {
                      duration: 6,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                      repeatType: "loop",
                    },
                  }}
                />
                <motion.path
                  d="M-160,75 Q-145,65 -130,75 T-100,75 Q-85,65 -70,75 T-40,75 L-40,120 L-160,120 Z"
                  fill={`${color}70`}
                  animate={{
                    x: [0, 120],
                  }}
                  transition={{
                    x: {
                      duration: 6,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                      repeatType: "loop",
                    },
                  }}
                />

                {/* Segunda capa de ondas - dos elementos para transición continua */}
                <motion.path
                  d="M-40,80 Q-25,70 -10,80 T20,80 Q35,70 50,80 T80,80 Q95,70 110,80 T140,80 L140,120 L-40,120 Z"
                  fill={`${color}50`}
                  animate={{
                    x: [0, 120],
                  }}
                  transition={{
                    x: {
                      duration: 8,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                      repeatType: "loop",
                    },
                  }}
                />
                <motion.path
                  d="M-160,80 Q-145,70 -130,80 T-100,80 Q-85,70 -70,80 T-40,80 L-40,120 L-160,120 Z"
                  fill={`${color}50`}
                  animate={{
                    x: [0, 120],
                  }}
                  transition={{
                    x: {
                      duration: 8,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                      repeatType: "loop",
                    },
                  }}
                />

                {/* Tercera capa de ondas - dos elementos para transición continua */}
                <motion.path
                  d="M-40,85 Q-25,75 -10,85 T20,85 Q35,75 50,85 T80,85 Q95,75 110,85 T140,85 L140,120 L-40,120 Z"
                  fill={`${color}30`}
                  animate={{
                    x: [0, 120],
                  }}
                  transition={{
                    x: {
                      duration: 7,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                      repeatType: "loop",
                    },
                  }}
                />
                <motion.path
                  d="M-160,85 Q-145,75 -130,85 T-100,85 Q-85,75 -70,85 T-40,85 L-40,120 L-160,120 Z"
                  fill={`${color}30`}
                  animate={{
                    x: [0, 120],
                  }}
                  transition={{
                    x: {
                      duration: 7,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                      repeatType: "loop",
                    },
                  }}
                />
              </g>
            </svg>

            {/* Number centered in circle */}
            <motion.div className="circle-number-container" variants={numberVariants}>
              <span className="circle-number" style={{ color: isTotal ? "white" : color }}>
                {cantidad}
              </span>
            </motion.div>
          </div>
        </motion.div>

        <div className="text-content">
          <h3 className="category-title" style={{ color: isTotal ? "white" : "#1f2937" }}>
            {categoria}
          </h3>
          <p className="category-subtitle" style={{ color: isTotal ? "rgba(255,255,255,0.8)" : "#6b7280" }}>
            {isTotal ? `Número: ${cantidad.toString().padStart(3, "0")}` : `${cantidad} elementos`}
          </p>
          {!isTotal && (
            <div className="percentage-bar">
              <motion.div
                className="percentage-fill"
                style={{
                  backgroundColor: color,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${porcentaje}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
              <span className="percentage-text" style={{ color }}>
                {porcentaje}%
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
