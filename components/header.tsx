import Link from "next/link"
import Image from "next/image"
import { Menu, Search, Facebook, Instagram, Youtube, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      {/* Top Bar with Social Media */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <X className="h-4 w-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <Youtube className="h-4 w-4" />
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
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/images/image.png" alt="Barracas Central" width={60} height={60} className="h-16 w-auto" />
            <div>
              <h1 className="text-2xl font-serif font-bold text-primary">VOZ DEL GUAPO</h1>
              <p className="text-sm text-muted-foreground">La voz de Barracas Central</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
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
            <li>
              <Link href="/historia" className="hover:text-primary transition-colors">
                HISTORIA
              </Link>
            </li>
            <li>
              <Link href="/contacto" className="hover:text-primary transition-colors">
                CONTACTO
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  )
}
