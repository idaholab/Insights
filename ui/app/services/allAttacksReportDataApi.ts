// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type DefaultResponse = Array<{ [key: string]: any; }>

export const allAttacksReportDataApi = createApi({
  reducerPath: 'allAttacksReportData',
  baseQuery: fetchBaseQuery({ baseUrl: process.env?.REACT_APP_INSIGHTS_API_URL }),
  endpoints: (builder) => ({
    getAllAttacksReportMain: builder.query<DefaultResponse, void>({
      query: () => ({
        url: process.env?.REACT_APP_REPORT_DATA_MAIN_API_URL || '',
      })
    }),
    getAllAttacksReportTechniques: builder.query<DefaultResponse, void>({
      query: () => ({
        url: process.env?.REACT_APP_REPORT_DATA_TEC_API_URL || '',
      })
    }),
    getAllAttacksReportTechniquesTiming: builder.query<DefaultResponse, void>({
      query: () => ({
        url: process.env?.REACT_APP_REPORT_DATA_TEC_TIMING_API_URL || '',
      })
    }),
  }),
});

export const {
  useGetAllAttacksReportMainQuery,
  useGetAllAttacksReportTechniquesQuery,
  useGetAllAttacksReportTechniquesTimingQuery,
} = allAttacksReportDataApi;
