// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

// React
import * as React from 'react';

// Custom Components
import LayoutMainLanding from '../layouts/LayoutMainLanding';

type Props = object;

const PageMainLanding: React.FC<Props> = () => {
  return (
    <div className="page-component">
      <LayoutMainLanding />
    </div>
  );
}

export default PageMainLanding;
