"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const cluster_1 = __importDefault(require("cluster"));
const registrar_1 = __importDefault(require("./registrar"));
const runner_1 = __importDefault(require("./runner"));
const config_1 = __importDefault(require("./config"));
// REGISTER::MODULE-ALIAS
registrar_1.default.moduleAlias(config_1.default);
// REGISTER::GLOBAL-VARIABLES
registrar_1.default.globalVariables(config_1.default);
// REGISTER::GLOBAL-STRUCTS
registrar_1.default.globalStructs(config_1.default);
void (async () => {
    // RUN-HOOK::INIT
    await config_1.default.init(config_1.default);
    if (cluster_1.default.isPrimary) {
        if (config_1.default.server.multiprocessing) {
            // RUN::MASTER
            await runner_1.default.master(config_1.default);
        }
        else {
            // RUN::WORKER
            await runner_1.default.worker(config_1.default);
        }
        // RUN::PRINT-APP-INFO
        runner_1.default.printAppInfo(config_1.default);
        // RUN::CRON
        runner_1.default.cron(config_1.default);
        // RUN::PROCESSES
        runner_1.default.processes(config_1.default);
    }
    else {
        // RUN::WORKER
        await runner_1.default.worker(config_1.default);
    }
})();
