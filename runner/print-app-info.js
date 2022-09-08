"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = __importDefault(require("@risecorejs/helpers/lib/env"));
const os_1 = require("os");
const cronstrue_1 = __importDefault(require("cronstrue"));
const package_json_1 = __importDefault(require("../package.json"));
function default_1(config) {
    const host = getHost(config);
    const url = `http://${host}:${config.server.port}`;
    console.log(`|------------------------------------------------------|`);
    console.log(`| ${package_json_1.default.description} v${package_json_1.default.version}`);
    console.log(`|------------------------------------------------------|`);
    console.log(`| # APP`);
    console.log(`|   URL: ${url}`);
    if ((0, env_1.default)('NODE_ENV') === 'development') {
        console.log(`|   Docs URL: ${url}/__docs`);
    }
    console.log('|   Press Ctrl+C to quit.');
    console.log(`|------------------------------------------------------|`);
    console.log(`| # SERVER`);
    console.log('|   Host: ' + config.server.host);
    console.log('|   Port: ' + config.server.port);
    console.log('|   Mode: ' + (config.server.multiprocessing ? 'multiprocessing' : 'singleProcess'));
    if (config.server.multiprocessing) {
        console.log('|   Number of workers: ' + config.server.multiprocessingWorkers);
    }
    if (config.cron) {
        console.log(`|------------------------------------------------------|`);
        console.log(`| # CRON`);
        console.log('|   Mode: ' + (config.cron.childProcess ? 'childProcess' : 'inside'));
        console.log('|   Number of jobs: ' + Object.keys(config.cron.jobs).length);
        for (const [pattern] of Object.entries(config.cron.jobs)) {
            console.log(`|   - ${pattern} (${cronstrue_1.default.toString(pattern, {
                verbose: true,
                use24HourTimeFormat: true
            })})`);
        }
    }
    if (config.processes) {
        console.log(`|------------------------------------------------------|`);
        console.log(`| # PROCESSES`);
        console.log('|   Number of processes: ' + Object.keys(config.processes).length);
        for (const [processName] of Object.entries(config.processes)) {
            console.log(`|   - ${processName}`);
        }
    }
    console.log(`|------------------------------------------------------|\n`);
}
exports.default = default_1;
/**
 * GET-HOST
 * @param config {IConfigCore}
 * @return {string}
 */
function getHost(config) {
    if (config.server.host === '0.0.0.0') {
        const nets = (0, os_1.networkInterfaces)();
        const netNames = ['Ethernet', 'eth0'];
        for (const name of netNames) {
            const net = nets[name];
            if (net) {
                const netInfo = net.find((net) => net.family === 'IPv4');
                if (netInfo) {
                    return netInfo.address;
                }
            }
        }
    }
    return 'localhost';
}
