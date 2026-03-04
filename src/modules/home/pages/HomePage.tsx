import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { logout } from '@store/slices';
import { authService, driveService } from '@shared/services';
import { Header, VideoCard } from '@shared/components';
import { ROUTES } from '@core/constants';
import type { DriveFile } from '@core/types';

export const HomePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const hasFetchedFiles = useRef(false);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDriveFiles = async () => {
      if (hasFetchedFiles.current) return;
      hasFetchedFiles.current = true;

      try {
        const response = await driveService.getFiles();
        
        let filesData: DriveFile[] = [];
        if (Array.isArray(response)) {
          filesData = response;
        } else if (response.data && Array.isArray(response.data)) {
          filesData = response.data;
        } else if (response.files && Array.isArray(response.files)) {
          filesData = response.files;
        }
        
        setFiles(filesData);
      } catch (error) {
        console.error('Error al cargar archivos del drive:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDriveFiles();
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
        <div className='mb-6'>
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-800 mb-2'>
            Tardes de Crecimiento
          </h1>
          <p className='text-gray-600'>
            {loading ? 'Cargando videos...' : `${files.length} video${files.length !== 1 ? 's' : ''} disponible${files.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {loading ? (
          <div className='flex justify-center items-center h-64'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
          </div>
        ) : files.length === 0 ? (
          <div className='bg-white rounded-xl shadow-lg p-8 text-center'>
            <svg
              className='w-16 h-16 text-gray-400 mx-auto mb-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z'
              />
            </svg>
            <h3 className='text-xl font-semibold text-gray-700 mb-2'>
              No hay videos disponibles
            </h3>
            <p className='text-gray-500'>
              Los videos aparecerán aquí cuando estén disponibles.
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'>
            {files.map((file) => (
              <VideoCard key={file.id} file={file} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

