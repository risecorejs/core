/// <reference types="node" />
import { Sequelize } from 'sequelize';
import cors from 'cors';
import express from 'express';
import * as http from 'http';
import { IProcesses } from '@risecorejs/processes-runner/interfaces';
import { TConfigRouter } from '../types';
export interface IConfigCron {
    childProcess?: boolean;
    jobs: {
        [key: string]: () => void;
    };
}
export interface IConfigStartCtx {
    config: IConfig;
    app: express.Application;
    server: http.Server;
}
export interface IConfig {
    global: {
        controller: (filePath: string) => (method: string) => string;
        env: (key: string, defaultValue?: any) => any;
        crudBuilder: any;
        [key: string]: any;
    };
    server?: {
        host?: string;
        port?: number;
        multiprocessing?: boolean;
        multiprocessingWorkers?: number | null;
    };
    moduleAlias?: {
        [key: string]: any;
    } | false;
    storage?: boolean;
    structs?: {
        setGlobal?: boolean;
        enableAPI?: boolean;
        dir?: string;
    } | false;
    cron?: IConfigCron;
    processes?: IProcesses;
    validator?: {
        locale?: 'ru' | 'en';
        sequelize?: Sequelize;
    } | false;
    router?: TConfigRouter | TConfigRouter[];
    middleware?: {
        rateLimit?: {
            windowMs?: number;
            max?: number;
        };
        cors?: cors.CorsOptions;
        extend?: () => express.Handler[];
    };
    init?: (config: IConfig) => void;
    master?: (config: IConfig) => void;
    start?: (ctx: IConfigStartCtx) => void;
}
