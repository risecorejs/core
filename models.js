"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getModels = require('@risecorejs/helpers/lib/get-models');
exports.default = getModels({
    configPath: ['database', 'config'],
    modelDir: ['database', 'models'],
    NODE_ENV: true
});
