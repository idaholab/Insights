// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import * as React from 'react';
import BarGraphTopTechniques from '../components/graphs/GraphTopTechniques';
import GraphTacticTechniqueFrequency from '../components/graphs/GraphTacTechniqueFrequency';
import GraphCyberThreatYear from '../components/graphs/GraphCyberThreatYear';
import BarGraphTopTechniquePairs from '../components/graphs/GraphTacTechniquePairs';
import CardStatusNested from '../components/cards/CardStatusNested';
import CardContent from '../components/cards/CardContent';
import GraphLengthOfAttackByAttack from '../components/graphs/GraphLengthOfAttackByAttack';
import { useAllAttacksData } from '../../app/hooks/useAllAttacksData';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import GenericLoadingErrorWrapper from '../components/wrappers/GenericLoadingErrorWrapper';
import { useGetRansomwareParsQuery, useGetTacticTechniqueObservableCountsQuery, useGetTacticTechniqueParCountsQuery, useGetTop5ImpactCountsQuery } from '../../app/services/tacticTechniquesStatsApi';
import { useTheme } from '../contexts/useTheme';

type Props = object;
const ViewCyberAttack: React.FC<Props> = () => {
    const { data: ransomwareParsData, isLoading: ransomIsLoading, error: ransomwareParsError } = useGetRansomwareParsQuery();
    const { data: tacticTechniqueObservableCountsData, isLoading: ttObservableCountsIsLoading, error: tacticTechniqueObservableCountsError } = useGetTacticTechniqueObservableCountsQuery();
    const { data: tacticTechniqueParCountsData, isLoading: ttParCountsIsLoading, error: tacticTechniqueParCountsError } = useGetTacticTechniqueParCountsQuery();
    const { data: top5ImpactCountsData, isLoading: top5ImpactCountsIsLoading, error: top5ImpactCountsError } = useGetTop5ImpactCountsQuery();
    const { allAttacksData, isLoadingAllAttacksData, errorAllAttacksData } = useAllAttacksData();
    const { skeletonBaseColor, skeletonHighlightColor } = useTheme();

    return (
        <div className="grid sm:grid-cols-1 gap-4">
            <div className="flex mb-6 items-center justify-between">
                <GenericLoadingErrorWrapper
                    skeletonTypeProps={{
                        isLoading: false,
                        height: 40,
                        width: 377,
                        count: 1,
                    }}
                    data={'Threat Analysis'}
                    error={null}
                    keyIndex={'ThreatAnalysisLabelKey1'}
                    renderComponent={(content) =>
                        <h2 className="text-3xl inline text-neutralc-900 dark:text-neutralc-100">
                            {content}
                        </h2>
                    } />
            </div>


            <GenericLoadingErrorWrapper
                skeletonTypeProps={{
                    isLoading: top5ImpactCountsIsLoading,
                    template: (
                        <div className={`card p-4 overflow-hidden`}>
                            <div className='mb-4 flex justify-left'>
                                <h4 className={`text-xl`}>
                                    <Skeleton height={28} width={198} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                                </h4>
                            </div>
                            <div className="grid sm:grid-cols-1 xl:grid-cols-1 gap-4">
                                {[...Array(1)].map((_, index) => (
                                    <Skeleton key={`skeleton-top5ImpactCountsLoadingData-${index}`} height={200} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                                ))}
                            </div>
                        </div>
                    )
                }}
                data={top5ImpactCountsData}
                error={top5ImpactCountsError}
                keyIndex={'top5ImpactCountsDataKey1'}
                renderComponent={(content) => {
                    return (
                        <CardStatusNested title={'Top Impact Techniques'} type="normal">
                            <div className="grid sm:grid-cols-1 xl:grid-cols-1 gap-4">
                                <CardContent>
                                    <BarGraphTopTechniques chartData={content} />
                                </CardContent>
                            </div>
                        </CardStatusNested>
                    )
                }
                } />

            <GenericLoadingErrorWrapper
                skeletonTypeProps={{
                    isLoading: ttObservableCountsIsLoading,
                    template: (
                        <div className={`card p-4 overflow-hidden`}>
                            <div className='mb-4 flex justify-left'>
                                <h4 className={`text-xl`}>
                                    <Skeleton height={28} width={198} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                                </h4>
                            </div>
                            <div className="grid sm:grid-cols-1 xl:grid-cols-1 gap-4">
                                {[...Array(1)].map((_, index) => (
                                    <Skeleton key={`skeleton-tacticTechniqueObservableCountsLoadingData-${index}`} height={200} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                                ))}
                            </div>
                        </div>
                    )
                }}
                data={tacticTechniqueObservableCountsData}
                error={tacticTechniqueObservableCountsError}
                keyIndex={'tacticTechniqueObservableCountsDataKey1'}
                renderComponent={(content) => {
                    return (
                        <CardStatusNested title={'All Study Cases: Top Tactic & Technique Pairs by Precursor Count'} type="normal">
                            <div className="grid sm:grid-cols-1 xl:grid-cols-1 gap-4">
                                <CardContent>
                                    <BarGraphTopTechniquePairs chartData={content} />
                                </CardContent>
                            </div>
                        </CardStatusNested>
                    )
                }
                } />

            <GenericLoadingErrorWrapper
                skeletonTypeProps={{
                    isLoading: ttParCountsIsLoading,
                    template: (
                        <div className={`card p-4 overflow-hidden`}>
                            <div className='mb-4 flex justify-left'>
                                <h4 className={`text-xl`}>
                                    <Skeleton height={28} width={198} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                                </h4>
                            </div>
                            <div className="grid sm:grid-cols-1 xl:grid-cols-1 gap-4">
                                {[...Array(1)].map((_, index) => (
                                    <Skeleton key={`skeleton-tacticTechniqueParCountsLoadingData-${index}`} height={200} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                                ))}
                            </div>
                        </div>
                    )
                }}
                data={tacticTechniqueParCountsData}
                error={tacticTechniqueParCountsError}
                keyIndex={'tacticTechniqueParCountsDataKey1'}
                renderComponent={(content) => {
                    return (
                        <CardStatusNested title={'Tactic/Technique Occurence Frequency'} type="normal">
                            <div className="grid sm:grid-cols-1 xl:grid-cols-1 gap-4">
                                <CardContent>
                                    <GraphTacticTechniqueFrequency data={content} />
                                </CardContent>
                            </div>
                        </CardStatusNested>
                    )
                }
                } />

            <GenericLoadingErrorWrapper
                skeletonTypeProps={{
                    isLoading: ransomIsLoading,
                    template: (
                        <div className={`card p-4 overflow-hidden`}>
                            <div className='mb-4 flex justify-left'>
                                <h4 className={`text-xl`}>
                                    <Skeleton height={28} width={198} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                                </h4>
                            </div>
                            <div className="grid sm:grid-cols-1 xl:grid-cols-1 gap-4">
                                {[...Array(1)].map((_, index) => (
                                    <Skeleton key={`skeleton-ransomwareParsLoadingData-${index}`} height={200} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                                ))}
                            </div>
                        </div>
                    )
                }}
                data={ransomwareParsData}
                error={ransomwareParsError}
                keyIndex={'ransomwareParsDataKeyIndex1'}
                renderComponent={(content) => {
                    return (
                        <CardStatusNested title={'Cyber Attack Threat Analysis Year of Attack Graph'} type="normal">
                            <div className="grid sm:grid-cols-1 xl:grid-cols-1 gap-4">
                                <CardContent>
                                    <GraphCyberThreatYear data={content} />
                                </CardContent>
                            </div>
                        </CardStatusNested>
                    )
                }
                } />

            <GenericLoadingErrorWrapper
                skeletonTypeProps={{
                    isLoading: isLoadingAllAttacksData,
                    template: (
                        <div className={`card p-4 overflow-hidden`}>
                            <div className='mb-4 flex justify-left'>
                                <h4 className={`text-xl`}>
                                    <Skeleton height={30} width={216} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                                </h4>
                            </div>
                            <div className="grid sm:grid-cols-1 xl:grid-cols-1 gap-4">
                                {[...Array(1)].map((_, index) => (
                                    <Skeleton key={`skeleton-allAttacksLoadingData-${index}`} height={1010} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                                ))}
                            </div>
                        </div>
                    )
                }}
                data={allAttacksData}
                error={errorAllAttacksData}
                keyIndex={'allAttacksDataKeyIndex1'}
                renderComponent={(content) => {
                    return (
                        <CardStatusNested title={'Length of Attack By Attack'} type="normal">
                            <CardContent>
                                <GraphLengthOfAttackByAttack allAttacksData={content} barsAreOpaque={true} />
                            </CardContent>
                        </CardStatusNested>
                    )
                }
                } />
        </div>
    )
}
export default ViewCyberAttack;