"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cron_1 = require("cron");
function default_1(configCron) {
    for (const [pattern, handler] of Object.entries(configCron.jobs)) {
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
exports.default = default_1;
