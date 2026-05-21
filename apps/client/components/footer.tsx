import Link from 'next/link';

export function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-slate-50 py-10">
            <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 sm:px-8 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-xl flex items-center gap-3">
                    <img src="/logo.jpg" alt="Oufeidun Logo" className="h-10 w-auto rounded-lg shadow-sm" />
                    <p className="text-xl font-bold text-slate-950 uppercase">Oufeidun</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                        <p className="mb-3 font-semibold text-slate-900">Liên hệ</p>
                        <p className="text-sm text-slate-600">Email: Mhpgroup.marketing@gmail.com</p>
                    </div>
                    <div>
                        <p className="mb-3 font-semibold text-slate-900">Khám phá</p>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li><Link href="/admin/login">Hệ thống quản trị</Link></li>
                        </ul>
                    </div>
                    <div>
                        <p className="mb-3 font-semibold text-slate-900">Mạng xã hội</p>
                        <div className="flex gap-4">
                            <a href="https://www.facebook.com/share/18wDPRjaFu/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-600 hover:text-blue-600">Facebook</a>
                            <a href="https://www.tiktok.com/@oufeidun?_r=1&_t=ZS-96PVc3euY8m" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-600 hover:text-black">Tiktok</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
