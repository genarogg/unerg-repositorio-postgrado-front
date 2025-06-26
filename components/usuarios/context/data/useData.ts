"use client"

import { useCallback } from "react"
import { useGlobal } from "../Global"
import dataFake from "./data-fake"

const useData = () => {
  const { setData } = useGlobal()
  const API = "http://localhost:4000/auth/usuarios" // URL actualizada

  const initialData = useCallback(
    async (page = 1, limit = 10) => {
      setData({ loading: true })
      try {
        const res = await fetch(API)
        const json = await res.json()

        console.log("Datos obtenidos:", json)

        // Verificar que la respuesta sea exitosa
        if (json.type !== "success") {
          throw new Error(json.message || "Error en la respuesta del servidor")
        }

        // Mapear los datos del servidor al formato esperado por la aplicación
        const mappedData = json.data.map((usuario: any) => ({
          id: usuario.id,
          name: usuario.name,
          lastName: usuario.lastName,
          email: usuario.email,
          role: usuario.role,
          cedula: usuario.cedula,
          // Convertir boolean a string para el estado
          estado: usuario.estado ? "ACTIVO" : "INACTIVO",
        }))

        // Calcular paginación para datos de la API
        const allItems = mappedData
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit
        const paginatedItems = allItems.slice(startIndex, endIndex)
        const totalPages = Math.ceil(allItems.length / limit)

        setData({
          items: paginatedItems.reverse(),
          totalItems: allItems.length,
          page,
          totalPages,
          loading: false,
        })
      } catch (error) {
        console.error("Error fetching data:", error)
        // Fallback con datos fake paginados
        const allItems = dataFake.usuarios.data
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit
        const paginatedItems = allItems.slice(startIndex, endIndex)
        const totalPages = Math.ceil(allItems.length / limit)

        setData({
          items: paginatedItems,
          totalItems: allItems.length,
          page,
          totalPages,
          loading: false,
          error: "Error al cargar datos desde la API",
        })
      }
    },
    [setData],
  )

  return { initialData }
}

export default useData
