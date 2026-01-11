"use client"
import { useEffect, useState } from "react"
import { Calendar, MapPin, Trophy } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Match } from "@/lib/mock-data"

export default function PartidosPage() {
  const [matches, setMatches] = useState<Match[]>([])

  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    try {
      const response = await fetch('/api/matches')
      if (response.ok) {
        const data = await response.json()
        setMatches(data)
      }
    } catch (error) {
      console.error('Error fetching matches:', error)
    }
  }

  const upcomingMatches = matches.filter((m) => m.status === "upcoming")
  const finishedMatches = matches.filter((m) => m.status === "finished")

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-center">Partidos</h1>
          <p className="text-center mt-4 text-lg opacity-90">Fixture y resultados</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Próximos Partidos */}
        <section className="mb-12">
          <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            Próximos Partidos
          </h2>
          <div className="grid gap-6">
            {upcomingMatches.map((match) => (
              <Card key={match.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex-1 text-center md:text-right">
                      <h3 className="text-xl font-bold">{match.home}</h3>
                    </div>
                    <div className="flex flex-col items-center gap-2 min-w-[120px]">
                      <Badge variant="outline" className="bg-accent">
                        {new Date(match.date).toLocaleDateString("es-AR", {
                          day: "numeric",
                          month: "short",
                        })}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(match.date).toLocaleTimeString("es-AR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="text-2xl font-bold">VS</span>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-xl font-bold">{match.away}</h3>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4" />
                      {match.tournament}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {match.stadium}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Resultados */}
        <section>
          <h2 className="text-2xl font-serif font-bold mb-6">Últimos Resultados</h2>
          <div className="grid gap-6">
            {finishedMatches.map((match) => (
              <Card key={match.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex-1 text-center md:text-right">
                      <h3 className="text-xl font-bold">{match.home}</h3>
                    </div>
                    <div className="flex items-center gap-4 min-w-[120px] justify-center">
                      <span className="text-3xl font-bold">{match.homeScore}</span>
                      <span className="text-2xl text-muted-foreground">-</span>
                      <span className="text-3xl font-bold">{match.awayScore}</span>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-xl font-bold">{match.away}</h3>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(match.date).toLocaleDateString("es-AR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4" />
                      {match.tournament}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {match.stadium}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
