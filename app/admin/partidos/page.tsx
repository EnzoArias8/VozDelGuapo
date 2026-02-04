"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Pencil, Trash2, Calendar } from "lucide-react"
import { getMatches, createMatch, updateMatch, deleteMatch, Match } from "@/lib/data-manager"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AdminPartidosPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingMatch, setEditingMatch] = useState<Match | null>(null)
  const [newMatch, setNewMatch] = useState<Partial<Match>>({
    home: "",
    away: "",
    date: "",
    tournament: "",
    stadium: "",
    status: "upcoming"
  })

  useEffect(() => {
    const loadMatches = async () => {
      try {
        setLoading(true)
        const matchesData = await getMatches()
        setMatches(matchesData)
      } catch (error) {
        console.error('Error loading matches:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadMatches()
  }, [])

  const upcomingMatches = matches.filter((m) => m.status === "upcoming")
  const playedMatches = matches.filter((m) => m.status === "finished")

  const handleEditMatch = (match: Match) => {
    // Convertir la fecha con timezone a formato datetime-local
    // La fecha viene como ISO string con timezone, necesitamos convertirla
    const matchDate = new Date(match.date);
    const formattedMatch = {
      ...match,
      date: matchDate.toISOString().slice(0, 16) // YYYY-MM-DDTHH:MM
    }
    setEditingMatch(formattedMatch)
    setIsEditDialogOpen(true)
  }

  const handleUpdateMatch = async () => {
    if (editingMatch) {
      try {
        // Si se agregaron resultados y el estado no es "finished", cambiarlo automáticamente
        let updatedMatch = {
          ...editingMatch,
          date: editingMatch.date ? new Date(editingMatch.date).toISOString().slice(0, 16) : ''
        }
        
        // Solo cambiar a "finished" si el usuario lo selecciona explícitamente
        if (editingMatch.status === "finished") {
          updatedMatch.status = "finished"
        }
        
        const success = await updateMatch(editingMatch.id, updatedMatch)
        if (success) {
          const matchesData = await getMatches()
          setMatches(matchesData)
          setIsEditDialogOpen(false)
          setEditingMatch(null)
        }
      } catch (error) {
        console.error('Error updating match:', error)
      }
    }
  }

  const handleDeleteMatch = async (matchId: string) => {
    try {
      const success = await deleteMatch(matchId)
      if (success) {
        const matchesData = await getMatches()
        setMatches(matchesData)
      }
    } catch (error) {
      console.error('Error deleting match:', error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando partidos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2">Gestión de Partidos</h1>
            <p className="text-muted-foreground">Administra el fixture y resultados</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Agregar Partido
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Partido</DialogTitle>
                <DialogDescription>
                  Completa los datos para agregar un nuevo partido al fixture.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="home" className="text-right">
                    Equipo Local
                  </Label>
                  <Input
                    id="home"
                    value={newMatch.home}
                    onChange={(e) => setNewMatch({ ...newMatch, home: e.target.value })}
                    className="col-span-3"
                    placeholder="Ej: Barracas Central"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="away" className="text-right">
                    Equipo Visitante
                  </Label>
                  <Input
                    id="away"
                    value={newMatch.away}
                    onChange={(e) => setNewMatch({ ...newMatch, away: e.target.value })}
                    className="col-span-3"
                    placeholder="Ej: River Plate"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Fecha y Hora
                  </Label>
                  <Input
                    id="date"
                    type="datetime-local"
                    value={newMatch.date}
                    onChange={(e) => setNewMatch({ ...newMatch, date: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tournament" className="text-right">
                    Torneo
                  </Label>
                  <Input
                    id="tournament"
                    value={newMatch.tournament}
                    onChange={(e) => setNewMatch({ ...newMatch, tournament: e.target.value })}
                    className="col-span-3"
                    placeholder="Ej: Liga Profesional"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="stadium" className="text-right">
                    Estadio
                  </Label>
                  <Input
                    id="stadium"
                    value={newMatch.stadium}
                    onChange={(e) => setNewMatch({ ...newMatch, stadium: e.target.value })}
                    className="col-span-3"
                    placeholder="Ej: Claudio Chiqui Tapia"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="homeScore" className="text-right">
                    Goles Local
                  </Label>
                  <Input
                    id="homeScore"
                    type="number"
                    min="0"
                    value={newMatch.homeScore || ''}
                    onChange={(e) => setNewMatch({ ...newMatch, homeScore: e.target.value === '' ? undefined : parseInt(e.target.value) })}
                    className="col-span-3"
                    placeholder="Ej: 2"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="awayScore" className="text-right">
                    Goles Visitante
                  </Label>
                  <Input
                    id="awayScore"
                    type="number"
                    min="0"
                    value={newMatch.awayScore || ''}
                    onChange={(e) => setNewMatch({ ...newMatch, awayScore: e.target.value === '' ? undefined : parseInt(e.target.value) })}
                    className="col-span-3"
                    placeholder="Ej: 1"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Estado
                  </Label>
                  <Select
                    value={newMatch.status}
                    onValueChange={(value) => setNewMatch({ ...newMatch, status: value as Match['status'] })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecciona el estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Por jugar</SelectItem>
                      <SelectItem value="live">En vivo</SelectItem>
                      <SelectItem value="finished">Finalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false)
                    setNewMatch({
                      home: "",
                      away: "",
                      date: "",
                      tournament: "",
                      stadium: "",
                      status: "upcoming"
                    })
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={async () => {
                    if (newMatch.home && newMatch.away && newMatch.date && newMatch.tournament && newMatch.stadium) {
                      try {
                        const createdMatch = await createMatch(newMatch as Omit<Match, 'id'>)
                        if (createdMatch) {
                          const matchesData = await getMatches()
                          setMatches(matchesData)
                          setIsAddDialogOpen(false)
                          setNewMatch({
                            home: "",
                            away: "",
                            date: "",
                            tournament: "",
                            stadium: "",
                            status: "upcoming"
                          })
                        }
                      } catch (error) {
                        console.error('Error adding match:', error)
                      }
                    }
                  }}
                >
                  Agregar Partido
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Partido</DialogTitle>
            <DialogDescription>
              Modifica los datos del partido seleccionado.
            </DialogDescription>
          </DialogHeader>
          {editingMatch && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-home" className="text-right">
                  Equipo Local
                </Label>
                <Input
                  id="edit-home"
                  value={editingMatch.home}
                  onChange={(e) => setEditingMatch({ ...editingMatch, home: e.target.value })}
                  className="col-span-3"
                  placeholder="Ej: Barracas Central"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-away" className="text-right">
                  Equipo Visitante
                </Label>
                <Input
                  id="edit-away"
                  value={editingMatch.away}
                  onChange={(e) => setEditingMatch({ ...editingMatch, away: e.target.value })}
                  className="col-span-3"
                  placeholder="Ej: River Plate"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-date" className="text-right">
                  Fecha y Hora
                </Label>
                <Input
                  id="edit-date"
                  type="datetime-local"
                  value={editingMatch.date}
                  onChange={(e) => setEditingMatch({ ...editingMatch, date: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-tournament" className="text-right">
                  Torneo
                </Label>
                <Input
                  id="edit-tournament"
                  value={editingMatch.tournament}
                  onChange={(e) => setEditingMatch({ ...editingMatch, tournament: e.target.value })}
                  className="col-span-3"
                  placeholder="Ej: Liga Profesional"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-stadium" className="text-right">
                  Estadio
                </Label>
                <Input
                  id="edit-stadium"
                  value={editingMatch.stadium}
                  onChange={(e) => setEditingMatch({ ...editingMatch, stadium: e.target.value })}
                  className="col-span-3"
                  placeholder="Ej: Claudio Chiqui Tapia"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-homeScore" className="text-right">
                  Goles Local
                </Label>
                <Input
                  id="edit-homeScore"
                  type="number"
                  min="0"
                  value={editingMatch.homeScore || ""}
                  onChange={(e) => setEditingMatch({ ...editingMatch, homeScore: e.target.value === '' ? undefined : parseInt(e.target.value) })}
                  className="col-span-3"
                  placeholder="Ej: 2"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-awayScore" className="text-right">
                  Goles Visitante
                </Label>
                <Input
                  id="edit-awayScore"
                  type="number"
                  min="0"
                  value={editingMatch.awayScore || ""}
                  onChange={(e) => setEditingMatch({ ...editingMatch, awayScore: e.target.value === '' ? undefined : parseInt(e.target.value) })}
                  className="col-span-3"
                  placeholder="Ej: 1"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">
                  Estado
                </Label>
                <Select
                  value={editingMatch.status}
                  onValueChange={(value) => setEditingMatch({ ...editingMatch, status: value as Match['status'] })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona el estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Por jugar</SelectItem>
                    <SelectItem value="live">En vivo</SelectItem>
                    <SelectItem value="finished">Finalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false)
                setEditingMatch(null)
              }}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleUpdateMatch}
              disabled={!editingMatch || !editingMatch.home || !editingMatch.away || !editingMatch.date || !editingMatch.tournament || !editingMatch.stadium}
            >
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                        {match.tournament}
                      </Badge>
                      <Badge variant="secondary">
                        {match.status === "upcoming" ? "Por jugar" : match.status === "live" ? "En vivo" : "Finalizado"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center flex-1">
                        <p className="font-bold text-lg">{match.home}</p>
                      </div>
                      <div className="text-center px-6">
                        <p className="text-sm text-muted-foreground mb-1">
                          {new Date(match.date).toLocaleDateString('es-AR', { 
                            day: '2-digit', 
                            month: '2-digit', 
                            year: 'numeric',
                            timeZone: 'America/Argentina/Buenos_Aires'
                          })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(match.date).toLocaleTimeString('es-AR', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: false,
                            timeZone: 'America/Argentina/Buenos_Aires'
                          })} hs
                        </p>
                        {match.status === "finished" && match.homeScore !== undefined && match.awayScore !== undefined ? (
                          <div className="flex items-center gap-2 justify-center">
                            <span className="text-2xl font-bold">{match.homeScore || 0}</span>
                            <span className="text-lg font-semibold">-</span>
                            <span className="text-2xl font-bold">{match.awayScore || 0}</span>
                          </div>
                        ) : (
                          <p className="text-2xl font-bold">VS</p>
                        )}
                        <p className="text-sm text-muted-foreground mt-1">{match.stadium}</p>
                      </div>
                      <div className="text-center flex-1">
                        <p className="font-bold text-lg">{match.away}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{match.stadium}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-6">
                    <Button variant="ghost" size="icon" onClick={() => handleEditMatch(match)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. El partido será eliminado permanentemente del sistema.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteMatch(match.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
                        {match.tournament}
                      </Badge>
                      <Badge>Finalizado</Badge>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center flex-1">
                        <p className="font-bold text-lg mb-2">{match.home}</p>
                        <p className="text-3xl font-bold">{match.homeScore || 0}</p>
                      </div>
                      <div className="text-center px-6">
                        <p className="text-sm text-muted-foreground mb-1">
                          {new Date(match.date).toLocaleDateString('es-AR', { 
                            day: '2-digit', 
                            month: '2-digit', 
                            year: 'numeric',
                            timeZone: 'America/Argentina/Buenos_Aires'
                          })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(match.date).toLocaleTimeString('es-AR', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: false,
                            timeZone: 'America/Argentina/Buenos_Aires'
                          })} hs
                        </p>
                        <p className="text-xl font-bold text-muted-foreground">-</p>
                      </div>
                      <div className="text-center flex-1">
                        <p className="font-bold text-lg mb-2">{match.away}</p>
                        <p className="text-3xl font-bold">{match.awayScore || 0}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{match.stadium}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-6">
                    <Button variant="ghost" size="icon" onClick={() => handleEditMatch(match)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. El partido será eliminado permanentemente del sistema.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteMatch(match.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
