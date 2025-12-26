import Image from "next/image"
import Link from "next/link"
import { mockNews } from "@/lib/mock-data"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

export default function NoticiasPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold mb-2">Todas las Noticias</h1>
        <p className="text-muted-foreground">Las últimas novedades de Barracas Central</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockNews.map((article) => (
          <Link key={article.id} href={`/noticias/${article.slug}`} className="group">
            <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={article.imageUrl || "/placeholder.svg"}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {article.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(article.publishedAt).toLocaleDateString("es-AR", {
                      day: "numeric",
                      month: "short",
                    })}
                  </div>
                </div>
                <h3 className="text-xl font-serif font-bold group-hover:text-primary transition-colors text-balance leading-tight">
                  {article.title}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3 text-pretty">{article.excerpt}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
