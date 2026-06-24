// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

export type ParLossesResponseRaw = {
  data: {
    findManyCaseStudy: {
      Id: string;
      LowerBoundLoss: string;
      UpperBoundLoss: string;
    }[];
  };
};
