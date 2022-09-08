"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cluster_1 = __importDefault(require("cluster"));
async function default_1(config) {
    for (let i = 0; i < config.server.multiprocessingWorkers; i++) {
        cluster_1.default.fork();
    }
    cluster_1.default.on('exit', (worker) => {
        console.log(`Worker PID: ${worker.process.pid} died`);
        cluster_1.default.fork();
    });
    // RUN-HOOK::MASTER
    if (config.master) {
        await config.master(config);
    }
}
exports.default = default_1;
