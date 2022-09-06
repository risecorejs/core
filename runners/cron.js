"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execa_1 = __importDefault(require("execa"));
const register_1 = __importDefault(require("../register"));
/**
 * RUN CRON
 * @param configCron {Object}
 * @returns {void}
 */
function default_1(configCron) {
    if (configCron.childProcess) {
        (0, execa_1.default)(`node ${__dirname}/../child-processes/cron.js`, {
            stdin: process.stdin,
            stdout: process.stdout,
            stderr: process.stderr,
            shell: true
        }).catch((err) => console.error(err));
    }
    else {
        register_1.default.cron(configCron.jobs);
    }
}
exports.default = default_1;
