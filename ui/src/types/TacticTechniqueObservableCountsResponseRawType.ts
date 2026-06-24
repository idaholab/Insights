// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

export type TacticTechniqueObservableCountsResponseRaw = {
  data: {
    findManyTacticTechniqueIdentifier: {
      MitreTechnique: {
        Name: string;
      };
      MitreTactic: {
        Name: string;
      };
      ObservableTacticAndTechnique: {
        ObservableId: string;
      }[];
    }[];
  };
};
