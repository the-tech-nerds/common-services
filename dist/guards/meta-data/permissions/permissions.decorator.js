"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HasPermissions = void 0;
const common_1 = require("@nestjs/common");
exports.HasPermissions = (permissions, type = 1) => common_1.SetMetadata('has-permissions', {
    permissions,
    type,
});
//# sourceMappingURL=permissions.decorator.js.map