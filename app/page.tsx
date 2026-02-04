"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { getNews, getWebsiteNews, getFeaturedNews } from "@/lib/data-manager"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

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

const normalizeCategory = (category: string) => {
  const normalizedMap: { [key: string]: string } = {
    'liga profesional': 'liga-profesional',
    'liga-profesional': 'liga-profesional',
    'primera': 'liga-profesional',
    'primera division': 'liga-profesional',
    'primera-division': 'liga-profesional',
    'primera división': 'liga-profesional',
    'copa argentina': 'copa-argentina',
    'copa-argentina': 'copa-argentina',
    'copa sudamericana': 'copa-sudamericana',
    'copa-sudamericana': 'copa-sudamericana',
    'pretemporada': 'copa-sudamericana',
    'reserva': 'reserva',
    'inferiores': 'reserva',
    'mercado': 'mercado',
    'mercado de pases': 'mercado',
    'mercado-pases': 'mercado',
    'entrevistas': 'entrevistas',
    'institucional': 'institucional'
  }
  const normalized = normalizedMap[category.toLowerCase().trim()] || 
                  normalizedMap[category.toLowerCase().replace(/\s+/g, '-')] ||
                  category.toLowerCase().replace(/\s+/g, '-').trim()
  return normalized
}

const getCategoryStyle = (category: string) => {
  // Todas las categorías usan el mismo estilo rojo
  return 'bg-red-500 text-white border-red-500 hover:bg-red-600 hover:border-red-600'
}

export default function HomePage() {
  const [news, setNews] = useState<any[]>([])
  const [showLoading, setShowLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Evitar hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    // Activar seguimiento de visitas (lógica directa del hook)
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const siteStatsKey = 'site-stats'
      const storedStats = localStorage.getItem(siteStatsKey)
      
      if (storedStats) {
        const stats = JSON.parse(storedStats)
        const today = new Date().toDateString()
        
        // Resetear contador diario si es un nuevo día
        if (stats.lastReset !== today) {
          stats.today = 1
          stats.lastReset = today
        } else {
          stats.today += 1
        }
        
        stats.total += 1
        localStorage.setItem(siteStatsKey, JSON.stringify(stats))
      } else {
        // Primera visita
        const initialStats = {
          total: 1,
          today: 1,
          lastReset: new Date().toDateString()
        }
        localStorage.setItem(siteStatsKey, JSON.stringify(initialStats))
      }
    }
    
    // No mostrar pantalla de carga si el usuario viene directamente de una noticia
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      setShowLoading(false)
      return
    }

    // Cargar noticias
    const loadNews = async () => {
      try {
        const storedNews = await getNews();
        setNews(storedNews.length === 0 ? [] : storedNews);
      } catch (error) {
        console.error('Error loading news:', error);
        setNews([]);
      }
    };
    
    loadNews();

    // Ocultar pantalla de carga después de 1 segundo
    const timer = setTimeout(() => {
      setShowLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [mounted])

  // Mostrar pantalla de carga personalizada
  if (showLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-gray-900">
        {/* Fondo con imagen */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
          style={{
            backgroundImage: 'url("/images/fondo.jfif")',
          }}
        />
        
        {/* Overlay para mejor contraste */}
        <div className="absolute inset-0 bg-black/30" />
        
        {/* Contenido centrado */}
        <div className="relative z-10 flex flex-col items-center justify-center space-y-8 px-4">
          {/* Logo con animación de salto */}
          <div className="relative">
            <Image
              src="/images/image.png"
              alt="Voz del Guapo - Logo"
              width={280}
              height={336}
              className="relative object-contain drop-shadow-2xl animate-bounce"
              priority
            />
          </div>
          
          {/* Texto con sombra */}
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white drop-shadow-lg">
              Voz del Guapo
            </h1>
          </div>
          
          {/* Indicador de carga */}
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    )
  }

  const featuredNews = news.filter((article) => article.featured)[0]
  const secondaryNews = news.filter((article) => article.featured).slice(1, 3)
  const recentNews = news.filter((article) => !article.featured).slice(0, 9)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured Article */}
          {featuredNews && (
            <div className="lg:col-span-2">
              <Link href={`/noticias/?slug=${featuredNews.slug}`}>
                <Card className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 border-0 h-full">
                  <div className="relative">
                    <div className="aspect-[16/9] overflow-hidden">
                      <Image
                        src={featuredNews.imageUrl}
                        alt={featuredNews.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <Badge className="mb-2 bg-[#E30613] text-white hover:bg-[#B80510] transition-colors">
                        {formatCategory(featuredNews.category)}
                      </Badge>
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 line-clamp-2">
                        {featuredNews.title}
                      </h2>
                      <p className="text-gray-200 text-sm line-clamp-2">
                        {featuredNews.excerpt}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>
          )}

          {/* Secondary News */}
          <div className="space-y-4">
            {secondaryNews.map((article) => (
              <Link key={article.id} href={`/noticias/?slug=${article.slug}`}>
                <Card className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 border-0">
                  <div className="relative">
                    <div className="aspect-[16/9] overflow-hidden">
                      <Image
                        src={article.imageUrl}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <Badge className="mb-2 text-xs bg-[#E30613] text-white hover:bg-[#B80510] transition-colors">
                        {formatCategory(article.category)}
                      </Badge>
                      <h3 className="font-bold text-white text-sm line-clamp-2">
                        {article.title}
                      </h3>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Categorías</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
          {["Liga Profesional", "Copa Argentina", "Copa Sudamericana", "Reserva", "Entrevistas", "Mercado de Pases", "Institucional"].map(
            (category) => {
              const normalized = normalizeCategory(category)
              console.log(`Categoría: ${category} -> Normalizada: ${normalized}`)
              return (
                <Link
                  key={category}
                  href={`/noticias/?categoria=${normalized}`}
                  className={`p-4 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-center flex items-center justify-center min-h-[80px] ${getCategoryStyle(category)}`}
                >
                  <span className="font-medium text-sm leading-tight">{category}</span>
                </Link>
              )
            }
          )}
        </div>
      </section>

      {/* Recent News Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Últimas Noticias</h2>
          <Link
            href="/noticias"
            className="text-primary hover:text-primary/80 transition-colors font-medium"
          >
            Ver todas
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentNews.map((article) => (
            <Link key={article.id} href={`/noticias/?slug=${article.slug}`}>
              <Card className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="relative">
                  <div className="aspect-[16/9] overflow-hidden">
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <Badge className="mb-2 text-xs bg-[#E30613] text-white hover:bg-[#B80510] transition-colors">
                      {formatCategory(article.category)}
                    </Badge>
                    <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">
                      {article.title}
                    </h3>
                    <div className="flex items-center text-gray-300 text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(article.publishedAt).toLocaleDateString('es-AR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
