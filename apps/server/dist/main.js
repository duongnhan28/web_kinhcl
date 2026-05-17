"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        cors: {
            origin: true,
            credentials: true
        }
    });
    app.useStaticAssets((0, path_1.join)(process.cwd(), 'public'), {
        prefix: '/public/',
    });
    app.setGlobalPrefix('api');
    app.use((0, helmet_1.default)({ crossOriginResourcePolicy: false }));
    app.use((0, cookie_parser_1.default)());
    app.use((0, express_1.json)({ limit: '5mb' }));
    app.use((0, express_1.urlencoded)({ extended: true, limit: '5mb' }));
    app.use((0, express_rate_limit_1.default)({
        windowMs: 60 * 1000,
        max: 200,
        legacyHeaders: false
    }));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: false,
        transformOptions: { enableImplicitConversion: true }
    }));
    const port = process.env.PORT || 4000;
    await app.listen(port);
    console.log(`Server running on http://localhost:${port}/api`);
}
bootstrap();
