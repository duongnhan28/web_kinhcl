'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdmin } from '../../../lib/api';
import { useAuthStore } from '../../../hooks/useAuthStore';

export default function AdminLoginPage() {
    const router = useRouter();
    const setToken = useAuthStore((state) => state.setToken);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await loginAdmin(username, password);
            setToken(result.accessToken);
            router.push('/admin/products');
        } catch (err) {
            setError('Đăng nhập không thành công. Vui lòng kiểm tra lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid min-h-screen place-items-center bg-slate-50 px-6 py-20">
            <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
                <h1 className="mb-2 text-3xl font-semibold text-slate-950">Quản trị viên</h1>
                <p className="mb-8 text-sm text-slate-600">Đăng nhập để quản lý sản phẩm và danh mục.</p>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Tên đăng nhập</label>
                        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Nhập tên đăng nhập" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400" />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Mật khẩu</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Nhập mật khẩu" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400" />
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <button type="submit" disabled={loading} className="inline-flex w-full justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50">
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                </form>
            </div>
        </div>
    );
}
