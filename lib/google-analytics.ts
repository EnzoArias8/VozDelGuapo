"use client"

import { useEffect } from 'react'

// Google Analytics Measurement ID
const GA_MEASUREMENT_ID = 'G-T8F6X9V31M' // ID actualizado de Google Analytics

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, any>) => void
  }
}

// Inicializar Google Analytics
export const initializeGA = () => {
  try {
    if (typeof window !== 'undefined' && !window.gtag) {
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
      script.onerror = () => {
        console.warn('Google Analytics script failed to load')
      }
      document.head.appendChild(script)

      window.gtag = function() {
        window.dataLayer = window.dataLayer || []
        window.dataLayer.push(arguments)
      } as any

      window.gtag('js', new Date())
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_location: window.location.href,
        page_title: document.title,
        // Evitar errores de autenticación
        send_page_view: false // Configuramos manualmente para evitar problemas
      })
    }
  } catch (error) {
    console.warn('Error initializing Google Analytics:', error)
  }
}

// Registrar vista de página
export const trackPageView = (url: string, title?: string) => {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_location: url,
        page_title: title || document.title
      })
    }
  } catch (error) {
    console.warn('Error tracking page view:', error)
  }
}

// Registrar evento personalizado
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value
      })
    }
  } catch (error) {
    console.warn('Error tracking event:', error)
  }
}

// Hook para seguimiento automático de páginas
export function useGoogleAnalytics() {
  useEffect(() => {
    // Inicializar GA solo en el cliente
    if (typeof window !== 'undefined') {
      initializeGA()
    }
  }, [])
}

// Hook para seguimiento de vistas de página
export function usePageTracking(pageUrl?: string, pageTitle?: string) {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      trackPageView(pageUrl || window.location.href, pageTitle)
    }
  }, [pageUrl, pageTitle])
}
