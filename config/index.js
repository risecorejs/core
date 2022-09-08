"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const merge_1 = __importDefault(require("merge"));
const helpers_1 = require("@risecorejs/helpers");
const os = __importStar(require("os"));
const initialConfig = require('./initial').default;
const appConfig = require(path_1.default.resolve('config')).default;
const { config } = merge_1.default.recursive({ config: initialConfig }, { config: appConfig });
if ((0, helpers_1.env)('$CLI_HOST')) {
    config.server.host = (0, helpers_1.env)('$CLI_HOST');
}
if ((0, helpers_1.env)('$CLI_PORT')) {
    config.server.port = (0, helpers_1.env)('$CLI_PORT', Number);
}
if ((0, helpers_1.env)('$CLI_MULTIPROCESSING')) {
    config.server.multiprocessing = true;
}
if (config.server.multiprocessing) {
    if ((0, helpers_1.env)('$CLI_MULTIPROCESSING_WORKERS')) {
        config.server.multiprocessingWorkers = (0, helpers_1.env)('$CLI_MULTIPROCESSING_WORKERS', Number);
    }
    config.server.multiprocessingWorkers ||= os.cpus().length - 1;
}
exports.default = config;
