import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) { }

    findAll() {
        return this.prisma.category.findMany({ orderBy: { name: 'asc' } });
    }

    create(dto: CreateCategoryDto) {
        return this.prisma.category.create({ data: dto });
    }

    update(id: string, dto: UpdateCategoryDto) {
        return this.prisma.category.update({ where: { id }, data: dto });
    }

    remove(id: string) {
        return this.prisma.category.delete({ where: { id } });
    }
}
