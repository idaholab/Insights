// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import * as React from 'react';
import GenericLoadingErrorWrapper from '../components/wrappers/GenericLoadingErrorWrapper';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import CardStatusNested from '../components/cards/CardStatusNested';
import CardContent from '../components/cards/CardContent';
import { useFinancialLossData } from '../../app/hooks/useFinancialLossData';
import GraphFinancialLossHistogram from '../components/graphs/GraphFinancialLossHistogram';
import ButtonIcon from '../components/elements/ButtonIcon';
import { useState } from 'react';
import { SimpleModal } from '../components/modals/SimpleModal';
import { useAppSelector } from '../../app/hooks/reduxTypescriptHooks';
import parse from 'html-react-parser';
import { useTheme } from '../contexts/useTheme';

type Props = object;
const ViewFinancialLossByAmountRange: React.FC<Props> = () => {
    const { skeletonBaseColor, skeletonHighlightColor } = useTheme();
    const { financialLossHistogramData, isLoading: histogramIsLoading, error: histogramError } = useFinancialLossData();
    const userHelp = useAppSelector((state) => state.appState.helpTopics);

    const [modals, setModals] = useState({
        financialLoss: false
    });

    const handleModalOpen = (modalName: string) => {
        setModals((prevModals) => ({
            ...prevModals,
            [modalName]: true,
        }));
    };

    const handleModalClose = (modalName: string) => {
        setModals((prevModals) => ({
            ...prevModals,
            [modalName]: false,
        }));
    };

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
                    data={'Financial Loss by Amount Range'}
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
                    isLoading: histogramIsLoading,
                    template: (
                        <div className={`card p-4 overflow-hidden`}>
                            <div className='mb-4 flex justify-left'>
                                <h4 className={`text-xl`}>
                                    <Skeleton height={28} width={269} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                                </h4>
                            </div>
                            <div className="grid sm:grid-cols-1 xl:grid-cols-1 gap-4">
                                {[...Array(1)].map((_, index) => (
                                    <Skeleton key={`skeleton-financialLossHistogramData1-${index}`} height={935} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                                ))}
                            </div>
                        </div>
                    )
                }}
                data={financialLossHistogramData}
                error={histogramError}
                keyIndex={''}
                renderComponent={(content) => {
                    return (
                        <CardStatusNested title={'Financial losses by a range of dollar amounts'} type="normal">
                            <div className="absolute right-3">
                                <ButtonIcon buttonIcon="info" color="btn-ghost" buttonSize="btn-sm" additionalClasses='dark:hover:text-primary-100 hover:text-primary-900' altTitle={`${userHelp.financialLossByAmountRange.title}`} onClick={() => handleModalOpen('financialLoss')} />
                            </div>
                            <CardContent>
                                <GraphFinancialLossHistogram financialLossHistogramData={content} />
                            </CardContent>
                        </CardStatusNested>
                    )
                }
                } />
            <SimpleModal
                isOpen={modals.financialLoss}
                onCloseClick={() => handleModalClose('financialLoss')}
                title={`${userHelp.financialLossByAmountRange.dialogTitle}`}
                content={parse(userHelp.financialLossByAmountRange.dialogText)}
            />
        </>
    )
}
export default ViewFinancialLossByAmountRange;