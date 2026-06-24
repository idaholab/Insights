// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import React from 'react';
import { Link, Outlet, useParams } from 'react-router-dom';
import { useObservablesData } from '../../app/hooks/useObservablesData';
import { useAllAttacksData } from '../../app/hooks/useAllAttacksData';
import PageBanner from '../components/elements/PageBanner';
import { toUrlFriendly } from '../../src/util/urlHelpers';

const LayoutObservables: React.FC = () => {
  const { observablesData, isLoading } = useObservablesData();
  const { allAttacksData } = useAllAttacksData();
  const { caseAlias } = useParams<{ caseAlias: string }>();

  // Get unique case studies with counts
  const caseStudies = React.useMemo(() => {
    if (!observablesData) return [];
    
    const caseMap = new Map<string, { alias: string; name: string; displayName: string; count: number }>();
    
    observablesData.forEach(obs => {
      if (!caseMap.has(obs.case_alias)) {
        const matchedAttack = allAttacksData?.find(
          attack => attack.caseStudyNameShort?.toLowerCase() === obs.case_alias?.toLowerCase()
        );
        caseMap.set(obs.case_alias, {
          alias: obs.case_alias,
          name: obs.case_name,
          displayName: matchedAttack?.caseStudyName ?? obs.case_alias,
          count: 0
        });
      }
      const caseStudy = caseMap.get(obs.case_alias);
      if (caseStudy) {
        caseStudy.count++;
      }
    });
    
    return Array.from(caseMap.values()).sort((a, b) => a.alias.localeCompare(b.alias));
  }, [observablesData, allAttacksData]);

  const viewReportActions = React.useMemo(() => {
    if (!caseAlias) return undefined;
    const matchedAttack = allAttacksData?.find(
      a => a.caseStudyNameShort?.toLowerCase() === caseAlias.toLowerCase()
    );
    return matchedAttack
      ? [{ label: 'View Report', link: `/attack/${toUrlFriendly(matchedAttack.caseStudyNameShort ?? '')}/overview` }]
      : undefined;
  }, [caseAlias, allAttacksData]);

  return (
    <>
      <PageBanner
        isLoading={false}
        title='Observables Database'
        baseRoute='/observables'
        actions={viewReportActions}
      />

      <div className="flex h-full overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 bg-neutralc-200 dark:bg-neutralc-900 overflow-y-auto border-r border-neutralc-300 dark:border-neutralc-800 flex-shrink-0 pb-28">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4 dark:text-neutralc-200">Case Studies ({caseStudies.length})</h3>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              <ul className="menu p-0">
                {caseStudies.map((caseStudy) => {
                  const isActive = caseAlias === caseStudy.alias;
                  return (
                    <li key={caseStudy.alias}>
                      <Link
                        to={`/observables/${caseStudy.alias}`}
                        className={`flex justify-between items-center px-4 py-3 hover:bg-neutralc-300 dark:hover:bg-neutralc-800 ${
                          isActive ? 'bg-neutralc-300 dark:bg-neutralc-800 font-semibold' : ''
                        }`}
                      >
                        <span className="text-sm flex-1">
                          {caseStudy.displayName}
                        </span>
                        <span className="badge badge-secondary badge-sm ml-2">
                          {caseStudy.count}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-28">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default LayoutObservables;
