"use client"

import dynamic from "next/dynamic";

// Carga dinámica client-only - mata el error #418 para siempre
const EditarNoticiaClient = dynamic(() => import("./EditarNoticiaClient"), { 
  ssr: false,
  loading: () => (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Cargando editor...</p>
      </div>
    </div>
  )
});

export default function EditarNoticiaWrapper() {
  return <EditarNoticiaClient />;
}
