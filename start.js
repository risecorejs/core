"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const helpers_1 = require("@risecorejs/helpers");
const os_1 = __importDefault(require("os"));
const cluster_1 = __importDefault(require("cluster"));
const processes_runner_1 = __importDefault(require("@risecorejs/processes-runner"));
const register_1 = __importDefault(require("./register"));
const runners_1 = __importDefault(require("./runners"));
const config_1 = __importDefault(require("./config"));
// REGISTER MODULE-ALIAS
if (config_1.default.moduleAlias) {
    register_1.default.moduleAlias(config_1.default.moduleAlias);
}
// REGISTER GLOBAL-VARIABLES
register_1.default.globalVariables(config_1.default.global);
// SET GLOBAL-STRUCTS
if (config_1.default.structs && config_1.default.structs?.setGlobal !== false) {
    (0, helpers_1.setGlobalStructs)(config_1.default.structs.dir);
}
void (async () => {
    if ((0, helpers_1.env)('$CLI_HOST')) {
        config_1.default.server.host = (0, helpers_1.env)('$CLI_HOST');
    }
    if ((0, helpers_1.env)('$CLI_PORT')) {
        config_1.default.server.port = (0, helpers_1.env)('$CLI_PORT', Number);
    }
    if ((0, helpers_1.env)('$CLI_MULTIPROCESSING')) {
        config_1.default.server.multiprocessing = true;
    }
    if (config_1.default.server.multiprocessing) {
        if ((0, helpers_1.env)('$CLI_MULTIPROCESSING_WORKERS')) {
            config_1.default.server.multiprocessingWorkers = (0, helpers_1.env)('$CLI_MULTIPROCESSING_WORKERS', Number);
        }
        config_1.default.server.multiprocessingWorkers ||= os_1.default.cpus().length - 1;
    }
    // RUN INIT-FUNCTION
    await config_1.default.init(config_1.default);
    if (cluster_1.default.isPrimary) {
        if (config_1.default.server.multiprocessing) {
            await runners_1.default.master(config_1.default);
        }
        else {
            await runners_1.default.worker(config_1.default);
        }
        runners_1.default.printAppInfo(config_1.default);
        if (config_1.default.cron) {
            runners_1.default.cron(config_1.default.cron);
        }
        if (config_1.default.processes) {
            await (0, processes_runner_1.default)(config_1.default.processes);
        }
    }
    else {
        await runners_1.default.worker(config_1.default);
    }
})();
