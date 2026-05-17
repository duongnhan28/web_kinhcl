"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const sharp_1 = __importDefault(require("sharp"));
const path_1 = require("path");
const fs_1 = require("fs");
const crypto_1 = require("crypto");
let UploadService = class UploadService {
    async uploadImage(file) {
        try {
            const optimized = await (0, sharp_1.default)(file.buffer).resize({ width: 1400, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
            const uploadDir = (0, path_1.join)(process.cwd(), 'public', 'uploads');
            await fs_1.promises.mkdir(uploadDir, { recursive: true });
            const filename = `${(0, crypto_1.randomBytes)(16).toString('hex')}.webp`;
            const filepath = (0, path_1.join)(uploadDir, filename);
            await fs_1.promises.writeFile(filepath, optimized);
            const port = process.env.PORT || 4000;
            return `http://localhost:${port}/public/uploads/${filename}`;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Image processing failed');
        }
    }
    async uploadMany(files) {
        return Promise.all(files.map((file) => this.uploadImage(file)));
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)()
], UploadService);
