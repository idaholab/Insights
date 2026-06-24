// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import React, { useState } from 'react';
import GenericLoadingErrorWrapper from '../components/wrappers/GenericLoadingErrorWrapper';
import CardStatusNested from '../components/cards/CardStatusNested';
import { useAppSelector } from '../../app/hooks/reduxTypescriptHooks';
import { useMitreMatrixData } from '../../app/hooks/useMitreMatrixData';
import CardSimpleAttackName from '../components/cards/CardSimpleAttackName';
import { SimpleModal } from '../components/modals/SimpleModal';
import Skeleton from 'react-loading-skeleton';
import CardStatus from '../components/cards/CardStatus';
import { useTheme } from '../contexts/useTheme';

type Props = object;
const ViewMitreAttackMatrixOverview: React.FC<Props> = () => {
    const { skeletonBaseColor, skeletonHighlightColor } = useTheme();
    const { mitreAttackMatrixData, isLoading, error: errorMitreMatrix } = useMitreMatrixData();
    const observedAttackTechniqueList: Array<{ [key: string]: any; }> = useAppSelector((state: any) => state.appState.cyoteFullObservedTechniqueList);
    const [selectedTechnique, setSelectedTechnique] = useState<string | undefined>(undefined);
    const [selectedTechniqueDescription, setSelectedTechniqueDescription] = useState<string | undefined>(undefined);
    const overviewNumbers: Array<{ [key: string]: any; }> = useAppSelector((state: any) => state.appState.overviewNumbers);

    function handleModalClose() {
        setSelectedTechnique(undefined);
    }
    return (
        <>
            <>
                {/* Total Perceived Observables */}
                <div className="flex mb-8 items-center justify-between">
                    <GenericLoadingErrorWrapper
                        skeletonTypeProps={{
                            isLoading: false,
                            height: 30,
                            width: 570,
                            count: 1
                        }}
                        data={'Perceived MITRE Techniques'}
                        error={null}
                        keyIndex={'LayoutMainLanding6'}
                        renderComponent={(content) =>
                            <h2 className="text-3xl inline text-neutralc-800 dark:text-neutralc-200">
                                {content}
                            </h2>
                        } />
                </div>

                <div className="grid sm:grid-cols-1 2xl:grid-cols-1 gap-4 mb-8">
                    <GenericLoadingErrorWrapper
                        skeletonTypeProps={{
                            isLoading: false,
                            template: (
                                <div className={`card p-4 overflow-hidden`}>
                                    <div className='mb-4 flex justify-left'>
                                        <h4 className={`text-xl`}>
                                            <Skeleton height={30} width={290} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                                        </h4>
                                    </div>
                                    <div className="grid sm:grid-cols-1 xl:grid-cols-2 gap-4">
                                        {[...Array(2)].map((_, index) => (
                                            <Skeleton key={`skeleton-LayoutMainLanding7-${index}`} height={240} baseColor={skeletonBaseColor} highlightColor={skeletonHighlightColor} />
                                        ))}
                                    </div>
                                </div>
                            )
                        }}
                        data={overviewNumbers}
                        error={null}
                        keyIndex={'LayoutMainLanding7'}
                        renderComponent={(content) =>
                            <CardStatusNested title={content[4]?.title} type="normal">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {content[4]?.data.map((object: any, index: number) => {
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

            <div className="flex mb-8 items-center justify-between">
                <GenericLoadingErrorWrapper
                    skeletonTypeProps={{
                        isLoading: isLoading,
                        height: 30,
                        width: 570,
                        count: 1
                    }}
                    data={'MITRE ATT&CK® Matrix - Total Perceived Techniques'}
                    error={null}
                    keyIndex={'LayoutMainLanding6'}
                    renderComponent={(content) =>
                        <h2 className="text-3xl inline text-neutralc-800 dark:text-neutralc-200">
                            {content}
                        </h2>
                    } />
            </div>

            <div className="flex">
                <GenericLoadingErrorWrapper
                    skeletonTypeProps={{
                        isLoading: isLoading,
                        height: 1032,
                    }}
                    data={mitreAttackMatrixData}
                    error={errorMitreMatrix}
                    keyIndex={'LayoutMainLanding6'}
                    renderComponent={(content) => {
                        return (
                            <>
                                {content?.map((techniqueCategory: any, index: number) => (
                                    <CardStatusNested
                                        key={`techniqueCategory-${index}-${techniqueCategory.tactic.MITRE_TacticName}`}
                                        title={techniqueCategory.tactic.MITRE_TacticName}
                                        className="w-1/12 h-fit mx-1 overflow-visible mb-8"
                                        type="mitre-col"
                                        titleAlignment="center">
                                        <div className="grid sm:grid-cols-1 gap-2">
                                            {techniqueCategory.techniques.map((technique: any, idx: number) => {
                                                const isAttack = observedAttackTechniqueList?.some((observed: any) => {
                                                    return observed.techniques.includes(technique.MITRE_TechniqueName);
                                                });
                                                const techniqueTitle = technique.MITRE_TechniqueName + ' (' + technique.MITRE_Id + ')'
                                                return (
                                                    <div key={technique.MITRE_Id || 'technique-' + technique.MITRE_TechniqueId} className="relative">
                                                        <CardSimpleAttackName
                                                            key={idx + technique.MITRE_Id}
                                                            title={technique.MITRE_TechniqueName}
                                                            disabled={!isAttack}
                                                            isMultiple={false}
                                                            isFiltered={false}
                                                            onClick={() => { setSelectedTechnique(techniqueTitle); setSelectedTechniqueDescription(technique.MITRE_TechniqueDescription) }}
                                                        />
                                                    </div>
                                                );
                                            })
                                            }
                                        </div>
                                    </CardStatusNested>
                                ))
                                }
                            </>
                        )
                    }}
                />
            </div>

            <SimpleModal isOpen={selectedTechnique !== undefined} onCloseClick={handleModalClose} title={selectedTechnique} content={selectedTechniqueDescription}></SimpleModal>
        </>
    )
}
export default ViewMitreAttackMatrixOverview;