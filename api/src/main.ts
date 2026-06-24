// Copyright 2026, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import express, { Router } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import { IProcessEnv } from 'interfaces/IProcessEnv';
import morgan from "morgan"
import fs from "fs"
export function run(routes: {[key:string]: Router }){
    dotenv.config();

    let env_vars: IProcessEnv = process.env;
    const port: number = parseInt(env_vars.ADAPTER_PORT!);
    
    const app = express();
    
    app.use(cors());
    app.use(helmet())
    app.use(express.json());
    app.use(morgan('combined', {
        stream: fs.createWriteStream(process.env.LOG_PATH || './access.log', {flags: 'a'})
    }));

    app.use('/store', express.static('store'));
    Object.entries(routes).forEach(t=>app.use(`/${t[0]}`, t[1]))   
    
    app.use((err:any, req:any, res:any, next:any) => {
      res.status(500).json({ error: 'Internal Server Error' });
    });
    app.listen(port, () => {
      console.info(`Adapter server running on port ${port}`);
    });
    
}
