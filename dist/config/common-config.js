"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    app_name: process.env.APP_NAME,
    app_client_id: process.env.APP_CLIENT_ID,
    app_client_secret: process.env.APP_CLIENT_SECRET,
    client_key: process.env.CLIENT_SECRET_KEY,
    redis_global_host: process.env.REDIS_GLOBAL_HOST,
    redis_global_port: process.env.REDIS_GLOBAL_PORT,
    api_rate_limit_time: process.env.API_RATE_LIMIT_TIME,
    api_rate_limit_max: process.env.API_RATE_LIMIT_MAX,
    aws_access_key: process.env.AWS_ACCESS_KEY_ID,
    aws_secret_key: process.env.AWS_SECRET_ACCESS_KEY,
});
//# sourceMappingURL=common-config.js.map