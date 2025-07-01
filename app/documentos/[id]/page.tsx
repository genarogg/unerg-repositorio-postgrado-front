"use client"

import { useState, useEffect } from "react"

import { useParams } from "next/navigation"

import styles from "./page.module.css"
import Layout from '../../../components/layout'

import { SearchBar } from "../../../components/search/SearchBar/SearchBar"

// Definir las interfaces para los tipos
interface Usuario {
  name: string
  lastName: string
}

interface LineaDeInvestigacion {
  nombre: string
  usuario?: Usuario
}

interface PeriodoAcademico {
  periodo: string
}

interface Documento {
  id: string
  titulo: string
  autor: string
  resumen?: string
  doc?: string
  estado: string
  lineaDeInvestigacion?: LineaDeInvestigacion
  periodoAcademico?: PeriodoAcademico
}

export default function DocumentoIndividualPage() {
  const params = useParams()
  const documentoId = params.id as string

  // Tipado correcto del estado
  const [documento, setDocumento] = useState<Documento | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDocumento = async () => {
      if (!documentoId) return

      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`http://localhost:4000/trabajos/get-by-id/${documentoId}`)

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const result = await response.json()

        if (result.type === "success" && result.data) {
          setDocumento(result.data)
        } else {
          throw new Error(result.message || "Error al obtener el documento")
        }
      } catch (err) {
        console.error("Error fetching documento:", err)
        setError(err instanceof Error ? err.message : "Error al cargar el documento")
      } finally {
        setLoading(false)
      }
    }

    fetchDocumento()
  }, [documentoId])

  const descargarDocumento = () => {
    if (!documento || !documento.doc) return

    // Construye la URL del archivo basada en el nombre del documento
    // Ajusta esta URL según tu configuración del servidor
    const fileUrl = `http://localhost:4000/files/${documento.doc}`

    const link = document.createElement("a")
    link.href = fileUrl
    link.download = documento.doc
    link.target = "_blank" // Abre en nueva pestaña como respaldo
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const searchPlaceholders = [
    "Buscar postgrados en salud...",
    "Especializaciones en derecho...",
    "Maestrías en ingeniería...",
    "Estudios avanzados en psicología...",
    "Postgrados en administración...",
    "Programas de comunicación...",
  ]

  // Estados de carga y error
  if (loading) {
    return (
      <Layout>
        <main className={styles.mainContent}>
          <div>Cargando documento...</div>
        </main>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <main className={styles.mainContent}>
          <div className={styles.breadcrumb}>

          </div>
          <div className={styles.errorContainer}>
            <h2>Error al cargar el documento</h2>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className={styles.retryButton}
            >
              Intentar nuevamente
            </button>
          </div>
        </main>
      </Layout>
    )
  }

  if (!documento) {
    return (
      <Layout>
        <main className={styles.mainContent}>
          <div className={styles.breadcrumb}>

          </div>
          <div className={styles.notFoundContainer}>
            <h2>Documento no encontrado</h2>
            <p>El documento solicitado no existe o no está disponible.</p>
          </div>
        </main>
      </Layout>
    )
  }



  return (
    <Layout>
      <div style={{ marginTop: "40px", marginBottom: "10px" }}>
        <SearchBar placeholders={searchPlaceholders} typingSpeed={80} typingDelay={1500} debounceTime={2000} />
      </div>
      <main className={styles.mainContent}>
        <article className={styles.articleContainer}>
          <header className={styles.articleHeader}>
            <div className={styles.categoryTag}>
              {documento.lineaDeInvestigacion?.nombre || "Investigación"}
            </div>
            <h1 className={styles.articleTitle}>{documento.titulo}</h1>
            <div className={styles.articleMeta}>
              <div className={styles.authorInfo}>
                <div className={styles.authorAvatar}>
                  <span>
                    {documento.autor ? documento.autor.charAt(0).toUpperCase() : "?"}
                  </span>
                </div>
                <div className={styles.authorDetails}>
                  <p className={styles.authorName}>{documento.autor}</p>
                  <p className={styles.authorField}>
                    {documento.lineaDeInvestigacion?.nombre || "Sin línea de investigación"}
                  </p>
                  {documento.lineaDeInvestigacion?.usuario && (
                    <p className={styles.authorSupervisor}>
                      Supervisor: {documento.lineaDeInvestigacion.usuario.name} {documento.lineaDeInvestigacion.usuario.lastName}
                    </p>
                  )}
                </div>
              </div>
              <div className={styles.documentInfo}>
                <p className={styles.period}>
                  Período: {documento.periodoAcademico?.periodo || "No especificado"}
                </p>
                <p className={styles.status}>
                  Estado: <span className={`${styles.statusBadge} ${styles[documento.estado?.toLowerCase()]}`}>
                    {documento.estado}
                  </span>
                </p>
              </div>
            </div>
          </header>

          <div className={styles.articleContent}>
            <div className={styles.abstract}>
              <h2>Resumen</h2>
              <div className={styles.resumeContent}>
                {documento.resumen ? (
                  documento.resumen.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))
                ) : (
                  <p>No hay resumen disponible para este documento.</p>
                )}
              </div>
            </div>

            <div className={styles.downloadSection}>
              <button
                className={styles.downloadButton}
                onClick={descargarDocumento}
                disabled={!documento.doc}
              >
                <svg className={styles.downloadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7,10 12,15 17,10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                {documento.doc ? "Descargar Documento Completo" : "Documento no disponible"}
              </button>
              {documento.doc && (
                <p className={styles.fileName}>
                  Archivo: {documento.doc}
                </p>
              )}
            </div>
          </div>
        </article>
      </main>
    </Layout>
  )
}