// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import React, { useState } from 'react';
import { ThemeContextBlock } from './ThemeContextBlock'; // Ensure the path is correct
import { getCssRGBVarColor } from '../util/helperFunctions';

type Props = {
  children: React.ReactNode;
};

const ThemeContextComponent: React.FC<Props> = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  const [skeletonBaseColor, setSkeletonBaseColor] = useState<string>(getCssRGBVarColor('--color-neutral-rgb-600'));
  const [skeletonHighlightColor, setSkeletonHighlightColor] = useState<string>(getCssRGBVarColor('--color-neutral-rgb-500'));

  const [graphLineColor, setGraphLineColor] = useState<string>(getCssRGBVarColor('--color-neutral-rgb-600'));
  const [graphFontColor, setGraphFontColor] = useState<string>(getCssRGBVarColor('--color-neutral-rgb-100'));

  const toggleTheme = () => {
    setTheme(currentTheme => currentTheme === 'dark' ? 'light' : 'dark');
    setSkeletonBaseColor((theme === 'dark') ? getCssRGBVarColor('--color-neutral-rgb-200') : getCssRGBVarColor('--color-neutral-rgb-600'));
    setSkeletonHighlightColor((theme === 'dark') ? getCssRGBVarColor('--color-neutral-rgb-100') : getCssRGBVarColor('--color-neutral-rgb-500'));

    setGraphFontColor((theme === 'dark') ? getCssRGBVarColor('--color-neutral-rgb-900') : getCssRGBVarColor('--color-neutral-rgb-100'));
    setGraphLineColor((theme === 'dark') ? getCssRGBVarColor('--color-neutral-rgb-400') : getCssRGBVarColor('--color-neutral-rgb-600'));

  };

  return (
    <ThemeContextBlock.Provider value={{ theme, toggleTheme, skeletonBaseColor, skeletonHighlightColor, graphLineColor, graphFontColor }}>
      {children}
    </ThemeContextBlock.Provider>
  );
};

export default ThemeContextComponent;
