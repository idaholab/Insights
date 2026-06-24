// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import { createContext } from 'react';

type ThemeContextType = {
  theme: string;
  toggleTheme: () => void;
  skeletonBaseColor?: string;
  skeletonHighlightColor?: string;
  graphFontColor?: string,
  graphLineColor?: string,
}

export const ThemeContextBlock = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => { console.warn('toggleTheme was called without a ThemeContext.Provider'); },
});
