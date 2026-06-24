// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import express from 'express';
import { getDataSource } from '../helpers/endpoint';

const router = express.Router();

router.get('', (_, res) => {
  res.status(200).send({ 
    status: 'OK',
    dataSource: getDataSource(),
  });
});

export default router;
