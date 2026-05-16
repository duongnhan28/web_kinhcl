'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../../../lib/api';
import { AdminShell } from '../../../../../components/admin-shell';
import { ProductForm } from '../../../../../components/product-form';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function EditProductPage() {
    const params = useParams();
    const id = params.id as string;

    const { data: product, isLoading } = useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            // Note: Since the backend currently only exposes /products/:slug,
            // we should either fetch all products and find it, or if backend has GET /products/:id, use it.
            // Wait, does the backend have GET /products/:id? 
            // In categories it's just GET /categories.
            // Let's assume there is an endpoint or we just fetch the product list and find it.
            const response = await apiClient.get('/products?page=1&pageSize=100');
            const products = response.data.data.items;
            return products.find((p: any) => p.id === id);
        }
    });

    return (
        <AdminShell>
            <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
                    <div className="mb-8 flex items-center gap-4">
                        <Link href="/admin/products" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Quản lý sản phẩm</p>
                            <h1 className="text-3xl font-semibold text-slate-950">Chỉnh sửa</h1>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex h-40 items-center justify-center text-slate-500">Đang tải dữ liệu...</div>
                    ) : product ? (
                        <ProductForm isEdit={true} initialData={product} />
                    ) : (
                        <div className="flex h-40 items-center justify-center text-slate-500">Không tìm thấy sản phẩm.</div>
                    )}
                </div>
            </div>
        </AdminShell>
    );
}
