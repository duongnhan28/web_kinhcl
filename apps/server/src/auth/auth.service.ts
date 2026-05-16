import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { ACCESS_TOKEN_EXPIRES_IN, COOKIE_REFRESH_TOKEN, REFRESH_TOKEN_EXPIRES_IN } from './constants';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private config: ConfigService
    ) { }

    async validateAdmin(username: string, password: string) {
        const admin = await this.prisma.admin.findUnique({ where: { username } });
        if (!admin) return null;
        const isValid = await bcrypt.compare(password, admin.passwordHash);
        if (!isValid) return null;
        return admin;
    }

    async login(username: string, password: string) {
        const admin = await this.validateAdmin(username, password);
        if (!admin) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { username: admin.username, sub: admin.id };
        const accessToken = this.jwtService.sign(payload, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.config.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: REFRESH_TOKEN_EXPIRES_IN
        });

        return { accessToken, refreshToken };
    }

    async refreshTokens(payload: { sub: string; username: string }) {
        if (!payload) {
            throw new UnauthorizedException('Refresh token invalid');
        }

        const tokenPayload = { username: payload.username, sub: payload.sub };
        const accessToken = this.jwtService.sign(tokenPayload, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
        const refreshToken = this.jwtService.sign(tokenPayload, {
            secret: this.config.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: REFRESH_TOKEN_EXPIRES_IN
        });

        return { accessToken, refreshToken };
    }

    async getProfile(userId: string) {
        return this.prisma.admin.findUnique({
            where: { id: userId },
            select: { id: true, username: true, createdAt: true }
        });
    }

    getRefreshCookie(token: string) {
        const isProduction = process.env.NODE_ENV === 'production';
        return `${COOKIE_REFRESH_TOKEN}=${token}; HttpOnly; Path=/api; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax${isProduction ? '; Secure' : ''}`;
    }
}
