import { useNavigate } from 'react-router-dom';
import { GoogleLoginButton } from '@shared/components';
import { useAppDispatch } from '@store/hooks';
import { loginStart, loginSuccess, loginFailure } from '@store/slices';
import { authService } from '@shared/services';
import { ROUTES } from '@core/constants';

export const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLoginSuccess = async (credential: string, googleAccessToken: string) => {
    try {
      dispatch(loginStart());
      
      // Enviar el access_token de Google al backend
      const response = await authService.loginWithGoogle(googleAccessToken);
      
      // El authService ya guarda el usuario y el token JWT del backend
      // Ahora solo actualizamos el estado de Redux
      dispatch(loginSuccess(response.user));
      
      // Redirigir al home
      navigate(ROUTES.HOME);
    } catch (error) {
      console.error('Error during login:', error);
      dispatch(loginFailure('Error al iniciar sesión con Google'));
    }
  };

  const handleLoginError = () => {
    dispatch(loginFailure('Error al autenticar con Google'));
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100'>
      <div className='bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>Bienvenido</h1>
          <p className='text-gray-600'>Inicia sesión para continuar</p>
        </div>
        
        <div className='flex justify-center'>
          <GoogleLoginButton
            onSuccess={handleLoginSuccess}
            onError={handleLoginError}
          />
        </div>
      </div>
    </div>
  );
};

