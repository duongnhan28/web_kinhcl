"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cloudinary_1 = require("cloudinary");
const sharp_1 = __importDefault(require("sharp"));
let UploadService = class UploadService {
    constructor(config) {
        this.config = config;
        cloudinary_1.v2.config({
            cloud_name: this.config.get('CLOUDINARY_CLOUD_NAME'),
            api_key: this.config.get('CLOUDINARY_API_KEY'),
            api_secret: this.config.get('CLOUDINARY_API_SECRET')
        });
    }
    async uploadImage(file) {
        try {
            const optimized = await (0, sharp_1.default)(file.buffer).resize({ width: 1400, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
            return new Promise((resolve, reject) => {
                const stream = cloudinary_1.v2.uploader.upload_stream({ folder: 'kinh-top', resource_type: 'image' }, (error, result) => {
                    if (error || !result) {
                        return reject(new common_1.InternalServerErrorException('Failed to upload image'));
                    }
                    resolve(result.secure_url);
                });
                stream.end(optimized);
            });
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
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], UploadService);
