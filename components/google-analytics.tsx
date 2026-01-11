"use client"

import { useGoogleAnalytics } from "@/lib/google-analytics"
import { usePathname } from "next/navigation"

export function GoogleAnalytics() {
  const pathname = usePathname()
  
  // Inicializar Google Analytics y hacer seguimiento de páginas
  useGoogleAnalytics()
  
  return null // Este componente no renderiza nada, solo maneja la analítica
}
