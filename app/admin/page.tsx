"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { mockNews } from "@/lib/mock-data"
import { getNews, deleteNews } from "@/lib/data-manager"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Users, BarChart3, Settings, Plus, Eye, Pencil, Trash2, Calendar, TrendingUp } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { getArticleVisits } from "@/hooks/use-visit-tracker"

export default function AdminDashboard() {
  const [news, setNews] = useState<any[]>([])
  const [totalVisits, setTotalVisits] = useState(0)
  const [todayVisits, setTodayVisits] = useState(0)
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [loadingAnalytics, setLoadingAnalytics] = useState(false)

  useEffect(() => {
    // Inicializar datos
    const storedNews = getNews();
    if (storedNews.length === 0) {
      // Si no hay datos guardados, usar los datos mock
      setNews(mockNews);
    } else {
      setNews(storedNews);
    }

    // Cargar estadísticas reales de Google Analytics
    const fetchAnalytics = async () => {
      try {
        setLoadingAnalytics(true)
        const response = await fetch('/api/analytics')
        const result = await response.json()
        
        if (result.success) {
          setAnalyticsData(result.data)
          setTotalVisits(result.data.totalVisits)
          setTodayVisits(result.data.todayVisits)
        }
      } catch (error) {
        console.error('Error loading analytics:', error)
        // Fallback a datos simulados
        setTotalVisits(1247)
        setTodayVisits(43)
      } finally {
        setLoadingAnalytics(false)
      }
    }

    fetchAnalytics()
  }, [])

  const stats = [
    {
      title: "Total Noticias",
      value: news.length,
      icon: FileText,
      description: "+2 esta semana",
    },
    {
      title: "Visitas Totales",
      value: totalVisits.toLocaleString(),
      icon: TrendingUp,
      description: `${todayVisits} hoy`,
    },
    {
      title: "Jugadores",
      value: 4,
      icon: Users,
      description: "Plantel actual",
    },
    {
      title: "Próximos Partidos",
      value: 2,
      icon: Calendar,
      description: "Este mes",
    },
  ]

  const handleDelete = (articleId: string) => {
    const success = deleteNews(articleId);
    if (success) {
      setNews(getNews());
      toast.success("Noticia eliminada correctamente");
    } else {
      toast.error("Error al eliminar la noticia");
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2">Panel de Administración</h1>
            <p className="text-muted-foreground">Gestiona el contenido de Voz del Guapo</p>
          </div>
          <Button asChild className="gap-2">
            <Link href="/admin/noticias/nueva">
              <Plus className="h-4 w-4" />
              Nueva Noticia
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Articles */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Noticias Recientes</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/noticias">Ver todas →</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {news.slice(0, 5).map((article) => (
              <div
                key={article.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-balance">{article.title}</h3>
                    {article.featured && (
                      <Badge variant="default" className="text-xs">
                        Destacada
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{article.category}</span>
                    <span>•</span>
                    <span>{article.author}</span>
                    <span>•</span>
                    <span>
                      {new Date(article.publishedAt).toLocaleDateString("es-AR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {getArticleVisits(article.id)} visitas
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/noticias/${article.slug}`} target="_blank">
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
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Dashboard */}
      {analyticsData && (
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Estadísticas Detalladas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Estadísticas Generales */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Resumen General</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <span className="text-sm font-medium">Visitas Totales</span>
                      <span className="text-lg font-bold text-blue-600">{analyticsData.totalVisits.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      <span className="text-sm font-medium">Visitas Hoy</span>
                      <span className="text-lg font-bold text-green-600">{analyticsData.todayVisits}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                      <span className="text-sm font-medium">Promedio Diario</span>
                      <span className="text-lg font-bold text-purple-600">
                        {Math.round(analyticsData.totalVisits / 30)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Estadísticas por Categoría */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Categorías Populares</h3>
                  <div className="space-y-2">
                    {analyticsData.popularCategories.map((cat: any, index: number) => {
                      const percentage = Math.round((cat.visits / analyticsData.totalVisits) * 100)
                      return (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">{cat.category}</span>
                            <span className="text-sm font-medium">{cat.visits} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Páginas Más Visitadas */}
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Páginas Más Visitadas</h3>
                <div className="space-y-2">
                  {analyticsData.topPages.map((page: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-muted-foreground w-4">#{index + 1}</span>
                        <span className="text-sm truncate max-w-xs">{page.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{page.visits}</span>
                        <span className="text-xs text-muted-foreground">visitas</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Estadísticas Diarias */}
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Últimos 5 Días</h3>
                <div className="grid grid-cols-5 gap-2">
                  {analyticsData.dailyStats.map((day: any, index: number) => {
                    const date = new Date(day.date)
                    const dayName = date.toLocaleDateString('es-AR', { weekday: 'short' })
                    const maxVisits = Math.max(...analyticsData.dailyStats.map((d: any) => d.visits))
                    const height = maxVisits > 0 ? (day.visits / maxVisits) * 100 : 0
                    
                    return (
                      <div key={index} className="text-center">
                        <div className="h-20 flex items-end justify-center mb-2">
                          <div 
                            className="w-full bg-primary rounded-t transition-all duration-300 hover:opacity-80"
                            style={{ height: `${height}%`, minHeight: '4px' }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">{dayName}</div>
                        <div className="text-xs font-medium">{day.visits}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
