// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import * as React from 'react';
import GenericLoadingErrorWrapper from '../components/wrappers/GenericLoadingErrorWrapper';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import CardStatusNested from '../components/cards/CardStatusNested';
import CardContent from '../components/cards/CardContent';
import GraphBoxFinancialLossByAttack from '../components/graphs/GraphBoxFinancialLossByAttack';
import { useAllAttacksData } from '../../app/hooks/useAllAttacksData';
import { useTheme } from '../contexts/useTheme';

type Props = object;
const ViewFinancialLossByAttack: React.FC<Props> = () => {
    const { skeletonBaseColor, skeletonHighlightColor } = useTheme();
    const { allAttacksData, isLoadingAllAttacksData, errorAllAttacksData } = useAllAttacksData();
    return (
        <>
            <div className="flex mb-8 items-center justify-between">
                <GenericLoadingErrorWrapper
                    skeletonTypeProps={{
                        isLoading: false,
                        height: 30,
                        width: 570,
                        count: 1
                    }}
                    data={'Financial Loss by Attack'}
                    error={null}
                    keyIndex={'FinancialSummariesOvervew6'}
                    renderComponent={(content) =>
                        <h2 className="text-3xl inline text-neutralc-800 dark:text-neutralc-200">
                            {content}
                        </h2>
                    } />
            </div>

            <GenericLoadingErrorWrapper
                skeletonTypeProps={{
                    isLoading: isLoadingAllAttacksData,
                    template: (
                        <div className={`card p-4 overflow-hidden`}>
                            <div className='mb-4 flex justify-left'>
                                <h4 className={`text-xl`}>
                                    <Skeleton height={28} width={198} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                                </h4>
                            </div>
                            <div className="grid sm:grid-cols-1 xl:grid-cols-1 gap-4">
                                {[...Array(1)].map((_, index) => (
                                    <Skeleton key={`view-Financial-allAttacksData-${index}`} height={935} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                                ))}
                            </div>
                        </div>
                    )
                }}
                data={allAttacksData}
                error={errorAllAttacksData}
                keyIndex={'view-Financial-allAttacksData'}
                renderComponent={(content) => {
                    return (
                        <CardStatusNested title={'Financial Losses for each precursor attack'} type="normal">
                            <CardContent>
                                <GraphBoxFinancialLossByAttack allAttacksData={content} />
                            </CardContent>
                        </CardStatusNested>
                    )
                }
                } />
        </>
    )
}
export default ViewFinancialLossByAttack;