"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { mockNews } from "@/lib/mock-data"
import { getNews } from "@/lib/data-manager"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Clock, User, Tag, ArrowLeft, Share2, Facebook, Twitter } from "lucide-react"
import { XIcon } from "@/components/ui/x-icon"
import { Button } from "@/components/ui/button"
import { useVisitTracker, getArticleVisits } from "@/hooks/use-visit-tracker"

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

export default function NoticiaPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [article, setArticle] = useState<any>(null)
  const [relatedNews, setRelatedNews] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [notFoundState, setNotFoundState] = useState(false)
  const [articleVisits, setArticleVisits] = useState(0)

  // Activar seguimiento de visitas para esta noticia
  useVisitTracker(slug)

  useEffect(() => {
    // Decodificar el slug de la URL
    const decodedSlug = decodeURIComponent(slug);
    
    const allNews = getNews();
    const foundArticle = allNews.find((a) => a.slug === decodedSlug);
    
    if (!foundArticle) {
      setNotFoundState(true);
      setIsLoading(false);
      return;
    }
    
    setArticle(foundArticle);
    const related = allNews.filter((a) => a.category === foundArticle.category && a.id !== foundArticle.id).slice(0, 3);
    setRelatedNews(related);
    setArticleVisits(getArticleVisits(foundArticle.id));
    setIsLoading(false);
  }, [slug])

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

  if (notFoundState) {
    notFound()
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground">No se encontró la noticia.</p>
        </div>
      </div>
    )
  }

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
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 bg-transparent"
                onClick={() => {
                  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`
                  window.open(url, '_blank', 'width=600,height=400')
                }}
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 bg-transparent"
                onClick={() => {
                  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`
                  window.open(url, '_blank', 'width=600,height=400')
                }}
              >
                <XIcon className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 bg-transparent"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  // Mostrar toast de éxito
                  alert('¡Enlace copiado al portapapeles!')
                }}
              >
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
            <div 
              dangerouslySetInnerHTML={{ 
                __html: article.content
                  .replace(/\n/g, '<br />')
                  .replace(/!\[([^\]]+)\]\(([^\)]+)\)/g, (match, alt, url) => {
                    return `<img src="${url}" alt="${alt}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); margin: 16px 0; display: block;" />`
                  })
              }} 
              className="text-lg leading-relaxed"
            />
          </div>

          {/* Additional Images */}
          {article.images && article.images.length > 1 && (
            <div className="mb-8">
              <h3 className="text-xl font-serif font-bold mb-4">Imágenes</h3>
              <div className="space-y-4">
                {article.images
                  .filter((image: string) => image !== article.imageUrl) // Excluir imagen principal
                  .map((image: string, index: number) => (
                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                      <Image 
                        src={image} 
                        alt={`Imagen ${index + 1} de ${article.title}`} 
                        fill 
                        className="object-contain" 
                      />
                    </div>
                  ))}
              </div>
            </div>
          )}

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
              {["primera", "mercado", "pretemporada", "entrevistas", "inferiores", "institucional"].map(
                (category) => (
                  <Link
                    key={category}
                    href={`/noticias?categoria=${category}`}
                    className="block p-3 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-sm"
                  >
                    {formatCategory(category)}
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
