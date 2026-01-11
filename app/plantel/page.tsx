"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { getPlayers, getStaff } from "@/lib/data-manager"

export default function PlantelPage() {
  const [players, setPlayers] = useState<any[]>([])
  const [staff, setStaff] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    const storedPlayers = getPlayers();
    const storedStaff = getStaff();
    setPlayers(storedPlayers);
    setStaff(storedStaff);
    setIsLoading(false);
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando plantel...</p>
        </div>
      </div>
    )
  }

  const positions = ["Arquero", "Defensor", "Mediocampista", "Delantero"]

  const getPositionPlural = (position: string) => {
    const pluralMap: { [key: string]: string } = {
      "Arquero": "Arqueros",
      "Defensor": "Defensores",
      "Mediocampista": "Mediocampistas",
      "Delantero": "Delanteros"
    }
    return pluralMap[position] || position + "s"
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-center">Plantel Profesional</h1>
          <p className="text-center mt-4 text-lg opacity-90">Conocé a los jugadores del Guapo</p>
        </div>
      </div>

      {/* Plantel */}
      <div className="container mx-auto px-4 py-12">
        {positions.map((position) => {
          const positionPlayers = players.filter((p) => p.position === position)
          if (positionPlayers.length === 0) return null

          return (
            <div key={position} className="mb-12">
              <h2 className="text-2xl font-serif font-bold mb-6 text-foreground">{getPositionPlural(position)}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {positionPlayers.map((player) => (
                  <Card key={player.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-[3/4] relative bg-muted">
                      <Image
                        src={player.imageUrl || "/placeholder.svg"}
                        alt={player.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">
                        {player.number}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg text-balance">{player.name}</h3>
                      <p className="text-sm text-muted-foreground">{player.position}</p>
                      <div className="flex items-center gap-2 mt-2 text-sm">
                        <span className="text-muted-foreground">{player.nationality}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{player.age} años</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}

        {/* Cuerpo Técnico */}
        <div className="mt-16">
          <h2 className="text-2xl font-serif font-bold mb-6 text-foreground">Cuerpo Técnico</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {staff.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
