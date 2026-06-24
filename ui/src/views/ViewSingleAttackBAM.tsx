// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

// React
import * as React from 'react';
import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';

// Hooks
import { AttackInfoContext } from '../pages/PageSingleAttackAnalysis';
import { useAttackBamData } from '../../app/hooks/useAttackBamData';

// Custom Components
import CardContent from '../components/cards/CardContent';
import GraphBAMViewHistorical from '../components/graphs/GraphBAMViewHistorical';
import CardStatusNested from '../components/cards/CardStatusNested';
import TableAdversaryAttackObservables from '../components/tables/TableAdversaryAttackObservables';
import GenericLoadingErrorWrapper from '../components/wrappers/GenericLoadingErrorWrapper';

// Types
import { BamAttackResponseType } from '../types';

type Props = object;

const ViewSingleAttackBAM: React.FC<Props> = () => {
    const { allAttacks, isLoading, errorAttacks } = useContext(AttackInfoContext);
    const { reportName } = useParams();
    const [hiddenItems, setHiddenItems] = useState<number[]>([]);

    let bamData: BamAttackResponseType[] = [];

    const formatForURL = (str?: string) => {
        if (!str) return '';
        return str
            .toLowerCase()
            .replace(/[^\w\s]/gi, '') // Remove special characters
            .replace(/ /g, '-'); // Replace spaces with hyphens
    };

    const foundReport = allAttacks?.find(report => formatForURL(report?.caseStudyNameShort) === reportName);
    // Update local state
    const data = useAttackBamData(foundReport?.caseStudyBAMParentId || "");
    if (data && data.attackBamData) {
        bamData = ([...data.attackBamData]);
    }

    return (
        <>
            <div className="mb-4">
                <GenericLoadingErrorWrapper
                    skeletonTypeProps={{
                        isLoading: isLoading,
                        height: 30,
                        count: 1
                    }}
                    data={'Bayesian Attack Model'}
                    error={errorAttacks}
                    keyIndex={''}
                    renderComponent={(content) => <h3 className="text-3xl text-neutralc-800 dark:text-white">
                        {content}
                    </h3>} />
            </div>
            {bamData.length === 0 ? (
                <div className="flex mt-36 justify-center items-center">
                    <div className="bg-gray-700 p-6 rounded-xl text-white">
                        <span>No Bayesian Attack Model data available for this attack</span>
                    </div>
                </div>
            ) : (
                <div className="grid gap-4">
                    <CardStatusNested title={'Analysis of Adversary Behavior by Phase'} type="normal" >
                        <CardContent>
                            <GenericLoadingErrorWrapper
                                skeletonTypeProps={{
                                    isLoading: isLoading,
                                    height: 400,
                                    count: 1
                                }}
                                data={allAttacks}
                                error={errorAttacks}
                                keyIndex={''}
                                renderComponent={(/*content*/) =>
                                    <GraphBAMViewHistorical data={bamData} hiddenItems={hiddenItems} />
                                } />
                        </CardContent>
                    </CardStatusNested>
                    <CardStatusNested title={'Adversary Behavior Observable List'} type="normal" >
                        <CardContent customPadding='p-0'>
                            <GenericLoadingErrorWrapper
                                skeletonTypeProps={{
                                    isLoading: isLoading,
                                    height: 600,
                                    count: 1
                                }}
                                data={allAttacks}
                                error={errorAttacks}
                                keyIndex={''}
                                renderComponent={() =>
                                    <TableAdversaryAttackObservables data={bamData} hiddenItems={hiddenItems} setHiddenItems={setHiddenItems} />
                                } />
                        </CardContent>
                    </CardStatusNested>
                </div>
            )}
        </>
    );
}

export default ViewSingleAttackBAM;
