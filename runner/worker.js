"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helpers_1 = require("@risecorejs/helpers");
const registrar_1 = __importDefault(require("../registrar"));
const package_json_1 = __importDefault(require("../package.json"));
async function default_1(config) {
    const app = (0, express_1.default)();
    app.disable('x-powered-by');
    app.get('/', (req, res) => res.send(`${package_json_1.default.description} v${package_json_1.default.version}`));
    // REGISTER::STRUCTS-API
    if (config.structs && config.structs.enableAPI) {
        registrar_1.default.structsAPI(config);
    }
    // REGISTER::MIDDLEWARE
    registrar_1.default.middleware(config, app);
    // REGISTER::ROUTER
    if (Array.isArray(config.router)) {
        if ((0, helpers_1.env)('NODE_ENV') === 'development') {
            app.get('/__routers', (req, res) => {
                return res.json({ routers: config.router });
            });
            app.get('/__docs', (req, res) => {
                return res.sendFile('docs.html', { root: __dirname + '/../view' });
            });
        }
        for (const item of config.router) {
            registrar_1.default.router(item, app).catch((err) => console.error(err));
        }
    }
    else {
        registrar_1.default.router(config.router, app).catch((err) => console.error(err));
    }
    // RUN::SERVER
    const server = app.listen(config.server.port, config.server.host, async () => {
        // RUN-HOOK::START
        await config.start({ config, app, server });
    });
}
exports.default = default_1;
