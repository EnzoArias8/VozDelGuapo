"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Pencil, Trash2, Users } from "lucide-react"
import { mockPlayers } from "@/lib/mock-data"
import { getPlayers, deletePlayer, Player, getStaff, deleteStaff, Staff } from "@/lib/data-manager"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import Link from "next/link"
import { toast } from "sonner"

export default function AdminPlantelPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [players, setPlayers] = useState<Player[]>([])
  const [staff, setStaff] = useState<Staff[]>([])

  useEffect(() => {
    // Inicializar datos
    const storedPlayers = getPlayers();
    if (storedPlayers.length === 0) {
      // Si no hay datos guardados, usar los datos mock
      setPlayers(mockPlayers);
    } else {
      setPlayers(storedPlayers);
    }

    const storedStaff = getStaff();
    setStaff(storedStaff);
  }, [])

  const filteredPlayers = players.filter(
    (player) =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.position.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = (playerId: string) => {
    const success = deletePlayer(playerId);
    if (success) {
      setPlayers(getPlayers());
      toast.success("Jugador eliminado correctamente");
    } else {
      toast.error("Error al eliminar el jugador");
    }
  }

  const handleDeleteStaff = (staffId: string) => {
    const success = deleteStaff(staffId);
    if (success) {
      setStaff(getStaff());
      toast.success("Miembro del cuerpo técnico eliminado correctamente");
    } else {
      toast.error("Error al eliminar el miembro del cuerpo técnico");
    }
  }

  const positionGroups = [
    { name: "Arqueros", players: filteredPlayers.filter((p) => p.position === "Arquero") },
    { name: "Defensores", players: filteredPlayers.filter((p) => p.position === "Defensor") },
    { name: "Mediocampistas", players: filteredPlayers.filter((p) => p.position === "Mediocampista") },
    { name: "Delanteros", players: filteredPlayers.filter((p) => p.position === "Delantero") },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2">Gestión del Plantel</h1>
            <p className="text-muted-foreground">Administra los jugadores y cuerpo técnico</p>
          </div>
          <Button asChild className="gap-2">
            <Link href="/admin/plantel/nuevo">
              <Plus className="h-4 w-4" />
              Agregar Jugador
            </Link>
          </Button>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o posición..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {positionGroups.map((group) => (
          <Card key={group.name}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {group.name}
                <Badge variant="secondary" className="ml-2">
                  {group.players.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {group.players.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4">No hay jugadores en esta categoría</p>
                ) : (
                  group.players.map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                          {player.number}
                        </div>
                        <div>
                          <h3 className="font-semibold">{player.name}</h3>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span>{player.position}</span>
                            <span>•</span>
                            <span>{player.age} años</span>
                            <span>•</span>
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
                                Esta acción no se puede deshacer. El jugador será eliminado permanentemente del plantel.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(player.id)}>
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
        ))}
      </div>

      {/* Cuerpo Técnico */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Cuerpo Técnico
              <Badge variant="secondary" className="ml-2">
                {staff.length}
              </Badge>
            </CardTitle>
            <Button asChild className="gap-2" variant="outline">
              <Link href="/admin/plantel/staff/nuevo">
                <Plus className="h-4 w-4" />
                Agregar Miembro
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {staff.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No hay miembros del cuerpo técnico</p>
            ) : (
              staff.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                >
                  <div>
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
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
                            Esta acción no se puede deshacer. El miembro del cuerpo técnico será eliminado permanentemente.
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
  )
}
