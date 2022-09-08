"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const processes_runner_1 = __importDefault(require("@risecorejs/processes-runner"));
async function default_1(configProcesses) {
    await (0, processes_runner_1.default)(configProcesses);
}
exports.default = default_1;
