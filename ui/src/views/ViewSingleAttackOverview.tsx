// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import * as React from 'react';
import { AttackInfoContext } from '../pages/PageSingleAttackAnalysis';
import CardStatus from '../components/cards/CardStatus';
import CardContent from '../components/cards/CardContent';
import CardStatusNested from '../components/cards/CardStatusNested';
import TimelineSvgSingleAttack from '../components/visualizations/TimelineSvgSingleAttack';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import GenericLoadingErrorWrapper from '../components/wrappers/GenericLoadingErrorWrapper';
import { convertDateFormat } from '../util/ConvertDateFormat';
import { useTheme } from '../contexts/useTheme';

type Props = object;

const ViewSingleAttackOverview: React.FC<Props> = () => {
  const { singleAttack, isLoading, errorAttacks } = React.useContext(AttackInfoContext);
  const { skeletonBaseColor, skeletonHighlightColor } = useTheme();
  const convertNumberWithCommas = (x: number) => {
    const roundedNumber = Math.round(x);
    return roundedNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const singleAttackOverview = [
    {
      label: 'Year',
      value: singleAttack?.caseStudyAttackData?.dates?.triggerYear
        ? singleAttack.caseStudyAttackData.dates.triggerYear
        : 'N/A'
    },
    {
      label: 'Ransomware',
      value: singleAttack?.caseStudyAttackData.ransomware !== undefined
        ? (singleAttack?.caseStudyAttackData.ransomware ? 'Yes' : 'No')
        : 'N/A'
    },
    {
      label: 'Reported Loss Minimum',
      value: singleAttack?.caseStudyFinancialLoss.minLoss
        ? `$${convertNumberWithCommas(singleAttack?.caseStudyFinancialLoss.minLoss)}`
        : 'N/A'
    },
    {
      label: 'Reported Loss Maximum',
      value: singleAttack?.caseStudyFinancialLoss.maxLoss
        ? `$${convertNumberWithCommas(singleAttack?.caseStudyFinancialLoss.maxLoss)}`
        : 'N/A'
    }
  ];

  const processedSingleAttackOverview = singleAttackOverview?.reduce((acc, curr) => {
    const foundItem = acc.find(item => item.value === curr.value);
    if (foundItem) {
      foundItem.label = "Reported Loss";
      return acc;
    }
    acc.push(curr);
    return acc;
  }, [] as any[]);

  const singleAttackDayCounts = [
    {
      label: 'Precursor Day Count',
      rawValue: singleAttack?.caseStudyAttackData?.durations?.precursor || 'N/A',
      value: singleAttack?.caseStudyAttackData?.durations?.precursor == null
        ? 'N/A'
        : singleAttack.caseStudyAttackData.durations.precursor < 1
          ? '< 1'
          : singleAttack.caseStudyAttackData.durations.precursor
    },
    {
      label: 'Recovery Day Count',
      rawValue: singleAttack?.caseStudyAttackData?.durations?.recovery || 'N/A',
      value: singleAttack?.caseStudyAttackData?.durations?.recovery == null
        ? 'N/A'
        : singleAttack.caseStudyAttackData.durations.recovery < 1
          ? '< 1'
          : singleAttack.caseStudyAttackData.durations.recovery
    },
    {
      label: 'Total Attack Day Count',
      rawValue: singleAttack?.caseStudyAttackData?.durations?.total || 'N/A',
      value: singleAttack?.caseStudyAttackData?.durations?.total == null
        ? 'N/A'
        : singleAttack.caseStudyAttackData.durations.total < 1
          ? '< 1'
          : singleAttack.caseStudyAttackData.durations.total
    }
  ];

  const singleAttackDates = [
    {
      label: 'Initial Access',
      value: singleAttack?.caseStudyAttackData?.dates?.initialAccess
        ? convertDateFormat(singleAttack.caseStudyAttackData.dates.initialAccess, 'd-LLL-yy')
        : 'N/A',
      textColor: '#4989c8'
    },
    {
      label: 'Triggering Event',
      value: singleAttack?.caseStudyAttackData?.dates?.triggerDate
        ? convertDateFormat(singleAttack.caseStudyAttackData.dates.triggerDate, 'd-LLL-yy')
        : 'N/A',
      textColor: '#ff0000'
    },
    {
      label: 'Recovery',
      value: singleAttack?.caseStudyAttackData?.dates?.recovery
        ? convertDateFormat(singleAttack.caseStudyAttackData.dates.recovery, 'd-LLL-yy')
        : 'N/A',
      textColor: '#166534'
    },
  ];

  const sameDayAttackZeroDays = () => {
    return (
      singleAttack?.caseStudyAttackData.durations.precursor === 0 &&
      singleAttack?.caseStudyAttackData.durations.recovery === 0 &&
      singleAttack?.caseStudyAttackData.durations.total === 0
    );
  }

  const attackTotals = [
    {
      label: 'MITRE ATT&CK® for ICS Techniques',
      value: singleAttack?.caseStudyAttackData.totals.icsTechniques
    },
    {
      label: 'Technique Observables',
      value: singleAttack?.caseStudyAttackData.totals.techniqueObservables
    }
  ]

  const precursorTechniqueInformation = [
    {
      label: 'Precursor Techniques',
      value: singleAttack?.caseStudyAttackData.totals.precursorTechniques
    },
    {
      label: 'Total Observables',
      value: singleAttack?.caseStudyAttackData.totals.observables
    },
    {
      label: 'Highly Perceivable Observables',
      value: singleAttack?.caseStudyAttackData.totals.hpObservables
    }
  ]

  return (
    <>
      <div className="mb-4">
        <GenericLoadingErrorWrapper
          skeletonTypeProps={{
            isLoading: isLoading,
            height: 36,
            count: 1
          }}
          data={'Overview'}
          error={null}
          keyIndex='Overview1'
          renderComponent={(content) =>
            <span className="text-3xl text-neutralc-800 dark:text-white ">{content}</span>
          } />
      </div>

      <div className="grid sm:grid-cols-1 gap-y-4">
        <div className="grid sm:grid-cols-1 2xl:grid-cols-[3fr_2fr] gap-4">
          <GenericLoadingErrorWrapper
            skeletonTypeProps={{
              isLoading: isLoading,
              template: (
                <div className={`card p-4 overflow-hidden`}>
                  <div className='mb-4 flex justify-left'>
                    <h4 className={`text-xl`}>
                      <Skeleton height={28} width={276} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                    </h4>
                  </div>
                  <div className="grid sm:grid-cols-1 xl:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, index) => (
                      <Skeleton key={`skeleton-${index}`} height={240} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                    ))}
                  </div>
                </div>
              )
            }}
            data={precursorTechniqueInformation}
            error={errorAttacks}
            keyIndex={'0'}
            renderComponent={(content) => {
              return (
                <CardStatusNested title={'Precursor Technique Information'} type="normal">
                  <div className="grid sm:grid-cols-1 xl:grid-cols-3 gap-4">
                    {content?.map((object: any, index: number) => {
                      return (
                        <CardStatus
                          key={index}
                          statusNumberLabel={object.label}
                          statusNumberValue={object.value}
                        />
                      )
                    })
                    }
                  </div>
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
                      <Skeleton height={28} width={106} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                    </h4>
                  </div>
                  <div className="grid sm:grid-cols-1 xl:grid-cols-2 gap-4">
                    {[...Array(2)].map((_, index) => (
                      <Skeleton key={`skeleton-${index}`} height={240} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                    ))}
                  </div>
                </div>
              )
            }}
            data={attackTotals}
            error={errorAttacks}
            keyIndex={'0'}
            renderComponent={(content) => {
              return (
                <CardStatusNested title={'Attack Totals'} type="normal" >
                  <div className="grid sm:grid-cols-1 xl:grid-cols-2 gap-4">
                    {content?.map((object: any, index: number) => {
                      return (
                        <CardStatus
                          key={index}
                          statusNumberLabel={object.label}
                          statusNumberValue={object.value}
                        />
                      )
                    })
                    }
                  </div>
                </CardStatusNested>
              )
            }
            } />
        </div >

        <GenericLoadingErrorWrapper
          skeletonTypeProps={{
            isLoading: isLoading,
            template: (
              <div className={`card p-4 overflow-hidden`}>
                <div className='mb-4 flex justify-left'>
                  <h4 className={`text-xl`}>
                    <Skeleton height={28} width={150} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                  </h4>
                </div>
                <div className="grid sm:grid-cols-1 xl:grid-cols-1 gap-4">
                  {[...Array(1)].map((_, index) => (
                    <Skeleton key={`skeleton-SingleAttackDates1-${index}`} height={360} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                  ))}
                </div>
              </div>
            )
          }}
          data={singleAttackDates}
          error={errorAttacks}
          keyIndex='TimelineOfAttack'
          renderComponent={(content) => {
            return (
              <>
                {!sameDayAttackZeroDays() &&
                  <CardStatusNested className="col-span-12" title={'Timeline of Attack'} type="normal">
                    {isLoading ? <Skeleton height={300} count={1} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor}></Skeleton> :
                      <div className="grid sm:grid-cols-1 gap-4">

                        <CardContent>
                          <div className="flex flex-grow items-center justify-center">
                            {content && content.some((item: any) => item.value !== 'N/A') ?
                              <TimelineSvgSingleAttack
                                dates={content}
                                dayCounts={singleAttackDayCounts.map(item => ({ ...item, value: item.rawValue }))}
                              />
                              :
                              <div key={"no-data-TimelineOfAttack"} role="alert" className="alert alert-info bg-accent-100 border-accent-100 dark:bg-accent-500 dark:border-accent-500">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  className="h-6 w-6 shrink-0 stroke-current">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>This attack has no timeline.</span>
                              </div>
                            }
                          </div>
                        </CardContent>
                      </div>
                    }
                  </CardStatusNested>
                }
              </>
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
                    <Skeleton height={28} width={100} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                  </h4>
                </div>
                <div className="grid sm:grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
                  {[...Array(2)].map((_, index) => (
                    <Skeleton key={`skeleton-singleAttackDayCounts1-${index}`} height={240} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                  ))}
                </div>
                <div className="grid sm:grid-cols-1 xl:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, index) => (
                    <Skeleton key={`skeleton-singleAttackDayCounts2-${index}`} height={240} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                  ))}
                </div>
              </div>
            )
          }}
          data={singleAttackDayCounts}
          error={errorAttacks}
          keyIndex='singleAttackDayCounts'
          renderComponent={(content) => {
            return (
              <CardStatusNested className="col-span-12" title={'Information'} type="normal">
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-1 xl:grid-cols-3 gap-4 relative">
                    {content?.map((object: any, index: number) => {
                      return (
                        <CardStatus
                          key={index}
                          statusNumberLabel={object.label}
                          statusNumberValue={object.value}
                          textColor={object.textColor}
                        />
                      )
                    })}
                  </div>
                  {processedSingleAttackOverview?.length === 4 &&
                    <div className={`grid grid-cols-4 gap-4`}>
                      {processedSingleAttackOverview?.map((object: any, index: number) => {
                        return (
                          <CardStatus
                            key={index}
                            statusNumberLabel={object.label}
                            statusNumberValue={object.value}
                          />
                        )
                      })}
                    </div>
                  }
                  {processedSingleAttackOverview?.length === 3 &&
                    <div className={`grid grid-cols-3 gap-4`}>
                      {processedSingleAttackOverview?.map((object: any, index: number) => {
                        return (
                          <CardStatus
                            key={index}
                            statusNumberLabel={object.label}
                            statusNumberValue={object.value}
                          />
                        )
                      })}
                    </div>
                  }
                </div>
              </CardStatusNested>
            )
          }
          } />
      </div>
    </>
  );
}

export default ViewSingleAttackOverview;
