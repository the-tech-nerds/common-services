"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponseService = void 0;
const common_1 = require("@nestjs/common");
const customLogger_service_1 = require("../logger/customLogger.service");
let ApiResponseService = class ApiResponseService {
    constructor(loggerService) {
        this.loggerService = loggerService;
    }
    response(message, status, code, data, res) {
        return res.status(200).json({
            message,
            status,
            code,
            data,
        });
    }
    successResponse(message, data, res) {
        return res.status(200).json({
            message,
            status: 'success',
            code: 200,
            data,
        });
    }
    notFoundError(message, res) {
        return res.status(404).json({
            message,
            status: 'Not Found',
            code: 404,
            data: null,
        });
    }
    badRequestError(message, res) {
        return res.status(400).json({
            message,
            status: 'Bad request',
            code: 400,
            data: null,
        });
    }
    unAuthorizedError(message, res) {
        return res.status(401).json({
            message,
            status: 'Unauthorized',
            code: 401,
            data: null,
        });
    }
    forbiddenError(message, res) {
        return res.status(403).json({
            message,
            status: 'Forbidden',
            code: 403,
            data: null,
        });
    }
    internalServerError(message, res) {
        this.loggerService.error(message[0]);
        return res.status(500).json({
            message,
            status: 'failure',
            code: 500,
            data: null,
        });
    }
};
ApiResponseService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [customLogger_service_1.CustomLoggerService])
], ApiResponseService);
exports.ApiResponseService = ApiResponseService;
//# sourceMappingURL=api-response.service.js.map