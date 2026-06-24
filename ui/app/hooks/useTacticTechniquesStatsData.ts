// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import { useGetTacticTechniqueParCountsQuery, useGetTacticTechniqueObservableCountsQuery, useGetTop5ImpactCountsQuery, useGetRansomwareParsQuery, useGetParLossesQuery } from '../services/tacticTechniquesStatsApi';

export const useTacticTechniquesStatsData = () => {
  const { data: tacticTechniqueParCountsData, isLoading: isLoadingTacticTechniqueParCounts, error: tacticTechniqueParCountsError } = useGetTacticTechniqueParCountsQuery();
  const { data: tacticTechniqueObservableCountsData, isLoading: isLoadingTacticTechniqueObservableCounts, error: tacticTechniqueObservableCountsError } = useGetTacticTechniqueObservableCountsQuery();
  const { data: top5ImpactCountsData, isLoading: isLoadingTop5ImpactCounts, error: top5ImpactCountsError } = useGetTop5ImpactCountsQuery();
  const { data: ransomwareParsData, isLoading: isLoadRansowarePars, error: ransomwareParsError } = useGetRansomwareParsQuery();
  const { data: parLossesData, isLoading: isLoadingParLosses, error: parLossesError } = useGetParLossesQuery();

  return {
    data: {
      tacticTechniqueParCounts: tacticTechniqueParCountsData,
      tacticTechniqueObservableCounts: tacticTechniqueObservableCountsData,
      top5ImpactCounts: top5ImpactCountsData,
      ransomwarePars: ransomwareParsData,
      parLosses: parLossesData
    },
    isLoading: isLoadingTacticTechniqueParCounts || isLoadingTacticTechniqueObservableCounts || isLoadRansowarePars || isLoadingTop5ImpactCounts || isLoadingParLosses,
    error: tacticTechniqueParCountsError || tacticTechniqueObservableCountsError || top5ImpactCountsError || ransomwareParsError || parLossesError
  };
};
