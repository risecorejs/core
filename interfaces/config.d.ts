/// <reference types="node" />
import express from 'express';
import * as http from 'http';
import { Sequelize } from 'sequelize';
import { IProcesses } from '@risecorejs/processes-runner/interfaces';
import { IRoute } from '@risecorejs/router/interfaces';
import cors from 'cors';
export interface IConfig {
    global?: {
        [key: string]: any;
    };
    server?: IConfigServer;
    moduleAliases?: IConfigModuleAliases;
    storage?: boolean;
    structs?: false | IConfigStructs;
    cron?: IConfigCron;
    processes?: IProcesses;
    validator?: IConfigValidator;
    router?: IConfigRouter | IConfigRouter[];
    middleware?: {
        rateLimit?: false | {
            [key: string]: any;
        };
        cors?: false | cors.CorsOptions;
        extend?: () => express.Handler[];
    };
    init?: (config: IConfig) => void | Promise<void>;
    master?: (config: IConfig) => void | Promise<void>;
    start?: (ctx: IConfigStartCtx) => void | Promise<void>;
}
export interface IConfigCore extends IConfig {
    server: Required<IConfigServer>;
    structs: false | Required<IConfigStructs>;
    validator: IConfigValidator;
    router: IConfigRouter | IConfigRouter[];
    middleware: {
        rateLimit: false | {
            [key: string]: any;
        };
        cors: false | cors.CorsOptions;
        extend?: () => express.Handler[];
    };
}
export interface IConfigServer {
    host?: string;
    port?: number;
    multiprocessing?: boolean;
    multiprocessingWorkers?: number;
}
export interface IConfigModuleAliases {
    [alias: string]: string;
}
export interface IConfigStructs {
    setGlobal?: boolean;
    enableAPI?: boolean;
    dir?: string;
}
export interface IConfigCron {
    childProcess?: boolean;
    jobs: {
        [key: string]: () => void;
    };
}
export interface IConfigValidator {
    locale?: 'ru' | 'en';
    sequelize?: Sequelize;
}
export interface IConfigRouter {
    type: 'pending' | 'local' | 'remote';
    status: 'pending' | 'connected' | 'reconnecting';
    main?: boolean;
    baseUrl?: string;
    routesDir?: string;
    routesUrl?: string;
    middleware?: express.Handler | string | (express.Handler | string)[];
    controller?: express.Handler | string;
    apiDocs?: {
        title?: string;
        baseUrl?: string;
    };
    routes?: IRoute[];
    timeout?: number;
}
export interface IConfigStartCtx {
    config: IConfig;
    app: express.Application;
    server: http.Server;
}
