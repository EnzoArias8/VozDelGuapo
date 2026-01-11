# Google Analytics Configuration

## Pasos para configurar Google Analytics:

### 1. Crear cuenta en Google Analytics
1. Ve a [Google Analytics](https://analytics.google.com/)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en "Empezar a medir"
4. Crea una cuenta de Analytics
5. Configura una propiedad (tu sitio web)

### 2. Obtener el Measurement ID
1. Una vez creada la propiedad, obtendrás un Measurement ID (formato: G-XXXXXXXXXX)
2. Copia este ID

### 3. Configurar en el proyecto
1. Abre el archivo: `lib/google-analytics.ts`
2. Reemplaza `G-XXXXXXXXXX` con tu Measurement ID real
3. Guarda el archivo

### 4. Configurar el archivo de entorno (opcional pero recomendado)
Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Y actualiza el código para usar la variable de entorno:

```typescript
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX'
```

### 5. Para datos reales de Analytics API
Para obtener estadísticas reales en el dashboard de administración:

1. **Configurar Google Cloud Platform**:
   - Ve a [Google Cloud Console](https://console.cloud.google.com/)
   - Crea un nuevo proyecto
   - Habilita "Google Analytics Data API"

2. **Configurar credenciales OAuth**:
   - Crea credenciales de cuenta de servicio
   - Descarga el archivo JSON
   - Guarda las credenciales de forma segura

3. **Actualizar la API route**:
   - Modifica `app/api/analytics/route.ts`
   - Reemplaza los datos simulados con llamadas reales a la API

### 6. Verificar la instalación
1. Despliega tu sitio
2. Ve a Google Analytics -> Informes -> Tiempo real
3. Deberías ver visitas en tiempo real

## Características implementadas:

✅ **Seguimiento automático de páginas**
✅ **Eventos personalizados**
✅ **Dashboard de administración con estadísticas**
✅ **Visitas por página y categoría**
✅ **Datos en tiempo real**

## Notas importantes:

- Los datos pueden tardar hasta 24-48 horas en aparecer en Analytics
- El modo de incógnito no registra visitas
- Los bloqueadores de anuncios pueden afectar el seguimiento
- Para datos 100% precisos, configura la API de Analytics

## Variables de entorno recomendadas:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
GOOGLE_ANALYTICS_CREDENTIALS_JSON=your-credentials-json-content
```
