import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductsDto } from './dto/query-products.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get()
    async findAll(@Query() query: QueryProductsDto) {
        return this.productsService.findAll(query);
    }

    @Get('filters')
    async getFilters() {
        return this.productsService.getFilters();
    }

    @Get(':slug')
    async findOne(@Param('slug') slug: string) {
        return this.productsService.findBySlug(slug);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() dto: CreateProductDto) {
        return this.productsService.create(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
        return this.productsService.update(id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.productsService.remove(id);
    }
}
