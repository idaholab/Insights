// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import * as React from 'react';
import { AttackInfoContext } from '../pages/PageSingleAttackAnalysis';
import CardContent from '../components/cards/CardContent';
import GraphBoxFinancialLossByAttack from '../components/graphs/GraphBoxFinancialLossByAttack';
import GraphLengthOfAttackByAttack from '../components/graphs/GraphLengthOfAttackByAttack';
import CardStatusNested from '../components/cards/CardStatusNested';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import GenericLoadingErrorWrapper from '../components/wrappers/GenericLoadingErrorWrapper';
import { useTheme } from '../contexts/useTheme';

type Props = object;
const ViewSingleAttackComparison: React.FC<Props> = () => {
  const { skeletonBaseColor, skeletonHighlightColor } = useTheme();
  const { allAttacks, isLoading, errorAttacks } = React.useContext(AttackInfoContext);
  return (
    <>
      <div className="mb-4">
        <GenericLoadingErrorWrapper
          skeletonTypeProps={{
            isLoading: isLoading,
            height: 48,
            width: 375,
            count: 1
          }}
          data={'Comparison View'}
          error={null}
          keyIndex='ComparisonViewLabel1'
          renderComponent={(content) =>
            <span className="text-3xl text-neutralc-800 dark:text-white ">{content}</span>
          } />
      </div>

      <div className="grid sm:grid-cols-1 gap-4">
        <GenericLoadingErrorWrapper
          skeletonTypeProps={{
            isLoading: isLoading,
            template: (
              <div className={`card p-4 overflow-hidden`}>
                <div className='mb-4 flex justify-left'>
                  <h4 className={`text-xl`}>
                    <Skeleton height={28} width={198} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                  </h4>
                </div>
                <div className="grid sm:grid-cols-1 xl:grid-cols-1 gap-4">
                  {[...Array(1)].map((_, index) => (
                    <Skeleton key={`skeleton-FinancialLossByAttack4-${index}`} height={934} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                  ))}
                </div>
              </div>
            )
          }}
          data={allAttacks}
          error={errorAttacks}
          keyIndex='FinancialLossByAttack2'
          renderComponent={(content: any) => {
            return (
              <CardStatusNested title={'Financial Loss by Attack'} type="normal">
                <CardContent>
                  <GraphBoxFinancialLossByAttack allAttacksData={content} />
                </CardContent>
              </CardStatusNested>
            )
          }
          } />

        <GenericLoadingErrorWrapper
          skeletonTypeProps={{
            isLoading: isLoading,
            template: (
              <div className={`card p-4 overflow-hidden`}>
                <div className='mb-4 flex justify-left'>
                  <h4 className={`text-xl`}>
                    <Skeleton height={28} width={216} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                  </h4>
                </div>
                <div className="grid sm:grid-cols-1 xl:grid-cols-1 gap-4">
                  {[...Array(1)].map((_, index) => (
                    <Skeleton key={`skeleton-LengthOfAttackByAttack4-${index}`} height={934} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                  ))}
                </div>
              </div>
            )
          }}
          data={allAttacks}
          error={errorAttacks}
          keyIndex='LengthOfAttackByAttack6'
          renderComponent={(content: any) => {
            return (
              <CardStatusNested title={'Length of Attack By Attack'} type="normal">
                <CardContent>
                  <GraphLengthOfAttackByAttack allAttacksData={content} barsAreOpaque={false} />
                </CardContent>
              </CardStatusNested>
            )
          }
          } />
      </div>
    </>
  );
}
export default ViewSingleAttackComparison;
