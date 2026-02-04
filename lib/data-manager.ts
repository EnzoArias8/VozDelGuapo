// Sistema de gestión de datos con Supabase
import { createClient } from './supabase/client'

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  featured: boolean;
  slug: string;
  publishedAt: string;
  imageUrl?: string; // Mantener para compatibilidad
  images?: string[]; // Nueva galería de imágenes
  videoUrl?: string;
  tags: string[];
  sort_order?: number; // Nuevo campo para ordenamiento manual
}

export interface Player {
  id: string;
  name: string;
  position: string;
  number: number | string;
  age: number | string;
  birthDate?: string; // Nueva fecha de nacimiento
  nationality: string;
  height?: string;
  weight?: string;
  matches?: string;
  goals?: string;
  assists?: string;
  imageUrl?: string;
}

// Función para calcular edad a partir de fecha de nacimiento
export function calculateAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  imageUrl?: string;
}

export interface Match {
  id: string;
  home: string;
  away: string;
  homeScore?: number;
  awayScore?: number;
  date: string;
  tournament: string;
  stadium: string;
  status: 'upcoming' | 'live' | 'finished';
  imageUrl?: string;
}

// Estado global en caché
let newsCache: NewsItem[] | null = null;
let playersCache: Player[] | null = null;
let staffCache: Staff[] | null = null;
let matchesCache: Match[] | null = null;


// Funciones para noticias
export async function getNews(): Promise<NewsItem[]> {
  if (newsCache) {
    console.log('getNews: Usando caché con', newsCache.length, 'noticias');
    return newsCache.sort((a, b) => {
      // Primero ordenar por sort_order si existe, sino por published_at
      if (a.sort_order !== undefined && b.sort_order !== undefined) {
        return a.sort_order - b.sort_order;
      }
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }
  
  try {
    console.log('getNews: Conectando a Supabase...');
    const supabase = createClient();
    console.log('getNews: Cliente Supabase creado');
    
    // Intentar ordenar por sort_order, si falla usar published_at
    let data, error;
    
    try {
      const result = await supabase
        .from('news')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('published_at', { ascending: false });
      
      data = result.data;
      error = result.error;
    } catch (e) {
      // Si sort_order no existe, usar solo published_at
      console.log('getNews: sort_order no existe, usando published_at');
      const result = await supabase
        .from('news')
        .select('*')
        .order('published_at', { ascending: false });
      
      data = result.data;
      error = result.error;
    }
    
    console.log('getNews: Resultado - data:', data, 'error:', error);
    
    if (error) {
      console.error('getNews: Error en consulta:', error);
      throw error;
    }
    
    console.log('getNews: Mapeando', data?.length || 0, 'noticias');
    if (!data) return [];
    
    newsCache = data.map(item => ({
      id: item.id,
      title: item.title,
      excerpt: item.excerpt,
      content: item.content,
      category: item.category,
      author: item.author,
      featured: item.featured,
      slug: item.slug,
      publishedAt: item.published_at,
      imageUrl: item.image_url,
      images: item.images || [],
      videoUrl: item.video_url || '',
      tags: item.tags || [],
      sort_order: item.sort_order || 0
    }));
    
    console.log('getNews: Noticias mapeadas:', newsCache.length);
    return newsCache;
  } catch (error) {
    console.error('getNews: Error general:', error);
    return [];
  }
}

export async function getFeaturedNews(): Promise<NewsItem[]> {
  const allNews = await getNews();
  return allNews
    .filter(news => news.featured)
    .slice(0, 3);
}

export async function getWebsiteNews(): Promise<NewsItem[]> {
  const allNews = await getNews();
  const featured = await getFeaturedNews();
  const regular = allNews.filter(news => !news.featured);
  
  return [...featured, ...regular];
}

export async function getNewsById(id: string): Promise<NewsItem | undefined> {
  console.log('getNewsById: Buscando noticia con ID:', id);
  const allNews = await getNews();
  console.log('getNewsById: Noticias disponibles:', allNews.map(n => ({ id: n.id, title: n.title })));
  const found = allNews.find(news => news.id === id);
  console.log('getNewsById: Noticia encontrada:', found ? found.title : 'No encontrada');
  return found;
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      console.error('Error fetching news by slug:', error);
      return null;
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      category: data.category,
      author: data.author,
      featured: data.featured,
      slug: data.slug,
      publishedAt: data.published_at,
      imageUrl: data.image_url,
      images: data.images,
      videoUrl: data.video_url,
      tags: data.tags || []
    };
  } catch (error) {
    console.error('Error fetching news by slug:', error);
    return null;
  }
}

