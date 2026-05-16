'use client';

import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api';
import { useAuthStore } from '../../../hooks/useAuthStore';
import { AdminShell } from '../../../components/admin-shell';
import Link from 'next/link';

export default function AdminProductsPage() {
    const token = useAuthStore((state) => state.token);
    const setToken = useAuthStore((state) => state.setToken);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!token) {
            const saved = localStorage.getItem('accessToken');
            if (saved) setToken(saved);
        }
    }, [token, setToken]);

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['admin-products', search],
        queryFn: async () => {
            const response = await apiClient.get('/products?page=1&pageSize=100');
            return response.data.data.items;
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await apiClient.delete(`/products/${id}`);
        },
        onSuccess: () => {
            refetch();
        }
    });

    const handleDelete = (id: string) => {
        if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            deleteMutation.mutate(id);
        }
    };

    const products = data?.filter((item: any) => item.name.toLowerCase().includes(search.toLowerCase())) ?? [];

    return (
        <AdminShell>
            <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Quản lý sản phẩm</p>
                            <h1 className="text-3xl font-semibold text-slate-950">Kính cường lực</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => refetch()} className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                                Làm mới
                            </button>
                            <Link href="/admin/products/new" className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                                + Thêm sản phẩm
                            </Link>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm kiếm sản phẩm..." className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none sm:max-w-xs focus:border-slate-400 transition" />
                    </div>

                    <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200">
                        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                            <thead className="bg-slate-50 text-slate-700">
                                <tr>
                                    <th className="px-6 py-4">Tên sản phẩm</th>
                                    <th className="px-6 py-4">Thương hiệu</th>
                                    <th className="px-6 py-4">Giá bán</th>
                                    <th className="px-6 py-4">Tồn kho</th>
                                    <th className="px-6 py-4 text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                                            Đang tải...
                                        </td>
                                    </tr>
                                ) : products.length ? (
                                    products.map((product: any) => (
                                        <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-slate-200">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={product.thumbnail} alt={product.name} className="h-full w-full object-cover" />
                                                    </div>
                                                    <span className="font-medium text-slate-900 line-clamp-2">{product.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">{product.brand}</td>
                                            <td className="px-6 py-4 font-medium text-emerald-600">{product.price.toLocaleString()}₫</td>
                                            <td className="px-6 py-4 text-slate-600">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-3">
                                                <Link href={`/admin/products/${product.id}/edit`} className="text-blue-600 hover:underline font-medium">Sửa</Link>
                                                <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:underline font-medium">Xóa</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                                            Không tìm thấy sản phẩm nào.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminShell>
    );
}
