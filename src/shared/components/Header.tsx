import { useState } from 'react';
import type { User } from '@core/types';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export const Header = ({ user, onLogout }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className='bg-white shadow-md sticky top-0 z-50'>
      <nav className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex items-center'>
            <h1 className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>
              Drive App
            </h1>
          </div>

          <div className='hidden md:flex items-center gap-4'>
            {user && (
              <>
                <div className='flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg'>
                  {user.picture && (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className='w-10 h-10 rounded-full ring-2 ring-blue-500 ring-offset-2'
                    />
                  )}
                  <div className='flex flex-col'>
                    <span className='text-sm font-semibold text-gray-800'>{user.name}</span>
                    <span className='text-xs text-gray-500'>{user.email}</span>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className='px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium'
                >
                  Cerrar sesión
                </button>
              </>
            )}
          </div>

          <div className='md:hidden'>
            <button
              onClick={toggleMenu}
              className='p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors'
              aria-label='Toggle menu'
            >
              {isMenuOpen ? (
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              ) : (
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                </svg>
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className='md:hidden border-t border-gray-200 py-4 space-y-4'>
            {user && (
              <>
                <div className='flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg'>
                  {user.picture && (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className='w-12 h-12 rounded-full ring-2 ring-blue-500 ring-offset-2'
                    />
                  )}
                  <div className='flex flex-col'>
                    <span className='text-sm font-semibold text-gray-800'>{user.name}</span>
                    <span className='text-xs text-gray-500'>{user.email}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setIsMenuOpen(false);
                  }}
                  className='w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md font-medium'
                >
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