// Función para mantener solo las 3 noticias destacadas más recientes
async function maintainMaxFeaturedNews(currentNewsId: string): Promise<void> {
  try {
    const supabase = createClient();
    
    // Obtener todas las noticias destacadas, ordenadas por fecha de publicación (más recientes primero)
    const { data: featuredNews, error } = await supabase
      .from('news')
      .select('id, publishedAt')
      .eq('featured', true)
      .order('publishedAt', { ascending: false });
    
    if (error) throw error;
    
    // Si hay más de 3 destacadas (incluyendo la que se está agregando), desmarcar la más vieja
    if (featuredNews && featuredNews.length >= 3) {
      // La más vieja será la última en el array ordenado
      const oldestFeatured = featuredNews[featuredNews.length - 1];
      
      // Si la más vieja no es la que se está agregando actualmente, desmarcarla
      if (oldestFeatured.id !== currentNewsId) {
        await supabase
          .from('news')
          .update({ featured: false })
          .eq('id', oldestFeatured.id);
        
        console.log(`Noticia ${oldestFeatured.id} desmarcada como destacada (manteniendo solo 3 más recientes)`);
      }
    }
  } catch (error) {
    console.error('Error maintaining max featured news:', error);
  }
}

// Función de mantenimiento para limpiar destacadas existentes (se puede ejecutar manualmente)
export async function cleanupFeaturedNews(): Promise<void> {
  try {
    const supabase = createClient();
    
    // Obtener todas las noticias destacadas
    const { data: featuredNews, error } = await supabase
      .from('news')
      .select('id, publishedAt')
      .eq('featured', true)
      .order('publishedAt', { ascending: false });
    
    if (error) throw error;
    
    // Si hay más de 3 destacadas, desmarcar las más viejas
    if (featuredNews && featuredNews.length > 3) {
      const newsToUnfeature = featuredNews.slice(3); // Todas excepto las 3 más recientes
      
      for (const news of newsToUnfeature) {
        await supabase
          .from('news')
          .update({ featured: false })
          .eq('id', news.id);
        
        console.log(`Noticia ${news.id} desmarcada como destacada en limpieza`);
      }
      
      console.log(`Se desmarcaron ${newsToUnfeature.length} noticias destacadas para mantener solo las 3 más recientes`);
    }
  } catch (error) {
    console.error('Error cleaning up featured news:', error);
  }
}

export async function updateNews(id: string, updates: Partial<NewsItem>): Promise<boolean> {
  try {
    const supabase = createClient();
    
    // Si se está marcando como destacada, mantener solo las 3 más recientes
    if (updates.featured === true) {
      await maintainMaxFeaturedNews(id);
    }
    
    const { error } = await supabase
      .from('news')
      .update({
        title: updates.title,
        excerpt: updates.excerpt,
        content: updates.content,
        category: updates.category,
        author: updates.author,
        featured: updates.featured,
        slug: updates.slug,
        image_url: updates.imageUrl,
        images: updates.images,
        video_url: updates.videoUrl,
        tags: updates.tags,
        sort_order: updates.sort_order // Incluir sort_order en la actualización
      })
      .eq('id', id);
    
    if (error) throw error;
    
    // Invalidar caché
    newsCache = null;
    return true;
  } catch (error) {
    console.error('Error updating news:', error);
    return false;
  }
}

export async function updateNewsOrder(newsId: string, newOrder: number): Promise<boolean> {
  try {
    console.log('updateNewsOrder: Actualizando orden de noticia', newsId, 'a', newOrder);
    const supabase = createClient();
    const { error } = await supabase
      .from('news')
      .update({ sort_order: newOrder })
      .eq('id', newsId);
    
    if (error) {
      console.error('Error updating news order:', error);
      return false;
    }
    
    // Invalidar caché para que se recargue el nuevo orden
    newsCache = null;
    console.log('updateNewsOrder: Orden actualizado correctamente');
    return true;
  } catch (error) {
    console.error('Error general updating news order:', error);
    return false;
  }
}

// Función para generar slug a partir del título
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números y espacios
    .replace(/\s+/g, '-') // Espacios a guiones
    .replace(/-+/g, '-') // Múltiples guiones a uno
    .trim();
}

