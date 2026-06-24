// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

export type TacticTechniqueCountsResponseRaw = {
  data: {
    findManyTacticTechniqueIdentifier: {
      MitreTechnique: {
        Name: string;
      };
      MitreTactic: {
        Name: string;
      };
      ObservableTacticAndTechnique: {
        Observable: {
          CaseStudyObservable: {
            CaseStudyId: string;
          }[];
        };
      }[];
    }[];
  };
};
