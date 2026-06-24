// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

// React
import * as React from 'react';

type Props = {
  isLoading: boolean;
  text: string;
};

const LoaderBounceHeading: React.FC<Props> = ({ isLoading, text }) => {
  return (
    <>
      <div className="h-[40px] flex items-end">
        {isLoading ?
          (
            <span className="loading loading-dots loading-lg h-8"></span>
          ) : (
            <h2 className="text-4xl text-neutralc-800 dark:text-white">
              {text}
            </h2>
          )
        }
      </div>
    </>
  );
}

export default LoaderBounceHeading;
