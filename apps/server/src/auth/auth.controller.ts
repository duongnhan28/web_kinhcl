import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { JwtRefreshGuard } from '../common/guards/jwt-refresh.guard';
import { User } from '../common/decorators/user.decorator';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: Response) {
        const { accessToken, refreshToken } = await this.authService.login(dto.username, dto.password);
        response.setHeader('Set-Cookie', this.authService.getRefreshCookie(refreshToken));
        return { accessToken };
    }

    @UseGuards(JwtRefreshGuard)
    @Post('refresh')
    async refresh(@User() user: { id: string; username: string }, @Res({ passthrough: true }) response: Response) {
        const { accessToken, refreshToken } = await this.authService.refreshTokens(user);
        response.setHeader('Set-Cookie', this.authService.getRefreshCookie(refreshToken));
        return { accessToken };
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async profile(@User('id') adminId: string) {
        return this.authService.getProfile(adminId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('change-password')
    async changePassword(@User('id') adminId: string, @Body() body: any) {
        return this.authService.changePassword(adminId, body.oldPassword, body.newPassword);
    }
}
