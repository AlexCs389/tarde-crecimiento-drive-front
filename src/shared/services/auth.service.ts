import type { IAuthService } from '@core/interfaces';
import type { User, GoogleLoginRequest, GoogleLoginResponse, RefreshTokenResponse } from '@core/types';
import { STORAGE_KEYS } from '@core/constants';
import { storageService } from '@shared/services';
import { httpService } from './http.service';

class AuthService implements IAuthService {
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  /**
   * Realiza el login con Google enviando el access_token al backend
   * @param googleAccessToken - Token de acceso de Google
   * @returns Respuesta del backend con el JWT y datos del usuario
   */
  async loginWithGoogle(googleAccessToken: string): Promise<GoogleLoginResponse> {
    try {
      const requestBody: GoogleLoginRequest = {
        access_token: googleAccessToken,
      };

      const response = await httpService.post<GoogleLoginResponse>(
        '/auth/google/login',
        requestBody
      );

      // Guardar el JWT token del backend
      this.setAccessToken(response.access_token);
      
      // Guardar el refresh token si existe
      if (response.refresh_token) {
        this.setRefreshToken(response.refresh_token);
      }
      
      // Guardar el usuario en el storage
      this.saveUser(response.user);

      return response;
    } catch (error) {
      console.error('Error during Google login:', error);
      throw new Error('Error al iniciar sesión con Google');
    }
  }

  /**
   * Refresca el access token usando el refresh token
   * @returns Nueva respuesta con access_token y refresh_token
   */
  async refreshToken(): Promise<RefreshTokenResponse> {
    try {
      const refreshToken = this.getRefreshToken();
      
      if (!refreshToken) {
        throw new Error('No hay refresh token disponible');
      }

      const response = await httpService.post<RefreshTokenResponse>(
        '/auth/refresh',
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );

      // Guardar el nuevo access token
      this.setAccessToken(response.access_token);
      
      // Actualizar el refresh token si viene uno nuevo
      if (response.refresh_token) {
        this.setRefreshToken(response.refresh_token);
      }

      return response;
    } catch (error) {
      console.error('Error during token refresh:', error);
      // Si falla el refresh, limpiar todo y forzar re-login
      await this.logout();
      throw new Error('Error al refrescar el token. Por favor, inicia sesión nuevamente.');
    }
  }

  /**
   * Intenta refrescar el token de forma segura, evitando múltiples llamadas simultáneas
   * @returns Promise con el nuevo access token
   */
  async refreshTokenSafe(): Promise<string> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      
      try {
        const response = await this.refreshToken();
        this.isRefreshing = false;
        
        // Notificar a todos los suscriptores que el token se refrescó
        this.onRefreshed(response.access_token);
        
        return response.access_token;
      } catch (error) {
        this.isRefreshing = false;
        this.refreshSubscribers = [];
        throw error;
      }
    }

    // Si ya se está refrescando, esperar a que termine
    return new Promise((resolve) => {
      this.subscribeTokenRefresh((token: string) => {
        resolve(token);
      });
    });
  }

  /**
   * Suscribe un callback para cuando el token se refresque
   */
  private subscribeTokenRefresh(callback: (token: string) => void): void {
    this.refreshSubscribers.push(callback);
  }

  /**
   * Notifica a todos los suscriptores que el token se refrescó
   */
  private onRefreshed(token: string): void {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  saveUser(user: User): void {
    storageService.set(STORAGE_KEYS.USER, user);
  }

  async logout(): Promise<void> {
    try {
      storageService.remove(STORAGE_KEYS.USER);
      storageService.remove(STORAGE_KEYS.AUTH_TOKEN);
      storageService.remove(STORAGE_KEYS.ACCESS_TOKEN);
      storageService.remove(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('Error during logout:', error);
      throw new Error('Error al cerrar sesión');
    }
  }

  getCurrentUser(): User | null {
    return storageService.get<User>(STORAGE_KEYS.USER);
  }

  getAccessToken(): string | null {
    return storageService.get<string>(STORAGE_KEYS.ACCESS_TOKEN);
  }

  setAccessToken(token: string): void {
    storageService.set(STORAGE_KEYS.ACCESS_TOKEN, token);
  }

  getRefreshToken(): string | null {
    return storageService.get<string>(STORAGE_KEYS.REFRESH_TOKEN);
  }

  setRefreshToken(token: string): void {
    storageService.set(STORAGE_KEYS.REFRESH_TOKEN, token);
  }
}

export const authService = new AuthService();

