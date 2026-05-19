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
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (!token) {
            const saved = localStorage.getItem('accessToken');
            if (saved) setToken(saved);
        }
    }, [token, setToken]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);
        return () => clearTimeout(handler);
    }, [search]);

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch]);

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['admin-products', debouncedSearch, currentPage],
        queryFn: async () => {
            const response = await apiClient.get('/products', {
                params: {
                    page: currentPage,
                    pageSize: 30,
                    search: debouncedSearch.trim() || undefined
                }
            });
            return response.data.data;
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

    const products = data?.items ?? [];
    const total = data?.total ?? 0;
    const totalPages = Math.ceil(total / 30);

    return (
        <AdminShell>
            <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400 mb-1">Hệ thống quản trị</p>
                            <h1 className="text-4xl font-normal text-slate-900 tracking-tight">Kính cường lực</h1>
                        </div>
                        <div className="flex items-center gap-3">
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
                                    <th className="px-6 py-4 w-20 text-center">STT</th>
                                    <th className="px-6 py-4">Mã SKU</th>
                                    <th className="px-6 py-4 text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                                            Đang tải...
                                        </td>
                                    </tr>
                                ) : products.length ? (
                                    products.map((product: any, index: number) => (
                                        <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 w-20 text-center font-semibold text-slate-500">
                                                {(currentPage - 1) * 30 + index + 1}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-slate-200">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={product.thumbnail || 'https://placehold.co/100x100/f8fafc/94a3b8?text=KINH'} alt="Kính" className="h-full w-full object-cover" />
                                                    </div>
                                                    <span className="font-bold text-slate-900">{product.sku || product.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-3">
                                                <Link href={`/admin/products/${product.id}/edit`} className="text-blue-600 hover:underline font-medium">Sửa</Link>
                                                <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:underline font-medium">Xóa</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                                            Không tìm thấy sản phẩm nào.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {total > 0 && (
                        <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row">
                            <div className="text-sm text-slate-500">
                                Hiển thị <span className="font-semibold text-slate-900">{products.length}</span> trên tổng số <span className="font-semibold text-slate-900">{total}</span> sản phẩm (Trang {currentPage}/{totalPages})
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:pointer-events-none"
                                >
                                    Trang trước
                                </button>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => setCurrentPage(p)}
                                            className={`h-8 w-8 rounded-full text-xs font-semibold transition ${
                                                p === currentPage
                                                    ? 'bg-slate-950 text-white'
                                                    : 'text-slate-700 hover:bg-slate-100'
                                            }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:pointer-events-none"
                                >
                                    Trang sau
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminShell>
    );
}
