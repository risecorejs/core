import { IConfig, IConfigStartCtx } from './interfaces';
declare const _default: IConfig & {
    server: {
        host: string;
        port: number;
        multiprocessing: boolean;
        multiprocessingWorkers: number | null;
    };
    init: (config: IConfig) => void;
    master: (config: IConfig) => void;
    start: (ctx: IConfigStartCtx) => void;
};
export default _default;
