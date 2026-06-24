// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

// React
import * as React from 'react';

type Props = {
  children: any,
  customPadding?: string;
  className?: string;
};

const CardContent: React.FC<Props> = ({ children, customPadding, className }) => {
  return (
    // bg-Light-200 text-neutralc-800 dark:bg-neutralc-700 dark:text-neutralc-200
    <div className={`card ${customPadding || 'p-10'} overflow-hidden flex align-middle card-content ${className}`}>
      {children}
    </div>
  );
};

export default CardContent;
