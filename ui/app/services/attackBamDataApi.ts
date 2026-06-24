// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BamAttackResponseType } from '../../src/types';

export const attackBamDataApi = createApi({
  reducerPath: 'attackBamData',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env?.REACT_APP_INSIGHTS_API_URL,
    prepareHeaders: (headers) => {
      // Add your authorization token to the headers
      headers.set('Authorization', `Bearer ${process.env?.REACT_APP_AUTH_TOKEN_ALT}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAttackBamData: builder.query<BamAttackResponseType[]|undefined, string>({
      query: () => ({
        url: process.env?.REACT_APP_REPORT_BAM||"",
      }),
      transformResponse: (response:{value:[{data: BamAttackResponseType}]},_meta, arg)=>response.value.map(t=>t.data).filter(s=>{
        return arg.trim().length && s.ParentID.startsWith(arg)
      }).sort((a,b)=>a.x-b.x)
    }),
  }),
});


export const { useGetAttackBamDataQuery } = attackBamDataApi