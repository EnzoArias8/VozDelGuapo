import EditarJugadorClient from "./EditarJugadorClient";
import { createClient } from "@/lib/supabase/client";

// Generamos rutas dinámicas basadas en los jugadores reales
export async function generateStaticParams() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('players')
      .select('id')
      .order('number', { ascending: true });
    
    if (error) {
      console.error('Error fetching player IDs:', error);
      return [{ id: 'fallback' }];
    }
    
    if (!data || data.length === 0) {
      return [{ id: 'fallback' }];
    }
    
    return data.map((player) => ({
      id: player.id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    // Fallback: generar una ruta básica para que el build no falle
    return [{ id: 'fallback' }];
  }
}

export default function Page() {
  return <EditarJugadorClient />;
}