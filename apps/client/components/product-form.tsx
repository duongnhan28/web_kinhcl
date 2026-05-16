'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import { ImageUpload } from './image-upload';
import { ChevronDown } from 'lucide-react';

interface ProductFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export function ProductForm({ initialData, isEdit }: ProductFormProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        slug: initialData?.slug || '',
        description: initialData?.description || '',
        price: initialData?.price || 0,
        brand: initialData?.brand || '',
        glassType: initialData?.glassType || '',
        stock: initialData?.stock || 0,
        categoryId: initialData?.categoryId || '',
        isFeatured: initialData?.isFeatured || false,
        thumbnail: initialData?.thumbnail || '',
        images: initialData?.images?.map((img: any) => img.imageUrl) || [],
        models: initialData?.models?.map((m: any) => m.modelName).join(', ') || ''
    });

    const { data: categories } = useQuery({
        queryKey: ['categories-list'],
        queryFn: async () => {
            const response = await apiClient.get('/categories');
            return response.data.data;
        }
    });

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            models: formData.models.split(',').map((s: string) => s.trim()).filter(Boolean)
        };

        try {
            if (isEdit && initialData?.id) {
                await apiClient.patch(`/products/${initialData.id}`, payload);
            } else {
                await apiClient.post('/products', payload);
            }
            
            // Ép xóa cache cũ để tải lại giá và sản phẩm mới
            await queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            await queryClient.invalidateQueries({ queryKey: ['products'] });
            await queryClient.invalidateQueries({ queryKey: ['products-filters'] });

            router.push('/admin/products');
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Có lỗi xảy ra khi lưu sản phẩm!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Tên sản phẩm</label>
                    <input name="name" value={formData.name} onChange={handleChange} required className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Slug URL</label>
                    <input name="slug" value={formData.slug} onChange={handleChange} required className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400" />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Thương hiệu</label>
                    <input name="brand" value={formData.brand} onChange={handleChange} required className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Dòng máy (Category)</label>
                    <div className="relative">
                        <select name="categoryId" value={formData.categoryId} onChange={handleChange} required className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm outline-none transition focus:border-slate-400">
                            <option value="">Chọn dòng máy</option>
                            {categories?.map((cat: any) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Giá bán (VNĐ)</label>
                    <input name="price" type="number" min="0" value={formData.price} onChange={handleChange} required className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Tồn kho</label>
                    <input name="stock" type="number" min="0" value={formData.stock} onChange={handleChange} required className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Loại kính (Chống nhìn trộm...)</label>
                    <input name="glassType" value={formData.glassType} onChange={handleChange} required className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Các model tương thích (Cách nhau bằng dấu phẩy)</label>
                <input name="models" value={formData.models} onChange={handleChange} placeholder="VD: iPhone 15 Pro, iPhone 15 Pro Max" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400" />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Mô tả sản phẩm</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={4} required className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400" />
            </div>

            <div className="space-y-6 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Ảnh đại diện (Thumbnail)</label>
                    <ImageUpload 
                        value={formData.thumbnail ? [formData.thumbnail] : []} 
                        onChange={(urls) => setFormData({ ...formData, thumbnail: urls[0] || '' })} 
                        maxFiles={1} 
                    />
                </div>
                
                <div className="h-px w-full bg-slate-200" />

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Ảnh chi tiết (Tối đa 6 ảnh)</label>
                    <ImageUpload 
                        value={formData.images} 
                        onChange={(urls) => setFormData({ ...formData, images: urls })} 
                        maxFiles={6} 
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <input type="checkbox" name="isFeatured" id="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-slate-900 focus:ring-slate-900" />
                <label htmlFor="isFeatured" className="text-sm font-medium text-slate-700">Sản phẩm nổi bật</label>
            </div>

            <div className="flex justify-end gap-4 pt-6">
                <button type="button" onClick={() => router.back()} className="rounded-full px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
                    Hủy bỏ
                </button>
                <button type="submit" disabled={loading} className="rounded-full bg-slate-950 px-8 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50">
                    {loading ? 'Đang lưu...' : 'Lưu sản phẩm'}
                </button>
            </div>
        </form>
    );
}
