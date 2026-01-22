import { useNavigate } from 'react-router-dom';
import { GoogleLoginButton } from '@shared/components';
import { useAppDispatch } from '@store/hooks';
import { loginStart, loginSuccess, loginFailure } from '@store/slices';
import { authService } from '@shared/services';
import { ROUTES } from '@core/constants';
import { User } from '@core/types';

export const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLoginSuccess = async (credential: string, accessToken: string) => {
    try {
      dispatch(loginStart());
      
      authService.setAccessToken(accessToken);
      
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }

      const userInfo = await response.json();
      
      const user: User = {
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
      };

      authService.saveUser(user);
      dispatch(loginSuccess(user));
      navigate(ROUTES.HOME);
    } catch (error) {
      console.error('Error during login:', error);
      dispatch(loginFailure('Error al iniciar sesión'));
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

