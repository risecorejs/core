"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const module_aliases_1 = __importDefault(require("./module-aliases"));
const global_variables_1 = __importDefault(require("./global-variables"));
const global_structs_1 = __importDefault(require("./global-structs"));
const middleware_1 = __importDefault(require("./middleware"));
const routers_1 = __importDefault(require("./routers"));
const structs_api_1 = __importDefault(require("./structs-api"));
exports.default = {
    moduleAliases: module_aliases_1.default,
    globalVariables: global_variables_1.default,
    globalStructs: global_structs_1.default,
    middleware: middleware_1.default,
    routers: routers_1.default,
    structsAPI: structs_api_1.default
};
