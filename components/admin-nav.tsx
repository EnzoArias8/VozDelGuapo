"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { FileText, Users, LayoutDashboard, Calendar } from "lucide-react"

export function AdminNav() {
  const pathname = usePathname()

  const links = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/admin/noticias",
      label: "Noticias",
      icon: FileText,
    },
    {
      href: "/admin/plantel",
      label: "Plantel",
      icon: Users,
    },
    {
      href: "/admin/partidos",
      label: "Partidos",
      icon: Calendar,
    },
  ]

  return (
    <nav className="border-b bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-6">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/admin" && pathname?.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
