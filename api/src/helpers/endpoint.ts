// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import axios from 'axios';
import dotenv from 'dotenv';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { ColumnsSelection } from 'drizzle-orm';
import { SQLiteSelectBase } from 'drizzle-orm/sqlite-core';
import { SelectMode, JoinNullability, SelectResult, BuildSubquerySelection } from 'drizzle-orm/query-builders/select.types';
import { IProcessEnv, DataSource } from 'interfaces/IProcessEnv';
import * as schema from '../../db/insights/schema';

dotenv.config();

export const env_vars: IProcessEnv = process.env;
export const gql = String.raw;

// ── Data source ───────────────────────────────────────────────────────────────

export function getDataSource(): DataSource {
  const ds = env_vars.DATA_SOURCE;
  if (ds === 'sqlite') return 'sqlite';
  return 'local'; // default — no infrastructure required
}

export function getBaseUrl(): string {
  return env_vars.LOCAL_STORE_BASE_URL ?? '';
}

// ── SQLite / Drizzle ──────────────────────────────────────────────────────────

let _db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (_db) return _db;
  const dbPath = env_vars.DB_PATH;
  if (!dbPath) throw new Error('DB_PATH is not set in environment');
  _db = drizzle(new Database(dbPath));
  return _db;
}

// MITRE
export const getMitreTactics     = () => getDb().select().from(schema.mitreTactic);
export const getMitreTechniques  = () => getDb().select().from(schema.mitreTechnique);
export const getMitreMappings    = () => getDb().select().from(schema.mitreTacticTechnique);
export const getMitreMitigations = () => getDb().select().from(schema.mitreMitigation);

// Case Studies
export const getCaseStudies               = () => getDb().select().from(schema.caseStudy);
export const getCaseStudyTechniques       = () => getDb().select().from(schema.caseStudyTechnique);
export const getCaseStudyTechniqueTiming  = () => getDb().select().from(schema.caseStudyTechniqueTiming);
export const getCaseStudyObservables      = () => getDb().select().from(schema.caseStudyObservable);
export const getCaseStudyReferences       = () => getDb().select().from(schema.caseStudyReference);
export const getCaseStudySectors          = () => getDb().select().from(schema.caseStudySector);

// Observables
export const getObservables                    = () => getDb().select().from(schema.observable);
export const getObservableLevels               = () => getDb().select().from(schema.observableLevel);
export const getObservableTacticAndTechniques  = () => getDb().select().from(schema.observableTacticAndTechnique);

// Reference tables
export const getSectors    = () => getDb().select().from(schema.sector);
export const getNaics      = () => getDb().select().from(schema.naics);
export const getTags       = () => getDb().select().from(schema.tags);
export const getCampaigns  = () => getDb().select().from(schema.campaign);
export const getGroups     = () => getDb().select().from(schema.group);
export const getSoftware   = () => getDb().select().from(schema.software);
export const getObservers  = () => getDb().select().from(schema.observer);
export const getFrequency  = () => getDb().select().from(schema.frequency);
export const getArtifacts  = () => getDb().select().from(schema.artifact);

// ── Endpoint handlers ─────────────────────────────────────────────────────────

/**
 * Serves a JSON file from LOCAL_STORE_BASE_URL.
 * Used when DATA_SOURCE=local.
 */
export function simpleEndpoint(base_url: string, envKey: keyof IProcessEnv) {
  return (_: any, res: any): void => {
    console.debug(`[simpleEndpoint] key=${envKey}`);

    const path = env_vars[envKey];
    if (!path) {
      console.error(`Missing environment variable: ${envKey}`);
      res.status(500).send('Server error');
      return;
    }

    axios
      .get(`${base_url}/${path}`)
      .then((x) => res.status(x?.status ?? 200).send(x?.data))
      .catch((e) => {
        if (axios.isAxiosError(e)) {
          res.status(e.response?.status ?? 500).send(e.response?.data ?? 'Server error');
        } else {
          res.status(500).send('Server error: ' + e);
        }
      });
  };
}

/**
 * Runs a Drizzle ORM query and sends the result.
 * Used when DATA_SOURCE=sqlite.
 */
export function drizzleEndpoint<
  TTableName extends string | undefined,
  TResultType extends 'sync' | 'async',
  TRunResult,
  TSelection extends ColumnsSelection,
  TSelectMode extends SelectMode = 'single',
  TNullabilityMap extends Record<string, JoinNullability> = TTableName extends string ? Record<TTableName, 'not-null'> : {},
  TDynamic extends boolean = false,
  TExcludedMethods extends string = never,
  TResult extends any[] = SelectResult<TSelection, TSelectMode, TNullabilityMap>[],
  TSelectedFields extends ColumnsSelection = BuildSubquerySelection<TSelection, TNullabilityMap>
>(
  query: () => SQLiteSelectBase<TTableName, TResultType, TRunResult, TSelection, TSelectMode, TNullabilityMap, TDynamic, TExcludedMethods, TResult, TSelectedFields>
) {
  return (_: any, res: any): void => {
    console.debug('[drizzleEndpoint] using sqlite');
    query()
      .then((x) => res.status(200).send(x))
      .catch((e) => {
        console.error('[drizzleEndpoint] error:', e?.message ?? e);
        res.status(500).send({ error: e?.message ?? 'Server error' });
      });
  };
}
