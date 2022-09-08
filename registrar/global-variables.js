"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(globalVariables) {
    global.$ = {};
    for (const [key, value] of Object.entries(globalVariables)) {
        $[key] = value;
    }
}
exports.default = default_1;
