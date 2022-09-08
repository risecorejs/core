"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(configGlobalVariables) {
    global.$ = {};
    for (const [key, value] of Object.entries(configGlobalVariables)) {
        $[key] = value;
    }
}
exports.default = default_1;
