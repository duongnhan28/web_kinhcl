import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([function (req) {
                return req?.cookies?.refreshToken;
            }]),
            ignoreExpiration: false,
            secretOrKey: config.get<string>('JWT_REFRESH_SECRET') || 'default-jwt-refresh-secret-key-987654321'
        });
    }

    async validate(payload: { sub: string; username: string }) {
        return { id: payload.sub, username: payload.username };
    }
}
