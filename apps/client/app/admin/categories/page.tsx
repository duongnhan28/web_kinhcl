'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api';
import { useAuthStore } from '../../../hooks/useAuthStore';
import { AdminShell } from '../../../components/admin-shell';

export default function AdminCategoriesPage() {
    const token = useAuthStore((state) => state.token);
    const setToken = useAuthStore((state) => state.setToken);
    
    // Create state
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    
    // Edit state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editSlug, setEditSlug] = useState('');

    useEffect(() => {
        if (!token) {
            const saved = localStorage.getItem('accessToken');
            if (saved) setToken(saved);
        }
    }, [token, setToken]);

    const { data, refetch, isLoading } = useQuery({
        queryKey: ['admin-categories'],
        queryFn: async () => {
            const response = await apiClient.get('/categories');
            return response.data.data;
        }
    });

    const createMutation = useMutation({
        mutationFn: async () => {
            await apiClient.post('/categories', { name, slug });
        },
        onSuccess: () => {
            setName('');
            setSlug('');
            refetch();
        }
    });

    const updateMutation = useMutation({
        mutationFn: async (id: string) => {
            await apiClient.patch(`/categories/${id}`, { name: editName, slug: editSlug });
        },
        onSuccess: () => {
            setEditingId(null);
            refetch();
        }
    });

    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await apiClient.delete(`/categories/${id}`);
        },
        onSuccess: () => {
            refetch();
            queryClient.invalidateQueries({ queryKey: ['categories-list'] });
        },
        onError: () => {
            alert('Có lỗi xảy ra khi xóa dòng máy! (Vui lòng tải lại trang)');
        }
    });

    const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        createMutation.mutate();
    };

    const handleUpdate = async (id: string) => {
        updateMutation.mutate(id);
    };

    const handleDelete = async (id: string) => {
        if (confirm('🚨 CẢNH BÁO NGUY HIỂM 🚨\n\nBạn có chắc chắn muốn xóa dòng máy này?\nHành động này sẽ XÓA TOÀN BỘ SẢN PHẨM thuộc dòng máy này và KHÔNG THỂ hoàn tác!')) {
            deleteMutation.mutate(id);
        }
    };

    const startEditing = (category: any) => {
        setEditingId(category.id);
        setEditName(category.name);
        setEditSlug(category.slug);
    };

    return (
        <AdminShell>
            <div className="space-y-8">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Quản lý dòng máy</p>
                            <h1 className="text-3xl font-semibold text-slate-950">Dòng máy điện thoại</h1>
                        </div>
                    </div>

                    <form onSubmit={handleCreate} className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên dòng máy (VD: iPhone 15 Series)" className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" required />
                        <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="Slug (VD: iphone-15-series)" className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" required />
                        <button type="submit" disabled={createMutation.isPending} className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50">
                            Thêm dòng máy
                        </button>
                    </form>

                    <div className="mt-10 overflow-hidden rounded-3xl border border-slate-200">
                        <table className="min-w-full divide-y divide-slate-200 text-sm text-left">
                            <thead className="bg-slate-50 text-slate-700">
                                <tr>
                                    <th className="px-6 py-4">Tên</th>
                                    <th className="px-6 py-4">Slug</th>
                                    <th className="px-6 py-4 text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-slate-500">Đang tải...</td>
                                    </tr>
                                ) : data?.map((category: any) => (
                                    <tr key={category.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            {editingId === category.id ? (
                                                <input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none" />
                                            ) : (
                                                <span className="font-medium text-slate-900">{category.name}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {editingId === category.id ? (
                                                <input value={editSlug} onChange={(e) => setEditSlug(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none" />
                                            ) : (
                                                category.slug
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            {editingId === category.id ? (
                                                <>
                                                    <button onClick={() => handleUpdate(category.id)} className="text-green-600 hover:underline">Lưu</button>
                                                    <button onClick={() => setEditingId(null)} className="text-slate-500 hover:underline">Hủy</button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => startEditing(category)} className="text-blue-600 hover:underline">Sửa</button>
                                                    <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:underline">Xóa</button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {!isLoading && data?.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-slate-500">Chưa có dòng máy nào.</td>
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
