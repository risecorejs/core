"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { getModels } = require('@risecorejs/helpers');
exports.default = getModels({
    configPath: ['database', 'config'],
    modelsDir: ['database', 'models'],
    NODE_ENV: true
});
