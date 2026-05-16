import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@kinh-top/shared';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <Link href={`/products/${product.slug}`} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-soft">
            <div className="relative h-72 w-full bg-slate-100">
                <Image src={product.thumbnail} alt={product.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
            </div>
            <div className="space-y-3 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{product.brand}</p>
                <h3 className="text-base font-semibold text-slate-950">{product.name}</h3>
                <p className="text-sm text-slate-600 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-slate-950">{product.price.toLocaleString()}₫</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-500">{product.glassType}</span>
                </div>
            </div>
        </Link>
    );
}
