import Link from "next/link"
import Image from "next/image"
import { Instagram, Mail, Lock } from "lucide-react"
import { TwitterX } from "@/components/ui/twitter-x"

export function Footer() {
  return (
    <footer className="bg-muted border-t mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Image src="/images/image.png" alt="Voz del Guapo - Personaje característico" width={60} height={60} className="h-16 w-auto" />
              <span className="font-serif font-bold text-lg text-primary">VOZ DEL GUAPO</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Tu fuente de información sobre el Club <br /> Atlético Barracas Central.
            </p>
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
                <Link href="/plantel" className="text-muted-foreground hover:text-primary transition-colors">
                  Plantel
                </Link>
              </li>
              <li>
                <Link href="/partidos" className="text-muted-foreground hover:text-primary transition-colors">
                  Partidos
                </Link>
              </li>
            </ul>
          </div>

          {/* Redes Sociales */}
          <div>
            <h3 className="font-semibold mb-4">Redes Sociales</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://instagram.com/@vozdelguapo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/@ariasalexisOK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  X
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:alexisarias92@gmail.com" className="hover:text-primary transition-colors">
                  alexisarias92@gmail.com
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
