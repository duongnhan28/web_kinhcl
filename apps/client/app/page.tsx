export const dynamic = 'force-dynamic';

import { Footer } from '../components/footer';
import { Header } from '../components/header';
import { ProductCard } from '../components/product-card';
import { fetchCategories, fetchPublicProducts } from '../lib/api';
import Link from 'next/link';

type ProductResponse = {
    items: Array<any>;
};

export default async function HomePage() {
    const [featuredRes, categoriesRes, newArrivalsRes] = await Promise.all([
        fetchPublicProducts('?sort=recent&page=1&pageSize=4'),
        fetchCategories(),
        fetchPublicProducts('?sort=price_asc&page=1&pageSize=4')
    ]);

    const featuredProducts = featuredRes.items ?? [];
    const categories = categoriesRes ?? [];
    const newArrivals = newArrivalsRes.items ?? [];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-950">
            <Header />
            <main className="mx-auto max-w-7xl px-6 py-8 sm:px-8">
                <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                    <div className="space-y-6">
                        <span className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-600">
                            #1 Kính cường lực
                        </span>
                        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                            Bảo vệ màn hình điện thoại của bạn với độ bền tối ưu
                        </h1>
                        <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                            Kính cường lực KINH TOP mang đến hiệu suất chống va đập, chống xước và độ trong suốt cao cho mọi thiết bị.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/products" className="inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                                Xem sản phẩm
                            </Link>
                            <Link href="/admin/login" className="inline-flex rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                                Bảng quản trị
                            </Link>
                        </div>
                    </div>
                    <div className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-700 p-6 text-white shadow-soft">
                        <div className="space-y-6">
                            <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Bảo vệ màn hình đỉnh cao</p>
                            <div className="grid gap-4 rounded-3xl bg-white/5 p-6 shadow-inner">
                                <div className="rounded-3xl bg-slate-950/90 p-5 shadow-lg">
                                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Góc cạnh</p>
                                    <p className="mt-4 text-4xl font-semibold">9H</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm text-slate-300">
                                    <div className="rounded-3xl bg-slate-900/60 p-4">Chống trầy xước</div>
                                    <div className="rounded-3xl bg-slate-900/60 p-4">Trong suốt HD</div>
                                    <div className="rounded-3xl bg-slate-900/60 p-4">Dễ dàng lắp đặt</div>
                                    <div className="rounded-3xl bg-slate-900/60 p-4">Bảo hành 1 đổi 1</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-16">
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Danh mục nổi bật</p>
                            <h2 className="text-3xl font-semibold text-slate-950">Khám phá dòng kính</h2>
                        </div>
                        <Link href="/products" className="text-sm font-medium text-slate-700 transition hover:text-slate-950">
                            Xem tất cả sản phẩm →
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {categories.map((category: any) => (
                            <Link key={category.id} href={`/products`} className="rounded-3xl border border-slate-200 bg-white px-5 py-6 text-center text-slate-800 transition hover:border-slate-300 hover:shadow-soft">
                                <p className="text-sm font-semibold">{category.name}</p>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="mt-16">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Sản phẩm nổi bật</p>
                            <h2 className="text-3xl font-semibold text-slate-950">Bộ sưu tập hàng đầu</h2>
                        </div>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                        {featuredProducts.map((product: any) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>

                <section className="mt-16 mb-20">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">New arrivals</p>
                            <h2 className="text-3xl font-semibold text-slate-950">Sản phẩm mới</h2>
                        </div>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                        {newArrivals.map((product: any) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
