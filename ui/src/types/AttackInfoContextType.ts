// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import { VM_AllAttackData } from "./VM_AllAttackDataType";

export type AttackInfoContextType = {
    isLoading: boolean;
    allAttacks?: VM_AllAttackData[];
    singleAttack?: any;
    mitreMatrix?: any;
    errorAttacks?: any;
    errorSingleAttack?: any;
    errorMitreMatrix?: any;
}