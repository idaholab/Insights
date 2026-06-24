// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import express from 'express';
import { getBaseUrl, getDataSource, simpleEndpoint, drizzleEndpoint, getMitreTactics, getMitreMappings, getMitreTechniques } from '../helpers/endpoint';

const router = express.Router();

router.all('*', (_, res, next) => {
  if (getDataSource() === 'local' && !getBaseUrl()) {
    console.error('Error: LOCAL_STORE_BASE_URL is not set.');
    res.status(500).send('Server error');
  } else {
    next();
  }
});

router.get('', (_, res) => {
  res.status(200).send({ message: 'MITRE Attack Matrix API' });
});

const isSqlite = getDataSource() === 'sqlite';

router.get('/AttackMatrixCategories', isSqlite
  ? drizzleEndpoint(getMitreTactics)
  : simpleEndpoint(getBaseUrl(), 'ATTACK_MATRIX_CATEGORIES'));

router.get('/AttackMatrixMapping', isSqlite
  ? drizzleEndpoint(getMitreMappings)
  : simpleEndpoint(getBaseUrl(), 'ATTACK_MATRIX_MAPPING'));

router.get('/AttackMatrixTechniques', isSqlite
  ? drizzleEndpoint(getMitreTechniques)
  : simpleEndpoint(getBaseUrl(), 'ATTACK_MATRIX_TECHNIQUES'));

export default router;
