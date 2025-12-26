import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Youtube, Mail, Lock, X } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted border-t mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Image src="/images/image.png" alt="Barracas Central" width={40} height={40} className="h-12 w-auto" />
              <span className="font-serif font-bold text-lg text-primary">VOZ DEL GUAPO</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Tu fuente de información sobre el Club Atlético Barracas Central.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <X className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Navegación</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/noticias" className="text-muted-foreground hover:text-primary transition-colors">
                  Noticias
                </Link>
              </li>
              <li>
                <Link href="/plantilla" className="text-muted-foreground hover:text-primary transition-colors">
                  Plantilla
                </Link>
              </li>
              <li>
                <Link href="/fixture" className="text-muted-foreground hover:text-primary transition-colors">
                  Fixture
                </Link>
              </li>
            </ul>
          </div>

          {/* Club Links */}
          <div>
            <h3 className="font-semibold mb-4">El Club</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/historia" className="text-muted-foreground hover:text-primary transition-colors">
                  Historia
                </Link>
              </li>
              <li>
                <Link href="/multimedia" className="text-muted-foreground hover:text-primary transition-colors">
                  Multimedia
                </Link>
              </li>
              <li>
                <Link href="/tienda" className="text-muted-foreground hover:text-primary transition-colors">
                  Tienda Oficial
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-muted-foreground hover:text-primary transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:info@vozdelguapo.com" className="hover:text-primary transition-colors">
                  info@vozdelguapo.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Voz del Guapo. Todos los derechos reservados.</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-1 mt-2 hover:text-primary transition-colors opacity-50 hover:opacity-100"
          >
            <Lock className="h-3 w-3" />
            <span>Acceso Administrador</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}
