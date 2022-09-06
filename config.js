"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crudBuilder = require('@risecorejs/crud-builder');
const path_1 = __importDefault(require("path"));
const merge_1 = __importDefault(require("merge"));
const env_1 = __importDefault(require("@risecorejs/helpers/lib/env"));
const models_1 = __importDefault(require("./models"));
const initialConfig = {
    global: {
        controller: (filePath) => (method) => filePath + '.' + method,
        env: env_1.default,
        crudBuilder
    },
    server: {
        host: (0, env_1.default)('HOST', 'localhost'),
        port: (0, env_1.default)('PORT', 8000),
        multiprocessing: false,
        multiprocessingWorkers: null
    },
    moduleAlias: {
        '~': path_1.default.resolve()
    },
    storage: true,
    structs: {
        setGlobal: true,
        enableAPI: true,
        dir: path_1.default.resolve('structs')
    },
    validator: {
        locale: 'en',
        sequelize: models_1.default.sequelize
    },
    router: {
        baseUrl: '/',
        routesPath: '/routes',
        apiDocs: {
            title: 'API-docs'
        }
    },
    middleware: {
        rateLimit: {
            windowMs: 5 * 60 * 1000,
            max: 1000
        },
        cors: {},
        extend: () => []
    },
    init(config) { },
    master(config) { },
    start(ctx) { }
};
const appConfig = require(path_1.default.resolve('config')).default;
// MERGE INITIAL-CONFIG AND APP-CONFIG
const { config } = merge_1.default.recursive({ config: initialConfig }, { config: appConfig });
exports.default = config;
