"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailNotification = void 0;
class EmailNotification {
    constructor(gatewayService) {
        this.gatewayService = gatewayService;
    }
    send(emailNotificationRequest) {
        this.gatewayService.execute('notification', {
            method: 'POST',
            path: '/api/v1/email/send/email',
            body: Object.assign({}, emailNotificationRequest),
        });
    }
}
exports.EmailNotification = EmailNotification;
//# sourceMappingURL=email-notification.js.map