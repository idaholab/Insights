// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

export type VM_AllAttackData = {
    caseStudyId: string;
    caseStudyName: string;
    caseStudyNameShort?: string;
    caseStudyDesc?: string;
    caseStudyDescTruncated?: string;
    caseStudyBAMParentId?: string;
    caseStudyFinancialLoss?: {
        maxLoss?: number;
        minLoss?: number;
    };
    caseStudyAttackData?: {
        dates?: {
            initialAccess?: string;
            triggerDate?: string;
            triggerYear?: number;
            recovery?: string;
        };
        durations?: {
            precursor?: number;
            recovery?: number;
            total?: number;
        };
        totals?: {
            precursorTechniques?: number;
            icsTechniques?: number;
            observables?: number;
            hpObservables?: number;
            techniqueObservables?: number;
        };
        ransomware: boolean;
        techniques?: any[]; //  need to define the type for `Techniques` 
    };
};