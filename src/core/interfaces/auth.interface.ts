import { User, GoogleLoginResponse, RefreshTokenResponse } from '@core/types';

export interface IAuthService {
  loginWithGoogle(googleAccessToken: string): Promise<GoogleLoginResponse>;
  refreshToken(): Promise<RefreshTokenResponse>;
  logout(): Promise<void>;
  getCurrentUser(): User | null;
  getAccessToken(): string | null;
  setAccessToken(token: string): void;
  getRefreshToken(): string | null;
  setRefreshToken(token: string): void;
  saveUser(user: User): void;
}

