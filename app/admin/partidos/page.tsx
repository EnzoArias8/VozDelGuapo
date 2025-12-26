"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Pencil, Trash2, Calendar } from "lucide-react"
import { mockMatches } from "@/lib/mock-data"

export default function AdminPartidosPage() {
  const upcomingMatches = mockMatches.filter((m) => m.status === "Por jugar")
  const playedMatches = mockMatches.filter((m) => m.status === "Finalizado")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2">Gestión de Partidos</h1>
            <p className="text-muted-foreground">Administra el fixture y resultados</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Agregar Partido
          </Button>
        </div>
      </div>

      <Tabs defaultValue="proximos" className="space-y-6">
        <TabsList>
          <TabsTrigger value="proximos">Próximos Partidos ({upcomingMatches.length})</TabsTrigger>
          <TabsTrigger value="resultados">Resultados ({playedMatches.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="proximos" className="space-y-4">
          {upcomingMatches.map((match) => (
            <Card key={match.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <Badge variant="outline" className="font-normal">
                        {match.competition}
                      </Badge>
                      <Badge variant="secondary">{match.status}</Badge>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center flex-1">
                        <p className="font-bold text-lg">{match.homeTeam}</p>
                      </div>
                      <div className="text-center px-6">
                        <p className="text-sm text-muted-foreground mb-1">{match.date}</p>
                        <p className="text-2xl font-bold">VS</p>
                        <p className="text-sm text-muted-foreground mt-1">{match.time}</p>
                      </div>
                      <div className="text-center flex-1">
                        <p className="font-bold text-lg">{match.awayTeam}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{match.venue}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-6">
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="resultados" className="space-y-4">
          {playedMatches.map((match) => (
            <Card key={match.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <Badge variant="outline" className="font-normal">
                        {match.competition}
                      </Badge>
                      <Badge>{match.status}</Badge>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center flex-1">
                        <p className="font-bold text-lg mb-2">{match.homeTeam}</p>
                        <p className="text-3xl font-bold">{match.homeScore}</p>
                      </div>
                      <div className="text-center px-6">
                        <p className="text-sm text-muted-foreground mb-1">{match.date}</p>
                        <p className="text-xl font-bold text-muted-foreground">-</p>
                      </div>
                      <div className="text-center flex-1">
                        <p className="font-bold text-lg mb-2">{match.awayTeam}</p>
                        <p className="text-3xl font-bold">{match.awayScore}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{match.venue}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-6">
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
