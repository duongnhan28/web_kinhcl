'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8 relative">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2">
                        <img src="/logo.jpg" alt="Oufeidun Logo" className="h-10 w-auto rounded-lg shadow-sm" />
                    </Link>
                </div>

                {/* Chữ Oufeidun ở chính giữa */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl md:text-3xl font-bold text-slate-900 font-sans">
                    Oufeidun
                </div>

                <div className="flex items-center gap-3 z-10">


                    <Link href="/admin/login" className="hidden md:inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                        Đăng nhập
                    </Link>

                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 md:hidden"
                    >
                        {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="border-t border-slate-200 bg-white px-6 py-4 md:hidden flex flex-col gap-4">

                    <Link href="/admin/login" className="text-sm font-medium text-slate-700" onClick={() => setIsMobileMenuOpen(false)}>
                        Đăng nhập
                    </Link>
                </div>
            )}
        </header>
    );
}
