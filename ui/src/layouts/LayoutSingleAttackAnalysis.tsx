// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

// React
import React from 'react';
import { Outlet } from 'react-router-dom';
import 'react-loading-skeleton/dist/skeleton.css'
import { AttackInfoContext } from '../pages/PageSingleAttackAnalysis';
import PageBanner from '../components/elements/PageBanner';
import { TabLink } from '../types';
import GenericLoadingErrorWrapper from '../components/wrappers/GenericLoadingErrorWrapper';
import { toUrlFriendly } from '../../src/util/urlHelpers';

const LayoutSingleAnalysis: React.FC = () => {
  const { singleAttack, errorAttacks, isLoading } = React.useContext(AttackInfoContext);
  const observablesLink = singleAttack?.caseStudyNameShort
    ? `/observables/${toUrlFriendly(singleAttack.caseStudyNameShort)}`
    : undefined;
  // PDFs are served as static files from the API at /store/reports/<ShortName>.pdf
  const reportPdfLink = singleAttack?.caseStudyNameShort
    ? `${process.env.REACT_APP_INSIGHTS_API_URL}/store/reports/${singleAttack.caseStudyNameShort}.pdf`
    : undefined;
  const actions = [
    ...(observablesLink ? [{ label: 'View Observables', link: observablesLink }] : []),
    ...(reportPdfLink ? [{ label: 'View PDF Report', link: reportPdfLink, external: true }] : []),
  ];
  const tabLinks: TabLink[] = [
    {
      label: 'Overview',
      link: 'overview',
    },
    {
      label: 'Technical View',
      link: 'technical',
    },
    {
      label: 'Comparison View',
      link: 'comparison',
    },
    {
      label: 'Bayesian Attack Model',
      link: 'bam',
    }
  ]
  return (
    <>
      <GenericLoadingErrorWrapper
        skeletonTypeProps={{
          isLoading: isLoading,
          height: 36,
          count: 1
        }}
        keyIndex={'singleAttack-caseStudyName'}
        data={singleAttack?.caseStudyName}
        error={errorAttacks}
        renderComponent={(content) =>
          <PageBanner
          isLoading={false}
          preTitle='Precursor Attack:'
          title={content}
          baseRoute='/single-attack-analysis'
          tabLinks={tabLinks}
          actions={actions.length ? actions : undefined}
        />
        } />

      <div className="p-10">
        <Outlet />
      </div>
    </>
  );
}
export default LayoutSingleAnalysis;
