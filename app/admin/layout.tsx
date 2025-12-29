"use client"

import type React from "react"
import { AdminNav } from "@/components/admin-nav"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    try {
      // Intentar logout de Supabase
      await supabase.auth.signOut()
    } catch (error) {
      console.error("Error en logout de Supabase:", error)
    }
    
    // Limpiar localStorage también
    localStorage.removeItem("admin_logged_in")
    
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="font-semibold">Panel de Administración - Voz del Guapo</h1>
            <div className="flex items-center gap-4">
              <a href="/" className="text-sm hover:underline">
                Ver sitio público →
              </a>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>
      </div>
      <AdminNav />
      {children}
    </div>
  )
}
