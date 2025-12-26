import Link from "next/link"
import { mockNews } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Users, BarChart3, Settings, Plus, Eye, Pencil, Trash2, Calendar, History } from "lucide-react"

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Noticias",
      value: mockNews.length,
      icon: FileText,
      description: "+2 esta semana",
    },
    {
      title: "Jugadores",
      value: 28,
      icon: Users,
      description: "Plantel actual",
    },
    {
      title: "Próximos Partidos",
      value: 5,
      icon: Calendar,
      description: "Este mes",
    },
    {
      title: "Categorías",
      value: 6,
      icon: BarChart3,
      description: "Activas",
    },
  ]

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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-5 w-5" />
              Noticias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Gestionar artículos</p>
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <Link href="/admin/noticias">Administrar</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-5 w-5" />
              Plantel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Gestionar jugadores</p>
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <Link href="/admin/plantel">Administrar</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-5 w-5" />
              Partidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Gestionar fixture</p>
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <Link href="/admin/partidos">Administrar</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <History className="h-5 w-5" />
              Historia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Editar historia</p>
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <Link href="/admin/historia">Administrar</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="h-5 w-5" />
              Contacto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Editar contacto</p>
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <Link href="/admin/contacto">Administrar</Link>
            </Button>
          </CardContent>
        </Card>
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
            {mockNews.slice(0, 5).map((article) => (
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
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
