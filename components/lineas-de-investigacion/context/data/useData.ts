"use client"

import { useCallback } from "react"
import { useGlobal } from "../Global"
import dataFake from "./data-fake"

const useData = () => {
  const { setData } = useGlobal()
  const API = "http://localhost:4000/lineas-de-investigacion/get-all"

  const initialData = useCallback(
    async (page = 1, limit = 10) => {
      setData({ loading: true })
      try {
        const res = await fetch(API)
        const json = await res.json()

        console.log("Datos obtenidos:", json)

        // Verificar que la respuesta sea exitosa y tenga datos
        if (json.type === "success" && json.data) {
          // Transformar los datos del API al formato esperado
          const transformedData = json.data.map((item: any) => ({
            id: item.id,
            nombre: item.nombre,
            estado: item.estado ? "ACTIVO" : "INACTIVO",
            // Campos adicionales que podrían ser necesarios para el formulario
            correo: "",
            telefono: "",
            cedula: "",
            rol: "EDITOR",
            limite: 0,
            doc: "",
          }))

          // Calcular paginación
          const allItems = transformedData
          const startIndex = (page - 1) * limit
          const endIndex = startIndex + limit
          const paginatedItems = allItems.slice(startIndex, endIndex)
          const totalPages = Math.ceil(allItems.length / limit)

          setData({
            items: allItems.reverse(),
            totalItems: allItems.length,
            page,
            totalPages,
            loading: false,
          })
        } else {
          throw new Error(json.message || "Error en la respuesta del servidor")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        // Fallback con datos fake paginados
        const allItems = dataFake["lineas-investigacion"].data.map((item: any) => ({
          id: item.id,
          nombre: item.nombre,
          estado: item.estado ? "ACTIVO" : "INACTIVO",
          correo: "",
          telefono: "",
          cedula: "",
          rol: "EDITOR",
          limite: 0,
          doc: "",
        }))

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
