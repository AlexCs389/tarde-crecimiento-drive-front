import { useEffect, useRef } from 'react';
import { authService } from '@shared/services';

interface UseTokenRefreshOptions {
  enabled?: boolean;
  refreshBeforeExpiry?: number; // Segundos antes de que expire para refrescar
}

/**
 * Hook para manejar el refresh automático del token
 * @param options - Opciones de configuración
 */
export const useTokenRefresh = (options: UseTokenRefreshOptions = {}) => {
  const { enabled = true, refreshBeforeExpiry = 300 } = options; // 5 minutos por defecto
  const refreshTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const scheduleTokenRefresh = async () => {
      try {
        const accessToken = authService.getAccessToken();
        
        if (!accessToken) return;

        // Decodificar el JWT para obtener el tiempo de expiración
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        const expiresAt = payload.exp * 1000; // Convertir a milisegundos
        const now = Date.now();
        const timeUntilExpiry = expiresAt - now;
        const timeUntilRefresh = timeUntilExpiry - (refreshBeforeExpiry * 1000);

        // Si ya expiró o está por expirar muy pronto, refrescar inmediatamente
        if (timeUntilRefresh <= 0) {
          await authService.refreshTokenSafe();
          // Reprogramar después del refresh
          scheduleTokenRefresh();
          return;
        }

        // Programar el refresh
        refreshTimerRef.current = setTimeout(async () => {
          try {
            await authService.refreshTokenSafe();
            // Reprogramar después del refresh
            scheduleTokenRefresh();
          } catch (error) {
            console.error('Error al refrescar token automáticamente:', error);
          }
        }, timeUntilRefresh);
      } catch (error) {
        console.error('Error al programar refresh de token:', error);
      }
    };

    scheduleTokenRefresh();

    // Limpiar el timer al desmontar
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, [enabled, refreshBeforeExpiry]);

  const manualRefresh = async () => {
    try {
      await authService.refreshTokenSafe();
    } catch (error) {
      console.error('Error al refrescar token manualmente:', error);
      throw error;
    }
  };

  return { manualRefresh };
};
