"use client"
import { useEffect, useState } from "react"
import { Calendar, MapPin, Trophy } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getMatches, Match } from "@/lib/data-manager"

export default function PartidosPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    try {
      setLoading(true)
      const matchesData = await getMatches()
      setMatches(matchesData)
    } catch (error) {
      console.error('Error fetching matches:', error)
    } finally {
      setLoading(false)
    }
  }

  const upcomingMatches = matches.filter((m) => m.status === "upcoming")
  const finishedMatches = matches.filter((m) => m.status === "finished")

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando partidos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="relative" style={{ height: '290px' }}>
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-no-repeat"
          style={{ 
            backgroundImage: 'url(/images/partidos.png?v=' + Date.now() + ')',
            backgroundSize: '1350px 290px',
            backgroundPosition: 'center'
          }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Content */}
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-center text-white">Partidos</h1>
          <p className="text-center mt-4 text-lg text-white/90">Fixture y resultados</p>
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
                  <div className="flex flex-col gap-4">
                    {/* Fecha y hora - arriba en móvil, centro en desktop */}
                    <div className="flex flex-col items-center gap-2">
                      <Badge variant="outline" className="bg-accent text-white">
                        {new Date(match.date).toLocaleDateString("es-AR", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          timeZone: "America/Argentina/Buenos_Aires"
                        })}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(match.date).toLocaleTimeString("es-AR", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                          timeZone: "America/Argentina/Buenos_Aires"
                        })} hs
                      </span>
                    </div>

                    {/* Equipos y VS - abajo en móvil, horizontal en desktop */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="flex-1 text-center md:text-right">
                        <h3 className="text-xl font-bold">{match.home}</h3>
                      </div>
                      <div className="flex items-center justify-center">
                        <span className="text-2xl font-bold">VS</span>
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <h3 className="text-xl font-bold">{match.away}</h3>
                      </div>
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
          {upcomingMatches.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No hay próximos partidos programados</p>
            </div>
          )}
        </section>

        {/* Resultados */}
        <section>
          <h2 className="text-2xl font-serif font-bold mb-6">Últimos Resultados</h2>
          <div className="grid gap-6">
            {finishedMatches.map((match) => (
              <Card key={match.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    {/* Fecha - arriba en móvil */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(match.date).toLocaleDateString("es-AR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          timeZone: "America/Argentina/Buenos_Aires"
                        })}
                      </div>
                    </div>

                    {/* Equipos y resultado - abajo en móvil, horizontal en desktop */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="flex-1 text-center md:text-right">
                        <h3 className="text-xl font-bold">{match.home}</h3>
                      </div>
                      <div className="flex items-center gap-4 min-w-[120px] justify-center">
                        <span className="text-3xl font-bold">{match.homeScore || 0}</span>
                        <span className="text-2xl text-muted-foreground">-</span>
                        <span className="text-3xl font-bold">{match.awayScore || 0}</span>
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <h3 className="text-xl font-bold">{match.away}</h3>
                      </div>
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
          {finishedMatches.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No hay partidos finalizados</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
