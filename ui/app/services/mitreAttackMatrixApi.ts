// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type DefaultResponse = Array<{ [key: string]: any; }>

export const mitreAttackMatrixApi = createApi({
  reducerPath: 'mitreAttackMatrix',
  baseQuery: fetchBaseQuery({ baseUrl: process.env?.REACT_APP_INSIGHTS_API_URL }),
  endpoints: (builder) => ({
    getMitreAttackMatrixCategories: builder.query<DefaultResponse, void>({
      query: () => ({
        url: process.env?.REACT_APP_REPORT_DATA_MITRE_CAT_API_URL || '',
      })
    }),

    getMitreAttackMatrixMapping: builder.query<DefaultResponse, void>({
      query: () => ({
        url: process.env?.REACT_APP_REPORT_DATA_MITRE_MAP_API_URL || '',
      })
    }),

    getMitreAttackMatrixTechniques: builder.query<DefaultResponse, void>({
      query: () => ({
        url: process.env?.REACT_APP_REPORT_DATA_MITRE_TEC_API_URL || '',
      })
    }),
  }),
});

export const {
  useGetMitreAttackMatrixCategoriesQuery,
  useGetMitreAttackMatrixMappingQuery,
  useGetMitreAttackMatrixTechniquesQuery
} = mitreAttackMatrixApi;
