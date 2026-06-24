// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { FinancialLossHistogramData } from '../../src/types';

type DefaultResponse = Array<{ [key: string]: any; }>

export const allAttacksMetricsDataApi = createApi({
  reducerPath: 'allAttacksMetricsData',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env?.REACT_APP_INSIGHTS_API_URL,
    prepareHeaders: (headers) => {
      // Add your authorization token to the headers
      headers.set('Authorization', `Bearer ${process.env?.REACT_APP_AUTH_TOKEN}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAllAttacksMetrics: builder.query<DefaultResponse, void>({
      query: () => ({
        url: process.env?.REACT_APP_ALL_ATTACKS_METRICS_API_URL || '',
      })
    }),
    getFinancialLossHistogram: builder.query<FinancialLossHistogramData, void>({
      query: () => ({
        url: process.env?.REACT_APP_FINANCIAL_LOSS_HISTOGRAM || '',
      })
    }),
  }),
});

export const {
  useGetAllAttacksMetricsQuery,
  useGetFinancialLossHistogramQuery
} = allAttacksMetricsDataApi;
