"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save } from "lucide-react"
import { getStaffById, updateStaff } from "@/lib/data-manager"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import Link from "next/link"

export default function EditStaffPage() {
  const router = useRouter()
  const params = useParams()
  const staffId = params.id as string
  const supabase = createClient()
  
  const [formData, setFormData] = useState({
    name: "",
    role: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Verificar autenticación
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error || !session) {
        toast.error("Sesión expirada. Por favor inicia sesión nuevamente.")
        router.push('/login')
        return
      }

      // Cargar datos del staff
      const staff = getStaffById(staffId)
      if (staff) {
        setFormData({
          name: staff.name,
          role: staff.role,
        })
        setIsLoading(false)
      } else {
        toast.error("Miembro del cuerpo técnico no encontrado")
        router.push("/admin/plantel")
      }
    }

    checkAuth()
  }, [staffId, router, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.role.trim()) {
      toast.error("Por favor completa todos los campos")
      return
    }

    setIsSubmitting(true)
    
    try {
      const success = updateStaff(staffId, formData)
      if (success) {
        toast.success("Miembro del cuerpo técnico actualizado correctamente")
        router.push("/admin/plantel")
      } else {
        toast.error("Error al actualizar el miembro del cuerpo técnico")
      }
    } catch (error) {
      toast.error("Error al actualizar el miembro del cuerpo técnico")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/admin/plantel"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al Plantel
        </Link>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Editar Miembro del Cuerpo Técnico</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Ej: Rubén Darío Forestello"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rol/Cargo</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => handleInputChange("role", e.target.value)}
                placeholder="Ej: Director Técnico"
                required
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/plantel")}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
