# Kinh Top Monorepo

Dự án monorepo E-Commerce cho kính cường lực điện thoại gồm frontend Next.js và backend NestJS, PostgreSQL, Prisma.

## Kiến trúc

- `apps/client`: Next.js 15 App Router, TailwindCSS, React Query, Zustand, Framer Motion.
- `apps/server`: NestJS, Prisma ORM, PostgreSQL, JWT Auth, Cloudinary upload.
- `packages/shared`: Kiểu dữ liệu dùng chung.
- `packages/ui`: Components UI tái sử dụng.

## Chạy dự án

1. Cài đặt dependencies:
```bash
pnpm install
```

2. Thiết lập biến môi trường:
```bash
cp .env.example .env
```

3. Chạy Docker Compose:
```bash
docker-compose up --build
```

4. Frontend: http://localhost:3000
5. Backend: http://localhost:4000/api

## Scripts

- `pnpm dev:client` - Chạy frontend
- `pnpm dev:server` - Chạy backend
- `pnpm dev` - Chạy đồng thời frontend và backend
- `pnpm build` - Build cả monorepo

## Notes

- Backend sử dụng cookie refresh token và JWT access token.
- Frontend hỗ trợ landing page, trang sản phẩm, chi tiết sản phẩm, khu vực admin.
- Docker compose chứa PostgreSQL và hai container frontend/backend.
