'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api';
import { AdminShell } from '../../../components/admin-shell';

export default function ChangePasswordPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const mutation = useMutation({
        mutationFn: async (data: any) => {
            const response = await apiClient.post('/auth/change-password', data);
            return response.data;
        },
        onSuccess: () => {
            setSuccess('Đổi mật khẩu thành công!');
            setError('');
            setTimeout(() => {
                router.push('/admin/products');
            }, 2000);
        },
        onError: (err: any) => {
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu');
            setSuccess('');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }
        if (formData.newPassword.length < 6) {
            setError('Mật khẩu mới phải từ 6 ký tự trở lên');
            return;
        }
        mutation.mutate({
            oldPassword: formData.oldPassword,
            newPassword: formData.newPassword
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <AdminShell>
            <div className="max-w-md mx-auto">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
                    <h1 className="text-2xl font-bold text-slate-900 mb-6">Đổi mật khẩu</h1>
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Mật khẩu cũ</label>
                            <input
                                type="password"
                                name="oldPassword"
                                required
                                value={formData.oldPassword}
                                onChange={handleChange}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-400 transition"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Mật khẩu mới</label>
                            <input
                                type="password"
                                name="newPassword"
                                required
                                value={formData.newPassword}
                                onChange={handleChange}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-400 transition"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Xác nhận mật khẩu mới</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-400 transition"
                            />
                        </div>

                        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
                        {success && <p className="text-sm text-emerald-500 font-medium">{success}</p>}

                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="w-full rounded-2xl bg-slate-950 py-4 text-sm font-bold text-white transition hover:bg-slate-800 disabled:bg-slate-400"
                        >
                            {mutation.isPending ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
                        </button>
                    </form>
                </div>
            </div>
        </AdminShell>
    );
}
