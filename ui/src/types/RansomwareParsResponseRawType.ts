// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

export type RansomwareParsResponseRaw = {
  data: {
    findManyCaseStudy: {
      Id: string;
      ShortName: string;
      Year: string;
      CaseStudyTag: { Id: string }[];
    }[];
  };
};
