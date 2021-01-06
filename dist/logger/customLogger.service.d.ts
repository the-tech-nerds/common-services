import { LoggerService } from '@nestjs/common';
export declare class CustomLoggerService implements LoggerService {
    private readonly currentDate;
    constructor(currentDate?: string);
    log(message: string): void;
    error(message: string): void;
    warn(message: string): void;
    debug(message: string): void;
    verbose(message: string): void;
}
