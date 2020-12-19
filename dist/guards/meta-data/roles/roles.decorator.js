"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HasRoles = void 0;
const common_1 = require("@nestjs/common");
exports.HasRoles = (roles, type) => common_1.SetMetadata('has-roles', { roles, type });
//# sourceMappingURL=roles.decorator.js.map