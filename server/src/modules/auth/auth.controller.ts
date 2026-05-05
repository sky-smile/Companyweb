import { Body, Controller, Get, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import { type Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from '@/common/dto/change-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '@/common/types/authenticated-request.type';
import { AUTH_COOKIE_CONFIG } from './auth-cookie.config';

@Controller('auth')
export class AuthController {
  private readonly cookieConfig: ReturnType<typeof AUTH_COOKIE_CONFIG>;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    const isProduction = configService.get<string>('server.nodeEnv') === 'production';
    this.cookieConfig = AUTH_COOKIE_CONFIG(isProduction);
  }

  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.login(dto.username, dto.password);
    this.setAuthCookies(response, result.accessToken, result.refreshToken);
    return result;
  }

  @Post('refresh')
  async refresh(
    @Body() dto: RefreshTokenDto,
    @Req() request: AuthenticatedRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    // Try body refreshToken first, then cookie
    const token = dto.refreshToken || request.cookies?.refresh_token;
    const result = await this.authService.refreshToken(token);
    this.setAuthCookies(response, result.accessToken, result.refreshToken);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @Req() request: AuthenticatedRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.logout(request.user.userId);
    this.clearAuthCookies(response);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() request: AuthenticatedRequest) {
    return this.authService.getProfile({
      sub: request.user.userId,
      username: request.user.username,
      isSuperAdmin: request.user.isSuperAdmin,
      roles: request.user.roles,
      permissions: request.user.permissions,
      tokenVersion: request.user.tokenVersion,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(
    @Req() request: AuthenticatedRequest,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.authService.updateProfile(request.user.userId, dto.nickname ?? '');
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  changePassword(
    @Req() request: AuthenticatedRequest,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(request.user.userId, dto);
  }

  private setAuthCookies(response: Response, accessToken: string, refreshToken: string) {
    response.cookie('access_token', accessToken, this.cookieConfig.access);
    response.cookie('refresh_token', refreshToken, this.cookieConfig.refresh);
  }

  private clearAuthCookies(response: Response) {
    response.clearCookie('access_token', this.cookieConfig.access);
    response.clearCookie('refresh_token', this.cookieConfig.refresh);
  }
}
