'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type ReactNode, useEffect, useState } from 'react';
import { useAuthStore } from '../hooks/useAuthStore';

interface AdminShellProps {
    children: ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
    const router = useRouter();
    const token = useAuthStore((state) => state.token);
    const logout = useAuthStore((state) => state.logout);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const storedToken = localStorage.getItem('accessToken');
        if (!token && !storedToken) {
            router.push('/admin/login');
        }
    }, [token, router]);

    if (!isMounted) return null;

    const handleLogout = () => {
        logout();
        router.push('/admin/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-950">
            <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur-sm">
                <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <img src="/logo.jpg" alt="Oufeidun Logo" className="h-9 w-auto rounded-lg" />
                        </Link>
                        <div className="flex items-center gap-2 md:hidden">
                            <Link href="/" target="_blank" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition">
                                Xem Website
                            </Link>
                            <button onClick={handleLogout} className="rounded-xl bg-red-50 text-red-600 px-3 py-2 text-xs font-semibold hover:bg-red-100 transition">
                                Thoát
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center md:gap-6">

                        <div className="hidden items-center gap-3 md:flex">
                            <div className="h-6 w-px bg-slate-200" />
                            <Link href="/" target="_blank" className="rounded-2xl bg-slate-900 text-white px-5 py-2.5 text-sm font-semibold hover:bg-slate-800 transition shadow-sm">
                                Xem Website
                            </Link>
                             <Link href="/admin/change-password" title="Đổi mật khẩu" className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
                                Đổi mật khẩu
                            </Link>
                            <button onClick={handleLogout} className="rounded-2xl bg-red-50 text-red-600 px-5 py-2.5 text-sm font-semibold hover:bg-red-100 transition">
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            <main className="mx-auto max-w-7xl px-6 py-10 sm:px-8">{children}</main>
        </div>
    );
}
