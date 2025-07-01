"use client"

import { useCallback } from "react"
import { useGlobal } from "../Global"
import dataFake from "./data-fake"

const useData = () => {
  const { setData } = useGlobal()
  const API = "https://repositorio.unerg.tech/auth/usuarios" // URL actualizada

  const initialData = useCallback(
    async (page: number = 1, itemsPerPage: number = 100) => {
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

        // Aplicar paginación cliente-side
        const allItems = mappedData.reverse()
        const totalItems = allItems.length
        const totalPages = Math.ceil(totalItems / itemsPerPage)
        
        // Calcular índices para la paginación
        const startIndex = (page - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        const paginatedItems = allItems.slice(startIndex, endIndex)

        setData({
          items: paginatedItems,
          totalItems,
          page,
          totalPages,
          loading: false,
        })
      } catch (error) {
        console.error("Error fetching data:", error)
        
        // Fallback con datos fake también paginados
        const allItems = dataFake.usuarios.data
        const totalItems = allItems.length
        const totalPages = Math.ceil(totalItems / itemsPerPage)
        
        const startIndex = (page - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        const paginatedItems = allItems.slice(startIndex, endIndex)

        setData({
          items: paginatedItems,
          totalItems,
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