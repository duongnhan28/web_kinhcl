'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api';
import { Header } from '../../components/header';
import { Footer } from '../../components/footer';
import { ProductCard } from '../../components/product-card';



export default function ProductsPage() {
    const [brand, setBrand] = useState('');
    const [glassType, setGlassType] = useState('');
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('recent');
    const [page, setPage] = useState(1);

    const { data: filterData } = useQuery({
        queryKey: ['products-filters'],
        queryFn: async () => {
            const response = await apiClient.get('/products/filters');
            return response.data.data;
        }
    });

    const filters = filterData || { brands: [], glassTypes: [] };

    const queryKey = useMemo(() => ['products', brand, glassType, search, sort, page], [brand, glassType, search, sort, page]);

    const { data, isLoading } = useQuery({
        queryKey: queryKey,
        queryFn: async () => {
            const params = new URLSearchParams();
            if (brand) params.append('brand', brand);
            if (glassType) params.append('glassType', glassType);
            if (search) params.append('search', search);
            if (sort) params.append('sort', sort);
            params.append('page', page.toString());
            params.append('pageSize', '12');
            const response = await apiClient.get(`/products?${params.toString()}`);
            return response.data.data;
        }
    });

    const products = data?.items ?? [];
    const total = data?.total ?? 0;
    const pages = Math.ceil(total / 12) || 1;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-950">
            <Header />
            <main className="mx-auto max-w-7xl px-6 py-10 sm:px-8">
                <div className="grid gap-8 xl:grid-cols-[280px_1fr]">
                    <aside className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div>
                            <h2 className="mb-4 text-lg font-semibold text-slate-950">Bộ lọc</h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="mb-2 text-sm font-medium text-slate-700">Thương hiệu</p>
                                    <select value={brand} onChange={(event) => setBrand(event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition">
                                        <option value="">Tất cả</option>
                                        {filters.brands.map((item) => (
                                            <option key={item} value={item}>{item}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <p className="mb-2 text-sm font-medium text-slate-700">Loại kính</p>
                                    <select value={glassType} onChange={(event) => setGlassType(event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition">
                                        <option value="">Tất cả</option>
                                        {filters.glassTypes.map((item) => (
                                            <option key={item} value={item}>{item}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <p className="mb-2 text-sm font-medium text-slate-700">Sắp xếp</p>
                                    <select value={sort} onChange={(event) => setSort(event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition">
                                        <option value="recent">Mới nhất</option>
                                        <option value="price_asc">Giá thấp đến cao</option>
                                        <option value="price_desc">Giá cao đến thấp</option>
                                        <option value="name_asc">Tên A → Z</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p className="mb-2 text-sm font-medium text-slate-700">Tìm kiếm</p>
                            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm sản phẩm..." className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition" />
                        </div>
                    </aside>

                    <section className="space-y-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Sản phẩm</p>
                                <h1 className="text-3xl font-semibold text-slate-950">Khám phá dòng kính cường lực</h1>
                            </div>
                            <p className="text-sm text-slate-600">Có {total} sản phẩm</p>
                        </div>

                        {isLoading ? (
                            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <div key={index} className="h-96 rounded-3xl border border-slate-200 bg-slate-100 animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                                {products.map((product: any) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="text-sm text-slate-600">Trang {page} / {pages}</div>
                            <div className="flex gap-3">
                                <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50">
                                    Trước
                                </button>
                                <button onClick={() => setPage((prev) => Math.min(prev + 1, pages))} disabled={page === pages} className="rounded-full border border-slate-200 bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50">
                                    Tiếp
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
