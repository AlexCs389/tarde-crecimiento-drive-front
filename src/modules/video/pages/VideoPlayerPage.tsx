import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { driveService } from '@shared/services';
import type { DriveFile } from '@core/types';
import { ROUTES } from '@core/constants';

export const VideoPlayerPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [file, setFile] = useState<DriveFile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeFile = async () => {
      if (location.state?.file) {
        setFile(location.state.file);
        setLoading(false);
        return;
      }

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
        
        const foundFile = filesData.find((f: DriveFile) => f.id === id);
        if (foundFile) {
          setFile(foundFile);
        } else {
          navigate(ROUTES.HOME);
        }
      } catch (error) {
        console.error('Error al cargar el archivo:', error);
        navigate(ROUTES.HOME);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      initializeFile();
    }
  }, [id, navigate, location.state]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatSize = (bytes: string) => {
    const size = parseInt(bytes);
    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)} KB`;
    } else if (size < 1024 * 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    } else {
      return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
  };

  const handleOpenVideo = () => {
    if (file) {
      window.open(file.webViewLink, '_blank');
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  if (!file) {
    return null;
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      <div className='bg-white shadow-sm border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <button
            onClick={() => navigate(ROUTES.HOME)}
            className='flex items-center text-gray-600 hover:text-gray-900 transition-colors'
          >
            <svg className='w-5 h-5 mr-2' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z'
                clipRule='evenodd'
              />
            </svg>
            Volver a inicio
          </button>
        </div>
      </div>

      <main className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='bg-white rounded-xl shadow-lg p-6 sm:p-8'>
          <div className='flex items-start gap-4 mb-6'>
            <div className='flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center'>
              <svg className='w-8 h-8 text-white' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z' />
              </svg>
            </div>
            <div className='flex-1 min-w-0'>
              <h1 className='text-2xl sm:text-3xl font-bold text-gray-800 mb-2 break-words'>
                {file.name}
              </h1>
              <p className='text-gray-500 text-sm'>Detalles del video</p>
            </div>
          </div>

          <div className='space-y-4 mb-8'>
            <div className='flex items-start gap-3 p-4 bg-gray-50 rounded-lg'>
              <svg
                className='w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
                  clipRule='evenodd'
                />
              </svg>
              <div className='flex-1'>
                <p className='text-sm font-medium text-gray-500 mb-1'>Fecha de creación</p>
                <p className='text-base text-gray-800'>{formatDate(file.createdTime)}</p>
              </div>
            </div>

            <div className='flex items-start gap-3 p-4 bg-gray-50 rounded-lg'>
              <svg
                className='w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z'
                  clipRule='evenodd'
                />
              </svg>
              <div className='flex-1'>
                <p className='text-sm font-medium text-gray-500 mb-1'>Tamaño del archivo</p>
                <p className='text-base text-gray-800'>{formatSize(file.size)}</p>
              </div>
            </div>

            <div className='flex items-start gap-3 p-4 bg-gray-50 rounded-lg'>
              <svg
                className='w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z'
                  clipRule='evenodd'
                />
              </svg>
              <div className='flex-1'>
                <p className='text-sm font-medium text-gray-500 mb-1'>Tipo de archivo</p>
                <p className='text-base text-gray-800'>{file.mimeType}</p>
              </div>
            </div>

            <div className='flex items-start gap-3 p-4 bg-gray-50 rounded-lg'>
              <svg
                className='w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                  clipRule='evenodd'
                />
              </svg>
              <div className='flex-1'>
                <p className='text-sm font-medium text-gray-500 mb-1'>ID del archivo</p>
                <p className='text-sm text-gray-800 font-mono break-all'>{file.id}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleOpenVideo}
            className='w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg shadow-lg hover:shadow-xl'
          >
            <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 20 20'>
              <path d='M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z' />
            </svg>
            Reproducir video
          </button>
        </div>
      </main>
    </div>
  );
};
