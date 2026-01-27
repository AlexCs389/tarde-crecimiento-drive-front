/**
 * Este archivo es un ejemplo de cómo crear servicios para consumir otros endpoints
 * de la API utilizando el httpService o httpInterceptorService
 * 
 * RECOMENDACIÓN:
 * - Usa httpInterceptorService para endpoints que requieren autenticación
 *   (maneja automáticamente el refresh de tokens cuando expiran)
 * - Usa httpService para endpoints públicos o cuando no necesites interceptores
 */

import { httpService } from './http.service';
import { httpInterceptorService } from './http-interceptor.service';
import { authService } from './auth.service';

// Ejemplo de interfaces para un endpoint de usuarios
interface UserProfile {
  id: string;
  email: string;
  name: string;
  bio?: string;
  avatar?: string;
}

interface UpdateProfileRequest {
  name?: string;
  bio?: string;
}

// Ejemplo de servicio para gestionar perfiles de usuario
// USANDO httpInterceptorService (recomendado para endpoints autenticados)
class UserProfileService {
  private getAuthHeaders() {
    const token = authService.getAccessToken();
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  /**
   * Obtiene el perfil del usuario actual
   * Usa httpInterceptorService que automáticamente refresca el token si expira
   */
  async getCurrentProfile(): Promise<UserProfile> {
    return httpInterceptorService.get<UserProfile>('/api/profile', {
      headers: this.getAuthHeaders(),
    });
  }

  /**
   * Actualiza el perfil del usuario
   */
  async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    return httpInterceptorService.patch<UserProfile>('/api/profile', data, {
      headers: this.getAuthHeaders(),
    });
  }

  /**
   * Obtiene el perfil de otro usuario por ID
   */
  async getUserProfile(userId: string): Promise<UserProfile> {
    return httpInterceptorService.get<UserProfile>(`/api/users/${userId}`, {
      headers: this.getAuthHeaders(),
    });
  }
}

// Ejemplo de servicio para gestionar archivos/documentos
interface Document {
  id: string;
  name: string;
  url: string;
  size: number;
  createdAt: string;
}

interface UploadDocumentRequest {
  name: string;
  file: File;
}

class DocumentService {
  private getAuthHeaders() {
    const token = authService.getAccessToken();
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  /**
   * Lista todos los documentos del usuario
   * Usa httpInterceptorService que automáticamente refresca el token si expira
   */
  async listDocuments(): Promise<Document[]> {
    return httpInterceptorService.get<Document[]>('/api/documents', {
      headers: this.getAuthHeaders(),
    });
  }

  /**
   * Obtiene un documento específico
   */
  async getDocument(documentId: string): Promise<Document> {
    return httpInterceptorService.get<Document>(`/api/documents/${documentId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  /**
   * Elimina un documento
   */
  async deleteDocument(documentId: string): Promise<void> {
    return httpInterceptorService.delete<void>(`/api/documents/${documentId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  /**
   * Nota: Para subir archivos, necesitarías un método especial en httpService
   * o manejar FormData directamente. Este es solo un ejemplo conceptual.
   */
  async uploadDocument(data: UploadDocumentRequest): Promise<Document> {
    const token = authService.getAccessToken();
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('file', data.file);

    // Para FormData, no uses httpService directamente, usa fetch
    const response = await fetch('http://localhost:5000/api/documents', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // NO incluyas Content-Type para FormData, el navegador lo hace automáticamente
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error al subir el documento');
    }

    return response.json();
  }
}

// Exportar instancias de los servicios
export const userProfileService = new UserProfileService();
export const documentService = new DocumentService();

/**
 * PATRÓN RECOMENDADO:
 * 
 * 1. Crear una clase para cada recurso/módulo de la API
 * 2. Usar httpService para peticiones JSON estándar
 * 3. Incluir el token JWT en los headers cuando sea necesario
 * 4. Definir interfaces TypeScript para requests y responses
 * 5. Manejar errores en el nivel del servicio o dejarlos propagar
 * 6. Exportar una instancia única del servicio (singleton)
 */
