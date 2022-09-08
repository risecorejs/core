"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("@risecorejs/helpers");
const path_1 = __importDefault(require("path"));
const models_1 = __importDefault(require("../models"));
exports.default = {
    server: {
        host: (0, helpers_1.env)('HOST', 'localhost'),
        port: (0, helpers_1.env)('PORT', 5000)
    },
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
        routesDir: '/',
        apiDocs: {
            title: 'API-docs'
        }
    },
    middleware: {
        rateLimit: {
            windowMs: 5 * 60 * 1000,
            max: 1000
        },
        cors: {}
    }
};
