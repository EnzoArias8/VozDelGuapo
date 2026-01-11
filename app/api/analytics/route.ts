import { NextRequest, NextResponse } from 'next/server'

// Google Analytics Measurement ID
const GA_MEASUREMENT_ID = 'G-519094805'

// Para obtener datos reales de Google Analytics Data API:
// 1. Ve a Google Cloud Console
// 2. Crea un proyecto o usa uno existente
// 3. Habilita "Google Analytics Data API"
// 4. Crea credenciales de Service Account
// 5. Descarga el archivo JSON
// 6. Guarda las credenciales como variable de entorno

export async function GET(request: NextRequest) {
  try {
    // Verificar si tenemos credenciales reales configuradas
    const hasRealCredentials = process.env.GA_PROPERTY_ID && process.env.GA_CLIENT_EMAIL
    
    if (hasRealCredentials) {
      // Aquí iría la llamada real a Google Analytics Data API
      // Por ahora, devolvemos datos simulados
      console.log('Usando credenciales reales de Google Analytics')
    }
    
    // Simulación con variaciones realistas
    const baseVisits = 1247
    const baseToday = 43
    
    // Simular crecimiento gradual
    const growthFactor = Math.random() * 0.1 // 0-10% de variación
    
    const mockAnalyticsData = {
      totalVisits: Math.floor(baseVisits + (baseVisits * growthFactor)),
      todayVisits: Math.floor(baseToday + (Math.random() * 20)),
      topPages: [
        { 
          path: '/noticias/barracas-central-victorioso', 
          title: 'Barracas Central Victorioso', 
          visits: Math.floor(234 + (Math.random() * 50)) 
        },
        { 
          path: '/noticias/nuevo-refuerzo', 
          title: 'Nuevo Refuerzo', 
          visits: Math.floor(189 + (Math.random() * 30)) 
        },
        { 
          path: '/noticias/mercado-de-pases', 
          title: 'Mercado de Pases', 
          visits: Math.floor(156 + (Math.random() * 25)) 
        },
        { 
          path: '/plantel', 
          title: 'Plantel', 
          visits: Math.floor(145 + (Math.random() * 20)) 
        },
        { 
          path: '/', 
          title: 'Inicio', 
          visits: Math.floor(98 + (Math.random() * 15)) 
        }
      ],
      dailyStats: [
        { date: '2024-01-09', visits: Math.floor(43 + (Math.random() * 20)) },
        { date: '2024-01-08', visits: Math.floor(67 + (Math.random() * 25)) },
        { date: '2024-01-07', visits: Math.floor(52 + (Math.random() * 20)) },
        { date: '2024-01-06', visits: Math.floor(89 + (Math.random() * 30)) },
        { date: '2024-01-05', visits: Math.floor(34 + (Math.random() * 15)) }
      ],
      popularCategories: [
        { 
          category: 'Primera División', 
          visits: Math.floor(456 + (Math.random() * 50)) 
        },
        { 
          category: 'Mercado de Pases', 
          visits: Math.floor(234 + (Math.random() * 30)) 
        },
        { 
          category: 'Pretemporada', 
          visits: Math.floor(123 + (Math.random() * 20)) 
        },
        { 
          category: 'Entrevistas', 
          visits: Math.floor(98 + (Math.random() * 15)) 
        }
      ],
      lastUpdated: new Date().toISOString(),
      status: 'simulated'
    }

    return NextResponse.json({
      success: true,
      data: mockAnalyticsData,
      isRealData: false, // Cambiar a true cuando uses datos reales
      note: hasRealCredentials 
        ? 'Credenciales configuradas pero usando datos simulados temporalmente.'
        : 'Datos simulados con variaciones realistas. Para datos reales, configura Google Analytics Data API.'
    })

  } catch (error) {
    console.error('Error fetching analytics data:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al obtener datos de analítica',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
