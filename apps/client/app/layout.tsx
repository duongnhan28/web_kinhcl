import { Outfit } from 'next/font/google';
import './globals.css';
import type { Metadata } from 'next';
import { QueryProvider } from '../lib/query-client';

const outfit = Outfit({ subsets: ['latin', 'latin-ext'], variable: '--font-outfit' });

export const metadata: Metadata = {
    title: 'Kinh Top | Kính Cường Lực Cao Cấp',
    description: 'Thương hiệu phân phối kính cường lực điện thoại chính hãng, bảo vệ tối đa thiết bị của bạn với công nghệ Nano & cường lực 9H.',
    metadataBase: new URL('https://kinhtop.example'),
    openGraph: {
        title: 'Kinh Top | Kính Cường Lực Cao Cấp',
        description: 'Thương hiệu phân phối kính cường lực điện thoại chính hãng.',
        siteName: 'Kinh Top',
        type: 'website'
    }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="vi">
            <body className={`${outfit.variable} font-sans antialiased text-slate-900 bg-slate-50 selection:bg-blue-100 selection:text-blue-900`}>
                <QueryProvider>{children}</QueryProvider>
            </body>
        </html>
    );
}
