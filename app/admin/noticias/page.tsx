import Link from "next/link"
import Image from "next/image"
import { mockNews } from "@/lib/mock-data"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Eye, Pencil, Trash2 } from "lucide-react"
import { AdminFilters } from "@/components/admin-filters"

export default function AdminNoticiasPage() {
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
        {mockNews.map((article) => (
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
                        <Badge variant="secondary" className="text-xs">
                          {article.category}
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
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
