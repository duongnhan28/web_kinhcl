import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';
import rateLimit from 'express-rate-limit';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        cors: {
            origin: true,
            credentials: true
        }
    });

    app.useStaticAssets(join(process.cwd(), 'public'), {
        prefix: '/public/',
    });

    app.setGlobalPrefix('api');
    app.use(helmet({ crossOriginResourcePolicy: false }));
    app.use(cookieParser());
    app.use(json({ limit: '5mb' }));
    app.use(urlencoded({ extended: true, limit: '5mb' }));
    app.use(
        rateLimit({
            windowMs: 60 * 1000,
            max: 200,
            legacyHeaders: false
        } as any)
    );
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: false,
            transformOptions: { enableImplicitConversion: true }
        })
    );

    const port = process.env.PORT || 4000;
    await app.listen(port);
    console.log(`Server running on http://localhost:${port}/api`);
}

bootstrap();
