'use client';

import { RiGithubFill } from '@remixicon/react';

import { Dock, DockIcon, DockSeparator } from './ui/dock';
import { ThemeSwitcher } from './theme-switcher';

export function Footer() {
  return (
    <Dock>
      <DockIcon>
        <ThemeSwitcher />
      </DockIcon>
      <DockSeparator />
      <DockIcon>
        <a href='https://github.com/jonathanrose18/machbar' target='_blank' rel='noopener noreferrer'>
          <RiGithubFill />
        </a>
      </DockIcon>
    </Dock>
  );
}
