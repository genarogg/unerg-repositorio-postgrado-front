import type { SearchItem, SearchIndex, SearchOptions } from "./types"

export function createSearchIndex(): SearchIndex {
  const items: SearchItem[] = []

  // Simple tokenization function
  function tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter(Boolean)
  }

  // Calculate score based on term frequency
  function calculateScore(item: SearchItem, tokens: string[], fields: string[], boost: Record<string, number>): number {
    let score = 0

    for (const field of fields) {
      if (!item[field] || typeof item[field] !== "string") continue

      const fieldValue = item[field].toLowerCase()
      const fieldBoost = boost[field] || 1

      for (const token of tokens) {
        // Exact match gets higher score
        if (fieldValue.includes(token)) {
          score += 1 * fieldBoost

          // Bonus for exact word match with word boundaries
          const regex = new RegExp(`\\b${token}\\b`, "i")
          if (regex.test(fieldValue)) {
            score += 0.5 * fieldBoost
          }

          // Bonus for match at beginning
          if (fieldValue.startsWith(token)) {
            score += 0.3 * fieldBoost
          }
        }
      }
    }

    return score
  }

  // Fuzzy matching using Levenshtein distance
  function levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = []

    // Initialize matrix
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i]
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j
    }

    // Fill matrix
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        const cost = a[j - 1] === b[i - 1] ? 0 : 1
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, // deletion
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j - 1] + cost, // substitution
        )
      }
    }

    return matrix[b.length][a.length]
  }

  // Check if a string matches with fuzzy search
  function fuzzyMatch(text: string, query: string, threshold: number): boolean {
    if (!text) return false
    text = text.toLowerCase()
    query = query.toLowerCase()

    // Direct contains check first (optimization)
    if (text.includes(query)) return true

    // For very short queries, be more strict
    if (query.length <= 2) {
      return text.includes(query)
    }

    // Calculate max allowed distance based on query length
    const maxDistance = Math.min(
      Math.floor(query.length * threshold),
      3, // Cap at 3 for performance
    )

    // Check each word in the text
    const words = text.split(/\s+/)
    for (const word of words) {
      // Quick length check to skip obvious non-matches
      if (Math.abs(word.length - query.length) > maxDistance) continue

      const distance = levenshteinDistance(word, query)
      if (distance <= maxDistance) return true
    }

    return false
  }

  return {
    items,

    addItem(item: SearchItem) {
      if (!item.id) {
        item.id = crypto.randomUUID()
      }
      items.push(item)
    },

    addItems(newItems: SearchItem[]) {
      for (const item of newItems) {
        this.addItem(item)
      }
    },

    search(query: string, options: SearchOptions = {}): SearchItem[] {
      const {
        limit = 50,
        fields = ["title", "description", "content"],
        boost = { title: 2, description: 1, content: 0.5 },
        fuzzy = true,
        prefix = true,
      } = options

      if (!query.trim()) return []

      const tokens = tokenize(query)
      const fuzzyThreshold = typeof fuzzy === "number" ? fuzzy : 0.3

      const results = items
        .map((item) => {
          let score = calculateScore(item, tokens, fields, boost)

          // Apply fuzzy matching if enabled and no exact matches found
          if (fuzzy && score === 0) {
            for (const field of fields) {
              if (!item[field] || typeof item[field] !== "string") continue

              for (const token of tokens) {
                if (fuzzyMatch(item[field], token, fuzzyThreshold)) {
                  score += 0.3 * (boost[field] || 1)
                }
              }
            }
          }

          // Apply prefix matching if enabled
          if (prefix && score === 0) {
            for (const field of fields) {
              if (!item[field] || typeof item[field] !== "string") continue

              const fieldValue = item[field].toLowerCase()
              for (const token of tokens) {
                for (const word of fieldValue.split(/\s+/)) {
                  if (word.startsWith(token)) {
                    score += 0.4 * (boost[field] || 1)
                  }
                }
              }
            }
          }

          return { item, score }
        })
        .filter((result) => result.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((result) => result.item)

      return results
    },

    getItem(id: string) {
      return items.find((item) => item.id === id)
    },

    removeItem(id: string) {
      const index = items.findIndex((item) => item.id === id)
      if (index !== -1) {
        items.splice(index, 1)
      }
    },

    clear() {
      items.length = 0
    },
  }
}
