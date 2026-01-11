"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, ImageIcon } from "lucide-react"
import { createPlayer } from "@/lib/data-manager"
import { toast } from "sonner"

export default function NuevoJugadorPage() {
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    number: "",
    age: "",
    nationality: "",
    height: "",
    weight: "",
    matches: "",
    goals: "",
    assists: "",
    imageUrl: ""
  })

  const [uploadingImage, setUploadingImage] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        setFormData({...formData, imageUrl: result.url})
        toast.success("Foto subida correctamente")
      } else {
        toast.error(result.error || "Error al subir la foto")
      }
    } catch (error) {
      toast.error("Error al subir la foto")
    } finally {
      setUploadingImage(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      
      // Check if it's an image
      if (file.type.startsWith('image/')) {
        setUploadingImage(true)
        try {
          const formData = new FormData()
          formData.append('file', file)

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
          })

          const result = await response.json()

          if (result.success) {
            setFormData({...formData, imageUrl: result.url})
            toast.success("Foto subida correctamente")
          } else {
            toast.error(result.error || "Error al subir la foto")
          }
        } catch (error) {
          toast.error("Error al subir la foto")
        } finally {
          setUploadingImage(false)
        }
      }
    }
  }

  const handleSave = () => {
    // Validar campos requeridos
    if (!formData.name || !formData.position || !formData.number || !formData.age || !formData.nationality) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    // Crear el jugador
    const newPlayer = createPlayer(formData);

    if (newPlayer) {
      toast.success("Jugador agregado correctamente");
      router.push("/admin/plantel");
    } else {
      toast.error("Error al agregar el jugador");
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Link
          href="/admin/plantel"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al plantel
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2">Nuevo Jugador</h1>
            <p className="text-muted-foreground">Agrega un nuevo jugador al plantel</p>
          </div>
          <div className="flex gap-2">
            <Button className="gap-2" onClick={handleSave}>
              <Save className="h-4 w-4" />
              Agregar Jugador
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo *</Label>
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Escribe el nombre completo del jugador" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position">Posición *</Label>
                  <Select value={formData.position} onValueChange={(value) => setFormData({...formData, position: value})}>
                    <SelectTrigger id="position">
                      <SelectValue placeholder="Selecciona una posición" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Arquero">Arquero</SelectItem>
                      <SelectItem value="Defensor">Defensor</SelectItem>
                      <SelectItem value="Mediocampista">Mediocampista</SelectItem>
                      <SelectItem value="Delantero">Delantero</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="number">Número de Camiseta *</Label>
                  <Input 
                    id="number" 
                    type="number"
                    value={formData.number}
                    onChange={(e) => setFormData({...formData, number: e.target.value})}
                    placeholder="Número" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Edad *</Label>
                  <Input 
                    id="age" 
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    placeholder="Edad" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nationality">Nacionalidad *</Label>
                  <Input 
                    id="nationality" 
                    value={formData.nationality}
                    onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                    placeholder="Nacionalidad" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height">Altura (cm)</Label>
                  <Input 
                    id="height" 
                    value={formData.height}
                    onChange={(e) => setFormData({...formData, height: e.target.value})}
                    placeholder="Ej: 175" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input 
                    id="weight" 
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    placeholder="Ej: 70" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Foto del Jugador</CardTitle>
            </CardHeader>
            <CardContent>
              {formData.imageUrl ? (
                <div className="space-y-4">
                  <div className="relative">
                    <img 
                      src={formData.imageUrl} 
                      alt="Foto del jugador" 
                      className="w-32 h-32 object-cover rounded-lg mx-auto"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-0 right-1/2 translate-x-1/2"
                      onClick={() => setFormData({...formData, imageUrl: ""})}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              ) : (
                <div 
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="player-image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                  <label 
                    htmlFor="player-image-upload" 
                    className="cursor-pointer flex flex-col items-center"
                  >
                    {uploadingImage ? (
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                    ) : (
                      <ImageIcon className="h-12 w-12 mb-4 text-muted-foreground" />
                    )}
                    <p className="text-sm text-muted-foreground mb-2">
                      {uploadingImage ? "Subiendo foto..." : "Haz clic para subir o arrastra una foto"}
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, WebP hasta 5MB</p>
                  </label>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="matches">Partidos Jugados</Label>
                <Input 
                  id="matches" 
                  type="number"
                  value={formData.matches}
                  onChange={(e) => setFormData({...formData, matches: e.target.value})}
                  placeholder="0" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goals">Goles Marcados</Label>
                <Input 
                  id="goals" 
                  type="number"
                  value={formData.goals}
                  onChange={(e) => setFormData({...formData, goals: e.target.value})}
                  placeholder="0" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assists">Asistencias</Label>
                <Input 
                  id="assists" 
                  type="number"
                  value={formData.assists}
                  onChange={(e) => setFormData({...formData, assists: e.target.value})}
                  placeholder="0" 
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información Adicional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">Estado: Activo</p>
                <p className="text-xs text-muted-foreground">
                  El jugador estará activo en el plantel al ser creado
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
