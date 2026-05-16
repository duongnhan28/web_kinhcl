'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api';
import { useAuthStore } from '../../../hooks/useAuthStore';
import { AdminShell } from '../../../components/admin-shell';

export default function AdminDashboardPage() {
    const token = useAuthStore((state) => state.token);
    const setToken = useAuthStore((state) => state.setToken);

    useEffect(() => {
        if (!token) {
            const saved = localStorage.getItem('accessToken');
            if (saved) setToken(saved);
        }
    }, [token, setToken]);

    const { data } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const productsResponse = await apiClient.get('/products?page=1&pageSize=1');
            const categoriesResponse = await apiClient.get('/categories');
            return {
                products: productsResponse.data.data.total,
                categories: categoriesResponse.data.data.length
            };
        }
    });

    return (
        <AdminShell>
            <div className="grid gap-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Dashboard</p>
                            <h1 className="text-3xl font-semibold text-slate-950">Tổng quan quản trị</h1>
                        </div>
                    </div>
                    <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                            <p className="text-sm text-slate-500">Sản phẩm</p>
                            <p className="mt-4 text-3xl font-semibold text-slate-950">{data?.products ?? '...'}</p>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                            <p className="text-sm text-slate-500">Danh mục</p>
                            <p className="mt-4 text-3xl font-semibold text-slate-950">{data?.categories ?? '...'}</p>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                            <p className="text-sm text-slate-500">Hỗ trợ</p>
                            <p className="mt-4 text-3xl font-semibold text-slate-950">24/7</p>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                            <p className="text-sm text-slate-500">Trạng thái</p>
                            <p className="mt-4 text-3xl font-semibold text-slate-950">Hoạt động</p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminShell>
    );
}
