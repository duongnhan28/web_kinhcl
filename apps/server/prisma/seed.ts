import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // 1. Tạo Admin
    const passwordHash = await bcrypt.hash('admin123', 10);
    await prisma.admin.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            passwordHash,
        },
    });
    console.log('Đã tạo admin account (admin / admin123)');

    // 2. Tạo Brands
    const apple = await prisma.brand.create({ data: { name: 'Apple', slug: 'apple' } });
    const samsung = await prisma.brand.create({ data: { name: 'Samsung', slug: 'samsung' } });
    console.log('Đã tạo brands mẫu');

    // 3. Tạo Category
    const category = await prisma.category.create({ data: { name: 'Kính cường lực', slug: 'kinh-cuong-luc', brandId: apple.id } });
    console.log('Đã tạo category mẫu');

    // 4. Tạo Product mẫu
    await prisma.product.create({
        data: {
            sku: 'GNS-T054',
            name: 'Kính 15 prm',
            slug: '15prm',
            description: 'Kính cường lực xịn',
            price: 150000,
            brandId: apple.id,
            glassType: 'Trong suốt HD',
            stock: 100,
            categoryId: category.id,
            thumbnail: 'http://localhost:4000/public/uploads/ba165c257c32bc3ff835bd4642bb6aea.webp',
            isFeatured: true
        }
    });
    console.log('Đã tạo product mẫu');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
