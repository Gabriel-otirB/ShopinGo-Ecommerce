'use client';

import { useEffect, useState } from 'react';
import { ProgressProvider } from '@bprogress/next/app';

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [color, setColor] = useState('#2563eb'); // light: blue-600

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleThemeChange = (e: MediaQueryListEvent) => {
      setColor(e.matches ? '#60a5fa' : '#2563eb'); // dark: blue-400
    };

    // Initial check
    setColor(mediaQuery.matches ? '#60a5fa' : '#2563eb');

    // Listen to changes
    mediaQuery.addEventListener('change', handleThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, []);

  return (
    <ProgressProvider
      height="4px"
      color={color}
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  );
};

export default Providers;
