'use client';

import React, { useState, useEffect } from 'react';
import {
  SystemIcon,
  LightIcon,
  DarkIcon,
} from '../../../public/icons/themeIcons';

const themes = ['system', 'light', 'dark'] as const;
type Theme = (typeof themes)[number];

const iconMap: Record<Theme, React.ElementType> = {
  system: SystemIcon,
  light: LightIcon,
  dark: DarkIcon,
};

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    const root = window.document.documentElement;

    const applyTheme = (selectedTheme: Theme) => {
      if (selectedTheme === 'system') {
        const prefersDark = window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches;
        root.classList.toggle('dark', prefersDark);
      } else {
        root.classList.toggle('dark', selectedTheme === 'dark');
      }
    };

    applyTheme(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme && themes.includes(savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 flex space-x-1 rounded-full border border-stone-300 bg-stone-100 p-1 shadow-md dark:border-stone-700 dark:bg-stone-800">
      {themes.map((t) => {
        const Icon = iconMap[t];
        return (
          <button
            key={t}
            onClick={() => setTheme(t)}
            aria-label={`Switch to ${t} theme`}
            className={`rounded-full p-1 transition-colors duration-200 *:size-7 ${
              theme === t
                ? 'bg-amber-500 text-stone-900'
                : 'text-stone-800 dark:bg-stone-700 dark:text-stone-300'
            }`}
          >
            <Icon className="h-5 w-5" />
          </button>
        );
      })}
    </div>
  );
}
