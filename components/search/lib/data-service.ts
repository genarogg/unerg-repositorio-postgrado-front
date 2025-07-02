import { createSearchIndex } from "./search-index"
import type { SearchItem } from "./types"

// Create a singleton instance of the search index
const searchIndex = createSearchIndex()

// Sample data for demonstration and fallback - Carreras Universitarias
const sampleData: SearchItem[] = []

// Cache management
interface DataCache {
  data: SearchItem[
    
  ]
  lastUpdated: Date
  source: "external" | "fallback"
}

let dataCache: DataCache | null = null

// Simulate external data source
async function fetchExternalData(): Promise<SearchItem[]> {
  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulate random success/failure (80% success rate for demo)
    if (Math.random() > 0.2) {
      // Simulate external data with some variations
      const externalData: SearchItem[] = [
        ...sampleData
      ]

      console.log("✅ External data fetched successfully")
      return externalData
    } else {
      throw new Error("External API unavailable")
    }
  } catch (error) {
    console.error("❌ Failed to fetch external data:", error)
    throw error
  }
}

// Check if data needs refresh (daily at 1 AM)
function shouldRefreshData(): boolean {
  if (!dataCache) return true

  const now = new Date()
  const lastUpdate = dataCache.lastUpdated

  // Check if it's past 1 AM today and we haven't updated today
  const today1AM = new Date()
  today1AM.setHours(1, 0, 0, 0)

  // If current time is past 1 AM and last update was before today's 1 AM
  if (now >= today1AM && lastUpdate < today1AM) {
    return true
  }

  // If current time is before 1 AM, check if last update was before yesterday's 1 AM
  const yesterday1AM = new Date(today1AM)
  yesterday1AM.setDate(yesterday1AM.getDate() - 1)

  if (now < today1AM && lastUpdate < yesterday1AM) {
    return true
  }

  return false
}

// Get data with caching and fallback
export async function getSearchData(): Promise<{
  data: SearchItem[]
  source: "external" | "fallback"
  lastUpdated: Date
}> {
  // Return cached data if it's still fresh
  if (dataCache && !shouldRefreshData()) {
    console.log("📦 Using cached data from:", dataCache.source)
    return {
      data: dataCache.data,
      source: dataCache.source,
      lastUpdated: dataCache.lastUpdated,
    }
  }

  console.log("🔄 Refreshing data...")

  try {
    // Try to fetch external data
    const externalData = await fetchExternalData()

    dataCache = {
      data: externalData,
      lastUpdated: new Date(),
      source: "external",
    }

    console.log("✅ Data updated from external source")
  } catch (error) {
    console.warn("⚠️ External data fetch failed, using fallback data")

    // Use fallback data if external fetch fails
    dataCache = {
      data: sampleData,
      lastUpdated: new Date(),
      source: "fallback",
    }
  }

  return {
    data: dataCache.data,
    source: dataCache.source,
    lastUpdated: dataCache.lastUpdated,
  }
}

// Initialize search index with data
export async function initializeSearchIndex(): Promise<void> {
  const { data } = await getSearchData()
  searchIndex.clear()
  searchIndex.addItems(data)
  console.log(`🚀 Search index initialized with ${data.length} items`)
}

// Force refresh data (for manual updates or cron jobs)
export async function forceRefreshData(): Promise<{
  success: boolean
  source: "external" | "fallback"
  itemCount: number
}> {
  try {
    const externalData = await fetchExternalData()

    dataCache = {
      data: externalData,
      lastUpdated: new Date(),
      source: "external",
    }

    // Update search index
    searchIndex.clear()
    searchIndex.addItems(externalData)

    return {
      success: true,
      source: "external",
      itemCount: externalData.length,
    }
  } catch (error) {
    // Fallback to sample data
    dataCache = {
      data: sampleData,
      lastUpdated: new Date(),
      source: "fallback",
    }

    searchIndex.clear()
    searchIndex.addItems(sampleData)

    return {
      success: false,
      source: "fallback",
      itemCount: sampleData.length,
    }
  }
}

export function getSearchIndex() {
  return searchIndex
}

export function addItemToIndex(item: SearchItem) {
  searchIndex.addItem(item)
}

export function searchItems(query: string, options = {}) {
  return searchIndex.search(query, options)
}

export function getSuggestions(query: string) {
  return searchIndex.search(query, {
    limit: 5,
    fields: ["title", "carrera", "tipo"],
    boost: { title: 3, carrera: 2, tipo: 1 },
    prefix: true,
  })
}

// Reset search index to default data
export function resetSearchIndex() {
  searchIndex.clear()
  searchIndex.addItems(sampleData)
}

// Get cache info for debugging
export function getCacheInfo() {
  return dataCache
    ? {
        lastUpdated: dataCache.lastUpdated,
        source: dataCache.source,
        itemCount: dataCache.data.length,
        shouldRefresh: shouldRefreshData(),
      }
    : null
}
