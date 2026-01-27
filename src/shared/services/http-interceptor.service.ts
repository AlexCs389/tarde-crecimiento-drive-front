import { env } from '@config/env';

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
  skipAuthRefresh?: boolean; // Para evitar loops infinitos en el refresh
}

interface HttpError extends Error {
  status?: number;
}

class HttpInterceptorService {
  private baseURL: string;
  private authServiceGetter: (() => any) | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Configura el servicio de autenticación para usar en el interceptor
   * Se usa un getter para evitar dependencias circulares
   */
  setAuthService(getAuthService: () => any): void {
    this.authServiceGetter = getAuthService;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      // Si es 401 y no es una petición de refresh, intentar refrescar el token
      if (
        response.status === 401 && 
        !options.skipAuthRefresh && 
        !endpoint.includes('/auth/refresh') &&
        !endpoint.includes('/auth/google/login')
      ) {
        return await this.handleUnauthorized<T>(endpoint, options);
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error: HttpError = new Error(
          errorData.message || `HTTP Error: ${response.status} ${response.statusText}`
        );
        error.status = response.status;
        throw error;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error desconocido en la petición');
    }
  }

  /**
   * Maneja errores 401 intentando refrescar el token
   */
  private async handleUnauthorized<T>(
    endpoint: string,
    originalOptions: RequestOptions
  ): Promise<T> {
    if (!this.authServiceGetter) {
      throw new Error('AuthService no configurado en HttpInterceptorService');
    }

    try {
      const authService = this.authServiceGetter();
      
      // Intentar refrescar el token de forma segura (evita múltiples llamadas simultáneas)
      const newAccessToken = await authService.refreshTokenSafe();
      
      // Reintentar la petición original con el nuevo token
      const newHeaders = {
        ...originalOptions.headers,
        Authorization: `Bearer ${newAccessToken}`,
      };

      return await this.request<T>(endpoint, {
        ...originalOptions,
        headers: newHeaders,
        skipAuthRefresh: true, // Evitar loop infinito
      });
    } catch (error) {
      console.error('Error al refrescar token:', error);
      // Si falla el refresh, propagar el error
      throw error;
    }
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  async post<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }
}

export const httpInterceptorService = new HttpInterceptorService(env.apiBaseUrl);
