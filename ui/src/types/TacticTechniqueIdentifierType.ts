// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

export type TacticTechniqueIdentifier = {
    MitreTechnique: {
        Name: string;
    };
    MitreTactic: {
        Name: string;
    };
    ObservableTacticAndTechnique: {
        Observable: {
            CaseStudyObservable: {
                CaseStudyId: number;
            }[];
        };
    }[];
};
