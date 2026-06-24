// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import { useState, useEffect } from 'react';
import { useGetFinancialLossHistogramQuery } from '../services/allAttacksMetricsDataApi';
import { FinancialLossHistogramData } from '../../src/types';

export const useFinancialLossData = (): { financialLossHistogramData: FinancialLossHistogramData | null, isLoading: boolean, error: any } => {
  const [financialLossHistogramData, setFinancialLossHistogramData] = useState<FinancialLossHistogramData | null>(null);
  const { data: financialLossDataResponse, isLoading, error } = useGetFinancialLossHistogramQuery();

  useEffect(() => {
    if (financialLossDataResponse) {
      setFinancialLossHistogramData({ ...financialLossDataResponse });
    }
  }, [financialLossDataResponse]);

  return {
    financialLossHistogramData,
    isLoading,
    error
  };

};
