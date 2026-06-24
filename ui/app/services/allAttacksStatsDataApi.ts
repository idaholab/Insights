// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type DefaultResponse = Array<{ [key: string]: any; }>

export const allAttacksStatsDataApi = createApi({
  reducerPath: 'allAttacksStatsData',
  baseQuery: fetchBaseQuery({ baseUrl: process.env?.REACT_APP_ALL_ATTACK_BASE_API_URL }),
  endpoints: (builder) => ({
    getAllAttacksStats: builder.query<DefaultResponse, void>({
      query: () => ({
        url: process.env?.REACT_APP_ALL_ATTACK_STATS_API_URL || '',
      })
    }),
    getAllAttacksTechniques: builder.query<DefaultResponse, void>({
      query: () => ({
        url: process.env?.REACT_APP_ALL_ATTACK_TECH_API_URL || '',
      })
    }),
  }),
});

export const {
  useGetAllAttacksStatsQuery,
  useGetAllAttacksTechniquesQuery
} = allAttacksStatsDataApi;
