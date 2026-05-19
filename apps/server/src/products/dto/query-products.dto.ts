import { IsIn, IsInt, IsOptional, IsPositive, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryProductsDto {
    @IsOptional()
    @IsString()
    brand?: string;



    @IsOptional()
    @IsString()
    categoryId?: string;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsIn(['price_asc', 'price_desc', 'name_asc', 'recent'])
    sort?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    pageSize = 12;
}
