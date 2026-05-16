import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://kinhcuongluc.example',
            lastModified: new Date(),
        },
        {
            url: 'https://kinhcuongluc.example/products',
            lastModified: new Date(),
        },
        {
            url: 'https://kinhcuongluc.example/admin/login',
            lastModified: new Date()
        }
    ];
}
