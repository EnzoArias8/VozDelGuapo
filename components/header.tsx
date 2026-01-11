"use client"

import Link from "next/link"
import Image from "next/image"
import { Menu, Search, Instagram } from "lucide-react"
import { TwitterX } from "@/components/ui/twitter-x"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { getNews } from "@/lib/data-manager"

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [allNews, setAllNews] = useState([])

  useEffect(() => {
    // Cargar todas las noticias al montar el componente
    const news = getNews()
    console.log('Noticias cargadas:', news)
    setAllNews(news)
  }, [])

  useEffect(() => {
    // Filtrar noticias cuando cambia el término de búsqueda
    if (searchTerm.trim() === "") {
      setSearchResults([])
      return
    }

    const filtered = allNews.filter(news => 
      news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    console.log('Término búsqueda:', searchTerm)
    console.log('Resultados filtrados:', filtered)
    setSearchResults(filtered)
  }, [searchTerm, allNews])
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      {/* Top Bar with Social Media */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a
              href="https://x.com/@ariasalexisOK"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <TwitterX className="h-4 w-4" />
            </a>
            <a
              href="https://instagram.com/@vozdelguapo"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <Instagram className="h-4 w-4" />
            </a>
          </div>
          <div className="text-sm">
            {new Date().toLocaleDateString("es-AR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/images/image.png" alt="Voz del Guapo - Personaje característico" width={80} height={80} className="h-20 w-auto" />
            <div>
              <h1 className="text-2xl font-serif font-bold text-primary">VOZ DEL GUAPO</h1>
              <p className="text-sm text-muted-foreground">Toda la información de Barracas Central</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-t hidden md:block">
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-6 py-3 text-sm font-medium">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">
                INICIO
              </Link>
            </li>
            <li>
              <Link href="/noticias" className="hover:text-primary transition-colors">
                NOTICIAS
              </Link>
            </li>
            <li>
              <Link href="/plantel" className="hover:text-primary transition-colors">
                PLANTEL
              </Link>
            </li>
            <li>
              <Link href="/partidos" className="hover:text-primary transition-colors">
                PARTIDOS
              </Link>
            </li>
                      </ul>
        </div>
      </nav>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b shadow-lg z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar noticias..."
                className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
              <Button variant="outline" onClick={() => setIsSearchOpen(false)}>
                Cancelar
              </Button>
            </div>
            
            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-4 max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  {searchResults.map((news) => (
                    <Link
                      key={news.id}
                      href={`/noticias/${news.slug}`}
                      className="block p-3 border rounded-lg hover:bg-muted transition-colors"
                      onClick={() => setIsSearchOpen(false)}
                    >
                      <h4 className="font-semibold text-sm mb-1">{news.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">{news.excerpt}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {searchTerm && searchResults.length === 0 && (
              <div className="mt-4 text-center text-muted-foreground">
                <p className="text-sm">No se encontraron noticias para "{searchTerm}"</p>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
