import Image from "next/image"
import Link from "next/link"
import { mockNews } from "@/lib/mock-data"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

export default function HomePage() {
  const featuredNews = mockNews.filter((article) => article.featured)[0]
  const secondaryNews = mockNews.filter((article) => !article.featured).slice(0, 2)
  const recentNews = mockNews.slice(2)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured Article */}
          <Link
            href={`/noticias/${featuredNews.slug}`}
            className="lg:col-span-2 group relative overflow-hidden rounded-lg"
          >
            <div className="relative aspect-[16/9] lg:aspect-[16/10]">
              <Image
                src={featuredNews.imageUrl || "/placeholder.svg"}
                alt={featuredNews.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <Badge className="mb-3 bg-primary hover:bg-primary">{featuredNews.category}</Badge>
                <h2 className="text-3xl lg:text-4xl font-serif font-bold mb-3 text-balance leading-tight">
                  {featuredNews.title}
                </h2>
                <p className="text-lg text-white/90 mb-3 line-clamp-2 text-pretty">{featuredNews.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-white/80">
                  <span>{featuredNews.author}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {new Date(featuredNews.publishedAt).toLocaleDateString("es-AR", {
                      day: "numeric",
                      month: "long",
                    })}
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Secondary Articles */}
          <div className="flex flex-col gap-6">
            {secondaryNews.map((article) => (
              <Link
                key={article.id}
                href={`/noticias/${article.slug}`}
                className="group relative overflow-hidden rounded-lg flex-1"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={article.imageUrl || "/placeholder.svg"}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <Badge className="mb-2 bg-primary hover:bg-primary text-xs">{article.category}</Badge>
                    <h3 className="text-lg font-serif font-bold mb-2 text-balance leading-tight line-clamp-2">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-white/80">
                      <Clock className="h-3 w-3" />
                      {new Date(article.publishedAt).toLocaleDateString("es-AR", {
                        day: "numeric",
                        month: "short",
                      })}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent News Grid */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif font-bold">Últimas Noticias</h2>
          <Link href="/noticias" className="text-primary hover:underline text-sm font-medium">
            Ver todas →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentNews.map((article) => (
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
      </section>

      {/* Categories Section */}
      <section>
        <h2 className="text-2xl font-serif font-bold mb-6">Categorías</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {["Primera División", "Mercado", "Pretemporada", "Entrevistas", "Inferiores", "Institucional"].map(
            (category) => (
              <Link
                key={category}
                href={`/noticias?categoria=${category.toLowerCase().replace(" ", "-")}`}
                className="p-4 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-center"
              >
                <span className="font-medium text-sm">{category}</span>
              </Link>
            ),
          )}
        </div>
      </section>
    </div>
  )
}
