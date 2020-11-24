"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonConfig = exports.setBootstrap = exports.CacheService = exports.CacheModule = void 0;
const cache_module_1 = require("./cache/cache.module");
Object.defineProperty(exports, "CacheModule", { enumerable: true, get: function () { return cache_module_1.CacheModule; } });
const cache_service_1 = require("./cache/cache.service");
Object.defineProperty(exports, "CacheService", { enumerable: true, get: function () { return cache_service_1.CacheService; } });
const app_bootstrap_1 = require("./app.bootstrap");
Object.defineProperty(exports, "setBootstrap", { enumerable: true, get: function () { return app_bootstrap_1.setBootstrap; } });
const common_config_1 = require("./config/common-config");
exports.commonConfig = common_config_1.default;
//# sourceMappingURL=index.js.map