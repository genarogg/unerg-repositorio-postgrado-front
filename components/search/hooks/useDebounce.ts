"use client"

import { useState, useEffect } from "react"

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Establecer un temporizador para actualizar el valor después del delay
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Limpiar el temporizador si el valor cambia antes del delay
    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
