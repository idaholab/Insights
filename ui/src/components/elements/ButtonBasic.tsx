// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  label: string;
  type?: 'btn-primary' | 'btn-primary inactive' | 'btn-neutral' | 'btn-ghost';
  link?: string;
  external?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  additionalClasses?: string;
}

const ButtonBasic: React.FC<ButtonProps> = ({ label, type, link, external, onClick, additionalClasses }) => {
  // hover: bg-primary-900
  const baseClasses = `btn ${type} uppercase border-none`;
  const lightModeClasses = type === 'btn-neutral' ? '!border !border-solid !border-primary text-primary hover:text-primary' : '';
  const darkModeClasses = type === 'btn-neutral' ? 'dark:border dark:border-solid dark:!border-neutralc-400 dark:text-neutralc-300 dark:hover:text-white' : '';
  const btnClass = `${baseClasses} ${lightModeClasses} ${darkModeClasses} ${additionalClasses}`;

  if (link && external) {
    return (
      <a className={btnClass} href={link} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    );
  }

  return (
    <>
      {link ? (
        <Link className={btnClass} to={link}>
          {label}
        </Link>
      ) : (
        <button className={btnClass} onClick={onClick}>
          {label}
        </button>
      )}
    </>
  );
};

export default ButtonBasic;
