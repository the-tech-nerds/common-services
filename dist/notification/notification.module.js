"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModule = void 0;
const common_1 = require("@nestjs/common");
const email_notification_1 = require("./email-notification");
const __1 = require("..");
const sms_notification_1 = require("./sms-notification");
let NotificationModule = class NotificationModule {
};
NotificationModule = __decorate([
    common_1.Module({
        imports: [__1.GatewayModule],
        providers: [email_notification_1.EmailNotification, sms_notification_1.SmsNotification],
        exports: [email_notification_1.EmailNotification, sms_notification_1.SmsNotification],
    })
], NotificationModule);
exports.NotificationModule = NotificationModule;
//# sourceMappingURL=notification.module.js.map