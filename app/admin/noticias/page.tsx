"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { getNews, deleteNews, updateNewsOrder, NewsItem } from "@/lib/data-manager"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Eye, Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react"
import { AdminFilters } from "@/components/admin-filters"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { toast } from "sonner"

const formatCategory = (category: string) => {
  const categoryMap: { [key: string]: string } = {
    'primera': 'Liga Profesional',
    'liga-profesional': 'Liga Profesional',
    'copa-argentina': 'Copa Argentina',
    'copa argentina': 'Copa Argentina',
    'pretemporada': 'Copa Sudamericana',
    'copa-sudamericana': 'Copa Sudamericana',
    'inferiores': 'Reserva',
    'reserva': 'Reserva',
    'entrevistas': 'Entrevistas',
    'mercado': 'Mercado de Pases',
    'institucional': 'Institucional'
  }
  return categoryMap[category.toLowerCase()] || category.charAt(0).toUpperCase() + category.slice(1)
}

export default function AdminNoticiasPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    const loadNews = async () => {
      try {
        setLoading(true)
        const newsData = await getNews()
        setNews(newsData)
      } catch (error) {
        console.error('Error loading news:', error)
        toast.error('Error al cargar las noticias')
      } finally {
        setLoading(false)
      }
    }
    
    loadNews()
  }, [mounted])

  const handleDelete = async (articleId: string) => {
    try {
      const success = await deleteNews(articleId)
      if (success) {
        const updatedNews = await getNews()
        setNews(updatedNews)
        toast.success("Noticia eliminada correctamente")
      } else {
        toast.error("Error al eliminar la noticia")
      }
    } catch (error) {
      console.error('Error deleting news:', error)
      toast.error("Error al eliminar la noticia")
    }
  }

  const handleReorder = async (articleId: string, direction: 'up' | 'down') => {
    const currentIndex = news.findIndex(n => n.id === articleId)
    if (currentIndex === -1) return
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= news.length) return
    
    const targetArticle = news[newIndex]
    
    try {
      // Actualizar orden de ambas noticias
      await Promise.all([
        updateNewsOrder(articleId, newIndex),
        updateNewsOrder(targetArticle.id, currentIndex)
      ])
      
      // Recargar noticias para mostrar nuevo orden
      const updatedNews = await getNews()
      setNews(updatedNews)
      toast.success(`Noticia movida ${direction === 'up' ? 'arriba' : 'abajo'}`)
    } catch (error) {
      console.error('Error reordering news:', error)
      toast.error("Error al reordenar la noticia")
    }
  }

  if (!mounted) {
    return null // Retornar null para evitar hydration mismatch
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando noticias...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2">Gestión de Noticias</h1>
            <p className="text-muted-foreground">Administra todas las noticias del sitio</p>
          </div>
          <Button asChild className="gap-2">
            <Link href="/admin/noticias/nueva">
              <Plus className="h-4 w-4" />
              Nueva Noticia
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <AdminFilters />
      </div>

      {/* News List */}
      <div className="space-y-4">
        {news.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-4">No hay noticias publicadas</p>
              <Button asChild>
                <Link href="/admin/noticias/nueva">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear primera noticia
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          news.map((article) => (
            <Card key={article.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="relative w-40 h-24 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={article.imageUrl || "/placeholder.svg"}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg text-balance line-clamp-1">{article.title}</h3>
                          {article.featured && (
                            <Badge variant="default" className="text-xs flex-shrink-0">
                              Destacada
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2 text-pretty">{article.excerpt}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <Badge className="text-xs bg-[#E30613] text-white hover:bg-[#B80510] transition-colors">
                            {formatCategory(article.category)}
                          </Badge>
                          <span>{article.author}</span>
                          <span>
                            {new Date(article.publishedAt).toLocaleDateString("es-AR", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {/* Botones de ordenamiento */}
                        <div className="flex flex-col gap-1 mr-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => handleReorder(article.id, 'up')}
                            disabled={news[0]?.id === article.id}
                            title="Mover arriba"
                          >
                            <ChevronUp className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => handleReorder(article.id, 'down')}
                            disabled={news[news.length - 1]?.id === article.id}
                            title="Mover abajo"
                          >
                            <ChevronDown className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/noticias/?slug=${article.slug}`} target="_blank">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/noticias/${article.id}/editar`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
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
                              <AlertDialogAction onClick={() => handleDelete(article.id)}>
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
