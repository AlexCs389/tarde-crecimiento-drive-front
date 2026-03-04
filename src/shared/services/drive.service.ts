import { httpInterceptorService, authService } from '@shared/services';

// Tipo flexible para la respuesta del drive
// Puedes actualizarlo cuando conozcas la estructura exacta
type DriveFilesResponse = any;

class DriveService {
  private getAuthHeaders() {
    const token = authService.getAccessToken();
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  /**
   * Obtiene la lista de archivos del drive
   * Endpoint: GET /drive/files
   * @returns Respuesta del backend con los archivos
   */
  async getFiles(): Promise<DriveFilesResponse> {
    try {
      const response = await httpInterceptorService.get<DriveFilesResponse>(
        '/drive/files',
        {
          headers: this.getAuthHeaders(),
        }
      );
      
      return response;
    } catch (error) {
      console.error('Error al obtener archivos del drive:', error);
      throw error;
    }
  }
}

export const driveService = new DriveService();
