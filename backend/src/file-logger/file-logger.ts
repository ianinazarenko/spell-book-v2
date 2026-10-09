import { ConsoleLogger, OnModuleInit } from '@nestjs/common';
import path from 'node:path';
import * as fs from 'node:fs';

type LogLevel = 'INFO' | 'WARN' | 'ERROR';

export class FileLogger extends ConsoleLogger {
    private readonly logsDir = path.join(process.cwd(), 'logs');

    constructor(context: string) {
        super(context);

        if (!fs.existsSync(this.logsDir)) {
            fs.mkdirSync(this.logsDir, { recursive: true });
        }

        this.cleanOldLogs();
    }

    log(message: string, context?: string): void {
        if (context) {
            super.log(message, context);
        } else {
            super.log(message);
        }

        this.writeToFile('INFO', message, context);
    }

    error(message: string, stack?: string, context?: string): void {
        super.error(message, stack, context);
        this.writeToFile('ERROR', `${message} ${stack ? `\nStack: ${stack}` : ''}`, context);
    }

    private cleanOldLogs(maxDays: number = 7): void {
        const now = Date.now();
        const maxAgeMs = maxDays * 24 * 60 * 60 * 1000;

        fs.readdir(this.logsDir, (err, files) => {
            if (err) {
                console.error(`Could not read logs from dir: ${err}`);
                return;
            }

            for (const file of files) {
                const filePath = path.join(this.logsDir, file);
                if (err) return;

                fs.stat(filePath, (err, stats) => {
                    if (err) return;
                    // Если файл старше maxDays — удаляем
                    if (now - stats.mtimeMs > maxAgeMs) {
                        fs.unlink(filePath, () => {});
                    }
                });
            }
        });
    }

    private writeToFile(level: LogLevel, message: string, context?: string): void {
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const filePath = path.join(this.logsDir, `spellbook-${dateStr}.log`);

        const timestamp = now.toISOString();
        const cxt = context || this.context || 'App';
        const logLine = `[${timestamp}] [${level}] [${cxt}]: ${typeof message === 'object' ? JSON.stringify(message) : message}\n`;

        fs.appendFile(filePath, logLine, (err) => {
            if (err) {
                console.error(`Could not write log to file: ${err}`);
            }
        });
    }
}
