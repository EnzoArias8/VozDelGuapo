"use client"

import { useEffect } from 'react'

interface VisitStats {
  total: number
  today: number
  lastReset: string
}

export function useVisitTracker(articleId?: string) {
  useEffect(() => {
    // Registrar visita general del sitio
    const siteStatsKey = 'site-stats'
    const storedStats = localStorage.getItem(siteStatsKey)
    
    if (storedStats) {
      const stats: VisitStats = JSON.parse(storedStats)
      const today = new Date().toDateString()
      
      // Resetear contador diario si es un nuevo día
      if (stats.lastReset !== today) {
        stats.today = 1
        stats.lastReset = today
      } else {
        stats.today += 1
      }
      
      stats.total += 1
      localStorage.setItem(siteStatsKey, JSON.stringify(stats))
    } else {
      // Primera visita
      const initialStats: VisitStats = {
        total: 1,
        today: 1,
        lastReset: new Date().toDateString()
      }
      localStorage.setItem(siteStatsKey, JSON.stringify(initialStats))
    }

    // Registrar visita individual de noticia si se proporciona articleId
    if (articleId) {
      const articleStatsKey = `article-${articleId}-visits`
      const storedArticleVisits = localStorage.getItem(articleStatsKey)
      
      if (storedArticleVisits) {
        const visits = parseInt(storedArticleVisits) + 1
        localStorage.setItem(articleStatsKey, visits.toString())
      } else {
        localStorage.setItem(articleStatsKey, '1')
      }
    }
  }, [articleId])
}

export function getArticleVisits(articleId: string): number {
  const visits = localStorage.getItem(`article-${articleId}-visits`)
  return visits ? parseInt(visits) : 0
}
