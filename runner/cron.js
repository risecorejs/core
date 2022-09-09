"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cronRunner = void 0;
const execa_1 = __importDefault(require("execa"));
const cron_1 = require("cron");
function default_1(configCron) {
    if (configCron.childProcess) {
        (0, execa_1.default)(`node ${__dirname}/../child-processes/cron.js`, {
            stdin: process.stdin,
            stdout: process.stdout,
            stderr: process.stderr,
            shell: true
        });
    }
    else {
        cronRunner(configCron.jobs);
    }
}
exports.default = default_1;
/**
 * CRON-RUNNER
 * @param cronJobs {IConfigCronJobs}
 */
function cronRunner(cronJobs) {
    for (const [pattern, handler] of Object.entries(cronJobs)) {
        new cron_1.CronJob(pattern, () => {
            try {
                handler();
            }
            catch (err) {
                console.error(err);
            }
        }).start();
    }
}
exports.cronRunner = cronRunner;
