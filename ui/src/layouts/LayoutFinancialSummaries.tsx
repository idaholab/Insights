// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

// React
import * as React from 'react';
import 'react-loading-skeleton/dist/skeleton.css'
import PageBanner from '../components/elements/PageBanner';
import { Outlet } from 'react-router-dom';
import { TabLink } from '../types';

type Props = object;
const LayoutFinancialSummaries: React.FC<Props> = () => {
  const tabLinks: TabLink[] = [
    {
      label: 'Financial Summaries',
      link: 'financial-summaries-overview',
    },
    {
      label: 'Financial Loss By Attack',
      link: 'financial-loss-by-attack',
    },
    {
      label: 'Financial Loss By Amount Range',
      link: 'financial-loss-by-amount-range',
    },
  ];
  return (
    <>
      <PageBanner title='Financial Summaries' isLoading={false} tabLinks={tabLinks} baseRoute='/financial-summaries' />
      <div className="p-10">
        <Outlet />
      </div>
    </>
  );
}

export default LayoutFinancialSummaries;
