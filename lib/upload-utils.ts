// Utilidades de subida de archivos para uso en cliente
import { createClient } from './supabase/client'

export interface UploadResult {
  success: boolean;
  url?: string;
  filename?: string;
  type?: 'image' | 'video';
  error?: string;
}

export async function uploadFile(file: File): Promise<UploadResult> {
  try {
    console.log('uploadFile: Iniciando subida de archivo:', file.name, 'Tipo:', file.type, 'Tamaño:', file.size);
    
    // Validar tipo de archivo
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp',
      'video/mp4',
      'video/webm',
      'video/ogg'
    ]

    if (!allowedTypes.includes(file.type)) {
      console.log('uploadFile: Tipo de archivo no permitido:', file.type);
      return { 
        success: false,
        error: 'Tipo de archivo no permitido. Se permiten imágenes (JPG, PNG, WebP) y videos (MP4, WebM, OGG)' 
      }
    }

    // Validar tamaño (máximo 10MB para videos, 5MB para imágenes)
    const maxSize = file.type.startsWith('video/') ? 10 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSize) {
      console.log('uploadFile: Archivo demasiado grande:', file.size, 'Máximo:', maxSize);
      return { 
        success: false,
        error: `El archivo es demasiado grande. Máximo permitido: ${maxSize / (1024 * 1024)}MB` 
      }
    }

    // Subir a Supabase Storage
    console.log('uploadFile: Creando cliente Supabase...');
    const supabase = createClient();
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `${timestamp}.${extension}`;
    const filePath = `${filename}`; // Cambiar de 'public/' a solo el nombre de archivo
    
    console.log('uploadFile: Intentando subir a bucket "images", ruta:', filePath);

    const { data, error } = await supabase.storage
      .from('images') // Cambiar de 'public' a 'images'
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    console.log('uploadFile: Resultado subida - data:', data, 'error:', error);

    if (error) {
      console.error('Error uploading to Supabase:', error);
      return { 
        success: false,
        error: `Error al subir el archivo: ${error.message}` 
      };
    }

    // Obtener URL pública
    console.log('uploadFile: Obteniendo URL pública...');
    const { data: { publicUrl } } = supabase.storage
      .from('images') // Cambiar de 'public' a 'images'
      .getPublicUrl(filePath);

    console.log('uploadFile: URL pública obtenida:', publicUrl);

    return {
      success: true,
      url: publicUrl,
      filename: filename,
      type: file.type.startsWith('video/') ? 'video' : 'image'
    };

  } catch (error) {
    console.error('Error al subir archivo:', error);
    return { 
      success: false,
      error: `Error al procesar el archivo: ${error.message}` 
    };
  }
}
