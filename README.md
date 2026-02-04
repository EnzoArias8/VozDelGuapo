# ⚽ Voz del Guapo - Sitio Web 

> **Tu fuente de información sobre el Club Atlético Barracas Central. Noticias, plantilla, fixture y más.**

![Voz del Guapo](https://img.shields.io/badge/Voz%20del%20Guapo-DC2626?style=for-the-badge&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

## 📋 Tabla de Contenidos

- [🌟 Características](#-características)
- [🚀 Tecnologías](#-tecnologías)
- [📦 Instalación](#-instalación)
- [⚙️ Configuración](#️-configuración)
- [🔧 Scripts Disponibles](#-scripts-disponibles)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [🗄️ Base de Datos](#️-base-de-datos)
- [🚀 Despliegue](#-despliegue)
- [🤝 Contribuir](#-contribuir)
- [📄 Licencia](#-licencia)

## 🌟 Características

### 🏠 **Página Principal**
- **Noticias Destacadas**: Sistema de noticias con destacadas principales
- **Categorías Organizadas**: Liga Profesional, Copa Argentina, Copa Sudamericana, y más categorías temáticas
- **Fixture Completo**: Próximos partidos y resultados
- **Plantel del Equipo**: Información completa de jugadores y cuerpo técnico

### 📰 **Sistema de Noticias**
- **Gestión Completa**: Crear, editar, y eliminar noticias
- **Categorización**: Sistema de categorías dinámicas
- **Imágenes Múltiples**: Soporte para galerías de imágenes
- **Noticias Destacadas**: Sistema de destacadas con límite de 3
- **SEO Optimizado**: URLs amigables y metaetiquetas

### 👥 **Panel de Administración**
- **Interfaz Moderna**: Dashboard intuitivo con Tailwind CSS
- **Gestión de Noticias**: CRUD completo de noticias
- **Gestión de Plantel**: Administración de jugadores y staff
- **Gestión de Partidos**: Actualización de fixture y resultados
- **Control de Acceso**: Sistema de autenticación seguro

### 🎨 **Diseño y UX**
- **Responsive Design**: Perfecta visualización en todos los dispositivos
- **UI/UX Moderna**: Componentes de shadcn/ui
- **Iconografía**: Lucide React para iconos consistentes
- **Animaciones**: Transiciones suaves y microinteracciones
- **Tema del Club**: Colores oficiales de Barracas Central

## 🚀 Tecnologías

### **Frontend**
- **Next.js 16.0.10** - Framework React con SSR y SSG
- **React 19.2.0** - Librería de componentes UI
- **TypeScript** - Tipado estático y mejor desarrollo
- **Tailwind CSS 4.1.9** - Framework de CSS utility-first
- **shadcn/ui** - Componentes UI de alta calidad

### **Backend y Base de Datos**
- **Supabase** - Backend como servicio (PostgreSQL + Auth + Storage)
- **PostgreSQL** - Base de datos relacional
- **Supabase Auth** - Sistema de autenticación
- **Supabase Storage** - Almacenamiento de imágenes

### **Herramientas de Desarrollo**
- **ESLint** - Linting de código
- **PostCSS** - Procesamiento de CSS
- **Next Themes** - Sistema de temas oscuro/claro
- **React Hook Form** - Formularios optimizados
- **Zod** - Validación de esquemas

### **Analytics y SEO**
- **Google Analytics 4** - Análisis de tráfico
- **Next SEO** - Optimización para motores de búsqueda
- **Sitemap Automático** - Generación automática de sitemaps

## 📦 Instalación

### **Prerrequisitos**
- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase

### **1. Clonar el Repositorio**
```bash
git clone https://github.com/tu-usuario/voz-del-guapo.git
cd voz-del-guapo
```

### **2. Instalar Dependencias**
```bash
npm install
# o
yarn install
```

### **3. Configurar Variables de Entorno**
Crea un archivo `.env.local` con las siguientes variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### **4. Configuración**

### **Configuración de Next.js**
El archivo `next.config.mjs` está configurado para:

```javascript
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  output: 'export',           // Static export
  trailingSlash: true,        // Compatible con Apache
  distDir: 'out',            // Directorio de build
}
```

### **Configuración de Apache**
Incluye el archivo `.htaccess` en tu servidor para routing correcto:

```apache
RewriteEngine On
RewriteBase /

# Archivos estáticos
RewriteCond %{REQUEST_FILENAME} -f
RewriteRule ^ - [L]

# Rutas de admin con UUIDs
RewriteRule ^admin/noticias/([a-f0-9-]+)/editar/?$ /admin/noticias/$1/editar/index.html [L]
RewriteRule ^admin/plantel/([a-f0-9-]+)/editar/?$ /admin/plantel/$1/editar/index.html [L]

# Rutas públicas
RewriteRule ^noticias/([^/]+)/?$ /noticias/detalle/index.html [L]

# Fallback
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo
npm run build        # Build para producción
npm run start        # Iniciar servidor de producción
npm run lint         # Ejecutar ESLint

# Exportación estática
npm run export       # Build + export para hosting estático
```

## 📁 Estructura del Proyecto

```
voz-del-guapo/
├── app/                    # App Router de Next.js
│   ├── admin/             # Panel de administración
│   │   ├── noticias/      # Gestión de noticias
│   │   ├── plantel/      # Gestión de plantel
│   │   └── partidos/     # Gestión de partidos
│   ├── noticias/         # Página de noticias públicas
│   ├── partidos/         # Página de fixture
│   ├── plantel/          # Página de plantel
│   ├── layout.tsx        # Layout principal
│   └── page.tsx          # Página principal
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes UI (shadcn/ui)
│   ├── header.tsx        # Header del sitio
│   ├── footer.tsx        # Footer del sitio
│   └── ...               # Otros componentes
├── lib/                   # Utilidades y configuración
│   ├── supabase/         # Cliente de Supabase
│   ├── data-manager.ts   # Gestión de datos
│   └── upload-utils.ts   # Utilidades de subida
├── public/                # Archivos estáticos
│   ├── images/           # Imágenes del sitio
│   ├── uploads/          # Imágenes subidas por usuarios
│   └── .htaccess         # Configuración de Apache
├── hooks/                 # Custom hooks de React
├── styles/               # Estilos globales
└── types/                # Definiciones de TypeScript
```

## 🗄️ Base de Datos

### **Tablas Principales**

#### **news** - Noticias
```sql
CREATE TABLE news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  category TEXT,
  author TEXT,
  featured BOOLEAN DEFAULT false,
  slug TEXT UNIQUE,
  image_url TEXT,
  video_url TEXT,
  images TEXT[],
  tags TEXT[],
  published_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **matches** - Partidos
```sql
CREATE TABLE matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  opponent TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME,
  location TEXT,
  competition TEXT,
  is_home BOOLEAN DEFAULT true,
  result TEXT,
  status TEXT DEFAULT 'upcoming',
  stadium TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **players** - Jugadores
```sql
CREATE TABLE players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT,
  number INTEGER,
  birth_date DATE,
  nationality TEXT,
  height TEXT,
  weight TEXT,
  image_url TEXT,
  biography TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 Despliegue

### **Opción 1: Vercel (Recomendado)**
1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Despliegue automático en cada push

### **Opción 2: Hosting Estático (Apache)**
1. Ejecuta `npm run build`
2. Sube la carpeta `out/` a tu servidor
3. Configura el archivo `.htaccess`
4. Asegúrate de tener `trailingSlash: true`

### **Opción 3: Netlify**
1. Conecta tu repositorio
2. Configura build command: `npm run build`
3. Directorio de publicación: `out`
4. Agrega variables de entorno

### **Variables de Entorno para Producción**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## 🤝 Contribuir

### **Cómo Contribuir**
1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

### **Guía de Estilo**
- Usa TypeScript para todo el código nuevo
- Sigue las convenciones de ESLint
- Usa componentes de shadcn/ui cuando sea posible
- Mantén los componentes pequeños y reutilizables
- Agrega tests para nuevas funcionalidades

### **Reportar Issues**
- Usa el template de issues de GitHub
- Incluye capturas de pantalla si es un bug visual
- Proporciona pasos para reproducir el problema
- Menciona tu navegador y versión

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Mira el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- **Club Atlético Barracas Central** - Por permitirnos crear su sitio oficial
- **Supabase** - Por la excelente plataforma backend
- **Vercel** - Por el increíble hosting de Next.js
- **shadcn/ui** - Por los hermosos componentes UI
- **Tailwind CSS** - Por el framework de CSS increíble

---

## 📞 Contacto

- **Sitio Web**: [https://vozdelguapo.com](https://vozdelguapo.com)

---

