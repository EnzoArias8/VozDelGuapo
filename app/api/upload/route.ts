import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó ningún archivo' }, { status: 400 })
    }

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
      return NextResponse.json({ 
        error: 'Tipo de archivo no permitido. Se permiten imágenes (JPG, PNG, WebP) y videos (MP4, WebM, OGG)' 
      }, { status: 400 })
    }

    // Validar tamaño (máximo 10MB para videos, 5MB para imágenes)
    const maxSize = file.type.startsWith('video/') ? 10 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: `El archivo es demasiado grande. Máximo permitido: ${maxSize / (1024 * 1024)}MB` 
      }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Crear directorio de uploads si no existe
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Generar nombre de archivo único
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()
    const filename = `${timestamp}.${extension}`
    
    // Guardar archivo
    const filepath = join(uploadDir, filename)
    await writeFile(filepath, buffer)

    // Devolver URL del archivo
    const fileUrl = `/uploads/${filename}`

    return NextResponse.json({ 
      success: true,
      url: fileUrl,
      filename: filename,
      type: file.type.startsWith('video/') ? 'video' : 'image'
    })

  } catch (error) {
    console.error('Error al subir archivo:', error)
    return NextResponse.json({ 
      error: 'Error al procesar el archivo' 
    }, { status: 500 })
  }
}
