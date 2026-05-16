import { Outfit } from 'next/font/google';
import './globals.css';
import type { Metadata } from 'next';
import { QueryProvider } from '../lib/query-client';

const outfit = Outfit({ subsets: ['latin', 'latin-ext'], variable: '--font-outfit' });

export const metadata: Metadata = {
    title: 'Tra cứu Kính Cường Lực Cao Cấp',
    description: 'Hệ thống tra cứu kính cường lực dùng chung cho các dòng máy điện thoại chuyên nghiệp.',
    metadataBase: new URL('https://kinhcuongluc.example'),
    openGraph: {
        title: 'Tra cứu Kính Cường Lực Cao Cấp',
        description: 'Hệ thống tra cứu kính cường lực dùng chung cho các dòng máy điện thoại chính xác.',
        siteName: 'Tra cứu Kính Cường Lực',
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
