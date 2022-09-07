declare const path: any;
declare const fs: any;
declare const router: any;
declare const apiDocs: any;
declare const axios: any;
/**
 * GET-ROUTES
 * @param routerConfig {Object}
 * @returns {Promise<Array>}
 */
declare function getRoutes(routerConfig: any): Promise<any[]>;
/**
 * GET-ROUTES-THROUGH-AXIOS
 * @param routerConfig {Object}
 * @returns {Promise<Array>}
 */
declare function getRoutesThroughAxios(routerConfig: any): Promise<any>;
/**
 * FILLING-ROUTES
 * @param routerConfig {Object}
 * @param routes {Array}
 * @param basePath {string}
 * @param folder {string}
 */
declare function fillingRoutes(routerConfig: any, routes: any, basePath: any, folder: any): void;
/**
 * FILLING-ROUTE
 * @param routerConfig {Object}
 * @param route {Object}
 */
declare function fillingRoute(routerConfig: any, route: any): void;
/**
 * SET-CONTROLLER
 * @param routerConfig {Object}
 * @param route {Object}
 */
declare function setController(routerConfig: any, route: any): void;
