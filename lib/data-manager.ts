// Sistema simple de gestión de datos en memoria
// En una aplicación real, esto se conectaría a una base de datos
import { mockNews } from "./mock-data"
import { mockPlayers } from "./mock-data"

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
}

export interface Player {
  id: string;
  name: string;
  position: string;
  number: number | string;
  age: number | string;
  nationality: string;
  height?: string;
  weight?: string;
  matches?: string;
  goals?: string;
  assists?: string;
  imageUrl?: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  imageUrl?: string;
}

// Estado global en memoria
let newsData: NewsItem[] = [];
let playersData: Player[] = [];
let staffData: Staff[] = [];

// Inicializar con datos mock
export function initializeData() {
  if (typeof window !== 'undefined') {
    const storedNews = localStorage.getItem('newsData');
    const storedPlayers = localStorage.getItem('playersData');
    const storedStaff = localStorage.getItem('staffData');
    
    if (storedNews) {
      newsData = JSON.parse(storedNews);
    } else {
      // Si no hay datos guardados, usar los datos mock y guardarlos
      newsData = mockNews.map(item => ({
        ...item,
        tags: item.tags || []
      }));
      localStorage.setItem('newsData', JSON.stringify(newsData));
    }
    
    if (storedPlayers) {
      playersData = JSON.parse(storedPlayers);
    } else {
      // Si no hay datos guardados, usar los datos mock y guardarlos
      playersData = mockPlayers;
      localStorage.setItem('playersData', JSON.stringify(playersData));
    }

    if (storedStaff) {
      staffData = JSON.parse(storedStaff);
    } else {
      // Datos iniciales del cuerpo técnico
      staffData = [
        { id: "1", name: "Rubén Darío Forestello", role: "Director Técnico" },
        { id: "2", name: "Hernán Grana", role: "Asistente Técnico" },
        { id: "3", name: "Maximiliano Velázquez", role: "Preparador Físico" }
      ];
      localStorage.setItem('staffData', JSON.stringify(staffData));
    }
  }
}

// Funciones para noticias
export function getNews(): NewsItem[] {
  initializeData();
  return newsData.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getFeaturedNews(): NewsItem[] {
  initializeData();
  return newsData
    .filter(news => news.featured)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);
}

export function getWebsiteNews(): NewsItem[] {
  initializeData();
  const featured = getFeaturedNews();
  const regular = newsData
    .filter(news => !news.featured)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  
  return [...featured, ...regular];
}

export function getNewsById(id: string): NewsItem | undefined {
  initializeData();
  return newsData.find(news => news.id === id);
}

export function updateNews(id: string, updates: Partial<NewsItem>): boolean {
  initializeData();
  const index = newsData.findIndex(news => news.id === id);
  if (index !== -1) {
    newsData[index] = { ...newsData[index], ...updates };
    saveNewsToStorage();
    return true;
  }
  return false;
}

export function createNews(news: Omit<NewsItem, 'id' | 'publishedAt'>): NewsItem {
  initializeData();
  
  // Generar slug automáticamente si no se proporciona
  const slug = news.slug || generateSlug(news.title);
  
  const newNews: NewsItem = {
    ...news,
    slug,
    id: Date.now().toString(),
    publishedAt: new Date().toISOString(),
  };
  newsData.push(newNews);
  saveNewsToStorage();
  return newNews;
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

export function deleteNews(id: string): boolean {
  initializeData();
  const index = newsData.findIndex(news => news.id === id);
  if (index !== -1) {
    newsData.splice(index, 1);
    saveNewsToStorage();
    return true;
  }
  return false;
}

// Funciones para jugadores
export function getPlayers(): Player[] {
  initializeData();
  return playersData;
}

export function getPlayerById(id: string): Player | undefined {
  initializeData();
  return playersData.find(player => player.id === id);
}

export function updatePlayer(id: string, updates: Partial<Player>): boolean {
  initializeData();
  const index = playersData.findIndex(player => player.id === id);
  if (index !== -1) {
    playersData[index] = { ...playersData[index], ...updates };
    savePlayersToStorage();
    return true;
  }
  return false;
}

export function createPlayer(player: Omit<Player, 'id'>): Player {
  initializeData();
  const newPlayer: Player = {
    ...player,
    id: Date.now().toString(),
  };
  playersData.push(newPlayer);
  savePlayersToStorage();
  return newPlayer;
}

export function deletePlayer(id: string): boolean {
  initializeData();
  const index = playersData.findIndex(player => player.id === id);
  if (index !== -1) {
    playersData.splice(index, 1);
    savePlayersToStorage();
    return true;
  }
  return false;
}

// Funciones para staff
export function getStaff(): Staff[] {
  initializeData();
  return staffData;
}

export function getStaffById(id: string): Staff | undefined {
  initializeData();
  return staffData.find(staff => staff.id === id);
}

export function updateStaff(id: string, updates: Partial<Staff>): boolean {
  initializeData();
  const index = staffData.findIndex(staff => staff.id === id);
  if (index !== -1) {
    staffData[index] = { ...staffData[index], ...updates };
    saveStaffToStorage();
    return true;
  }
  return false;
}

export function createStaff(staff: Omit<Staff, 'id'>): Staff {
  initializeData();
  const newStaff: Staff = {
    ...staff,
    id: Date.now().toString(),
  };
  staffData.push(newStaff);
  saveStaffToStorage();
  return newStaff;
}

export function deleteStaff(id: string): boolean {
  initializeData();
  const index = staffData.findIndex(staff => staff.id === id);
  if (index !== -1) {
    staffData.splice(index, 1);
    saveStaffToStorage();
    return true;
  }
  return false;
}

// Funciones de almacenamiento
function saveNewsToStorage() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('newsData', JSON.stringify(newsData));
  }
}

function savePlayersToStorage() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('playersData', JSON.stringify(playersData));
  }
}

function saveStaffToStorage() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('staffData', JSON.stringify(staffData));
  }
}
