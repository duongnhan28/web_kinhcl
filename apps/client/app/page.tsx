'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { Search, Check, Smartphone, Box } from 'lucide-react';
import Link from 'next/link';

// Helper: highlight phần text khớp với keyword
function HighlightText({ text, keyword }: { text: string; keyword: string }) {
    if (!keyword.trim()) return <>{text}</>;
    const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
        <>
            {parts.map((part, i) =>
                regex.test(part) ? (
                    <mark key={i} className="bg-transparent text-orange-600 font-bold not-italic">{part}</mark>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </>
    );
}

export default function HomePage() {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);
        return () => clearTimeout(handler);
    }, [search]);

    const { data, isLoading } = useQuery({
        queryKey: ['products-search', debouncedSearch],
        queryFn: async () => {
            if (!debouncedSearch) return { items: [] };
            const params = new URLSearchParams();
            params.append('search', debouncedSearch);
            params.append('page', '1');
            params.append('pageSize', '50'); 
            const response = await apiClient.get(`/products?${params.toString()}`);
            return response.data.data;
        },
        enabled: debouncedSearch.length > 0
    });

    const products = data?.items ?? [];

    return (
        <div className="min-h-screen bg-[#fafbfc] text-slate-900 font-sans flex flex-col">
            <Header />
            
            <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 py-8 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Ads Banner (Hidden on Mobile, spans 2 cols on Large) */}
                    <div className="hidden lg:block lg:col-span-3 space-y-6 sticky top-24">
                        <div className="rounded-3xl overflow-hidden shadow-md border border-slate-200 bg-white">
                            <img src="/banner.jpg" alt="Quảng cáo Oufeidun" className="w-full h-auto object-cover" />
                        </div>
                    </div>

                    {/* Center Column: Search & Results (Spans 12 cols on mobile, 6 cols on Large) */}
                    <div className="col-span-1 lg:col-span-6 flex flex-col items-center">
                        
                        <div className="text-center mb-10 w-full">
                            <h1 className="text-3xl md:text-4xl font-normal text-slate-900 mb-4 leading-tight">
                                Tra Cứu <span className="text-orange-600">Kính Cường Lực Con Ngựa Oufeidun</span>
                            </h1>
                            <p className="text-slate-500 max-w-lg mx-auto">
                                Nhập tên điện thoại của bạn (VD: RENO 2, iPhone 15...) để tìm chính xác mã kính cường lực dùng chung.
                            </p>
                        </div>

                        {/* Big Search Bar */}
                        <div className="relative w-full max-w-2xl mb-12">
                            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                                <Search className="h-6 w-6 text-slate-400" />
                            </div>
                            <input 
                                type="text" 
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                }}
                                suppressHydrationWarning
                                placeholder="Nhập dòng máy của bạn (VD: RENO 2, A70)..." 
                                className="w-full rounded-full border border-slate-200 bg-white py-5 pl-16 pr-8 text-lg outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-50 shadow-md"
                            />
                        </div>

                        {/* Search Results */}
                        <div className="w-full max-w-2xl space-y-6">
                            {debouncedSearch.length === 0 ? (
                                <div className="w-full rounded-3xl overflow-hidden shadow-md border border-slate-200 bg-white">
                                    <img 
                                        src="/banner-search.jpg" 
                                        alt="Kính Cường Lực Con Ngựa Oufeidun" 
                                        className="w-full h-auto object-cover" 
                                    />
                                </div>
                            ) : isLoading ? (
                                <div className="space-y-4 animate-pulse">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="rounded-3xl border border-slate-200 p-6 bg-white flex gap-6 h-40" />
                                    ))}
                                </div>
                            ) : products.length === 0 ? (
                                <div className="text-center py-16 px-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
                                    <p className="text-slate-600 font-medium">Không tìm thấy mã kính nào phù hợp với "{debouncedSearch}"</p>
                                    <p className="text-sm text-slate-500 mt-2">Vui lòng thử lại với tên dòng máy khác ngắn gọn hơn.</p>
                                </div>
                            ) : (
                                products.map((product: any) => (
                                    <div key={product.id} className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start">
                                            {/* Product Images */}
                                            <div className="shrink-0 flex flex-col items-center gap-2">
                                                <div className="flex gap-3">
                                                    {product.images && product.images.length > 0 ? (
                                                        product.images.map((img: any, idx: number) => (
                                                            <div key={img.id || idx} className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 relative shadow-sm hover:scale-105 transition-transform duration-200">
                                                                <img src={img.imageUrl} alt={`Bao bì ${idx + 1}`} className="w-full h-full object-cover" />
                                                            </div>
                                                        ))
                                                    ) : product.thumbnail ? (
                                                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 relative shadow-sm">
                                                            <img src={product.thumbnail} alt="Bao bì" className="w-full h-full object-cover" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm">
                                                            <Box className="w-8 h-8" />
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-xs text-slate-500 italic text-center mt-2">* Hình ảnh hiển thị trên bao bì</span>
                                            </div>

                                            {/* Compatible Models List (Moved up to replace Product Info) */}
                                            <div className="flex-1 min-w-0 w-full">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Check className="w-5 h-5 text-emerald-500" />
                                                    <span className="text-base font-semibold text-slate-900">Dùng chung với {product.models?.length || 0} dòng máy:</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2.5">
                                                    {product.models?.map((m: any) => {
                                                        const isMatch = debouncedSearch && m.modelName.toLowerCase().includes(debouncedSearch.toLowerCase());
                                                        return (
                                                            <span
                                                                key={m.id}
                                                                className={`inline-flex items-center px-4 py-1.5 rounded-full border text-sm font-medium shadow-sm transition ${
                                                                    isMatch
                                                                        ? 'border-orange-400 bg-orange-50 text-orange-700 ring-1 ring-orange-300 scale-105'
                                                                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                                                }`}
                                                            >
                                                                <HighlightText text={m.modelName} keyword={debouncedSearch} />
                                                            </span>
                                                        );
                                                    })}
                                                    {(!product.models || product.models.length === 0) && (
                                                        <span className="text-sm text-slate-500 italic">Chưa có danh sách máy hỗ trợ</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right Column: Ads Banner (Hidden on Mobile, spans 2 cols on Large) */}
                    <div className="hidden lg:block lg:col-span-3 space-y-6 sticky top-24">
                        <div className="rounded-3xl overflow-hidden shadow-md border border-slate-200 bg-white">
                            <img src="/banner.jpg" alt="Quảng cáo Oufeidun" className="w-full h-auto object-cover" />
                        </div>
                    </div>

                </div>
            </main>
            
            <Footer />
        </div>
    );
}
