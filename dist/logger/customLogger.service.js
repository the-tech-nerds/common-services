"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomLoggerService = void 0;
const fs = require("fs");
const moment = require("moment");
class CustomLoggerService {
    constructor(currentDate = moment().format('YYYY-MM-DD')) {
        this.currentDate = currentDate;
    }
    log(message) {
        fs.writeFile(`./logs/log-${this.currentDate}.txt`, `LOG: ${message}`, err => {
            if (err) {
            }
        });
    }
    error(message) {
        fs.writeFile(`./logs/error-${this.currentDate}.txt`, `ERROR: ${message}`, err => {
            if (err) {
            }
        });
    }
    warn(message) {
        fs.writeFile(`./logs/warning-${this.currentDate}.txt`, `WARNING: ${message}`, err => {
            if (err) {
            }
        });
    }
    debug(message) {
        fs.writeFile(`./logs/debug-${this.currentDate}.txt`, `DEBUG: ${message}`, err => {
            if (err) {
            }
        });
    }
    verbose(message) {
        fs.writeFile(`./logs/verbos-${this.currentDate}.txt`, `VERBOSE: ${message}`, err => {
            if (err) {
            }
        });
    }
}
exports.CustomLoggerService = CustomLoggerService;
//# sourceMappingURL=customLogger.service.js.map