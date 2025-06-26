"use client"

import { useCallback } from "react"
import { useGlobal } from "../Global"
import dataFake from "./data-fake"

const useData = () => {
    const { setData } = useGlobal()
    const API = "http://localhost:3001/usuarios"

    const initialData = useCallback(
        async (page = 1, limit = 10) => {
            setData({ loading: true })
            try {
                const res = await fetch(API)
                const json = await res.json()
                
                console.log("Datos obtenidos:", json.data)

                // Calcular paginación para datos de la API
                const allItems = json.data
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
                    error: "Error al cargar datos desde la API"
                })
            }
        },
        [setData],
    )

    return { initialData }
}

export default useData
