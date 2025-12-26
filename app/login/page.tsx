"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("") // Added error state for login feedback
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    setTimeout(() => {
      // Credenciales de prueba: admin@vozdelguapo.com / admin123
      if (email === "admin@vozdelguapo.com" && password === "admin123") {
        localStorage.setItem("admin_logged_in", "true")
        router.push("/admin")
      } else {
        setError("Credenciales incorrectas")
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <Image src="/images/image.png" alt="Barracas Central" width={100} height={120} className="object-contain" />
          </div>
          <div>
            <CardTitle className="text-2xl font-serif">Voz del Guapo</CardTitle>
            <CardDescription className="mt-2">Panel de Administración</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">{error}</div>}
            <div className="bg-muted p-3 rounded-md text-sm">
              <p className="font-medium mb-1">Credenciales de prueba:</p>
              <p className="text-muted-foreground">Email: admin@vozdelguapo.com</p>
              <p className="text-muted-foreground">Contraseña: admin123</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@vozdelguapo.com"
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
