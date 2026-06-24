// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

// React
import * as React from 'react';

type Props = {
  size: string
};

const LoaderRingsGeneral: React.FC<Props> = ({size}) => {
  return (
    <>
      <span className="loading loading-ring" style={{width: `${size}px`}}></span>
    </>
  );
}

export default LoaderRingsGeneral;
