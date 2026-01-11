"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Intentar login con Supabase primero
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      // Si hay un error de Supabase pero es porque no está configurado, usar fallback
      if (authError) {
        // Si el error es de configuración (URL inválida), usar método de fallback
        if (authError.message?.includes('Invalid API key') || authError.message?.includes('Failed to fetch')) {
          // Método de fallback si Supabase no está configurado
      if (email === "admin@vozdelguapo.com" && password === "admin123") {
        localStorage.setItem("admin_logged_in", "true")
            toast.success("Sesión iniciada correctamente")
            router.push("/admin")
            router.refresh()
            setIsLoading(false)
            return
          } else {
            setError("Credenciales incorrectas")
            toast.error("Credenciales incorrectas")
            setIsLoading(false)
            return
          }
        }
        
        // Otro tipo de error de Supabase
        setError(authError.message || "Credenciales incorrectas")
        toast.error(authError.message || "Error al iniciar sesión")
        setIsLoading(false)
        return
      }

      // Login exitoso con Supabase
      if (data.user) {
        toast.success("Sesión iniciada correctamente")
        router.push("/admin")
        router.refresh()
      }
    } catch (err: any) {
      console.error("Error en login:", err)
      
      // Si es un error de red/configuración, intentar fallback
      if (err.message?.includes('Failed to fetch') || err.message?.includes('Network')) {
        if (email === "admin@vozdelguapo.com" && password === "admin123") {
          localStorage.setItem("admin_logged_in", "true")
          toast.success("Sesión iniciada correctamente")
          router.push("/admin")
          router.refresh()
          setIsLoading(false)
          return
        }
      }
      
      setError("Error al iniciar sesión. Por favor, intenta nuevamente.")
      toast.error("Error al iniciar sesión")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <Image src="/images/image.png" alt="Voz del Guapo - Personaje característico" width={140} height={168} className="object-contain" />
          </div>
          <div>
            <CardTitle className="text-2xl font-serif">Voz del Guapo</CardTitle>
            <CardDescription className="mt-2">Panel de Administración</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">{error}</div>}
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Button variant="link" className="text-sm" asChild>
              <a href="/">← Volver al sitio</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