export async function createNews(news: Omit<NewsItem, 'id' | 'publishedAt'>): Promise<NewsItem> {
  try {
    const supabase = createClient();
    const slug = news.slug || generateSlug(news.title);
    
    // Si se está creando como destacada, mantener solo las 3 más recientes
    if (news.featured === true) {
      // Primero crear la noticia
      const { data: newNews, error: insertError } = await supabase
        .from('news')
        .insert({
          title: news.title,
          excerpt: news.excerpt,
          content: news.content,
          category: news.category,
          author: news.author,
          featured: news.featured,
          slug,
          image_url: news.imageUrl,
          images: news.images,
          video_url: news.videoUrl,
          tags: news.tags,
          published_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (insertError) throw insertError;
      
      // Luego mantener solo las 3 más recientes
      await maintainMaxFeaturedNews(newNews.id);
      
      // Invalidar caché
      newsCache = null;
      
      return {
        id: newNews.id,
        title: newNews.title,
        excerpt: newNews.excerpt,
        content: newNews.content,
        category: newNews.category,
        author: newNews.author,
        featured: newNews.featured,
        slug: newNews.slug,
        publishedAt: newNews.published_at,
        imageUrl: newNews.image_url,
        images: newNews.images,
        videoUrl: newNews.video_url,
        tags: newNews.tags || []
      };
    }
    
    // Si no es destacada, crear normalmente
    const { data, error } = await supabase
      .from('news')
      .insert({
        title: news.title,
        excerpt: news.excerpt,
        content: news.content,
        category: news.category,
        author: news.author,
        featured: news.featured,
        slug,
        image_url: news.imageUrl,
        images: news.images,
        video_url: news.videoUrl,
        tags: news.tags,
        published_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Invalidar caché
    newsCache = null;
    
    return {
      id: data.id,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      category: data.category,
      author: data.author,
      featured: data.featured,
      slug: data.slug,
      publishedAt: data.published_at,
      imageUrl: data.image_url,
      images: data.images,
      videoUrl: data.video_url,
      tags: data.tags || []
    };
  } catch (error) {
    console.error('Error creating news:', error);
    throw error;
  }
}

export async function deleteNews(id: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    // Invalidar caché
    newsCache = null;
    return true;
  } catch (error) {
    console.error('Error deleting news:', error);
    return false;
  }
}

// Funciones para jugadores
export async function getPlayers(): Promise<Player[]> {
  if (playersCache) {
    return playersCache;
  }
  
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('number', { ascending: true });
    
    if (error) {
      console.error('Error fetching players:', error);
      return [];
    }
    
    playersCache = data.map(item => ({
      id: item.id,
      name: item.name,
      position: item.position,
      number: item.number,
      age: item.age,
      birthDate: item.birth_date || undefined,
      nationality: item.nationality,
      height: item.height,
      weight: item.weight,
      matches: item.matches,
      goals: item.goals,
      assists: item.assists,
      imageUrl: item.image_url
    }));
    
    return playersCache;
  } catch (error) {
    console.error('Error fetching players:', error);
    return [];
  }
}

export async function getPlayerById(id: string): Promise<Player | undefined> {
  const allPlayers = await getPlayers();
  return allPlayers.find(player => player.id === id);
}

export async function updatePlayer(id: string, updates: Partial<Player>): Promise<boolean> {
  try {
    const supabase = createClient();
    
    // Preparar objeto de actualización solo con campos que existen
    const updateData: any = {
      name: updates.name,
      position: updates.position,
      number: updates.number,
      age: updates.age,
      nationality: updates.nationality,
      height: updates.height,
      weight: updates.weight,
      matches: updates.matches,
      goals: updates.goals,
      assists: updates.assists,
      image_url: updates.imageUrl
    };
    
    // Agregar birth_date solo si existe y no está vacío
    if (updates.birthDate && updates.birthDate.trim() !== '') {
      updateData.birth_date = updates.birthDate;
    }
    
    const { error } = await supabase
      .from('players')
      .update(updateData)
      .eq('id', id);
    
    if (error) throw error;
    
    // Invalidar caché
    playersCache = null;
    return true;
  } catch (error) {
    console.error('Error updating player:', error);
    return false;
  }
}

export async function createPlayer(player: Omit<Player, 'id'>): Promise<Player> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('players')
      .insert({
        name: player.name,
        position: player.position,
        number: player.number,
        age: player.age,
        nationality: player.nationality,
        height: player.height,
        weight: player.weight,
        matches: player.matches,
        goals: player.goals,
        assists: player.assists,
        image_url: player.imageUrl
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Invalidar caché
    playersCache = null;
    
    return {
      id: data.id,
      name: data.name,
      position: data.position,
      number: data.number,
      age: data.age,
      nationality: data.nationality,
      height: data.height,
      weight: data.weight,
      matches: data.matches,
      goals: data.goals,
      assists: data.assists,
      imageUrl: data.image_url
    };
  } catch (error) {
    console.error('Error creating player:', error);
    throw error;
  }
}

export async function deletePlayer(id: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    // Invalidar caché
    playersCache = null;
    return true;
  } catch (error) {
    console.error('Error deleting player:', error);
    return false;
  }
}

// Funciones para staff
export async function getStaff(): Promise<Staff[]> {
  if (staffCache) {
    return staffCache;
  }
  
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error fetching staff:', error);
      return [];
    }
    
    staffCache = data.map(item => ({
      id: item.id,
      name: item.name,
      role: item.role,
      imageUrl: item.image_url
    }));
    
    return staffCache;
  } catch (error) {
    console.error('Error fetching staff:', error);
    return [];
  }
}

