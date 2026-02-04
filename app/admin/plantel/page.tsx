"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Pencil, Trash2, Users } from "lucide-react"
import { getPlayers, deletePlayer, Player, getStaff, deleteStaff, Staff } from "@/lib/data-manager"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import Link from "next/link"
import { toast } from "sonner"

export default function AdminPlantelPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [players, setPlayers] = useState<Player[]>([])
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [playersData, staffData] = await Promise.all([
          getPlayers(),
          getStaff()
        ])
        setPlayers(playersData)
        setStaff(staffData)
      } catch (error) {
        console.error('Error loading plantel data:', error)
        toast.error('Error al cargar los datos del plantel')
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  const handleDeletePlayer = async (playerId: string) => {
    try {
      const success = await deletePlayer(playerId)
      if (success) {
        const updatedPlayers = await getPlayers()
        setPlayers(updatedPlayers)
        toast.success("Jugador eliminado correctamente")
      } else {
        toast.error("Error al eliminar el jugador")
      }
    } catch (error) {
      console.error('Error deleting player:', error)
      toast.error("Error al eliminar el jugador")
    }
  }

  const handleDeleteStaff = async (staffId: string) => {
    try {
      const success = await deleteStaff(staffId)
      if (success) {
        const updatedStaff = await getStaff()
        setStaff(updatedStaff)
        toast.success("Miembro del staff eliminado correctamente")
      } else {
        toast.error("Error al eliminar el miembro del staff")
      }
    } catch (error) {
      console.error('Error deleting staff:', error)
      toast.error("Error al eliminar el miembro del staff")
    }
  }

  const filteredPlayers = players?.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.position.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  const filteredStaff = staff?.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando plantel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2">Gestión de Plantel</h1>
            <p className="text-muted-foreground">Administra jugadores y cuerpo técnico</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" className="gap-2">
              <Link href="/admin/plantel/nuevo">
                <Plus className="h-4 w-4" />
                Nuevo Jugador
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <Link href="/admin/plantel/staff/nuevo">
                <Users className="h-4 w-4" />
                Nuevo Staff
              </Link>
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar jugadores o staff..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Players Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Jugadores ({filteredPlayers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPlayers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    {searchTerm ? "No se encontraron jugadores" : "No hay jugadores registrados"}
                  </p>
                  {!searchTerm && (
                    <Button asChild>
                      <Link href="/admin/plantel/nuevo">
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar primer jugador
                      </Link>
                    </Button>
                  )}
                </div>
              ) : (
                filteredPlayers.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold">{player.number}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{player.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="secondary">{player.position}</Badge>
                          <span>{player.age} años</span>
                          <span>{player.nationality}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/plantel/${player.id}/editar`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
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
                              Esta acción no se puede deshacer. El jugador será eliminado permanentemente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeletePlayer(player.id)}>
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Staff Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Staff Técnico ({filteredStaff.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredStaff.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    {searchTerm ? "No se encontraron miembros del staff" : "No hay miembros del staff registrados"}
                  </p>
                  {!searchTerm && (
                    <Button asChild>
                      <Link href="/admin/plantel/staff/nuevo">
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar primer miembro
                      </Link>
                    </Button>
                  )}
                </div>
              ) : (
                filteredStaff.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/plantel/staff/${member.id}/editar`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
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
                              Esta acción no se puede deshacer. El miembro del staff será eliminado permanentemente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteStaff(member.id)}>
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
