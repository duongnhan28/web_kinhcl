export type GlassType = 'Tempered' | 'Nano' | 'Privacy' | 'FullCover';

export interface Category {
    id: string;
    name: string;
    slug: string;
}

export interface ProductModel {
    id: string;
    productId: string;
    modelName: string;
}

export interface ProductImage {
    id: string;
    productId: string;
    imageUrl: string;
    sortOrder: number;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    brand: string;
    glassType: GlassType;
    stock: number;
    categoryId: string;
    thumbnail: string;
    isFeatured: boolean;
    createdAt: string;
    updatedAt: string;
    category?: Category;
    images?: ProductImage[];
    models?: ProductModel[];
}

export interface AdminProfile {
    id: string;
    username: string;
    createdAt: string;
}
