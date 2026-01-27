export * from './auth.service';
export * from './storage.service';
export * from './http.service';
export * from './http-interceptor.service';

// Configurar el interceptor con el authService
import { httpInterceptorService } from './http-interceptor.service';
import { authService } from './auth.service';

httpInterceptorService.setAuthService(() => authService);

