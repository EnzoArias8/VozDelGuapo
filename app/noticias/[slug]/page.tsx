import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { mockNews } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Clock, User, Tag, ArrowLeft, Share2, Facebook, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function NoticiaPage({ params }: PageProps) {
  const { slug } = await params
  const article = mockNews.find((a) => a.slug === slug)

  if (!article) {
    notFound()
  }

  const relatedNews = mockNews.filter((a) => a.category === article.category && a.id !== article.id).slice(0, 3)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        href="/noticias"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a noticias
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Article Content */}
        <article className="lg:col-span-2">
          {/* Article Header */}
          <div className="mb-6">
            <Badge className="mb-4">{article.category}</Badge>
            <h1 className="text-4xl lg:text-5xl font-serif font-bold mb-4 text-balance leading-tight">
              {article.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-6 text-pretty">{article.excerpt}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{article.author}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {new Date(article.publishedAt).toLocaleDateString("es-AR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Compartir:</span>
              <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-8">
            <Image src={article.imageUrl || "/placeholder.svg"} alt={article.title} fill className="object-cover" />
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-lg leading-relaxed">{article.content}</p>

            <p className="text-lg leading-relaxed">
              El encuentro comenzó con un ritmo vertiginoso, donde ambos equipos buscaron rápidamente la portería
              contraria. Sin embargo, fue Barracas Central quien logró abrir el marcador a los 23 minutos con un gol de
              cabeza tras un corner perfectamente ejecutado. La hinchada local estalló de alegría en las tribunas del
              Chiqui Tapia.
            </p>

            <p className="text-lg leading-relaxed">
              Independiente respondió con mayor presión en el segundo tiempo, pero la defensa guapa se mantuvo sólida.
              Contra todo pronóstico, el Guapo amplió la ventaja a los 67 minutos con un contragolpe letal que dejó sin
              respuesta al arquero visitante. Aunque el Rojo descontó sobre el final, ya no hubo tiempo para más.
            </p>

            <p className="text-lg leading-relaxed">
              Esta victoria es fundamental para las aspiraciones del equipo de seguir peleando por un lugar en las
              competencias internacionales de la próxima temporada. Los tres puntos permiten al Guapo escalar posiciones
              en la tabla y mantener vivo el sueño de volver a la Copa Sudamericana.
            </p>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2 flex-wrap pt-6 border-t">
            <Tag className="h-4 w-4 text-muted-foreground" />
            {article.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </article>

        {/* Sidebar */}
        <aside className="space-y-8">
          {/* Related News */}
          <div>
            <h3 className="text-xl font-serif font-bold mb-4">Noticias Relacionadas</h3>
            <div className="space-y-4">
              {relatedNews.map((related) => (
                <Link key={related.id} href={`/noticias/${related.slug}`} className="group block">
                  <Card className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={related.imageUrl || "/placeholder.svg"}
                        alt={related.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <CardHeader>
                      <Badge variant="secondary" className="w-fit mb-2 text-xs">
                        {related.category}
                      </Badge>
                      <h4 className="font-semibold text-sm group-hover:text-primary transition-colors text-balance leading-tight line-clamp-2">
                        {related.title}
                      </h4>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Categories Widget */}
          <div>
            <h3 className="text-xl font-serif font-bold mb-4">Categorías</h3>
            <div className="space-y-2">
              {["Primera División", "Mercado", "Pretemporada", "Entrevistas", "Inferiores", "Institucional"].map(
                (category) => (
                  <Link
                    key={category}
                    href={`/noticias?categoria=${category.toLowerCase().replace(" ", "-")}`}
                    className="block p-3 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-sm"
                  >
                    {category}
                  </Link>
                ),
              )}
            </div>
          </div>

          {/* Banner/Ad Space */}
          <Card className="bg-muted">
            <CardContent className="p-8 text-center">
              <p className="text-sm text-muted-foreground mb-2">Espacio publicitario</p>
              <div className="aspect-square bg-background rounded-lg flex items-center justify-center">
                <span className="text-xs text-muted-foreground">Banner 300x300</span>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* More News Section */}
      <section className="mt-16">
        <h2 className="text-2xl font-serif font-bold mb-6">Más Noticias</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockNews
            .filter((a) => a.id !== article.id)
            .slice(0, 3)
            .map((news) => (
              <Link key={news.id} href={`/noticias/${news.slug}`} className="group">
                <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={news.imageUrl || "/placeholder.svg"}
                      alt={news.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <CardHeader className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {news.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(news.publishedAt).toLocaleDateString("es-AR", {
                          day: "numeric",
                          month: "short",
                        })}
                      </div>
                    </div>
                    <h3 className="text-lg font-serif font-bold group-hover:text-primary transition-colors text-balance leading-tight line-clamp-2">
                      {news.title}
                    </h3>
                  </CardHeader>
                </Card>
              </Link>
            ))}
        </div>
      </section>
    </div>
  )
}
