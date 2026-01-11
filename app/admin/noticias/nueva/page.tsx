"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Eye, ImageIcon, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createNews } from "@/lib/data-manager"
import { toast } from "sonner"

export default function NuevaNoticiaPage() {
  const router = useRouter()
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    author: "",
    featured: false,
    slug: "",
    imageUrl: "",
    videoUrl: "",
    images: [] as string[]
  })

  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [dragVideoActive, setDragVideoActive] = useState(false)

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploadingImage(true)
    try {
      // Convertir FileList a Array y mantener el orden de selección
      const filesArray = Array.from(files)
      
      const uploadPromises = filesArray.map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        const result = await response.json()
        if (!result.success) {
          throw new Error(result.error || "Error al subir la imagen")
        }
        return result.url
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      
      // Combinar imágenes existentes con las nuevas (nuevas al final)
      const newImages = [...formData.images, ...uploadedUrls]
      
      // Debug: Ver qué imágenes se están guardando
      console.log('Imágenes subidas:', uploadedUrls)
      console.log('Imágenes existentes:', formData.images)
      console.log('Array completo:', newImages)
      
      // Siempre usar la primera imagen del array completo como principal
      const primaryImageUrl = newImages[0] || uploadedUrls[0]
      
      console.log('URL imagen principal:', primaryImageUrl)
      
      setFormData({
        ...formData, 
        imageUrl: primaryImageUrl,
        images: newImages
      })
      
      const message = files.length === 1 ? "Imagen subida correctamente" : `${files.length} imágenes subidas correctamente`
      toast.success(message)
    } catch (error) {
      toast.error("Error al subir las imágenes")
    } finally {
      setUploadingImage(false)
    }
  }

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadingVideo(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        setFormData({...formData, videoUrl: result.url})
        toast.success("Video subido correctamente")
      } else {
        toast.error(result.error || "Error al subir el video")
      }
    } catch (error) {
      toast.error("Error al subir el video")
    } finally {
      setUploadingVideo(false)
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

  const handleDragVideo = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragVideoActive(true)
    } else if (e.type === "dragleave") {
      setDragVideoActive(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files)
      const imageFiles = files.filter(file => file.type.startsWith('image/'))
      
      if (imageFiles.length === 0) {
        toast.error("Solo se pueden subir imágenes")
        return
      }

      setUploadingImage(true)
      try {
        const uploadPromises = imageFiles.map(async (file) => {
          const formData = new FormData()
          formData.append('file', file)

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
          })

          const result = await response.json()
          if (!result.success) {
            throw new Error(result.error || "Error al subir la imagen")
          }
          return result.url
        })

        const uploadedUrls = await Promise.all(uploadPromises)
        
        // Si es la primera imagen, establecerla como imageUrl principal
        const newImages = [...formData.images, ...uploadedUrls]
        const primaryImageUrl = uploadedUrls[0] || formData.imageUrl
        
        setFormData({
          ...formData, 
          imageUrl: primaryImageUrl,
          images: newImages
        })
        
        const message = imageFiles.length === 1 ? "Imagen subida correctamente" : `${imageFiles.length} imágenes subidas correctamente`
        toast.success(message)
      } catch (error) {
        toast.error("Error al subir las imágenes")
      } finally {
        setUploadingImage(false)
      }
    }
  }

  const handleDropVideo = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragVideoActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      
      // Check if it's a video
      if (file.type.startsWith('video/')) {
        setUploadingVideo(true)
        try {
          const formData = new FormData()
          formData.append('file', file)

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
          })

          const result = await response.json()

          if (result.success) {
            setFormData({...formData, videoUrl: result.url})
            toast.success("Video subido correctamente")
          } else {
            toast.error(result.error || "Error al subir el video")
          }
        } catch (error) {
          toast.error("Error al subir el video")
        } finally {
          setUploadingVideo(false)
        }
      }
    }
  }

  const removeImage = (indexToRemove: number) => {
    const newImages = formData.images.filter((_, index) => index !== indexToRemove)
    const newImageUrl = newImages[0] || ""
    
    setFormData({
      ...formData,
      images: newImages,
      imageUrl: newImageUrl
    })
    
    toast.success("Imagen eliminada de la galería")
  }

  const setAsPrimary = (index: number) => {
    const newImages = [...formData.images]
    const [selectedImage] = newImages.splice(index, 1)
    newImages.unshift(selectedImage)
    
    setFormData({
      ...formData,
      images: newImages,
      imageUrl: selectedImage
    })
    
    toast.success("Imagen establecida como principal")
  }

  const handlePreview = () => {
    // Aquí iría la lógica para mostrar vista previa
    console.log("Mostrando vista previa...", formData)
    // En una aplicación real, esto abriría una nueva ventana o modal con la vista previa
  }

  const handlePublish = () => {
    // Validar campos requeridos
    if (!formData.title || !formData.excerpt || !formData.content || !formData.category || !formData.author) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    // Debug: Ver qué se está guardando
    console.log('FormData al publicar:', {
      ...formData,
      tags
    });

    // Crear la noticia
    const newNews = createNews({
      ...formData,
      tags
    });

    if (newNews) {
      toast.success("Noticia publicada correctamente");
      router.push("/admin/noticias");
    } else {
      toast.error("Error al publicar la noticia");
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <Link
          href="/admin/noticias"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a noticias
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2">Nueva Noticia</h1>
            <p className="text-muted-foreground">Completa los datos para publicar una nueva noticia</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 bg-transparent" onClick={handlePreview}>
              <Eye className="h-4 w-4" />
              Vista Previa
            </Button>
            <Button className="gap-2" onClick={handlePublish}>
              <Save className="h-4 w-4" />
              Publicar
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contenido Principal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input 
                  id="title" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Escribe el título de la noticia" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Extracto *</Label>
                <Textarea 
                  id="excerpt" 
                  value={formData.excerpt}
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                  placeholder="Breve resumen que aparecerá en las vistas previas" 
                  rows={3} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Contenido *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="Escribe el contenido completo de la noticia"
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Galería de Imágenes</CardTitle>
            </CardHeader>
            <CardContent>
              {formData.images && formData.images.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={image} 
                          alt={`Imagen ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border-2 border-muted"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => setAsPrimary(index)}
                            className="text-xs"
                            disabled={index === 0}
                          >
                            {index === 0 ? "Principal" : "Principal"}
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeImage(index)}
                            className="text-xs"
                          >
                            Eliminar
                          </Button>
                        </div>
                        {index === 0 && (
                          <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                            Principal
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Add more images button */}
                  <div 
                    className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                      dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadingImage}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <label 
                      htmlFor="image-upload" 
                      className="cursor-pointer flex flex-col items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {uploadingImage ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                      ) : (
                        <ImageIcon className="h-8 w-8 mb-2 text-muted-foreground" />
                      )}
                      <p className="text-sm text-muted-foreground mb-1">
                        {uploadingImage ? "Subiendo imágenes..." : "Agregar más imágenes"}
                      </p>
                      <p className="text-xs text-muted-foreground">Click o arrastra (múltiple permitido)</p>
                    </label>
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
                      id="image-upload"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadingImage}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <label 
                      htmlFor="image-upload" 
                      className="cursor-pointer flex flex-col items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {uploadingImage ? (
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                      ) : (
                        <ImageIcon className="h-12 w-12 mb-4 text-muted-foreground" />
                      )}
                      <p className="text-sm text-muted-foreground mb-2">
                        {uploadingImage ? "Subiendo imágenes..." : "Haz clic para subir o arrastra imágenes"}
                      </p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, WebP hasta 5MB (múltiple permitido)</p>
                    </label>
                  </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Video (Opcional)</CardTitle>
            </CardHeader>
            <CardContent>
              {formData.videoUrl ? (
                <div className="space-y-4">
                  <video 
                    src={formData.videoUrl} 
                    controls 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => setFormData({...formData, videoUrl: ""})}
                  >
                    Eliminar Video
                  </Button>
                </div>
              ) : (
                <div 
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragVideoActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary'
                  }`}
                  onDragEnter={handleDragVideo}
                  onDragLeave={handleDragVideo}
                  onDragOver={handleDragVideo}
                  onDrop={handleDropVideo}
                >
                  <input
                    type="file"
                    id="video-upload"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                    disabled={uploadingVideo}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <label 
                    htmlFor="video-upload" 
                    className="cursor-pointer flex flex-col items-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {uploadingVideo ? (
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                    ) : (
                      <ImageIcon className="h-12 w-12 mb-4 text-muted-foreground" />
                    )}
                    <p className="text-sm text-muted-foreground mb-2">
                      {uploadingVideo ? "Subiendo video..." : "Haz clic para subir o arrastra un video"}
                    </p>
                    <p className="text-xs text-muted-foreground">MP4, WebM, OGG hasta 10MB</p>
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
              <CardTitle>Publicación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoría *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primera">Primera División</SelectItem>
                    <SelectItem value="mercado">Mercado de Pases</SelectItem>
                    <SelectItem value="pretemporada">Pretemporada</SelectItem>
                    <SelectItem value="entrevistas">Entrevistas</SelectItem>
                    <SelectItem value="inferiores">Inferiores</SelectItem>
                    <SelectItem value="institucional">Institucional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Autor *</Label>
                <Input 
                  id="author" 
                  value={formData.author}
                  onChange={(e) => setFormData({...formData, author: e.target.value})}
                  placeholder="Nombre del autor" 
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="featured">Marcar como destacada</Label>
                <Switch 
                  id="featured" 
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({...formData, featured: checked})}
                />
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">Estado: Borrador</p>
                <p className="text-xs text-muted-foreground">
                  La noticia se publicará inmediatamente al hacer clic en "Publicar"
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Etiquetas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Agregar etiqueta"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                />
                <Button type="button" onClick={addTag} size="sm">
                  Agregar
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-destructive transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="slug">URL amigable</Label>
                <Input 
                  id="slug" 
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  placeholder="titulo-de-la-noticia" 
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Se generará automáticamente desde el título si se deja en blanco
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
