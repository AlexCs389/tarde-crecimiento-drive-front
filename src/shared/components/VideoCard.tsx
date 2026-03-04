import type { DriveFile } from '@core/types';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@core/constants';

interface VideoCardProps {
  file: DriveFile;
}

export const VideoCard = ({ file }: VideoCardProps) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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

  const handleClick = () => {
    navigate(`${ROUTES.VIDEO_PLAYER}/${file.id}`, { state: { file } });
  };

  return (
    <div
      onClick={handleClick}
      className='bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group'
    >
      <div className='relative bg-gradient-to-br from-blue-500 to-indigo-600 h-48 flex items-center justify-center'>
        <svg
          className='w-16 h-16 text-white opacity-80 group-hover:opacity-100 transition-opacity'
          fill='currentColor'
          viewBox='0 0 20 20'
        >
          <path d='M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z' />
        </svg>
        <div className='absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded'>
          {formatSize(file.size)}
        </div>
      </div>
      <div className='p-4'>
        <h3 className='font-semibold text-gray-800 text-sm line-clamp-2 mb-2 min-h-[2.5rem]'>
          {file.name}
        </h3>
        <div className='flex items-center text-xs text-gray-500 gap-2'>
          <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
              clipRule='evenodd'
            />
          </svg>
          <span>{formatDate(file.createdTime)}</span>
        </div>
      </div>
    </div>
  );
};
