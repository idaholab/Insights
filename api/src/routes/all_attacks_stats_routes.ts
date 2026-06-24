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
  res.status(200).send({ message: 'All Attacks Stats API' });
});

router.get('/AllAttacksStats',      simpleEndpoint(getBaseUrl(), 'ALL_ATTACKS_METRICS'));
router.get('/AllAttacksBAM',        simpleEndpoint(getBaseUrl(), 'ALL_ATTACKS_BAM'));
router.get('/PARLosses',            simpleEndpoint(getBaseUrl(), 'PAR_LOSSES'));
router.get('/RansomwarePARS',       simpleEndpoint(getBaseUrl(), 'RANSOMWARE_PARS'));
router.get('/Top5ImpactCounts',     simpleEndpoint(getBaseUrl(), 'TOP_5_IMPACT_COUNTS'));

export default router;
