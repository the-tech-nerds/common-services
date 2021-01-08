import { LoggerService } from '@nestjs/common';
import * as fs from 'fs';
import moment = require('moment');
import path = require('path');

export class CustomLoggerService implements LoggerService {
  constructor(
    private readonly currentDate = moment().format('YYYY-MM-DD'),
    private readonly currentTime = moment().format('YYYY-MM-DD hh:mm:ss a'),
    private readonly logPath = path.join(__dirname, '../../../../logs/'),
  ) {}
  log(message: string) {
    fs.writeFile(
      `${this.logPath}log-${this.currentDate}.txt`,
      `LOG: Time: ${this.currentTime} :: ${message}`,
      err => {
        // Rest of your code
        if (err) {
          //
        }
      },
    );
  }

  error(message: string) {
    fs.writeFile(
      `${this.logPath}error-${this.currentDate}.txt`,
      `ERROR: Time: ${this.currentTime} :: ${message}`,
      err => {
        // Rest of your code
        if (err) {
          //
        }
      },
    );
  }

  warn(message: string) {
    fs.writeFile(
      `${this.logPath}warning-${this.currentDate}.txt`,
      `WARNING: Time: ${this.currentTime} :: ${message}`,
      err => {
        // Rest of your code
        if (err) {
          //
        }
      },
    );
  }

  debug(message: string) {
    fs.writeFile(
      `${this.logPath}debug-${this.currentDate}.txt`,
      `DEBUG: Time: ${this.currentTime} :: ${message}`,
      err => {
        // Rest of your code
        if (err) {
          //
        }
      },
    );
  }

  verbose(message: string) {
    fs.writeFile(
      `${this.logPath}verbos-${this.currentDate}.txt`,
      `VERBOSE: Time: ${this.currentTime} :: ${message}`,
      err => {
        // Rest of your code
        if (err) {
          //
        }
      },
    );
  }
}
