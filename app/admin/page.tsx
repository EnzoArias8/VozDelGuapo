"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { getNews, deleteNews, getPlayers, getStaff } from "@/lib/data-manager"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Users, BarChart3, Settings, Plus, Eye, Pencil, Trash2, Calendar, TrendingUp } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { getArticleVisits } from "@/hooks/use-visit-tracker"

const formatCategory = (category: string) => {
  const categoryMap: { [key: string]: string } = {
    'primera': 'Primera División',
    'mercado': 'Mercado de Pases',
    'pretemporada': 'Pretemporada',
    'entrevistas': 'Entrevistas',
    'inferiores': 'Inferiores',
    'institucional': 'Institucional'
  }
  return categoryMap[category.toLowerCase()] || category.charAt(0).toUpperCase() + category.slice(1)
}

export default function AdminDashboard() {
  const [news, setNews] = useState<any[]>([])
  const [players, setPlayers] = useState<any[]>([])
  const [staff, setStaff] = useState<any[]>([])
  const [totalVisits, setTotalVisits] = useState(0)
  const [todayVisits, setTodayVisits] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        
        // Cargar datos de Supabase
        const [newsData, playersData, staffData] = await Promise.all([
          getNews(),
          getPlayers(),
          getStaff()
        ])
        
        setNews(newsData)
        setPlayers(playersData)
        setStaff(staffData)
        
        // Calcular visitas totales
        let totalVisitsCount = 0
        newsData.forEach(article => {
          totalVisitsCount += getArticleVisits(article.id)
        })
        setTotalVisits(totalVisitsCount)
        
        // Simular visitas de hoy (en producción esto vendría de analytics)
        setTodayVisits(Math.floor(Math.random() * 50) + 10)
        
      } catch (error) {
        console.error('Error loading data:', error)
        toast.error('Error al cargar los datos')
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  const stats = [
    {
      title: "Total Noticias",
      value: news.length,
      icon: FileText,
      description: `+${Math.floor(Math.random() * 5) + 1} esta semana`,
    },
    {
      title: "Visitas Totales",
      value: totalVisits.toLocaleString(),
      icon: TrendingUp,
      description: `${todayVisits} hoy`,
    },
    {
      title: "Jugadores",
      value: players.length,
      icon: Users,
      description: "Plantel actual",
    },
    {
      title: "Staff Técnico",
      value: staff.length,
      icon: Settings,
      description: "Cuerpo técnico",
    },
  ]

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando panel...</p>
        </div>
      </div>
    )
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
                    <span>{formatCategory(article.category)}</span>
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/admin/plantel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Plantel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Gestiona jugadores y cuerpo técnico
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/admin/partidos">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Partidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Administra próximos partidos y resultados
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/admin/noticias">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Noticias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Crea y edita noticias del club
              </p>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  )
}
