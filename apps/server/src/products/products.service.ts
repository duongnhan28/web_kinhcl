import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductsDto } from './dto/query-products.dto';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    async findAll(query: QueryProductsDto) {
        const where: any = {};
        if (query.glassType) where.glassType = query.glassType;
        if (query.search)
            where.OR = [
                { sku: { contains: query.search, mode: 'insensitive' } },
                { name: { contains: query.search, mode: 'insensitive' } },
                { description: { contains: query.search, mode: 'insensitive' } },
                { models: { some: { modelName: { contains: query.search, mode: 'insensitive' } } } }
            ];

        const orderBy = query.sort === 'price_desc'
            ? { price: 'desc' }
            : query.sort === 'name_asc'
                ? { name: 'asc' }
                : { createdAt: 'desc' };

        const page = Math.max(query.page, 1);
        const pageSize = Math.min(query.pageSize, 24);
        const skip = (page - 1) * pageSize;

        const [items, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                orderBy,
                take: pageSize,
                skip,
                include: { images: true, models: true }
            }),
            this.prisma.product.count({ where })
        ]);

        return { items, total, page, pageSize };
    }

    async findById(id: string) {
        return this.prisma.product.findUnique({
            where: { id },
            include: { images: true, models: true }
        });
    }

    async create(dto: CreateProductDto) {
        const product = await this.prisma.product.create({
            data: {
                ...dto,

                images: {
                    create: dto.images?.map((image, index) => ({ imageUrl: image, sortOrder: index })) || []
                },
                models: {
                    create: dto.models?.map((name) => ({ modelName: name })) || []
                }
            }
        });

        return product;
    }

    async update(id: string, dto: UpdateProductDto) {
        return this.prisma.product.update({
            where: { id },
            data: {
                ...dto,

                images: dto.images
                    ? {
                        deleteMany: {},
                        create: dto.images.map((image, index) => ({ imageUrl: image, sortOrder: index }))
                    }
                    : undefined,
                models: dto.models
                    ? {
                        deleteMany: {},
                        create: dto.models.map((name) => ({ modelName: name }))
                    }
                    : undefined
            }
        });
    }

    async remove(id: string) {
        await this.prisma.productImage.deleteMany({ where: { productId: id } });
        await this.prisma.productModel.deleteMany({ where: { productId: id } });
        return this.prisma.product.delete({ where: { id } });
    }




}
