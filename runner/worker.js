"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
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
    // REGISTER::ROUTERS
    registrar_1.default.routers(config.router, app);
    // CREATE::SERVER
    const server = app.listen(config.server.port, config.server.host, async () => {
        // RUN-HOOK::START
        if (config.start) {
            await config.start({ config, app, server });
        }
    });
}
exports.default = default_1;
