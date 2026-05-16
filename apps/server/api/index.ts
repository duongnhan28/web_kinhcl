import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { configure as serverlessExpress } from '@vendia/serverless-express';

let cachedServer: any;

export default async function handler(req: any, res: any) {
    if (!cachedServer) {
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
        const expressApp = app.getHttpAdapter().getInstance();
        cachedServer = serverlessExpress({ app: expressApp });
    }

    return cachedServer(req, res);
}
