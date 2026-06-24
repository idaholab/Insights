// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import * as React from 'react';
import GenericLoadingErrorWrapper from '../components/wrappers/GenericLoadingErrorWrapper';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import CardStatusNested from '../components/cards/CardStatusNested';
import CardStatus from '../components/cards/CardStatus';
import { useAppSelector } from '../../app/hooks/reduxTypescriptHooks';
import { useTheme } from '../contexts/useTheme';

type Props = object;
const ViewThreatAnalysisOverview: React.FC<Props> = () => {
    const { skeletonBaseColor, skeletonHighlightColor } = useTheme();
    const overviewNumbers: Array<{ [key: string]: any; }> = useAppSelector((state: any) => state.appState.overviewNumbers);
    return (
        <>
            <div className="flex mb-8 items-center justify-between">
                <GenericLoadingErrorWrapper
                    skeletonTypeProps={{
                        isLoading: false,
                        height: 40,
                        width: 377,
                        count: 1,
                    }}
                    data={'Threat Analysis Overview'}
                    error={null}
                    keyIndex={'LayoutMainLanding1'}
                    renderComponent={(content) =>
                        <h2 className="text-3xl inline text-neutralc-900 dark:text-neutralc-100">
                            {content}
                        </h2>
                    } />
            </div>

            <div className="grid sm:grid-cols-1 2xl:grid-cols-[2fr_3fr] gap-4 mb-4">
                <GenericLoadingErrorWrapper
                    skeletonTypeProps={{
                        isLoading: false,
                        template: (
                            <div className={`card p-4 overflow-hidden`}>
                                <div className='mb-4 flex justify-left'>
                                    <h4 className={`text-xl`}>
                                        <Skeleton height={30} width={184} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                                    </h4>
                                </div>
                                <div className="grid sm:grid-cols-1 xl:grid-cols-2 gap-4">
                                    {[...Array(2)].map((_, index) => (
                                        <Skeleton key={`skeleton-LayoutMainLanding2-${index}`} height={240} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                                    ))}
                                </div>
                            </div>
                        )
                    }}
                    data={overviewNumbers}
                    error={null}
                    keyIndex={'ViewThreatAnalysis2-overviewNumbers'}
                    renderComponent={(content) =>
                        <CardStatusNested title={content[0]?.title} type="normal">
                            <div className="grid sm:grid-cols-2 gap-4">
                                {content[0]?.data.map((object: any, index: number) => {
                                    return (
                                        <CardStatus
                                            key={index}
                                            statusNumberLabel={object.label}
                                            statusNumberValue={object.value}
                                        />
                                    )
                                })}
                            </div>
                        </CardStatusNested>
                    }
                />

                <GenericLoadingErrorWrapper
                    skeletonTypeProps={{
                        isLoading: false,
                        template: (
                            <div className={`card p-4 overflow-hidden`}>
                                <div className='mb-4 flex justify-left'>
                                    <h4 className={`text-xl`}>
                                        <Skeleton height={30} width={184} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                                    </h4>
                                </div>
                                <div className="grid sm:grid-cols-1 xl:grid-cols-3 gap-4">
                                    {[...Array(3)].map((_, index) => (
                                        <Skeleton key={`skeleton-LayoutMainLanding3-${index}`} height={240} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                                    ))}
                                </div>
                            </div>
                        )
                    }}
                    data={overviewNumbers}
                    error={null}
                    keyIndex={'LayoutMainLanding3'}
                    renderComponent={(content) =>
                        <CardStatusNested title={content[1]?.title} type="normal">
                            <div className="grid sm:grid-cols-3 gap-4">
                                {content[1]?.data.map((object: any, index: number) => {
                                    return (
                                        <CardStatus
                                            key={index}
                                            statusNumberLabel={object.label}
                                            statusNumberValue={object.value}
                                        />
                                    )
                                })}
                            </div>
                        </CardStatusNested>
                    }
                />
            </div>

            <div className="grid sm:grid-cols-1 2xl:grid-cols-[2fr_2fr] gap-4 mb-8">
                <GenericLoadingErrorWrapper
                    skeletonTypeProps={{
                        isLoading: false,
                        template: (
                            <div className={`card p-4 overflow-hidden`}>
                                <div className='mb-4 flex justify-left'>
                                    <h4 className={`text-xl`}>
                                        <Skeleton height={30} width={184} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                                    </h4>
                                </div>
                                <div className="grid sm:grid-cols-1 xl:grid-cols-2 gap-4">
                                    {[...Array(2)].map((_, index) => (
                                        <Skeleton key={`skeleton-LayoutMainLanding4-${index}`} height={240} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                                    ))}
                                </div>
                            </div>
                        )
                    }}
                    data={overviewNumbers}
                    error={null}
                    keyIndex={'LayoutMainLanding4'}
                    renderComponent={(content) =>
                        <CardStatusNested title={content[2]?.title} type="normal" >
                            <div className="grid sm:grid-cols-2 gap-4">
                                {content[2]?.data.map((object: any, index: number) => {
                                    return (
                                        <CardStatus
                                            key={index}
                                            statusNumberLabel={object.label}
                                            statusNumberValue={object.value}
                                        />
                                    )
                                })}
                            </div>
                        </CardStatusNested>
                    }
                />

                <GenericLoadingErrorWrapper
                    skeletonTypeProps={{
                        isLoading: false,
                        template: (
                            <div className={`card p-4 overflow-hidden`}>
                                <div className='mb-4 flex justify-left'>
                                    <h4 className={`text-xl`}>
                                        <Skeleton height={30} width={116} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                                    </h4>
                                </div>
                                <div className="grid sm:grid-cols-1 xl:grid-cols-2 gap-4">
                                    {[...Array(2)].map((_, index) => (
                                        <Skeleton key={`skeleton-LayoutMainLanding5-${index}`} height={240} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                                    ))}
                                </div>
                            </div>
                        )
                    }}
                    data={overviewNumbers}
                    error={null}
                    keyIndex={'LayoutMainLanding5'}
                    renderComponent={(content) =>
                        <CardStatusNested title={content[3]?.title} type="normal">
                            <div className="grid sm:grid-cols-2 gap-4">
                                {content[3]?.data.map((object: any, index: number) => {
                                    return (
                                        <CardStatus
                                            key={index}
                                            statusNumberLabel={object.label}
                                            statusNumberValue={object.value}
                                        />
                                    )
                                })}
                            </div>
                        </CardStatusNested>
                    }
                />
            </div>
        </>
    )
}
export default ViewThreatAnalysisOverview;