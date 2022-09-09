"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cron_1 = require("../runner/cron");
const config_1 = __importDefault(require("../config"));
if (config_1.default.cron) {
    (0, cron_1.cronRunner)(config_1.default.cron.jobs);
}
