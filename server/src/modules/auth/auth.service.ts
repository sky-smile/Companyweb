import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AdminUserRepository } from '@/modules/admin-user/admin-user.repository';
import { verifyPassword } from '@/common/utils/password.util';
import { AuthRepository } from './auth.repository';
import { ChangePasswordDto } from '@/common/dto/change-password.dto';
import { AuthenticatedAdmin } from './interfaces/authenticated-admin.interface';
import { AuthProfile } from './interfaces/auth-profile.interface';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { TokenPair } from './interfaces/token-pair.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly adminUserRepository: AdminUserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(username: string, password: string) {
    const admin = await this.authRepository.findByUsername(username);

    if (admin === null || admin.status !== 1) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const passwordMatched = await verifyPassword(password, admin.passwordHash);

    if (!passwordMatched) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const tokens = await this.generateTokens(admin);

    return {
      ...tokens,
      profile: this.toProfile(admin),
    };
  }

  async refreshToken(refreshToken: string): Promise<TokenPair> {
    const payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
    });

    const admin = await this.authRepository.findById(payload.sub);

    if (admin === null || admin.status !== 1) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (admin.tokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    return this.generateTokens(admin);
  }

  async updateProfile(userId: string, nickname: string): Promise<AuthProfile> {
    const admin = await this.authRepository.updateProfile(userId, nickname);
    return this.toProfile(admin);
  }

  async getProfile(user: JwtPayload): Promise<AuthProfile> {
    const admin = await this.authRepository.findById(user.sub);

    if (admin === null) {
      throw new NotFoundException('Admin user not found');
    }

    return this.toProfile(admin);
  }

  async logout(userId: string) {
    await this.adminUserRepository.incrementTokenVersion(userId);
    return { success: true, message: 'Logged out successfully' };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    if (dto.oldPassword === dto.newPassword) {
      throw new UnauthorizedException('New password must be different from old password');
    }

    const admin = await this.authRepository.findById(userId);

    if (admin === null) {
      throw new NotFoundException('Admin user not found');
    }

    const passwordMatched = await verifyPassword(dto.oldPassword, admin.passwordHash);

    if (!passwordMatched) {
      throw new UnauthorizedException('Old password is incorrect');
    }

    await this.adminUserRepository.updateOwnPassword(userId, dto.oldPassword, dto.newPassword);

    return {
      success: true,
      message: 'Password updated successfully',
    };
  }

  private async generateTokens(admin: AuthenticatedAdmin): Promise<TokenPair> {
    const payload: JwtPayload = {
      sub: admin.id,
      username: admin.username,
      isSuperAdmin: admin.isSuperAdmin,
      roles: admin.roles,
      permissions: admin.permissions,
      tokenVersion: admin.tokenVersion,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
        expiresIn: this.configService.get<string>('jwt.refreshExpiresIn', '7d'),
      }),
    };
  }

  private toProfile(admin: AuthenticatedAdmin): AuthProfile {
    return {
      id: admin.id,
      username: admin.username,
      nickname: admin.nickname,
      isSuperAdmin: admin.isSuperAdmin,
      roles: admin.roles,
      permissions: admin.permissions,
    };
  }
}
