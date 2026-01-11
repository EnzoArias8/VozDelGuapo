"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface LoadingContextType {
  isFirstVisit: boolean
  setFirstVisit: (visited: boolean) => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isFirstVisit, setIsFirstVisit] = useState(true) // Siempre true para pruebas

  useEffect(() => {
    // Temporalmente ignorar localStorage para mostrar siempre la pantalla de carga
    // const hasVisited = localStorage.getItem('has-visited-site')
    // if (hasVisited) {
    //   setIsFirstVisit(false)
    // }
  }, [])

  const setFirstVisit = (visited: boolean) => {
    setIsFirstVisit(visited)
    if (!visited) {
      localStorage.setItem('has-visited-site', 'true')
    }
  }

  return (
    <LoadingContext.Provider value={{ isFirstVisit, setFirstVisit }}>
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}
