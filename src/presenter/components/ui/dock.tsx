'use client';

import * as React from 'react';

import { cn } from '@/presenter/lib/utils';

export interface DockProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const Dock = React.forwardRef<HTMLDivElement, DockProps>(({ className, ...props }, ref) => {
  return (
    <footer
      ref={ref}
      className={cn(
        'fixed bottom-4 left-1/2 -translate-x-1/2 z-40 min-w-24 flex items-center justify-center border-border bg-white dark:bg-black flex-row gap-3 rounded-2xl border px-2 py-2',
        className
      )}
      {...props}
    />
  );
});
Dock.displayName = 'Dock';

export interface DockIconProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const DockIcon = React.forwardRef<HTMLDivElement, DockIconProps>(({ className, children, onClick, ...props }, ref) => {
  return (
    <div
      className={cn(
        'h-5 cursor-pointer w-5 inline-flex items-center justify-center transition-all duration-500 text-black/50 group-hover:text-black dark:text-white/50 group-hover:dark:text-white hover:scale-110',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});
DockIcon.displayName = 'DockIcon';

const DockSeparator = () => <div className='mx-1 h-4 w-px bg-border dark:bg-white/50  rounded-full' />;
DockSeparator.displayName = 'DockSeparator';

export { Dock, DockIcon, DockSeparator };