export async function getStaffById(id: string): Promise<Staff | undefined> {
  const allStaff = await getStaff();
  return allStaff.find(staff => staff.id === id);
}

export async function updateStaff(id: string, updates: Partial<Staff>): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('staff')
      .update({
        name: updates.name,
        role: updates.role,
        image_url: updates.imageUrl
      })
      .eq('id', id);
    
    if (error) throw error;
    
    // Invalidar caché
    staffCache = null;
    return true;
  } catch (error) {
    console.error('Error updating staff:', error);
    return false;
  }
}

export async function createStaff(staff: Omit<Staff, 'id'>): Promise<Staff> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('staff')
      .insert({
        name: staff.name,
        role: staff.role,
        image_url: staff.imageUrl
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Invalidar caché
    staffCache = null;
    
    return {
      id: data.id,
      name: data.name,
      role: data.role,
      imageUrl: data.image_url
    };
  } catch (error) {
    console.error('Error creating staff:', error);
    throw error;
  }
}

export async function deleteStaff(id: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('staff')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    // Invalidar caché
    staffCache = null;
    return true;
  } catch (error) {
    console.error('Error deleting staff:', error);
    return false;
  }
}

// Funciones para partidos
export async function getMatches(): Promise<Match[]> {
  if (matchesCache) {
    console.log('getMatches: Usando caché con', matchesCache.length, 'partidos');
    return matchesCache;
  }
  
  try {
    console.log('getMatches: Conectando a Supabase...');
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) {
      console.error('getMatches: Error en consulta:', error);
      return [];
    }
    
    console.log('getMatches: Mapeando', data?.length || 0, 'partidos');
    matchesCache = data.map(item => ({
      id: item.id,
      home: item.home,
      away: item.away,
      homeScore: item.home_score,
      awayScore: item.away_score,
      date: item.date,
      tournament: item.tournament,
      stadium: item.stadium,
      status: item.status,
      imageUrl: item.image_url
    }));
    
    console.log('getMatches: Partidos mapeados:', matchesCache.length);
    return matchesCache;
  } catch (error) {
    console.error('getMatches: Error general:', error);
    return [];
  }
}

export async function createMatch(match: Omit<Match, 'id'>): Promise<Match> {
  try {
    const supabase = createClient();
    
    // Combinar fecha y tiempo con offset de Argentina (-03:00)
    // El datetime-local viene en formato YYYY-MM-DDTHH:MM
    const fullDateTime = match.date + ':00-03:00';
    
    const { data, error } = await supabase
      .from('matches')
      .insert({
        home: match.home,
        away: match.away,
        home_score: match.homeScore,
        away_score: match.awayScore,
        date: fullDateTime,
        tournament: match.tournament,
        stadium: match.stadium,
        status: match.status,
        image_url: match.imageUrl
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Invalidar caché
    matchesCache = null;
    
    return {
      id: data.id,
      home: data.home,
      away: data.away,
      homeScore: data.home_score,
      awayScore: data.away_score,
      date: data.date,
      tournament: data.tournament,
      stadium: data.stadium,
      status: data.status,
      imageUrl: data.image_url
    };
  } catch (error) {
    console.error('Error creating match:', error);
    throw error;
  }
}

export async function updateMatch(id: string, updates: Partial<Match>): Promise<boolean> {
  try {
    const supabase = createClient();
    
    // Preparar datos de actualización sin conversión de timezone
    let updateData: any = {
      home: updates.home,
      away: updates.away,
      home_score: updates.homeScore,
      away_score: updates.awayScore,
      tournament: updates.tournament,
      stadium: updates.stadium,
      status: updates.status,
      image_url: updates.imageUrl
    };
    
    // Si hay fecha, combinar con offset de Argentina (-03:00)
    if (updates.date) {
      updateData.date = updates.date + ':00-03:00';
    }
    
    const { error } = await supabase
      .from('matches')
      .update(updateData)
      .eq('id', id);
    
    if (error) throw error;
    
    // Invalidar caché
    matchesCache = null;
    return true;
  } catch (error) {
    console.error('Error updating match:', error);
    return false;
  }
}

export async function deleteMatch(id: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('matches')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    // Invalidar caché
    matchesCache = null;
    return true;
  } catch (error) {
    console.error('Error deleting match:', error);
    return false;
  }
}
