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
  res.status(200).send({ message: 'Word Cloud API' });
});

router.get('/DynamicTopicModel',      simpleEndpoint(getBaseUrl(), 'WORD_CLOUD_DYN_TOPIC'));
router.get('/IntertopicDistanceMap',  simpleEndpoint(getBaseUrl(), 'WORD_CLOUD_INTER_DIST'));
router.get('/HierarchicalClustering', simpleEndpoint(getBaseUrl(), 'WORD_CLOUD_HIER_CLUST'));
router.get('/TopicSimilarityMatrix',  simpleEndpoint(getBaseUrl(), 'WORD_CLOUD_SIM_MATRIX'));
router.get('/TopicWordScores',        simpleEndpoint(getBaseUrl(), 'WORD_CLOUD_WORD_SCORES'));

export default router;
