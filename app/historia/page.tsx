import Image from "next/image"
import { Trophy, Calendar, Award } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function HistoriaPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-center">Historia del Club</h1>
          <p className="text-center mt-4 text-lg opacity-90">La pasión y tradición de Barracas Central</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Fundación */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-4">Nuestros Orígenes</h2>
              <div className="flex items-center gap-2 text-primary mb-4">
                <Calendar className="h-5 w-5" />
                <span className="font-semibold">5 de abril de 1904</span>
              </div>
              <p className="text-lg leading-relaxed mb-4">
                Barracas Central fue fundado el 5 de abril de 1904 en el barrio de Barracas, al sur de la Ciudad de
                Buenos Aires. Desde sus inicios, el club se caracterizó por su fuerte arraigo barrial y la pasión de sus
                hinchas.
              </p>
              <p className="text-lg leading-relaxed">
                El apodo "El Guapo" nace de la tradición popular del barrio, donde los vecinos se referían con orgullo a
                su equipo como el más vistoso y elegante de la zona.
              </p>
            </div>
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src="/futbol-argentino-estadio-partido.jpg"
                alt="Historia de Barracas Central"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Estadio */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-serif">Estadio Claudio Chiqui Tapia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="leading-relaxed mb-4">
                    Nuestro estadio, bautizado en honor al presidente de AFA y referente del club, Claudio "Chiqui"
                    Tapia, es la casa de Barracas Central desde 1950.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>
                        <strong>Capacidad:</strong> 3.500 espectadores
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>
                        <strong>Ubicación:</strong> Luna 183, Barracas, CABA
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>
                        <strong>Inauguración:</strong> 1950
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <Image
                    src="/entrenamiento-futbol-equipo.jpg"
                    alt="Estadio Claudio Chiqui Tapia"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Logros */}
        <section>
          <h2 className="text-3xl font-serif font-bold mb-8 flex items-center gap-2">
            <Trophy className="h-8 w-8 text-primary" />
            Logros Destacados
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-primary/20">
              <CardContent className="p-6 text-center">
                <Award className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-bold text-lg mb-2">Primera División</h3>
                <p className="text-sm text-muted-foreground">Ascenso histórico en 2019</p>
              </CardContent>
            </Card>
            <Card className="border-primary/20">
              <CardContent className="p-6 text-center">
                <Award className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-bold text-lg mb-2">Primera B Metropolitana</h3>
                <p className="text-sm text-muted-foreground">Campeón 2018-19</p>
              </CardContent>
            </Card>
            <Card className="border-primary/20">
              <CardContent className="p-6 text-center">
                <Award className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-bold text-lg mb-2">Copa Argentina</h3>
                <p className="text-sm text-muted-foreground">Participaciones destacadas</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Identidad */}
        <section className="mt-16">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-8">
              <h2 className="text-3xl font-serif font-bold mb-6 text-center">Nuestra Identidad</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-xl mb-3">Colores</h3>
                  <p className="leading-relaxed">
                    La camiseta roja y blanca a rayas verticales es el símbolo más distintivo del club, representando la
                    pasión y la pureza del juego.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-3">Himno</h3>
                  <p className="leading-relaxed">
                    El himno del club, cantado con fervor por la hinchada, refleja el orgullo barrial y el sentimiento
                    de pertenencia de todos los hinchas del Guapo.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
