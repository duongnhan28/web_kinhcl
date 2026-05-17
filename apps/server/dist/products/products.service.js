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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductsService = class ProductsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const where = {};
        if (query.glassType)
            where.glassType = query.glassType;
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
    async findById(id) {
        return this.prisma.product.findUnique({
            where: { id },
            include: { images: true, models: true }
        });
    }
    async create(dto) {
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
    async update(id, dto) {
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
    async remove(id) {
        await this.prisma.productImage.deleteMany({ where: { productId: id } });
        await this.prisma.productModel.deleteMany({ where: { productId: id } });
        return this.prisma.product.delete({ where: { id } });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
