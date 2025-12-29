# Configuración de Supabase para Voz del Guapo

Este documento describe cómo configurar Supabase para el proyecto Voz del Guapo.

## 1. Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta o inicia sesión
2. Crea un nuevo proyecto
3. Anota tu **Project URL** y **anon key** (disponibles en Settings > API)

## 2. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

## 3. Ejecutar Migraciones SQL

1. Ve a tu proyecto en Supabase
2. Navega a **SQL Editor**
3. Ejecuta el contenido del archivo `supabase/migrations/001_initial_schema.sql`

Esto creará todas las tablas necesarias con Row Level Security (RLS) habilitado.

## 4. Crear Usuario Administrador

1. Ve a **Authentication** > **Users** en Supabase
2. Haz clic en **Add user** > **Create new user**
3. Crea un usuario con:
   - Email: `admin@vozdelguapo.com`
   - Password: `admin123` (o la que prefieras)
   - Auto Confirm User: ✅ (activado)

## 5. Configurar Supabase Storage

1. Ve a **Storage** en Supabase
2. Crea un nuevo bucket llamado `images`
3. Configura las políticas:
   - **Public Access**: Habilitado para lectura
   - **Authenticated Upload**: Solo usuarios autenticados pueden subir

### Políticas de Storage (SQL)

Ejecuta esto en el SQL Editor:

```sql
-- Permitir lectura pública
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Permitir subida a usuarios autenticados
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);

-- Permitir actualización a usuarios autenticados
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);

-- Permitir eliminación a usuarios autenticados
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);
```

## 6. Estructura de Tablas

El proyecto incluye las siguientes tablas:

- **usuarios**: Administradores del sistema
- **noticias**: Artículos de noticias
- **jugadores**: Plantel del equipo
- **partidos**: Fixture y resultados
- **historia**: Contenido histórico del club
- **contacto**: Información de contacto

Todas las tablas tienen Row Level Security (RLS) configurado:
- Lectura pública para noticias, jugadores, partidos, historia y contacto
- Escritura solo para usuarios autenticados

## 7. Iniciar el Proyecto

```bash
pnpm install
pnpm dev
```

## 8. Acceder al Panel de Administración

1. Ve a `http://localhost:3000/login`
2. Inicia sesión con:
   - Email: `admin@vozdelguapo.com`
   - Password: `admin123` (o la que configuraste)

## Notas Importantes

- El middleware protege todas las rutas `/admin/*` requiriendo autenticación
- Las imágenes se suben a Supabase Storage en el bucket `images`
- Todas las operaciones de escritura requieren autenticación
- Las políticas RLS aseguran que solo usuarios autenticados puedan modificar datos

## Solución de Problemas

### Error: "Invalid API key"
- Verifica que las variables de entorno estén correctamente configuradas
- Asegúrate de usar la **anon key**, no la service role key

### Error: "Row Level Security policy violation"
- Verifica que las políticas RLS estén correctamente configuradas
- Asegúrate de estar autenticado cuando intentas escribir datos

### Error: "Bucket not found"
- Verifica que el bucket `images` esté creado en Storage
- Verifica que las políticas de Storage estén configuradas

