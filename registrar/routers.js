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
            registerRouter(item, app).catch((err) => console.error(err));
        }
    }
    else {
        registerRouter(configRouter, app).catch((err) => console.error(err));
    }
}
exports.default = default_1;
/**
 * REGISTER-ROUTER
 * @param configRouter {IConfigRouter}
 * @param app {express.Application}
 */
async function registerRouter(configRouter, app) {
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
 * @param configRouter {IConfigRouter}
 * @returns {Promise<IRoute[]>}
 */
async function getRoutes(configRouter) {
    const routes = [];
    if (configRouter.routesDir) {
        configRouter.type = 'local';
        fillingRoutes(configRouter, routes, configRouter.routesDir);
    }
    else if (configRouter.routesUrl) {
        configRouter.type = 'remote';
        for (const route of await getRemoteRoutes(configRouter)) {
            changeRouteMiddleware(configRouter, route);
            changeRouteController(configRouter, route);
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
 * FILLING-ROUTES
 * @param configRouter {IConfigRouter}
 * @param routes {IRoute[]}
 * @param routesDir {string}
 */
function fillingRoutes(configRouter, routes, routesDir) {
    routesDir = routesDir === '/' ? '' : routesDir;
    const baseDir = path_1.default.join(path_1.default.resolve(), 'routes');
    const files = fs_1.default.readdirSync(path_1.default.join(baseDir, routesDir));
    for (const file of files) {
        if (!file.startsWith('_')) {
            const filePath = path_1.default.join(routesDir, file);
            const fileStat = fs_1.default.statSync(baseDir + filePath);
            if (fileStat.isDirectory()) {
                fillingRoutes(configRouter, routes, filePath);
            }
            else if (file.endsWith('.js')) {
                const route = require(baseDir + filePath);
                changeRouteMiddleware(configRouter, route);
                changeRouteController(configRouter, route);
                routes.push(route);
            }
        }
    }
}
/**
 * GET-REMOTE-ROUTES
 * @param configRouter {IConfigRouter}
 * @returns {Promise<IRoute[]>}
 */
async function getRemoteRoutes(configRouter) {
    try {
        const response = await axios_1.default.get(configRouter.routesUrl);
        return response.data.routes;
    }
    catch (err) {
        console.error(err);
        configRouter.status = 'reconnecting';
        return new Promise((resolve) => {
            setTimeout(async () => {
                const routes = await getRemoteRoutes(configRouter);
                resolve(routes);
            }, configRouter.timeout || 3000);
        });
    }
}
/**
 * CHANGE-ROUTE-MIDDLEWARE
 * @param configRouter {IConfigRouter}
 * @param route {IRoute}
 */
function changeRouteMiddleware(configRouter, route) {
    if (configRouter.middleware) {
        if (route.middleware) {
            if (Array.isArray(route.middleware)) {
                if (Array.isArray(configRouter.middleware)) {
                    for (const item of configRouter.middleware) {
                        route.middleware.unshift(item);
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
}
/**
 * CHANGE-ROUTE-CONTROLLER
 * @param configRouter {IConfigRouter}
 * @param route {IRoute}
 */
function changeRouteController(configRouter, route) {
    if (configRouter.controller) {
        if (route.method) {
            route.controller = configRouter.controller;
        }
        if (route.children?.length) {
            for (const item of route.children) {
                changeRouteController(configRouter, item);
            }
        }
    }
}
