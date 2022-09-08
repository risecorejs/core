"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rateLimit = require('express-rate-limit');
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const middleware_1 = __importDefault(require("@risecorejs/only/middleware"));
const middleware_2 = __importDefault(require("@risecorejs/validator/middleware"));
const middleware_3 = __importDefault(require("@risecorejs/order-builder/middleware"));
const middleware_4 = __importDefault(require("@risecorejs/where-builder/middleware"));
const middleware_5 = __importDefault(require("@risecorejs/include-builder/middleware"));
function default_1(config, app) {
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    if (config.middleware.rateLimit) {
        app.use(rateLimit(config.middleware.rateLimit));
    }
    if (config.middleware.cors) {
        app.use((0, cors_1.default)(config.middleware.cors));
    }
    if (config.storage) {
        app.use('/storage', express_1.default.static(path_1.default.resolve('storage')));
    }
    app.use((0, middleware_1.default)());
    app.use((0, middleware_2.default)(config.validator));
    app.use((0, middleware_3.default)());
    app.use((0, middleware_4.default)());
    app.use((0, middleware_5.default)());
    if (config.middleware.extend) {
        const middleware = config.middleware.extend();
        if (middleware.length) {
            for (const item of middleware) {
                app.use(item);
            }
        }
    }
}
exports.default = default_1;
