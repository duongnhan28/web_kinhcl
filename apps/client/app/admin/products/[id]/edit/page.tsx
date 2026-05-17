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
    const id = params?.id as string;

    const { data: product, isLoading } = useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            const response = await apiClient.get(`/products/${id}`);
            return response.data.data;
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
                            <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400 mb-1">Hệ thống quản trị</p>
                            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Chỉnh sửa</h1>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex h-40 items-center justify-center text-slate-500">Đang tải dữ liệu...</div>
                    ) : product ? (
                        <ProductForm key={product.id} isEdit={true} initialData={product} />
                    ) : (
                        <div className="flex h-40 items-center justify-center text-slate-500">Không tìm thấy sản phẩm (ID: {id}).</div>
                    )}
                </div>
            </div>
        </AdminShell>
    );
}
