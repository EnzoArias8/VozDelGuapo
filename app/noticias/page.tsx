"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { mockNews } from "@/lib/mock-data"
import { getNews } from "@/lib/data-manager"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

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

export default function NoticiasPage() {
  const searchParams = useSearchParams()
  const [news, setNews] = useState<any[]>(mockNews) // Inicializar con mockNews
  const [filteredNews, setFilteredNews] = useState<any[]>(mockNews) // Inicializar con mockNews

  useEffect(() => {
    // Inicializar datos sin pantalla de carga
    const storedNews = getNews();
    const allNews = storedNews.length === 0 ? mockNews : storedNews;
    setNews(allNews);
    
    // Filtrar por categoría si hay parámetro
    const categoriaParam = searchParams.get('categoria');
    if (categoriaParam) {
      const filtered = allNews.filter(article => 
        article.category.toLowerCase() === categoriaParam.toLowerCase()
      );
      setFilteredNews(filtered);
    } else {
      setFilteredNews(allNews);
    }
  }, [searchParams])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold mb-2">
          {searchParams.get('categoria') 
            ? `Noticias: ${formatCategory(searchParams.get('categoria') || '')}`
            : 'Todas las Noticias'
          }
        </h1>
        <p className="text-muted-foreground">
          {searchParams.get('categoria') 
            ? `Las últimas novedades de ${formatCategory(searchParams.get('categoria') || '')}`
            : 'Las últimas novedades de Barracas Central'
          }
        </p>
        {searchParams.get('categoria') && (
          <Link 
            href="/noticias" 
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors mt-2"
          >
            ← Ver todas las noticias
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.map((article) => (
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
                  <Badge variant="secondary" className="text-xs whitespace-nowrap">
                    {formatCategory(article.category)}
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
