// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ParLossesResponse, ParLossesResponseRaw, RansomwareParsResponse, RansomwareParsResponseRaw, TacticTechniqueCountsResponse, TacticTechniqueCountsResponseRaw, TacticTechniqueObservableCountsResponseRaw } from '../../src/types';

export const tacticTechniquesStatsApi = createApi({
  reducerPath: 'tacticTechniquesStats',
  baseQuery: fetchBaseQuery({ baseUrl: process.env?.REACT_APP_INSIGHTS_API_URL || '' }),
  endpoints: (builder) => ({
    //Tactic/Technique Occurence Frequency
    getTacticTechniqueParCounts: builder.query<TacticTechniqueCountsResponse[], void>({
      query: () => ({
        url: process.env?.REACT_APP_PAR_COUNTS_API_URL || ''
      }),
      transformResponse: (response: TacticTechniqueCountsResponseRaw) => response?.data?.findManyTacticTechniqueIdentifier.map(t => ({ technique: t.MitreTechnique.Name, tactic: t.MitreTactic.Name, count: t.ObservableTacticAndTechnique.flatMap(t => t.Observable.CaseStudyObservable.map(t => t.CaseStudyId)).filter((v, i, a) => (a.indexOf(v) === i)).length })).sort((a, b) => b.count - a.count),
    }),
    getTop5ImpactCounts: builder.query<TacticTechniqueCountsResponse[], void>({
      query: () => ({
        url: process.env?.REACT_APP_TOP_5_IMPACT_COUNTS_API_URL || ''
      }),
      transformResponse: (response: TacticTechniqueCountsResponseRaw) => response?.data?.findManyTacticTechniqueIdentifier.map(t => ({ technique: t.MitreTechnique.Name, tactic: t.MitreTactic.Name, count: t.ObservableTacticAndTechnique.flatMap(t => t.Observable.CaseStudyObservable.map(t => t.CaseStudyId)).filter((v, i, a) => (a.indexOf(v) === i)).length })).sort((a, b) => a.count - b.count),//.slice(0,5),
    }),
    getRansomwarePars: builder.query<RansomwareParsResponse[], void>({
      query: () => ({
        url: process.env?.REACT_APP_RANSOMWARE_PARS_API_URL  || ''
      }),
      transformResponse: (response: RansomwareParsResponseRaw) => response?.data?.findManyCaseStudy?.map(t => ({ CaseStudy: t.ShortName, Year: parseInt(t.Year), IsRansomware: t.CaseStudyTag.length > 0 })),
    }),

    // All Study Cases: Top Tactic & Technique Pairs by Precursor Count
    getTacticTechniqueObservableCounts: builder.query<TacticTechniqueCountsResponse[], void>({
      query: () => ({
        url: process.env?.REACT_APP_TAC_TECH_OBS_CNT_API_URL || ''
      }),
      transformResponse: (response: TacticTechniqueObservableCountsResponseRaw) => response?.data?.findManyTacticTechniqueIdentifier.map(t => ({ technique: t.MitreTechnique.Name, tactic: t.MitreTactic.Name, count: t.ObservableTacticAndTechnique.map(t => t.ObservableId).filter((v, i, a) => (a.indexOf(v) === i)).length })).sort((a, b) => b.count - a.count).filter((v, i, a) => a.findIndex(o => (o.tactic === v.tactic) && (o.technique === v.technique)) === i),
    }),
    getParLosses: builder.query<ParLossesResponse, void>({
      query: () => ({
        url: process.env?.REACT_APP_PAR_LOSSES_API_URL || ''
      }),
      transformResponse: (response: ParLossesResponseRaw) => ({
        Maximum: {
          Maximum: Math.max(...response?.data?.findManyCaseStudy?.map(t => parseFloat(t.UpperBoundLoss)) ?? 0),
          Minimum: Math.min(...response?.data?.findManyCaseStudy?.map(t => parseFloat(t.UpperBoundLoss)) ?? 0),
          Average: response?.data?.findManyCaseStudy?.map(t => parseFloat(t.UpperBoundLoss)).reduce((a, b) => a + b, 0) / response?.data?.findManyCaseStudy?.length,
          Median: parseFloat(response?.data?.findManyCaseStudy?.sort((a, b) => parseFloat(a.UpperBoundLoss) - parseFloat(b.UpperBoundLoss))[Math.floor(response?.data?.findManyCaseStudy?.length / 2)].UpperBoundLoss)
        },
        Minimum: {
          Maximum: Math.max(...response?.data?.findManyCaseStudy?.map(t => parseFloat(t.LowerBoundLoss)) ?? 0),
          Minimum: Math.min(...response?.data?.findManyCaseStudy?.map(t => parseFloat(t.LowerBoundLoss)) ?? 0),
          Average: response?.data?.findManyCaseStudy?.map(t => parseFloat(t.LowerBoundLoss)).reduce((a, b) => a + b, 0) / response?.data?.findManyCaseStudy?.length,
          Median: parseFloat(response?.data?.findManyCaseStudy?.sort((a, b) => parseFloat(a.LowerBoundLoss) - parseFloat(b.LowerBoundLoss))[Math.floor(response?.data?.findManyCaseStudy?.length / 2)].LowerBoundLoss)
        }
      }),
    }),

  })
})

export const { useGetParLossesQuery, useGetRansomwareParsQuery, useGetTacticTechniqueObservableCountsQuery, useGetTacticTechniqueParCountsQuery, useGetTop5ImpactCountsQuery } = tacticTechniquesStatsApi