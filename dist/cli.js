"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandRegistration = void 0;
const core_1 = require("@nestjs/core");
const nestjs_command_1 = require("nestjs-command");
exports.commandRegistration = async (module) => {
    const app = await core_1.NestFactory.createApplicationContext(module, {
        logger: false,
    });
    app
        .select(nestjs_command_1.CommandModule)
        .get(nestjs_command_1.CommandService)
        .exec();
};
//# sourceMappingURL=cli.js.map