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
    const loadData = async () => {
      try {
        setIsLoading(true)
        const [playersData, staffData] = await Promise.all([
          getPlayers(),
          getStaff()
        ])
        setPlayers(playersData)
        setStaff(staffData)
      } catch (error) {
        console.error('Error loading plantel data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadData()
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
      <div className="relative" style={{ height: '290px' }}>
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-no-repeat"
          style={{ 
            backgroundImage: 'url(/images/plantel.jpeg)',
            backgroundSize: '1350px 290px',
            backgroundPosition: 'center'
          }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Content */}
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-center text-white">Plantel Profesional</h1>
          <p className="text-center mt-4 text-lg text-white/90">Conocé a los jugadores del Guapo</p>
        </div>
      </div>

      {/* Plantel */}
      <div className="container mx-auto px-4 py-12">
        {(players || []).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No hay jugadores cargados en el plantel.</p>
          </div>
        ) : (
          positions.map((position) => {
            const positionPlayers = (players || []).filter((p) => p.position === position)
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
          })
        )}

        {/* Cuerpo Técnico */}
        <div className="mt-16">
          <h2 className="text-2xl font-serif font-bold mb-6 text-foreground">Cuerpo Técnico</h2>
          {(staff || []).length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No hay miembros del cuerpo técnico cargados.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(staff || []).map((member) => (
                <Card key={member.id}>
                  <CardContent className="p-6 text-center">
                    <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                      {member.imageUrl ? (
                        <Image
                          src={member.imageUrl}
                          alt={member.name}
                          width={96}
                          height={96}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="text-2xl font-bold text-muted-foreground">
                          {member.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-lg">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
