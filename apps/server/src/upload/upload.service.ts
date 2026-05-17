import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { randomBytes } from 'crypto';

@Injectable()
export class UploadService {
    private supabase: SupabaseClient;
    private bucket = 'images';

    constructor(private config: ConfigService) {
        this.supabase = createClient(
            this.config.get<string>('SUPABASE_URL')!,
            this.config.get<string>('SUPABASE_SERVICE_KEY')!
        );
    }

    async uploadImage(file: Express.Multer.File): Promise<string> {
        try {
            const filename = `${randomBytes(16).toString('hex')}.${file.mimetype.split('/')[1] || 'jpg'}`;
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
        } catch (error: any) {
            throw new InternalServerErrorException('Image upload failed: ' + error.message);
        }
    }

    async uploadMany(files: Express.Multer.File[]): Promise<string[]> {
        return Promise.all(files.map((file) => this.uploadImage(file)));
    }
}
