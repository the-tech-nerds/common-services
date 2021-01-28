"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    auth: {
        local: 'http://localhost:8081',
        dev: 'http://auth:3000',
        prod: 'http://auth-service.default.svc.cluster.local:3000',
    },
    product: {
        local: 'http://localhost:8082',
        dev: 'http://product:3000',
        prod: 'http://product-service.default.svc.cluster.local:3000',
    },
    notification: {
        local: 'http://localhost:9001',
        dev: 'http://notification:3000',
        prod: 'http://notification-service.default.svc.cluster.local:3000',
    },
};
//# sourceMappingURL=gateway.services.js.map