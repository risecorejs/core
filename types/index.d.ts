import express from 'express';
import { IRoute } from '@risecorejs/router/interfaces';
export declare type TRouterConfig = {
    main?: boolean;
    baseUrl?: string;
    routesPath?: string;
    routesUrl?: string;
    middleware?: express.Handler | string | (express.Handler | string)[];
    controller?: express.Handler | string;
    apiDocs?: {
        title?: string;
    };
    routes?: IRoute[];
};
