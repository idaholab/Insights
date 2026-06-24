// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import * as React from 'react';
import GenericLoadingErrorWrapper from '../components/wrappers/GenericLoadingErrorWrapper';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import CardStatusNested from '../components/cards/CardStatusNested';
//import { useUser } from '../contexts/userContext';
import { useGetParLossesQuery } from '../../app/services/tacticTechniquesStatsApi';
import CardStatus from '../components/cards/CardStatus';
import { useTheme } from '../contexts/useTheme';

type Props = object;
const ViewFinancialSummariesOverview: React.FC<Props> = () => {
    //const { user } = useUser();
    const { skeletonBaseColor, skeletonHighlightColor } = useTheme();
    const { data: parLossesData, isLoading: isLoadingParLosses, error: parLossesError } = useGetParLossesQuery();
    const formatter = Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    return (
        <>
            <div className="flex mb-8 items-center justify-between">
                <GenericLoadingErrorWrapper
                    skeletonTypeProps={{
                        isLoading: isLoadingParLosses,
                        height: 64,
                        width: 570,
                        count: 1
                    }}
                    data={'Financial Summaries Overview'}
                    error={null}
                    keyIndex={'FinancialSummariesOverviewLabel1'}
                    renderComponent={(content) =>
                        <div className='flex flex-col'>
                            <h2 className="text-3xl inline text-neutralc-800 dark:text-neutralc-200">
                                {content}
                            </h2>
                            <h3 className="text-xl text-neutralc-800 dark:text-neutralc-200">
                                Estimated Maximum/Minimum Financial Loss from Public Reported OT Cyber Attack
                            </h3>
                        </div>
                    } />
            </div>

            <GenericLoadingErrorWrapper
                skeletonTypeProps={{
                    isLoading: isLoadingParLosses,
                    template: (
                        <div className={`card p-4 overflow-hidden`}>
                            <div className='mb-4 flex justify-left'>
                                <h4 className={`text-xl`}>
                                    <Skeleton height={28} width={376} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                                </h4>
                            </div>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                {[...Array(4)].map((_, index) => (
                                    <Skeleton key={`skeleton-parLossesLoadingKeyData1-${index}`} height={240} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                                ))}
                            </div>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 ">
                                {[...Array(4)].map((_, index) => (
                                    <Skeleton key={`skeleton-parLossesLoadingKeyData2-${index}`} height={240} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                                ))}
                            </div>
                        </div>
                    )
                }}
                data={parLossesData}
                error={parLossesError}
                keyIndex={'parLossesKeyData1'}
                renderComponent={(content) => {
                    return (
                        <>
                            <CardStatusNested className="mb-4" title={'Financial Analysis of Maximum Financial Loss'} type="normal">
                                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <CardStatus
                                        key={'MaximumMaximumKey1'}
                                        statusNumberLabel={'Maximum Financial Loss in a Cyber-Attack'}
                                        statusNumberValue={formatter.format(content?.Maximum.Maximum ?? 0)}
                                    />
                                    <CardStatus
                                        key={'MaximumAverageKey2'}
                                        statusNumberLabel={'Average Maximum Financial Loss Reported'}
                                        statusNumberValue={formatter.format(content?.Maximum.Average ?? 0)}
                                    />
                                    <CardStatus
                                        key={'MaximumMinimumKey3'}
                                        statusNumberLabel={'Minimum Maximum Financial Loss Reported'}
                                        statusNumberValue={formatter.format(content?.Maximum.Minimum ?? 0)}
                                    />
                                    <CardStatus
                                        key={'MaximumMedianKey4'}
                                        statusNumberLabel={'Median Maximum Financial Loss Reported'}
                                        statusNumberValue={formatter.format(content?.Maximum.Median ?? 0)}
                                    />
                                </div>
                            </CardStatusNested>
                            <CardStatusNested title={'Financial Analysis of Minimum Financial Loss'} type="normal">
                                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <CardStatus
                                        key={'MinimumMinimumKey'}
                                        statusNumberLabel={'Minimum Financial Loss in a Cyber-Attack'}
                                        statusNumberValue={formatter.format(content?.Minimum.Minimum ?? 0)}
                                    />
                                    <CardStatus
                                        key={'MinimumAverageKey'}
                                        statusNumberLabel={'Average Minimum Financial Loss Reported'}
                                        statusNumberValue={formatter.format(content?.Minimum.Average ?? 0)}
                                    />
                                    <CardStatus
                                        key={'MinimumMaximumKey'}
                                        statusNumberLabel={'Maximum Minimum Financial Loss Reported'}
                                        statusNumberValue={formatter.format(content?.Minimum.Maximum ?? 0)}
                                    />
                                    <CardStatus
                                        key={'MinimumMedianKey'}
                                        statusNumberLabel={'Median Minimum Financial Loss Reported'}
                                        statusNumberValue={formatter.format(content?.Minimum.Median ?? 0)}
                                    />
                                </div>
                            </CardStatusNested>
                        </>
                    )
                }
                } />
        </>
    )
}
export default ViewFinancialSummariesOverview;