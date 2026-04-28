import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { type Request } from 'express';
import { AuthRepository } from './auth.repository';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly authRepository: AuthRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // Try httpOnly cookie first (production same-origin), fallback to Bearer header (dev cross-origin)
        (request: Request) => request.cookies?.access_token ?? null,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.accessSecret'),
    });
  }

  async validate(payload: JwtPayload) {
    // Query fresh user data from DB — ensures permissions and token version are always up-to-date
    const admin = await this.authRepository.findById(payload.sub);

    if (admin === null || admin.status !== 1) {
      throw new UnauthorizedException('User not found or inactive');
    }

    // Token version mismatch — user has logged out or changed password since this token was issued
    if (admin.tokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedException('Token has been revoked');
    }

    return {
      userId: admin.id,
      username: admin.username,
      isSuperAdmin: admin.isSuperAdmin,
      roles: admin.roles,
      permissions: admin.permissions,
      tokenVersion: admin.tokenVersion,
    };
  }
}
