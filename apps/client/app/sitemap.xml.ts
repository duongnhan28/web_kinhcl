import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://kinhtop.example',
            lastModified: new Date()
        },
        {
            url: 'https://kinhtop.example/products',
            lastModified: new Date()
        },
        {
            url: 'https://kinhtop.example/admin/login',
            lastModified: new Date()
        }
    ];
}
