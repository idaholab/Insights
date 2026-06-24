// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

// React
import React from 'react';
import 'react-loading-skeleton/dist/skeleton.css'
import { Outlet } from 'react-router-dom';
import PageBanner from '../components/elements/PageBanner';
import { TabLink } from '../types';

type Props = object;
const LayoutAttackChainEstimator: React.FC<Props> = () => {
    const tabLinks: TabLink[] = [

    ];
    return (
        <>
            <PageBanner tabLinks={tabLinks} title='Attack Chain Estimator' subtitle='Shows the probability of attack for MITRE Tactics and Techniques based on input observable event text' isLoading={false} baseRoute='/attack-chain-estimator' />
            <div className="p-10">
                <Outlet />
            </div>
        </>
    );
}
export default LayoutAttackChainEstimator;