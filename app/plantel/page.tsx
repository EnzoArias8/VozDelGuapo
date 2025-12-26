import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { mockPlayers } from "@/lib/mock-data"

export default function PlantelPage() {
  const positions = ["Arquero", "Defensor", "Mediocampista", "Delantero"]

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
          const players = mockPlayers.filter((p) => p.position === position)
          if (players.length === 0) return null

          return (
            <div key={position} className="mb-12">
              <h2 className="text-2xl font-serif font-bold mb-6 text-foreground">{position}s</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {players.map((player) => (
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
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg">Rubén Darío Forestello</h3>
                <p className="text-sm text-muted-foreground">Director Técnico</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg">Hernán Grana</h3>
                <p className="text-sm text-muted-foreground">Asistente Técnico</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg">Maximiliano Velázquez</h3>
                <p className="text-sm text-muted-foreground">Preparador Físico</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
