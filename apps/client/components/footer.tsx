import Link from 'next/link';

export function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-slate-50 py-10">
            <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 sm:px-8 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-xl space-y-3">
                    <p className="text-xl font-semibold text-slate-950">KINH TOP</p>
                    <p className="text-sm text-slate-600">Chuyên kính cường lực điện thoại cao cấp với bảo vệ toàn diện cho thiết bị của bạn.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                        <p className="mb-3 font-semibold text-slate-900">Liên hệ</p>
                        <p className="text-sm text-slate-600">Email: support@kinhtop.vn</p>
                        <p className="text-sm text-slate-600">Điện thoại: 0909 123 456</p>
                    </div>
                    <div>
                        <p className="mb-3 font-semibold text-slate-900">Khám phá</p>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li><Link href="/products">Sản phẩm</Link></li>
                            <li><Link href="/admin/login">Dashboard</Link></li>
                        </ul>
                    </div>
                    <div>
                        <p className="mb-3 font-semibold text-slate-900">Mạng xã hội</p>
                        <p className="text-sm text-slate-600">Facebook / Instagram / Tiktok</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
