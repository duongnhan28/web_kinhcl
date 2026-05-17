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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
const crypto_1 = require("crypto");
let UploadService = class UploadService {
    constructor(config) {
        this.config = config;
        this.bucket = 'images';
        this.supabase = (0, supabase_js_1.createClient)(this.config.get('SUPABASE_URL'), this.config.get('SUPABASE_SERVICE_KEY'));
    }
    async uploadImage(file) {
        try {
            const filename = `${(0, crypto_1.randomBytes)(16).toString('hex')}.${file.mimetype.split('/')[1] || 'jpg'}`;
            const filepath = `uploads/${filename}`;
            const { error } = await this.supabase.storage
                .from(this.bucket)
                .upload(filepath, file.buffer, {
                contentType: file.mimetype,
                upsert: false
            });
            if (error) {
                throw new Error(error.message);
            }
            const { data } = this.supabase.storage
                .from(this.bucket)
                .getPublicUrl(filepath);
            return data.publicUrl;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Image upload failed: ' + error.message);
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
