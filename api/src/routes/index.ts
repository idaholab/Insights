// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import { Router } from 'express';
import AllAttacksMetrics     from './all_attacks_metrics_routes';
import AllAttacksReport      from './all_attacks_report_routes';
import AllAttacksStats       from './all_attacks_stats_routes';
import MitreAttackMatrix     from './mitre_attack_matrix_routes';
import TacticTechniquesStats from './tactic_techniques_stats_routes';
import WordCloud             from './word_cloud_routes';
import Observables           from './observables_routes';
import Health                from './health_routes';

export const routes: { [key: string]: Router } = {
  health:                Health,
  AllAttacksMetrics:     AllAttacksMetrics,
  AllAttacksReports:     AllAttacksReport,
  AllAttacksStats:       AllAttacksStats,
  MitreAttackMatrix:     MitreAttackMatrix,
  TacticTechniquesStats: TacticTechniquesStats,
  WordCloud:             WordCloud,
  Observables:           Observables,
};
