import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { logout } from '@store/slices';
import { authService } from '@shared/services';
import { Header } from '@shared/components';
import { ROUTES } from '@core/constants';

export const HomePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const accessToken = authService.getAccessToken();
    console.log('Google Access Token:', accessToken);
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    dispatch(logout());
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      <Header user={user} onLogout={handleLogout} />

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8'>
        <div className='bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8'>
          <div className='flex flex-col sm:flex-row items-center sm:items-center gap-4 mb-4 sm:mb-6'>
            <div className='w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg flex-shrink-0'>
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className='text-center sm:text-left'>
              <h2 className='text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 break-words'>
                ¡Bienvenido, {user?.name}!
              </h2>
              <p className='text-sm sm:text-base text-gray-500 mt-1'>Es genial tenerte de vuelta</p>
            </div>
          </div>
          
          <div className='border-t border-gray-200 pt-4 sm:pt-6'>
            <p className='text-sm sm:text-base text-gray-600 leading-relaxed'>
              Esta es tu página de inicio. Aquí puedes agregar el contenido de tu aplicación.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

