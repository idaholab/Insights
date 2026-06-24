// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

export type AttackResponse =
    {
        CaseStudyId: string,
        CaseStudyName: string,
        CaseStudyDescription?: string,
        UpperBoundLoss?: string,
        LowerBoundLoss?: string,
        Year?: string,
        ShortName?: string
    }