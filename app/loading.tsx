"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

export default function Loading() {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Mostrar la pantalla de carga por 5 segundos
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  if (!showContent) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
        {/* Fondo con imagen */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/images/fondo.jfif")',
          }}
        />
        
        {/* Overlay para mejor contraste */}
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Contenido centrado */}
        <div className="relative z-10 flex flex-col items-center justify-center space-y-8 px-4">
          {/* Logo con animación de salto */}
          <div className="relative">
            <Image
              src="/images/image.png"
              alt="Voz del Guapo - Logo"
              width={280}
              height={336}
              className="relative object-contain drop-shadow-2xl animate-bounce"
              priority
            />
          </div>
          
          {/* Texto con sombra */}
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white drop-shadow-lg">
              Voz del Guapo
            </h1>
          </div>
          
          {/* Indicador de carga */}
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    )
  }

  // Después del tiempo de carga, mostrar null para que Next.js continúe con la página real
  return null
}
