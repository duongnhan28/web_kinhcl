import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { json, urlencoded, Express } from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import { IncomingMessage, ServerResponse } from 'http';

let cachedApp: Express;

async function createApp(): Promise<Express> {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        cors: {
            origin: true,
            credentials: true
        }
    });

    app.setGlobalPrefix('api');
    app.use(helmet({ crossOriginResourcePolicy: false }));
    app.use(cookieParser());
    app.use(json({ limit: '5mb' }));
    app.use(urlencoded({ extended: true, limit: '5mb' }));
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: false,
            transformOptions: { enableImplicitConversion: true }
        })
    );

    await app.init();
    return app.getHttpAdapter().getInstance();
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
    if (!cachedApp) {
        cachedApp = await createApp();
    }
    cachedApp(req, res);
}
