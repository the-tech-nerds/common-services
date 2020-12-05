"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandRegistration = void 0;
const nestjs_command_1 = require("nestjs-command");
exports.commandRegistration = async (app) => {
    app
        .select(nestjs_command_1.CommandModule)
        .get(nestjs_command_1.CommandService)
        .exec();
};
//# sourceMappingURL=cli.js.map