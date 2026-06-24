// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define Observable type inline since it's not in types yet
interface Observable {
  case_id: string;
  case_alias: string;
  case_obs_seq: string;
  tact_tech_combined_seq_id: string;
  tact_tech_combined_info: string;
  tech_ics_name: string;
  tech_ics_id: string;
  tact_ics_name: string;
  tact_ics_id: string;
  obs_desc: string;
  obs_lvl: string;
  obs_type: string;
  obs_src_tag: string;
  norm_freq: string;
  norm_freq_val: string;
  p_obs_tech: string;
  p_obs_tech_val: string;
  diagnosticity: string;
  aware: string;
  understand: string;
  perceivability: string;
  ttid: string;
  case_name: string;
  ransom: string;
  start_year: string;
  case_start_date: string;
  case_trigger_date: string;
  case_end_date: string;
  case_duration_days: string;
  tech_tact_event_reported_date: string;
  time_distance_to_trigger_event: string;
  d_notation: string;
  tech_tact_event_date_estimation_confidence: string;
  tech_tact_event_est_early_date: string;
  tech_tact_event_est_late_date: string;
  tact_tech_group: string;
  tact_tech_phase: string;
  obs_terminal: string;
  case_tact_tech_obs_seq: string;
}

export const observablesDataApi = createApi({
  reducerPath: 'observablesData',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:8181/Observables'
  }),
  endpoints: (builder) => ({
    getAllObservables: builder.query<Observable[], void>({
      query: () => ({
        url: '/AllObservables',
      })
    }),
  }),
});

export const {
  useGetAllObservablesQuery,
} = observablesDataApi;
