"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import "./countdown-indicator.css"

interface CountdownIndicatorProps {
  seconds: number
  onComplete?: () => void
}

export function CountdownIndicator({ seconds, onComplete }: CountdownIndicatorProps) {
  const [count, setCount] = useState(seconds)

  useEffect(() => {
    if (count <= 0) {
      onComplete?.()
      return
    }

    const timer = setTimeout(() => {
      setCount(count - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [count, onComplete])

  return (
    <>
 
      <motion.div
        className="countdown-container"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        key={count}
      >
        <div className="countdown-number">{count}</div>
        <svg className="countdown-circle" viewBox="0 0 36 36">
          <motion.path
            className="circle-bg"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="3"
          />
          <motion.path
            className="circle-progress"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            initial={{ pathLength: 1 }}
            animate={{ pathLength: count / seconds }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </svg>
      </motion.div>
    </>
  )
}
