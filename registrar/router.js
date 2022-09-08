"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apiDocs = require('@risecorejs/api-docs');
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router_1 = __importDefault(require("@risecorejs/router"));
const axios_1 = __importDefault(require("axios"));
async function default_1(routerConfig, app) {
    routerConfig.type = routerConfig.status = 'Pending';
    const routes = await getRoutes(routerConfig);
    routerConfig.status = 'Connected';
    app.use(routerConfig.baseUrl, (0, router_1.default)(routes, {
        controllers: path_1.default.resolve('controllers'),
        middleware: path_1.default.resolve('middleware')
    }));
    if (routerConfig.apiDocs && process.env.NODE_ENV === 'development') {
        app.use('/__routes' + routerConfig.baseUrl, (req, res) => res.json({ routes }));
        routerConfig.apiDocs.baseUrl = routerConfig.baseUrl === '/' ? '' : routerConfig.baseUrl;
        app.use('/__docs' + routerConfig.baseUrl, apiDocs(routes, routerConfig.apiDocs));
    }
}
exports.default = default_1;
/**
 * GET-ROUTES
 * @param routerConfig {Object}
 * @returns {Promise<Array>}
 */
async function getRoutes(routerConfig) {
    const routes = [];
    if (routerConfig.routesPath) {
        routerConfig.type = 'Local';
        fillingRoutes(routerConfig, routes, path_1.default.resolve(), routerConfig.routesPath);
    }
    else if (routerConfig.routesUrl) {
        routerConfig.type = 'Remote';
        for (const route of await getRoutesThroughAxios(routerConfig)) {
            fillingRoute(routerConfig, route);
            routes.push(route);
        }
    }
    else {
        throw Error('Routes source required');
    }
    if (routerConfig.routes?.length) {
        for (const route of routerConfig.routes) {
            routes.push(route);
        }
    }
    return routes;
}
/**
 * GET-ROUTES-THROUGH-AXIOS
 * @param routerConfig {Object}
 * @returns {Promise<Array>}
 */
async function getRoutesThroughAxios(routerConfig) {
    try {
        const { data: { routes } } = await axios_1.default.get(routerConfig.routesUrl);
        return routes;
    }
    catch (err) {
        console.error(err);
        routerConfig.status = 'Reconnecting';
        return await new Promise((resolve) => {
            setTimeout(async () => {
                const routes = await getRoutesThroughAxios(routerConfig);
                resolve(routes);
            }, routerConfig.timeout || 3000);
        });
    }
}
/**
 * FILLING-ROUTES
 * @param routerConfig {Object}
 * @param routes {Array}
 * @param basePath {string}
 * @param folder {string}
 */
function fillingRoutes(routerConfig, routes, basePath, folder) {
    const files = fs_1.default.readdirSync(basePath + folder);
    for (const file of files) {
        if (!file.startsWith('_')) {
            const filePath = path_1.default.join(folder, file);
            const fileStat = fs_1.default.statSync(basePath + filePath);
            if (fileStat.isDirectory()) {
                fillingRoutes(routerConfig, routes, basePath, filePath);
            }
            else if (file.endsWith('.js')) {
                const route = require(basePath + filePath);
                fillingRoute(routerConfig, route);
                routes.push(route);
            }
        }
    }
}
/**
 * FILLING-ROUTE
 * @param routerConfig {Object}
 * @param route {Object}
 */
function fillingRoute(routerConfig, route) {
    if (routerConfig.middleware) {
        if (route.middleware) {
            if (Array.isArray(route.middleware)) {
                if (Array.isArray(routerConfig.middleware)) {
                    for (const middleware of routerConfig.middleware) {
                        route.middleware.unshift(middleware);
                    }
                }
                else {
                    route.middleware.unshift(routerConfig.middleware);
                }
            }
        }
        else {
            route.middleware = routerConfig.middleware;
        }
    }
    setController(routerConfig, route);
}
/**
 * SET-CONTROLLER
 * @param routerConfig {Object}
 * @param route {Object}
 */
function setController(routerConfig, route) {
    if (routerConfig.controller) {
        if (route.method) {
            route.controller = routerConfig.controller;
        }
        if (route.children?.length) {
            for (const _route of route.children) {
                setController(routerConfig, _route);
            }
        }
    }
}
