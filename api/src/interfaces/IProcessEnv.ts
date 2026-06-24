// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

export type DataSource = 'local' | 'sqlite' | 'deeplynx';

export interface IProcessEnv {
  // Server
  ADAPTER_NAME?: string;
  ADAPTER_URL?: string;
  ADAPTER_PORT?: string;

  // Data source strategy
  DATA_SOURCE?: DataSource;

  // Local JSON
  LOCAL_STORE_BASE_URL?: string;

  // SQLite
  DB_PATH?: string;

  // DeepLynx
  DL_URL?: string;
  DL_URL_INTERNAL?: string;
  DL_APP_ID?: string;
  DL_APP_SECRET?: string;
  DL_APP_EXPIRY?: string;
  DL_AUTH_TOKEN?: string;
  DL_CONTAINER_URL?: string;

  // JSON file names
  ALL_ATTACKS_METRICS?: string;
  ALL_ATTACKS_BAM?: string;
  ATTACK_MATRIX_MAPPING?: string;
  ATTACK_MATRIX_TECHNIQUES?: string;
  ATTACK_MATRIX_CATEGORIES?: string;
  FINANCIAL_LOSS_HISTOGRAM?: string;
  PAR_LOSSES?: string;
  RANSOMWARE_PARS?: string;
  REPORT_MAIN?: string;
  REPORT_TECHNIQUES?: string;
  REPORT_TECHNIQUES_TIMING?: string;
  TACTIC_TECHNIQUE_OBSERVABLE_COUNTS?: string;
  TACTIC_TECHNIQUE_PAR_COUNTS?: string;
  TOP_5_IMPACT_COUNTS?: string;
  OBSERVABLES?: string;
  WORD_CLOUD_DYN_TOPIC?: string;
  WORD_CLOUD_INTER_DIST?: string;
  WORD_CLOUD_HIER_CLUST?: string;
  WORD_CLOUD_SIM_MATRIX?: string;
  WORD_CLOUD_WORD_SCORES?: string;

  // Keep index signature for any untyped access — remove once all usages are migrated
  [key: string]: string | undefined;
}
