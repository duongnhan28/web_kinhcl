import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, IsUUID, Min } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsOptional()
    sku?: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    slug: string;

    @IsString()
    @IsNotEmpty()
    description: string;





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
