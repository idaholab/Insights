// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

// React
import * as React from 'react';

// Custom Components
import LayoutFinancialSummaries from '../layouts/LayoutFinancialSummaries';

type Props = object;

const PageFinancialSummaries: React.FC<Props> = () => {
  return (
    <div className="page-component">
      <LayoutFinancialSummaries />
    </div>
  );
}

export default PageFinancialSummaries;
