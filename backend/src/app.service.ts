import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    constructor() {}

    getHello(): string {
        return 'Hello World!';
    }

    getHealth(): { status: string; timestamp: string } {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
        };
    }
}
