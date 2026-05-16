'use client';

import Link from 'next/link';
import { Search, Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api';

export function Header() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    const { data: searchResults } = useQuery({
        queryKey: ['search-suggestions', searchQuery],
        queryFn: async () => {
            if (!searchQuery.trim()) return [];
            const res = await apiClient.get(`/products?search=${encodeURIComponent(searchQuery)}&page=1&pageSize=5`);
            return res.data.data.items;
        },
        enabled: searchQuery.trim().length > 0
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-xl font-bold tracking-tight text-slate-950">
                        KINH TOP
                    </Link>
                    <nav className="hidden items-center gap-6 md:flex">
                        <Link href="/products" className="text-sm font-medium text-slate-600 transition hover:text-slate-950">
                            Sản phẩm
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative" ref={searchRef}>
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                        >
                            <Search size={18} />
                        </button>

                        {isSearchOpen && (
                            <div className="absolute right-0 top-full mt-2 w-72 sm:w-96 rounded-3xl border border-slate-200 bg-white p-4 shadow-xl">
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Tìm kiếm sản phẩm (VD: iphone 15)..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
                                />
                                {searchQuery.trim().length > 0 && (
                                    <div className="mt-4 flex flex-col gap-2">
                                        {searchResults?.length > 0 ? (
                                            searchResults.map((product: any) => (
                                                <Link
                                                    key={product.id}
                                                    href={`/products?search=${encodeURIComponent(product.name)}`}
                                                    onClick={() => setIsSearchOpen(false)}
                                                    className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-slate-50"
                                                >
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={product.thumbnail} alt={product.name} className="h-10 w-10 rounded-lg object-cover border border-slate-100" />
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-slate-900 line-clamp-1">{product.name}</span>
                                                        <span className="text-xs text-slate-500">{product.price.toLocaleString()}₫</span>
                                                    </div>
                                                </Link>
                                            ))
                                        ) : (
                                            <p className="text-center text-sm text-slate-500 py-4">Không tìm thấy sản phẩm nào.</p>
                                        )}
                                        {searchResults?.length > 0 && (
                                            <Link
                                                href={`/products?search=${encodeURIComponent(searchQuery)}`}
                                                onClick={() => setIsSearchOpen(false)}
                                                className="mt-2 block rounded-xl bg-slate-50 py-2 text-center text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                                            >
                                                Xem tất cả kết quả
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

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
                    <Link href="/products" className="text-sm font-medium text-slate-700" onClick={() => setIsMobileMenuOpen(false)}>
                        Sản phẩm
                    </Link>
                    <Link href="/admin/login" className="text-sm font-medium text-slate-700" onClick={() => setIsMobileMenuOpen(false)}>
                        Đăng nhập
                    </Link>
                </div>
            )}
        </header>
    );
}
