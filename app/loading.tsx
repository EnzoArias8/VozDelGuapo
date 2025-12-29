"use client"

import Image from "next/image"

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* Fondo con tiras rojas y blancas horizontales (como la camiseta) */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: `
            repeating-linear-gradient(
              0deg,
              #DC2626 0px,
              #DC2626 40px,
              #FFFFFF 40px,
              #FFFFFF 80px
            )
          `,
        }}
      />
      
      {/* Overlay sutil para mejor contraste */}
      <div className="absolute inset-0 bg-black/5" />
      
      {/* Contenido centrado */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8 px-4">
        {/* Escudo con animación */}
        <div className="relative animate-pulse">
          <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl scale-150" />
          <Image
            src="/images/image.png"
            alt="Escudo de Barracas Central"
            width={220}
            height={264}
            className="relative object-contain drop-shadow-2xl"
            priority
          />
        </div>
        
        {/* Texto con sombra */}
        <div className="text-center">
          <h1 
            className="text-5xl md:text-7xl font-serif font-bold drop-shadow-2xl"
            style={{
              color: '#DC2626',
              textShadow: '3px 3px 6px rgba(0, 0, 0, 0.3), 0 0 20px rgba(220, 38, 38, 0.5)',
            }}
          >
            Voz del Guapo
          </h1>
        </div>
      </div>
    </div>
  )
}

