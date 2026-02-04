"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

export function AdminFilters() {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar noticias..." className="pl-10" />
      </div>
      <Select defaultValue="todas">
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="Categoría" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todas">Todas las categorías</SelectItem>
          <SelectItem value="liga-profesional">Liga Profesional</SelectItem>
          <SelectItem value="copa-argentina">Copa Argentina</SelectItem>
          <SelectItem value="copa-sudamericana">Copa Sudamericana</SelectItem>
          <SelectItem value="reserva">Reserva</SelectItem>
          <SelectItem value="entrevistas">Entrevistas</SelectItem>
          <SelectItem value="mercado">Mercado de Pases</SelectItem>
          <SelectItem value="institucional">Institucional</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="recientes">
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="Ordenar por" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recientes">Más recientes</SelectItem>
          <SelectItem value="antiguas">Más antiguas</SelectItem>
          <SelectItem value="titulo">Título A-Z</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
