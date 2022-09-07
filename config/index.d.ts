declare const path: any;
declare const merge: any;
declare const env: any;
declare const crudBuilder: any;
declare const models: any;
declare const initialConfig: {
    global: {
        controller: (filename: any) => (method: any) => string;
        env: any;
        crudBuilder: any;
    };
    server: {
        host: any;
        port: any;
        multiprocessing: boolean;
        multiprocessingWorkers: null;
    };
    moduleAlias: {
        '~': any;
    };
    storage: boolean;
    structs: {
        setGlobal: boolean;
        enableAPI: boolean;
        dir: any;
    };
    validator: {
        locale: string;
        sequelize: any;
    };
    router: {
        baseUrl: string;
        routesPath: string;
        apiDocs: {
            title: string;
        };
    };
    middleware: {
        rateLimit: {
            windowMs: number;
            max: number;
        };
        cors: {};
        extend: () => never[];
    };
    init(config: any): void;
    master(config: any): void;
    start({ config, app, server }: {
        config: any;
        app: any;
        server: any;
    }): void;
};
declare const appConfig: any;
declare const config: any;
