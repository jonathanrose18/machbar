'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

import { cn } from '../lib/utils';

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  if (!mounted) {
    return <div className='h-6 w-6 rounded-full bg-white dark:bg-black' />;
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'cursor-pointer group relative h-5 w-5 rounded-full transition-all duration-500 ease-out',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
      )}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center transition-all duration-500',
          isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
        )}
      >
        <svg
          viewBox='0 0 24 24'
          fill='none'
          className='h-5 w-5 transition-transform duration-500 group-hover:scale-110'
        >
          <circle
            cx='12'
            cy='12'
            r='4'
            className='fill-black/50 group-hover:fill-black transition-colors duration-500'
          />
          <g
            className='stroke-black/50 group-hover:stroke-black transition-colors duration-500'
            strokeWidth='2'
            strokeLinecap='round'
          >
            <line x1='12' y1='2' x2='12' y2='4' />
            <line x1='12' y1='20' x2='12' y2='22' />
            <line x1='4' y1='12' x2='2' y2='12' />
            <line x1='22' y1='12' x2='20' y2='12' />
            <line x1='5.64' y1='5.64' x2='4.22' y2='4.22' />
            <line x1='19.78' y1='19.78' x2='18.36' y2='18.36' />
            <line x1='5.64' y1='18.36' x2='4.22' y2='19.78' />
            <line x1='19.78' y1='4.22' x2='18.36' y2='5.64' />
          </g>
        </svg>
      </div>

      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center transition-all duration-500',
          isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
        )}
      >
        <svg
          viewBox='0 0 24 24'
          fill='none'
          className='h-6 w-6 transition-transform duration-500 group-hover:scale-110'
        >
          <path
            d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'
            className='fill-white/50 stroke-white/50 group-hover:fill-white group-hover:stroke-white duration-500 transition-colors'
            strokeWidth='1'
          />
        </svg>
      </div>

      <span className='absolute inset-0 rounded-full transition-transform duration-300 group-active:scale-90' />
    </button>
  );
}
