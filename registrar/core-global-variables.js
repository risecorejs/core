"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("@risecorejs/helpers");
function default_1() {
    global.$getController = (controllerPath) => (method) => controllerPath + '.' + method;
    global.$env = helpers_1.env;
}
exports.default = default_1;
