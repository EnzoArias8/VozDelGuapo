"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Save, History } from "lucide-react"

export default function AdminHistoriaPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = () => {
    setIsLoading(true)
    // Aquí conectarás con el backend
    setTimeout(() => {
      setIsLoading(false)
      alert("Historia actualizada correctamente")
    }, 1000)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2">Editar Historia del Club</h1>
            <p className="text-muted-foreground">Actualiza la información histórica del club</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Contenido de la Historia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título Principal</Label>
            <Input id="title" placeholder="Historia de Barracas Central" defaultValue="Historia de Barracas Central" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="intro">Introducción</Label>
            <Textarea
              id="intro"
              placeholder="Texto introductorio..."
              rows={4}
              defaultValue="El Club Atlético Barracas Central fue fundado el 5 de abril de 1904 en el barrio de Barracas, Buenos Aires. Con más de 119 años de historia, el club es conocido cariñosamente como 'El Guapo' y representa con orgullo al barrio porteño."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fundacion">Fundación</Label>
            <Textarea
              id="fundacion"
              placeholder="Historia de la fundación..."
              rows={5}
              defaultValue="La historia de Barracas Central comienza en las calles del barrio de Barracas, cuando un grupo de vecinos decidió formar un club de fútbol que representara a la comunidad. El 5 de abril de 1904 quedó oficialmente fundado el Club Atlético Barracas Central."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="golden">Época Dorada</Label>
            <Textarea
              id="golden"
              placeholder="Época dorada del club..."
              rows={5}
              defaultValue="Durante las décadas de 1940 y 1950, Barracas Central vivió su época dorada, compitiendo en la Primera División del fútbol argentino. El club logró importantes victorias y consolidó su presencia en el fútbol profesional argentino."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="achievements">Logros Principales</Label>
            <Textarea
              id="achievements"
              placeholder="Lista de logros..."
              rows={6}
              defaultValue="- Campeón Primera B Nacional 2022&#10;- Múltiples campeonatos en categorías inferiores&#10;- Participación destacada en Copa Argentina&#10;- Ascenso histórico a Primera División en 2023"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="present">Actualidad</Label>
            <Textarea
              id="present"
              placeholder="Historia reciente..."
              rows={5}
              defaultValue="En 2022, Barracas Central logró el ascenso a la Primera División tras ganar la Primera Nacional, regresando a la máxima categoría después de décadas. El club continúa escribiendo su historia en el fútbol argentino, representando con orgullo al barrio de Barracas."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline">Cancelar</Button>
            <Button onClick={handleSave} disabled={isLoading} className="gap-2">
              <Save className="h-4 w-4" />
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
