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
  res.status(200).send({ message: 'Observables API' });
});

router.get('/AllObservables', simpleEndpoint(getBaseUrl(), 'OBSERVABLES'));

export default router;
