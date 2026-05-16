import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, IsUUID, Min } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    slug: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsInt()
    @Min(0)
    price: number;

    @IsString()
    @IsNotEmpty()
    brand: string;

    @IsString()
    @IsNotEmpty()
    glassType: string;

    @IsInt()
    @Min(0)
    stock: number;

    @IsUUID()
    categoryId: string;

    @IsString()
    @IsNotEmpty()
    thumbnail: string;

    @IsBoolean()
    isFeatured: boolean;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    models?: string[];
}
