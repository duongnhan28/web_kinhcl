import { Controller, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('upload')
export class UploadController {
    constructor(private uploadService: UploadService) { }

    @UseGuards(JwtAuthGuard)
    @Post('images')
    @UseInterceptors(FilesInterceptor('files', 6))
    async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
        if (!files || files.length === 0) {
            return { urls: [] };
        }
        const urls = await this.uploadService.uploadMany(files);
        return { urls };
    }
}
