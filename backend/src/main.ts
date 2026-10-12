import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';

const CLIENT_URL = 'http://localhost:8080';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        forceCloseConnections: true,
    });
    app.enableShutdownHooks();

    // Global DTO validation
    app.useGlobalPipes(
        new ValidationPipe({
            // turn on whitelst and forbid any non listed fieldes
            whitelist: true,
            forbidNonWhitelisted: true,
        })
    );

    app.enableCors({
        origin: CLIENT_URL,
    });

    await app.listen(process.env.PORT ?? 8000, '127.0.0.1');
}

await bootstrap();
