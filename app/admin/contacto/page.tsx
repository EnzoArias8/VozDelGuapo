"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, Mail, MapPin, Phone } from "lucide-react"

export default function AdminContactoPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = () => {
    setIsLoading(true)
    // Aquí conectarás con el backend
    setTimeout(() => {
      setIsLoading(false)
      alert("Información de contacto actualizada")
    }, 1000)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2">Editar Información de Contacto</h1>
            <p className="text-muted-foreground">Actualiza los datos de contacto del club</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Ubicación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Input id="address" defaultValue="Luna 1200, Barracas, Buenos Aires" placeholder="Dirección completa" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Ciudad / Provincia</Label>
              <Input id="city" defaultValue="Buenos Aires, Argentina" placeholder="Ciudad y provincia" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postal">Código Postal</Label>
              <Input id="postal" defaultValue="C1270" placeholder="Código postal" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Teléfonos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone1">Teléfono Principal</Label>
              <Input id="phone1" defaultValue="+54 11 4301-5040" placeholder="+54 11 xxxx-xxxx" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone2">Teléfono Secundario</Label>
              <Input id="phone2" defaultValue="+54 11 4301-5041" placeholder="+54 11 xxxx-xxxx" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input id="whatsapp" defaultValue="+54 9 11 xxxx-xxxx" placeholder="+54 9 11 xxxx-xxxx" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Correos Electrónicos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-general">Email General</Label>
              <Input
                id="email-general"
                type="email"
                defaultValue="info@barracascentral.com.ar"
                placeholder="info@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-press">Email Prensa</Label>
              <Input
                id="email-press"
                type="email"
                defaultValue="prensa@barracascentral.com.ar"
                placeholder="prensa@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-commercial">Email Comercial</Label>
              <Input
                id="email-commercial"
                type="email"
                defaultValue="comercial@barracascentral.com.ar"
                placeholder="comercial@example.com"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Redes Sociales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                defaultValue="https://facebook.com/BarracasCentralOficial"
                placeholder="URL de Facebook"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter / X</Label>
              <Input id="twitter" defaultValue="https://twitter.com/BarracasCentral" placeholder="URL de Twitter" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                defaultValue="https://instagram.com/barracascentraloficial"
                placeholder="URL de Instagram"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtube">YouTube</Label>
              <Input id="youtube" defaultValue="https://youtube.com/@BarracasCentral" placeholder="URL de YouTube" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Horarios de Atención</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="schedule">Horarios</Label>
              <Textarea
                id="schedule"
                rows={4}
                defaultValue="Lunes a Viernes: 9:00 - 18:00&#10;Sábados: 9:00 - 13:00&#10;Domingos y feriados: Cerrado"
                placeholder="Describe los horarios de atención"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline">Cancelar</Button>
          <Button onClick={handleSave} disabled={isLoading} className="gap-2">
            <Save className="h-4 w-4" />
            {isLoading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </div>
    </div>
  )
}
