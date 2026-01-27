# Tarde Crecimiento Drive Front

Aplicación React con autenticación de Google, construida con arquitectura modular y buenas prácticas.

## Tecnologías

- React 19
- TypeScript
- Vite
- Redux Toolkit
- React Router
- Tailwind CSS
- Google OAuth

## Estructura del Proyecto

```
src/
├── config/              # Configuración de la aplicación
├── core/                # Núcleo de la aplicación
│   ├── constants/       # Constantes globales
│   ├── interfaces/      # Interfaces y contratos
│   └── types/           # Tipos TypeScript
├── modules/             # Módulos de la aplicación
│   ├── auth/            # Módulo de autenticación
│   └── home/            # Módulo de home
├── router/              # Configuración de rutas
├── shared/              # Recursos compartidos
│   ├── components/      # Componentes reutilizables
│   └── services/        # Servicios compartidos
└── store/               # Estado global (Redux)
    └── slices/          # Slices de Redux
```

## Configuración Inicial

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Google OAuth

#### 2.1. Crear Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. En el menú lateral, ve a **APIs y servicios** → **Credenciales**

#### 2.2. Configurar Pantalla de Consentimiento OAuth

1. Ve a **Pantalla de consentimiento de OAuth**
2. Selecciona **Externo** (o Interno si es para uso organizacional)
3. Completa la información requerida:
   - Nombre de la aplicación
   - Correo electrónico de asistencia
   - Dominios autorizados (opcional para desarrollo)
   - Correo electrónico del desarrollador
4. Guarda y continúa

#### 2.3. Crear Credenciales OAuth 2.0

1. Ve a **Credenciales** → **Crear credenciales** → **ID de cliente de OAuth**
2. Tipo de aplicación: **Aplicación web**
3. Nombre: `Tarde Crecimiento Drive Front` (o el que prefieras)
4. **Orígenes de JavaScript autorizados**:
   - Agregar: `http://localhost:5173`
   - Agregar: `http://localhost:5173/` (con barra final)
5. **URIs de redirección autorizadas**:
   - Agregar: `http://localhost:5173`
6. Haz clic en **Crear**
7. Copia el **ID de cliente** que aparece

#### 2.4. Habilitar Google+ API (Opcional pero recomendado)

1. Ve a **Biblioteca** en el menú lateral
2. Busca **Google+ API**
3. Haz clic en **Habilitar**

### 3. Configurar Variables de Entorno

1. Crea un archivo `.env.local` en la raíz del proyecto:

```bash
touch .env.local
```

2. Agrega las siguientes variables:

```env
VITE_GOOGLE_CLIENT_ID=tu_google_client_id_aqui.apps.googleusercontent.com
VITE_API_BASE_URL=http://localhost:5000
```

**Ejemplo:**
```env
VITE_GOOGLE_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
VITE_API_BASE_URL=http://localhost:5000
```

⚠️ **Importante**: El archivo `.env.local` está en `.gitignore` y no se subirá al repositorio.

### 3.1. Configurar el Backend

Esta aplicación requiere un backend para gestionar la autenticación. Asegúrate de que el backend esté corriendo en `http://localhost:5000` (o la URL configurada en `VITE_API_BASE_URL`).

El backend debe tener el siguiente endpoint:

**POST** `/auth/google/login`

**Request Body:**
```json
{
  "access_token": "google_access_token_here"
}
```

**Response:**
```json
{
  "access_token": "jwt_token_from_backend",
  "refresh_token": "refresh_token_optional",
  "token_type": "Bearer",
  "expires_in": 3600,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "picture": "https://...",
    "googleId": "google_user_id"
  }
}
```

El backend también debe implementar el endpoint de refresh:

**POST** `/auth/refresh`

**Headers:**
```
Authorization: Bearer {refresh_token}
```

**Response:**
```json
{
  "access_token": "new_jwt_token",
  "refresh_token": "new_refresh_token_optional",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

📖 **Documentación detallada:**
- [Flujo de autenticación](docs/AUTH_FLOW.md)
- [Sistema de refresh token](docs/TOKEN_REFRESH.md)

### 4. Ejecutar la Aplicación

```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

## Scripts Disponibles

```bash
npm run dev      # Inicia el servidor de desarrollo
npm run build    # Construye la aplicación para producción
npm run preview  # Vista previa de la build de producción
npm run lint     # Ejecuta el linter
```

## Características

- ✅ Autenticación con Google OAuth
- ✅ Integración con backend para gestión de sesiones JWT
- ✅ **Sistema de refresh token automático**
  - Refresh preventivo antes de expiración
  - Interceptor automático para errores 401
  - Prevención de múltiples refreshes simultáneos
- ✅ Servicio HTTP reutilizable para consumir APIs
- ✅ HttpInterceptorService con manejo automático de tokens
- ✅ Rutas protegidas
- ✅ Persistencia de sesión
- ✅ Estado global con Redux
- ✅ Arquitectura modular
- ✅ Principios SOLID
- ✅ TypeScript estricto
- ✅ Tailwind CSS
- ✅ Path aliases con @
- ✅ Exports con index.ts

## Arquitectura

La aplicación sigue principios SOLID:

- **Single Responsibility**: Cada servicio y componente tiene una única responsabilidad
- **Open/Closed**: Interfaces permiten extensión sin modificación
- **Liskov Substitution**: Implementaciones intercambiables mediante interfaces
- **Interface Segregation**: Interfaces específicas y pequeñas
- **Dependency Inversion**: Dependencias en abstracciones, no en implementaciones

## Path Aliases

El proyecto utiliza alias para imports más limpios:

```typescript
import { User } from '@core/types';
import { authService } from '@shared/services';
import { useAppDispatch } from '@store/hooks';
import { ROUTES } from '@core/constants';
import { LoginPage } from '@modules/auth/pages';
```

Alias configurados:
- `@/*` → `src/*`
- `@config/*` → `src/config/*`
- `@core/*` → `src/core/*`
- `@modules/*` → `src/modules/*`
- `@router/*` → `src/router/*`
- `@shared/*` → `src/shared/*`
- `@store/*` → `src/store/*`

Cada carpeta incluye archivos `index.ts` para exportaciones limpias.

## Solución de Problemas

### Error: "Invalid Client ID"
- Verifica que el `VITE_GOOGLE_CLIENT_ID` en `.env.local` sea correcto
- Asegúrate de reiniciar el servidor de desarrollo después de crear/modificar `.env.local`

### Error: "redirect_uri_mismatch"
- Verifica que `http://localhost:5173` esté agregado en los **Orígenes de JavaScript autorizados** en Google Cloud Console
- Asegúrate de que el puerto coincida (por defecto Vite usa 5173)

### Error: "Failed to fetch" o "Network Error"
- Verifica que el backend esté corriendo en la URL configurada (`http://localhost:5000`)
- Revisa que el backend tenga configurado CORS correctamente para permitir peticiones desde `http://localhost:5173`
- Verifica la consola del navegador para ver errores específicos de red

### La autenticación no funciona
- Verifica que Google+ API esté habilitada en tu proyecto de Google Cloud
- Asegúrate de que el backend esté corriendo y responda correctamente
- Revisa la consola del navegador para ver errores específicos
- Asegúrate de que el archivo `.env.local` exista y tenga el formato correcto
- Verifica que el endpoint `/auth/google/login` del backend esté funcionando correctamente

### Cambiar el puerto de desarrollo
Si necesitas usar un puerto diferente:

1. Modifica `vite.config.ts`:
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Tu puerto preferido
  },
  // ... resto de la configuración
});
```

2. Actualiza las URIs en Google Cloud Console con el nuevo puerto
