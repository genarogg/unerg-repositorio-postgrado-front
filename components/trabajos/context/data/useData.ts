"use client"

import { useCallback } from "react"
import { useGlobal } from "../Global"
import dataFake from "./data-fake"

const useData = () => {
  const { setData } = useGlobal()
  const API = "http://localhost:4000/trabajos/get-all"

  const initialData = useCallback(
    async (page = 1, limit = 10) => {
      setData({ loading: true })
      try {
        const res = await fetch(API)
        const json = await res.json()

        console.log("Datos obtenidos:", json)

        // Verificar que la respuesta sea exitosa
        if (json.type === "success" && json.data && json.data.trabajos) {
          // Mapear los datos del API al formato esperado por la tabla
          const mappedItems = json.data.trabajos.map((trabajo: any) => ({
            id: trabajo.id,
            titulo: trabajo.titulo,
            autor: trabajo.autor,
            lineaDeInvestigacion: trabajo.lineaDeInvestigacion?.nombre || "Sin línea",
            estado: trabajo.estado.toUpperCase(), // Convertir a mayúsculas para que coincida con nuestros badges
            periodoAcademico: trabajo.periodoAcademico?.periodo || "Sin período",
            pdfUrl: trabajo.doc,
            resumen: trabajo.resumen,
            // Guardar también los IDs originales por si los necesitamos
            lineaDeInvestigacionId: trabajo.lineaDeInvestigacionId,
            periodoAcademicoId: trabajo.periodoAcademicoId,
          }))

          // Calcular paginación
          const allItems = mappedItems
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
          })
        } else {
          throw new Error("Formato de respuesta inválido")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        // Fallback con datos fake paginados
        const allItems = dataFake.trabajos.data
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
