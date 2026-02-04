// Gestión de partidos con Supabase
import { createClient } from './supabase/client'

export interface Match {
  id: string;
  home: string;
  away: string;
  homeScore?: number;
  awayScore?: number;
  date: string;
  time: string;
  tournament: string;
  stadium: string;
  status: 'upcoming' | 'live' | 'finished' | 'postponed';
  homeLogo?: string;
  awayLogo?: string;
}

// Cache en memoria
let matchesCache: Match[] | null = null;

export async function getMatches(): Promise<Match[]> {
  if (matchesCache) {
    return matchesCache;
  }
  
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) throw error;
    
    if (!data) return [];
    
    matchesCache = data.map((item: any) => ({
      id: item.id,
      home: item.home,
      away: item.away,
      homeScore: item.home_score,
      awayScore: item.away_score,
      date: item.date,
      time: item.time,
      tournament: item.tournament,
      stadium: item.stadium,
      status: item.status,
      homeLogo: item.home_logo,
      awayLogo: item.away_logo
    }));
    
    return matchesCache || [];
  } catch (error) {
    console.error('Error fetching matches:', error);
    return [];
  }
}

export async function createMatch(match: Omit<Match, 'id'>): Promise<Match> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('matches')
      .insert({
        home: match.home,
        away: match.away,
        home_score: match.homeScore,
        away_score: match.awayScore,
        date: match.date,
        time: match.time,
        tournament: match.tournament,
        stadium: match.stadium,
        status: match.status || 'upcoming',
        home_logo: match.homeLogo,
        away_logo: match.awayLogo
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
      time: data.time,
      tournament: data.tournament,
      stadium: data.stadium,
      status: data.status,
      homeLogo: data.home_logo,
      awayLogo: data.away_logo
    };
  } catch (error) {
    console.error('Error creating match:', error);
    throw error;
  }
}

export async function updateMatch(id: string, updates: Partial<Match>): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('matches')
      .update({
        home: updates.home,
        away: updates.away,
        home_score: updates.homeScore,
        away_score: updates.awayScore,
        date: updates.date,
        time: updates.time,
        tournament: updates.tournament,
        stadium: updates.stadium,
        status: updates.status,
        home_logo: updates.homeLogo,
        away_logo: updates.awayLogo
      })
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
