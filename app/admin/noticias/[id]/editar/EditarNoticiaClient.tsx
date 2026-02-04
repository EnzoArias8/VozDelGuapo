"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Eye, ImageIcon, X, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getNewsById, updateNews, deleteNews, NewsItem } from "@/lib/data-manager"
import { uploadFile } from "@/lib/upload-utils"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { toast } from "sonner"

export default function EditarNoticiaPage() {
  const params = useParams()
  const router = useRouter()
  const articleId = params.id as string
  
  const [article, setArticle] = useState<NewsItem | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [tags, setTags] = useState<string[]>(["fútbol", "barracas"])
  const [newTag, setNewTag] = useState("")
  const [mounted, setMounted] = useState(false)
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

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    const loadArticle = async () => {
      try {
        console.log('EditarNoticiaClient: Cargando artículo con ID:', articleId);
        setIsLoading(true)
        const loadedArticle = await getNewsById(articleId)
        
        if (loadedArticle) {
          console.log('EditarNoticiaClient: Artículo cargado:', loadedArticle.title);
          setArticle(loadedArticle)
          setFormData({
            title: loadedArticle.title || "",
            excerpt: loadedArticle.excerpt || "",
            content: loadedArticle.content || "",
            category: loadedArticle.category || "",
            author: loadedArticle.author || "",
            featured: loadedArticle.featured || false,
            slug: loadedArticle.slug || "",
            imageUrl: loadedArticle.imageUrl || "",
            videoUrl: loadedArticle.videoUrl || "",
            images: loadedArticle.images || []
          })
          
          // Asegurar que la imagen principal esté al principio del array
          if (loadedArticle.imageUrl && loadedArticle.images) {
            const images = [...(loadedArticle.images || [])]
            const imageIndex = images.indexOf(loadedArticle.imageUrl)
            if (imageIndex > 0) {
              // Mover la imagen principal al principio
              images.splice(imageIndex, 1)
              images.unshift(loadedArticle.imageUrl)
              setFormData(prev => ({
                ...prev,
                images: images
              }))
            }
          }
          setTags(loadedArticle.tags || [])
        } else {
          console.log('EditarNoticiaClient: Artículo no encontrado');
          setNotFound(true)
        }
      } catch (error) {
        console.error('Error loading article:', error)
        setNotFound(true)
      } finally {
        setIsLoading(false)
      }
    }
    
    if (articleId) {
      loadArticle()
    }
  }, [articleId, mounted])

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
    console.log('handleImageUpload: Función llamada');
    const files = event.target.files
    console.log('handleImageUpload: Files seleccionados:', files?.length);
    
    if (!files || files.length === 0) {
      console.log('handleImageUpload: No hay archivos, saliendo');
      return
    }

    console.log('handleImageUpload: Iniciando subida de', files.length, 'archivos');
    setUploadingImage(true)
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        console.log('handleImageUpload: Procesando archivo:', file.name);
        const result = await uploadFile(file)
        if (!result.success) {
          throw new Error(result.error || "Error al subir la imagen")
        }
        return result.url
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      
      // Si no hay imageUrl principal, usar la primera imagen subida
      // Mantener la imagen principal existente si ya hay una
      const newImages = [...formData.images, ...uploadedUrls]
      const primaryImageUrl = formData.imageUrl || (uploadedUrls[0] || formData.imageUrl)
      
      setFormData({
        ...formData, 
        images: newImages,
        imageUrl: primaryImageUrl
      })
      
      toast.success(`${uploadedUrls.length} imagen(es) subida(s) correctamente`)
    } catch (error) {
      console.error('Error uploading images:', error)
      toast.error(error instanceof Error ? error.message : "Error al subir las imágenes")
    } finally {
      setUploadingImage(false)
    }
  }

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleVideoUpload: Función llamada');
    const file = event.target.files?.[0]
    console.log('handleVideoUpload: Video seleccionado:', file?.name, 'Tamaño:', file?.size);
    
    if (!file) {
      console.log('handleVideoUpload: No hay archivo, saliendo');
      return
    }

    console.log('handleVideoUpload: Iniciando subida de video');
    setUploadingVideo(true)
    try {
      const result = await uploadFile(file)
      console.log('handleVideoUpload: Resultado uploadFile:', result);
      
      if (result.success) {
        setFormData({...formData, videoUrl: result.url})
        toast.success("Video subido correctamente")
      } else {
        toast.error(result.error || "Error al subir el video")
      }
    } catch (error) {
      console.error('handleVideoUpload: Error:', error);
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
          const result = await uploadFile(file)
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
          const result = await uploadFile(file)

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

  const handleSave = async () => {
    if (!article) return;
    
    try {
      const success = await updateNews(article.id, {
        ...formData,
        tags
      });
      
      if (success) {
        toast.success("Noticia actualizada correctamente");
        router.push("/admin/noticias");
      } else {
        toast.error("Error al actualizar la noticia");
      }
    } catch (error) {
      console.error('Error saving article:', error);
      toast.error("Error al actualizar la noticia");
    }
  }

  const handleDelete = async () => {
    if (!article) return;
    
    try {
      const success = await deleteNews(article.id);
      
      if (success) {
        toast.success("Noticia eliminada correctamente");
        router.push("/admin/noticias");
      } else {
        toast.error("Error al eliminar la noticia");
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      toast.error("Error al eliminar la noticia");
    }
  }

  if (!mounted) {
    return null // Retornar null en lugar de loading para evitar hydration mismatch
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando noticia...</p>
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Noticia no encontrada</h1>
          <p className="text-muted-foreground mb-4">La noticia que intentas editar no existe.</p>
          <Button asChild>
            <Link href="/admin/noticias">Volver a noticias</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Noticia no encontrada</h1>
          <p className="text-muted-foreground mb-4">La noticia que intentas editar no existe.</p>
          <Button asChild>
            <Link href="/admin/noticias">Volver a noticias</Link>
          </Button>
        </div>
      </div>
    )
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
            <h1 className="text-3xl font-serif font-bold mb-2">Editar Noticia</h1>
            <p className="text-muted-foreground">Modifica los datos de la noticia</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Eye className="h-4 w-4" />
              Vista Previa
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Eliminar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. La noticia será eliminada permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button className="gap-2" onClick={handleSave}>
              <Save className="h-4 w-4" />
              Guardar Cambios
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
                            disabled={image === formData.imageUrl}
                          >
                            {image === formData.imageUrl ? "Principal" : "Principal"}
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
                      id="image-upload-more"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        console.log('Input secundario onChange disparado');
                        handleImageUpload(e);
                      }}
                      className="hidden"
                      disabled={uploadingImage}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <label 
                      htmlFor="image-upload-more" 
                      className="cursor-pointer flex flex-col items-center"
                      onClick={(e) => {
                        console.log('Label secundario clickeado - debería abrir el selector de archivos');
                        e.stopPropagation()
                      }}
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
                    id="image-upload-main"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      console.log('Input principal onChange disparado');
                      handleImageUpload(e);
                    }}
                    className="hidden"
                    disabled={uploadingImage}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <label 
                    htmlFor="image-upload-main" 
                    className="cursor-pointer flex flex-col items-center"
                    onClick={(e) => {
                      console.log('Label principal clickeado');
                      e.stopPropagation()
                    }}
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
                    onChange={(e) => {
                      console.log('Input video onChange disparado');
                      handleVideoUpload(e);
                    }}
                    className="hidden"
                    disabled={uploadingVideo}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <label 
                    htmlFor="video-upload" 
                    className="cursor-pointer flex flex-col items-center"
                    onClick={(e) => {
                      console.log('Label video clickeado');
                      e.stopPropagation()
                    }}
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
                    <SelectItem value="liga-profesional">Liga Profesional</SelectItem>
                    <SelectItem value="copa-argentina">Copa Argentina</SelectItem>
                    <SelectItem value="copa-sudamericana">Copa Sudamericana</SelectItem>
                    <SelectItem value="reserva">Reserva</SelectItem>
                    <SelectItem value="entrevistas">Entrevistas</SelectItem>
                    <SelectItem value="mercado">Mercado de Pases</SelectItem>
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
                <p className="text-sm text-muted-foreground mb-2">Estado: Publicado</p>
                <p className="text-xs text-muted-foreground">
                  La noticia está publicada y visible para todos los usuarios
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
