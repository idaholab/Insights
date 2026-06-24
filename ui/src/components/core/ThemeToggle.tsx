// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import * as React from 'react';
import { useEffect } from 'react';

import { useTheme } from '../../contexts/useTheme';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  // Load from storage
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', storedTheme);
  }, []);

  // user toggle
  useEffect(() => {
    const htmlElement = document.documentElement;
    if (htmlElement) {
      htmlElement.setAttribute('class', theme);
      htmlElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  return (
    <label className="swap swap-rotate btn btn-square btn-ghost text-white">
      <input onClick={toggleTheme} type="checkbox" />
      <span className="swap-off material-icons">light_mode</span>
      <span className="swap-on material-icons">dark_mode</span>
    </label>
  );
};

export default ThemeToggle;
