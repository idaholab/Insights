// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import express from 'express';
import { getBaseUrl, simpleEndpoint } from '../helpers/endpoint';

const router = express.Router();

router.all('*', (_, res, next) => {
  if (!getBaseUrl()) {
    console.error('Error: LOCAL_STORE_BASE_URL is not set.');
    res.status(500).send('Server error');
  } else {
    next();
  }
});

router.get('', (_, res) => {
  res.status(200).send({ message: 'Tactic Techniques Stats API' });
});

router.get('/TacticTechniqueObservableCounts', simpleEndpoint(getBaseUrl(), 'TACTIC_TECHNIQUE_OBSERVABLE_COUNTS'));
router.get('/TacticTechniquePARCounts',        simpleEndpoint(getBaseUrl(), 'TACTIC_TECHNIQUE_PAR_COUNTS'));
router.get('/ParLosses',                       simpleEndpoint(getBaseUrl(), 'PAR_LOSSES'));
router.get('/RansomwarePars',                  simpleEndpoint(getBaseUrl(), 'RANSOMWARE_PARS'));
router.get('/Top5ImpactCounts',                simpleEndpoint(getBaseUrl(), 'TOP_5_IMPACT_COUNTS'));

export default router;
