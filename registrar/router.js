"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apiDocs = require('@risecorejs/api-docs');
const helpers_1 = require("@risecorejs/helpers");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router_1 = __importDefault(require("@risecorejs/router"));
const axios_1 = __importDefault(require("axios"));
function default_1(configRouter, app) {
    if (Array.isArray(configRouter)) {
        if ((0, helpers_1.env)('NODE_ENV') === 'development') {
            app.get('/__routers', (req, res) => {
                return res.json({ routers: configRouter });
            });
            app.get('/__docs', (req, res) => {
                return res.sendFile('docs.html', { root: __dirname + '/../view' });
            });
        }
        for (const item of configRouter) {
            routerRegistration(item, app).catch((err) => console.error(err));
        }
    }
    else {
        routerRegistration(configRouter, app).catch((err) => console.error(err));
    }
}
exports.default = default_1;
/**
 * ROUTER-REGISTRATION
 * @param configRouter {IConfigRouter}
 * @param app {express.Application}
 */
async function routerRegistration(configRouter, app) {
    configRouter.type = 'pending';
    configRouter.status = 'pending';
    const routes = await getRoutes(configRouter);
    configRouter.status = 'connected';
    app.use(configRouter.baseUrl, (0, router_1.default)(routes, {
        controllersDir: path_1.default.resolve('controllers'),
        middlewareDir: path_1.default.resolve('middleware')
    }));
    if (configRouter.apiDocs && (0, helpers_1.env)('NODE_ENV') === 'development') {
        app.use('/__routes' + configRouter.baseUrl, (req, res) => {
            return res.json({ routes });
        });
        configRouter.apiDocs.baseUrl = configRouter.baseUrl === '/' ? '' : configRouter.baseUrl;
        app.use('/__docs' + configRouter.baseUrl, apiDocs(routes, configRouter.apiDocs));
    }
}
/**
 * GET-ROUTES
 * @param configRouter {Object}
 * @returns {Promise<Array>}
 */
async function getRoutes(configRouter) {
    const routes = [];
    if (configRouter.routesPath) {
        configRouter.type = 'Local';
        fillingRoutes(configRouter, routes, path_1.default.resolve(), configRouter.routesPath);
    }
    else if (configRouter.routesUrl) {
        configRouter.type = 'Remote';
        for (const route of await getRoutesThroughAxios(configRouter)) {
            fillingRoute(configRouter, route);
            routes.push(route);
        }
    }
    else {
        throw Error('Routes source required');
    }
    if (configRouter.routes?.length) {
        for (const route of configRouter.routes) {
            routes.push(route);
        }
    }
    return routes;
}
/**
 * GET-ROUTES-THROUGH-AXIOS
 * @param configRouter {Object}
 * @returns {Promise<Array>}
 */
async function getRoutesThroughAxios(configRouter) {
    try {
        const { data: { routes } } = await axios_1.default.get(configRouter.routesUrl);
        return routes;
    }
    catch (err) {
        console.error(err);
        configRouter.status = 'Reconnecting';
        return await new Promise((resolve) => {
            setTimeout(async () => {
                const routes = await getRoutesThroughAxios(configRouter);
                resolve(routes);
            }, configRouter.timeout || 3000);
        });
    }
}
/**
 * FILLING-ROUTES
 * @param configRouter {Object}
 * @param routes {Array}
 * @param basePath {string}
 * @param folder {string}
 */
function fillingRoutes(configRouter, routes, basePath, folder) {
    const files = fs_1.default.readdirSync(basePath + folder);
    for (const file of files) {
        if (!file.startsWith('_')) {
            const filePath = path_1.default.join(folder, file);
            const fileStat = fs_1.default.statSync(basePath + filePath);
            if (fileStat.isDirectory()) {
                fillingRoutes(configRouter, routes, basePath, filePath);
            }
            else if (file.endsWith('.js')) {
                const route = require(basePath + filePath);
                fillingRoute(configRouter, route);
                routes.push(route);
            }
        }
    }
}
/**
 * FILLING-ROUTE
 * @param configRouter {Object}
 * @param route {Object}
 */
function fillingRoute(configRouter, route) {
    if (configRouter.middleware) {
        if (route.middleware) {
            if (Array.isArray(route.middleware)) {
                if (Array.isArray(configRouter.middleware)) {
                    for (const middleware of configRouter.middleware) {
                        route.middleware.unshift(middleware);
                    }
                }
                else {
                    route.middleware.unshift(configRouter.middleware);
                }
            }
        }
        else {
            route.middleware = configRouter.middleware;
        }
    }
    setController(configRouter, route);
}
/**
 * SET-CONTROLLER
 * @param configRouter {Object}
 * @param route {Object}
 */
function setController(configRouter, route) {
    if (configRouter.controller) {
        if (route.method) {
            route.controller = configRouter.controller;
        }
        if (route.children?.length) {
            for (const _route of route.children) {
                setController(configRouter, _route);
            }
        }
    }
}
