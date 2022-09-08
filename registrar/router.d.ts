import express from 'express';
import { TRouterConfig } from '../types';
export default function (routerConfig: TRouterConfig & {
    type: string;
    status: string;
}, app: express.Application): Promise<void>;
