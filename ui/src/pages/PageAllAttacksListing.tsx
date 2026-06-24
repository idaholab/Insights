// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

// React
import * as React from 'react';

// Custom Components
import LayoutAllAttacksListing from '../layouts/LayoutAllAttacksListing';

type Props = object;

const PageAllAttacksListing: React.FC<Props> = () => {
  return (
    <div className="page-component">
      <LayoutAllAttacksListing />
    </div>
  );
}

export default PageAllAttacksListing;
