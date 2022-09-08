"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const registrar_1 = __importDefault(require("../registrar"));
const config_1 = __importDefault(require("../config"));
registrar_1.default.cron(config_1.default.cron.jobs);
