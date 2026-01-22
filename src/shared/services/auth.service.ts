import { IAuthService } from '@core/interfaces';
import { User } from '@core/types';
import { STORAGE_KEYS } from '@core/constants';
import { storageService } from '@shared/services';

class AuthService implements IAuthService {
  async login(credential: string): Promise<User> {
    try {
      const payload = JSON.parse(atob(credential.split('.')[1]));
      
      const user: User = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      };

      storageService.set(STORAGE_KEYS.USER, user);
      storageService.set(STORAGE_KEYS.AUTH_TOKEN, credential);

      return user;
    } catch (error) {
      console.error('Error during login:', error);
      throw new Error('Failed to process login');
    }
  }

  saveUser(user: User): void {
    storageService.set(STORAGE_KEYS.USER, user);
  }

  async logout(): Promise<void> {
    try {
      storageService.remove(STORAGE_KEYS.USER);
      storageService.remove(STORAGE_KEYS.AUTH_TOKEN);
      storageService.remove(STORAGE_KEYS.ACCESS_TOKEN);
    } catch (error) {
      console.error('Error during logout:', error);
      throw new Error('Failed to logout');
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
}

export const authService = new AuthService();

