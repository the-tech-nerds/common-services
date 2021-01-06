import { LoggerService } from '@nestjs/common';
import * as fs from 'fs';
import moment = require('moment');

export class CustomLoggerService implements LoggerService {
  constructor(private readonly currentDate = moment().format('YYYY-MM-DD')) {}
  log(message: string) {
    fs.writeFile(
      `./logs/log-${this.currentDate}.txt`,
      `LOG: ${message}`,
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
      `./logs/error-${this.currentDate}.txt`,
      `ERROR: ${message}`,
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
      `./logs/warning-${this.currentDate}.txt`,
      `WARNING: ${message}`,
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
      `./logs/debug-${this.currentDate}.txt`,
      `DEBUG: ${message}`,
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
      `./logs/verbos-${this.currentDate}.txt`,
      `VERBOSE: ${message}`,
      err => {
        // Rest of your code
        if (err) {
          //
        }
      },
    );
  }
}
