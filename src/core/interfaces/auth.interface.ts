import { User } from '@core/types';

export interface IAuthService {
  login(credential: string): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): User | null;
}

