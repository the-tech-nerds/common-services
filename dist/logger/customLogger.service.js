"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomLoggerService = void 0;
const fs = require("fs");
const moment = require("moment");
const path = require("path");
class CustomLoggerService {
    constructor(currentDate = moment().format('YYYY-MM-DD'), currentTime = moment().format('YYYY-MM-DD hh:mm:ss a'), logPath = path.join(__dirname, '../../../../../logs/')) {
        this.currentDate = currentDate;
        this.currentTime = currentTime;
        this.logPath = logPath;
    }
    log(message) {
        this.checkDir();
        fs.writeFile(`${this.logPath}log-${this.currentDate}.txt`, `LOG: Time: ${this.currentTime} :: ${message}`, err => {
            if (err) {
            }
        });
    }
    error(message) {
        this.checkDir();
        fs.writeFile(`${this.logPath}error-${this.currentDate}.txt`, `ERROR: Time: ${this.currentTime} :: ${message}`, err => {
            if (err) {
            }
        });
    }
    warn(message) {
        this.checkDir();
        fs.writeFile(`${this.logPath}warning-${this.currentDate}.txt`, `WARNING: Time: ${this.currentTime} :: ${message}`, err => {
            if (err) {
            }
        });
    }
    debug(message) {
        this.checkDir();
        fs.writeFile(`${this.logPath}debug-${this.currentDate}.txt`, `DEBUG: Time: ${this.currentTime} :: ${message}`, err => {
            if (err) {
            }
        });
    }
    verbose(message) {
        this.checkDir();
        fs.writeFile(`${this.logPath}verbos-${this.currentDate}.txt`, `VERBOSE: Time: ${this.currentTime} :: ${message}`, err => {
            if (err) {
            }
        });
    }
    checkDir() {
        if (!fs.existsSync(this.logPath)) {
            fs.mkdirSync(this.logPath);
        }
    }
}
exports.CustomLoggerService = CustomLoggerService;
//# sourceMappingURL=customLogger.service.js.map