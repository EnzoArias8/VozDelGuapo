import EditarNoticiaWrapper from "./EditarNoticiaWrapper";
import { createClient } from "@/lib/supabase/client";

// Generamos rutas dinámicas basadas en las noticias reales
export async function generateStaticParams() {
  try {
    // Conexión directa a Supabase para evitar el problema de sort_order
    const supabase = createClient();
    const { data, error } = await supabase
      .from('news')
      .select('id')
      .order('published_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching news IDs:', error);
      return [{ id: 'fallback' }];
    }
    
    if (!data || data.length === 0) {
      return [{ id: 'fallback' }];
    }
    
    return data.map((article) => ({
      id: article.id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    // Fallback: generar una ruta básica para que el build no falle
    return [{ id: 'fallback' }];
  }
}

export default function Page() {
  return <EditarNoticiaWrapper />;
}