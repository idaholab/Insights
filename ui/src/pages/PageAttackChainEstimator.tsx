// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import * as React from 'react';
import LayoutAttackChainEstimator from '../layouts/LayoutAttackChainEstimator';

type Props = object;

const PageAttackChainEstimator: React.FC<Props> = () => {
    return (
        <div className="page-component">
            <LayoutAttackChainEstimator />
        </div>
    );
}

export default PageAttackChainEstimator;
