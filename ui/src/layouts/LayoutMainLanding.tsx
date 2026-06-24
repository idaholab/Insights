// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import React from 'react';
import { Outlet } from 'react-router-dom';
import PageBanner from '../components/elements/PageBanner';
import { TabLink } from '../types';
import Hero from '../components/elements/Hero';

type Props = object;
const LayoutMainLanding: React.FC<Props> = () => {
  // MITRE ATT&CK® Matrix
  const tabLinks: TabLink[] = [
    {
      label: 'Threat Analysis',
      link: 'threat-analysis-overview',
    },
    {
      label: 'Perceived MITRE Techniques',
      link: 'perceived-techniques',
    },
    {
      label: 'Financial Summaries Overview',
      link: 'financial-summaries-overview',
    }
  ]
  return (
    <>
      <div className='pt-10 px-10'>
        <Hero></Hero>
      </div>
      <PageBanner tabLinks={tabLinks} title='Overview' isLoading={false} baseRoute='/overview' />

      <div className="p-10">
        <Outlet />
      </div>
    </>
  );
}
export default LayoutMainLanding;
