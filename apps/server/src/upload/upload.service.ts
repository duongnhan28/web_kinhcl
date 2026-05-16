import { Injectable, InternalServerErrorException } from '@nestjs/common';
import sharp from 'sharp';
import { join } from 'path';
import { promises as fs } from 'fs';
import { randomBytes } from 'crypto';

@Injectable()
export class UploadService {
    async uploadImage(file: Express.Multer.File) {
        try {
            const optimized = await sharp(file.buffer).resize({ width: 1400, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
            
            const uploadDir = join(process.cwd(), 'public', 'uploads');
            await fs.mkdir(uploadDir, { recursive: true });

            const filename = `${randomBytes(16).toString('hex')}.webp`;
            const filepath = join(uploadDir, filename);

            await fs.writeFile(filepath, optimized);

            const port = process.env.PORT || 4000;
            return `http://localhost:${port}/public/uploads/${filename}`;
        } catch (error) {
            throw new InternalServerErrorException('Image processing failed');
        }
    }

    async uploadMany(files: Express.Multer.File[]) {
        return Promise.all(files.map((file) => this.uploadImage(file)));
    }
}
