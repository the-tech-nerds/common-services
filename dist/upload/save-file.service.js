"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveFileService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let SaveFileService = class SaveFileService {
    async execute(model) {
        const connection = typeorm_1.getManager();
        const { url = '', type = '' } = model;
        const sql = `insert into file_storage (url,type) values('${url}', '${type}')`;
        const file = await connection.query(sql);
        return file;
    }
};
SaveFileService = __decorate([
    common_1.Injectable()
], SaveFileService);
exports.SaveFileService = SaveFileService;
//# sourceMappingURL=save-file.service.js.map