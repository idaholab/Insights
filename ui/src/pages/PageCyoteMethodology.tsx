// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

// React
import * as React from 'react';

// Custom Components
import LayoutCyoteMethodology from '../layouts/LayoutCyoteMethodology';

type Props = object;

const PageCyoteMethodology: React.FC<Props> = () => {
  return (
    <div className="page-component">
      <LayoutCyoteMethodology />
    </div>
  );
}

export default PageCyoteMethodology;
