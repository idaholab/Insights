// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  buttonIcon: string;
  buttonSize?: string | undefined;
  color: 'btn-primary' | 'btn-neutral' | 'btn-ghost' | string;
  link?: string;
  altTitle?: string;
  additionalClasses?: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const ButtonIcon: React.FC<ButtonProps> = ({ buttonIcon, buttonSize, color, link, altTitle, additionalClasses, onClick }) => {
  // Define base classes
  const baseClasses = `btn btn-circle ${color} ${buttonSize} ${additionalClasses} uppercase hover:opacity-100 border-transparent`;

  // Define conditional light mode classes
  const lightModeClasses = color === 'btn-neutral' ? 'border border-solid !border-primary text-primary hover:text-primary' : '';
  const btnGhostLightModeClasses = color === 'btn-ghost' ? 'text-primary hover:text-primary ' : '';

  // Define conditional dark mode classes
  const darkModeClasses = color === 'btn-neutral' ? 'dark:border dark:border-solid dark:!border-neutralc-400 dark:text-neutralc-300 dark:hover:text-white' : '';
  const btnGhostDarkModeClasses = color === 'btn-ghost' ? 'dark:text-primary dark:hover:text-primary' : '';

  // Combine base classes and conditional classes
  const btnClass = `${baseClasses} ${lightModeClasses} ${darkModeClasses} ${btnGhostLightModeClasses} ${btnGhostDarkModeClasses}`;

  return (
    <>
      {link ? (
        <Link className={btnClass} to={link} title={altTitle}>
          <span className="material-icons">
            {buttonIcon}
          </span>
        </Link>
      ) : (
        <button className={btnClass} onClick={onClick} title={altTitle}>
          <span className="material-icons">
            {buttonIcon}
          </span>
        </button>
      )}
    </>
  );
};

export default ButtonIcon;
