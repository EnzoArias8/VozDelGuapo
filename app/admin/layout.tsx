import type React from "react"
import { AdminNav } from "@/components/admin-nav"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="font-semibold">Panel de Administración - Voz del Guapo</h1>
            <a href="/" className="text-sm hover:underline">
              Ver sitio público →
            </a>
          </div>
        </div>
      </div>
      <AdminNav />
      {children}
    </div>
  )
}
