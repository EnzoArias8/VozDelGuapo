export interface NewsArticle {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  imageUrl: string
  category: string
  author: string
  publishedAt: string
  featured: boolean
  tags: string[]
}

export const mockNews: NewsArticle[] = [
  {
    id: "1",
    title: "Barracas Central consiguió una victoria clave ante Independiente",
    slug: "victoria-clave-ante-independiente",
    excerpt:
      "El Guapo logró un triunfo fundamental en el Claudio Chiqui Tapia que lo mantiene en la pelea por la clasificación a copas internacionales.",
    content:
      "En un partido vibrante disputado en el Claudio Chiqui Tapia, Barracas Central consiguió una victoria por 2-1 ante Independiente que resulta fundamental para las aspiraciones del equipo...",
    imageUrl: "/futbol-argentino-estadio-partido.jpg",
    category: "Primera División",
    author: "Juan Pérez",
    publishedAt: new Date().toISOString(),
    featured: true,
    tags: ["Primera División", "Victorias", "Local"],
  },
  {
    id: "2",
    title: "Iván Tapia renovó su contrato hasta 2026",
    slug: "tapia-renueva-contrato",
    excerpt:
      "El mediocampista chileno extendió su vínculo con la institución, consolidándose como una pieza clave del proyecto deportivo.",
    content:
      "Gran noticia para los hinchas del Guapo. Iván Tapia, una de las figuras del equipo, renovó su contrato hasta diciembre de 2026...",
    imageUrl: "/jugador-futbol-celebrando.jpg",
    category: "Mercado",
    author: "María González",
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    featured: false,
    tags: ["Mercado", "Renovaciones"],
  },
  {
    id: "3",
    title: "Se viene la pretemporada: mirá el cronograma completo",
    slug: "cronograma-pretemporada",
    excerpt:
      "El cuerpo técnico definió el plan de trabajo para la preparación de cara al próximo torneo. Conocé fechas y sedes de entrenamiento.",
    content:
      "El plantel de Barracas Central comenzará la pretemporada el próximo lunes con trabajos físicos en el predio de la institución...",
    imageUrl: "/entrenamiento-futbol-equipo.jpg",
    category: "Pretemporada",
    author: "Carlos Rodríguez",
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
    featured: false,
    tags: ["Pretemporada", "Plantel"],
  },
  {
    id: "4",
    title: "Entrevista exclusiva: Rodrigo Herrera habló de sus objetivos",
    slug: "entrevista-rodrigo-herrera",
    excerpt:
      "El delantero dialogó con Voz del Guapo y expresó su compromiso con el club y sus ambiciones para la temporada.",
    content:
      "En una charla íntima, Rodrigo Herrera compartió sus sensaciones tras un año de altibajos y confirmó su deseo de seguir vistiendo la camiseta del Guapo...",
    imageUrl: "/jugador-futbol-entrevista.jpg",
    category: "Entrevistas",
    author: "Laura Martínez",
    publishedAt: new Date(Date.now() - 259200000).toISOString(),
    featured: false,
    tags: ["Entrevistas", "Plantel"],
  },
  {
    id: "5",
    title: "La Reserva goleó 4-0 y sigue en la cima del torneo",
    slug: "reserva-goleo-sigue-en-cima",
    excerpt:
      "Los juveniles del Guapo demostraron gran nivel y mantienen el liderazgo de la categoría con una actuación brillante.",
    content:
      "La Reserva de Barracas Central sigue cosechando alegrías. En un partido dominante de principio a fin, el equipo dirigido por...",
    imageUrl: "/juveniles-futbol-celebracion.jpg",
    category: "Inferiores",
    author: "Diego Fernández",
    publishedAt: new Date(Date.now() - 345600000).toISOString(),
    featured: false,
    tags: ["Inferiores", "Reserva", "Victorias"],
  },
  {
    id: "6",
    title: "Nueva camiseta alternativa: conocé el diseño especial",
    slug: "nueva-camiseta-alternativa",
    excerpt:
      "El club presentó la nueva indumentaria que el plantel utilizará en los partidos como visitante, un diseño que rinde homenaje a la historia.",
    content:
      "Con un evento especial en el predio del club, Barracas Central presentó su nueva camiseta alternativa que combina tradición y modernidad...",
    imageUrl: "/camiseta-futbol-club-roja-blanca.jpg",
    category: "Institucional",
    author: "Ana Silva",
    publishedAt: new Date(Date.now() - 432000000).toISOString(),
    featured: false,
    tags: ["Institucional", "Indumentaria"],
  },
]

export const categories = ["Primera División", "Mercado", "Pretemporada", "Entrevistas", "Inferiores", "Institucional"]

export interface Player {
  id: string
  name: string
  position: string
  number: number
  nationality: string
  age: number
  imageUrl: string
}

export const mockPlayers: Player[] = [
  {
    id: "1",
    name: "Rodrigo Herrera",
    position: "Delantero",
    number: 9,
    nationality: "Argentina",
    age: 28,
    imageUrl: "/jugador-futbol-celebrando.jpg",
  },
  {
    id: "2",
    name: "Iván Tapia",
    position: "Mediocampista",
    number: 10,
    nationality: "Chile",
    age: 26,
    imageUrl: "/jugador-futbol-entrevista.jpg",
  },
  {
    id: "3",
    name: "Nicolás Capraro",
    position: "Defensor",
    number: 6,
    nationality: "Argentina",
    age: 30,
    imageUrl: "/futbol-argentino-estadio-partido.jpg",
  },
  {
    id: "4",
    name: "Sebastián Moyano",
    position: "Arquero",
    number: 1,
    nationality: "Argentina",
    age: 34,
    imageUrl: "/entrenamiento-futbol-equipo.jpg",
  },
]

export interface Match {
  id: string
  home: string
  away: string
  homeScore?: number
  awayScore?: number
  date: string
  tournament: string
  stadium: string
  status: "finished" | "upcoming" | "live"
}

export const mockMatches: Match[] = [
  {
    id: "1",
    home: "Barracas Central",
    away: "River Plate",
    date: "2025-01-15T20:30:00",
    tournament: "Liga Profesional",
    stadium: "Claudio Chiqui Tapia",
    status: "upcoming",
  },
  {
    id: "2",
    home: "Barracas Central",
    away: "Independiente",
    homeScore: 2,
    awayScore: 1,
    date: "2025-01-08T19:00:00",
    tournament: "Liga Profesional",
    stadium: "Claudio Chiqui Tapia",
    status: "finished",
  },
  {
    id: "3",
    home: "Boca Juniors",
    away: "Barracas Central",
    homeScore: 1,
    awayScore: 1,
    date: "2025-01-02T21:30:00",
    tournament: "Liga Profesional",
    stadium: "La Bombonera",
    status: "finished",
  },
]
