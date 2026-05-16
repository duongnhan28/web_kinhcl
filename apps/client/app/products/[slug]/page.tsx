import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '../../../components/header';
import { Footer } from '../../../components/footer';
import { fetchProductBySlug, fetchPublicProducts } from '../../../lib/api';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product = await fetchProductBySlug(slug);

    if (!product) {
        notFound();
    }

    const relatedResponse = await fetchPublicProducts(`?categoryId=${product.categoryId}&page=1&pageSize=4`);
    const relatedProducts = relatedResponse.items?.filter((item: any) => item.id !== product.id) ?? [];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-950">
            <Header />
            <main className="mx-auto max-w-7xl px-6 py-10 sm:px-8">
                <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="grid gap-4 lg:grid-cols-[0.3fr_0.7fr]">
                            <div className="space-y-4">
                                {product.images?.slice(0, 4).map((image: any) => (
                                    <div key={image.id} className="relative h-28 w-full overflow-hidden rounded-3xl bg-slate-100">
                                        <Image src={image.imageUrl} alt={product.name} fill className="object-cover" />
                                    </div>
                                ))}
                            </div>
                            <div className="relative h-[460px] rounded-[2rem] bg-slate-100 p-3">
                                <Image src={product.thumbnail} alt={product.name} fill className="object-cover rounded-[2rem]" />
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{product.brand}</p>
                                    <h1 className="text-4xl font-semibold text-slate-950">{product.name}</h1>
                                </div>
                                <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900">{product.glassType}</span>
                            </div>
                            <div className="flex items-center gap-4 text-slate-900">
                                <p className="text-3xl font-semibold">{product.price.toLocaleString()}₫</p>
                                <span className="rounded-full bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-900">{product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}</span>
                            </div>
                            <p className="max-w-3xl text-base leading-7 text-slate-600">{product.description}</p>
                            <div className="grid gap-3 sm:grid-cols-3">
                                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                    <p className="text-sm text-slate-500">Danh mục</p>
                                    <p className="mt-2 font-semibold text-slate-950">{product.category?.name}</p>
                                </div>
                                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                    <p className="text-sm text-slate-500">Mẫu máy hỗ trợ</p>
                                    <p className="mt-2 font-semibold text-slate-950">{product.models?.map((model: any) => model.modelName).join(', ') || 'Đang cập nhật'}</p>
                                </div>
                                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                    <p className="text-sm text-slate-500">SKU</p>
                                    <p className="mt-2 font-semibold text-slate-950">{product.slug}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <a href="mailto:sales@kinhtop.vn" className="inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                                    Liên hệ mua hàng
                                </a>
                                <Link href="/products" className="inline-flex rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                                    Quay lại cửa hàng
                                </Link>
                            </div>
                        </div>
                    </div>

                    <aside className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Sản phẩm liên quan</p>
                        <div className="space-y-4">
                            {relatedProducts.map((item: any) => (
                                <Link key={item.id} href={`/products/${item.slug}`} className="block rounded-3xl border border-slate-200 p-4 transition hover:border-slate-300 hover:shadow-sm">
                                    <p className="font-semibold text-slate-950">{item.name}</p>
                                    <p className="mt-2 text-sm text-slate-600">{item.price.toLocaleString()}₫</p>
                                </Link>
                            ))}
                        </div>
                    </aside>
                </div>
            </main>
            <Footer />
        </div>
    );
}
