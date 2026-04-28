import type { CookieOptions } from 'express';

export interface AuthCookieConfig {
  access: CookieOptions;
  refresh: CookieOptions;
}

/**
 * httpOnly cookie config for JWT tokens.
 * In production (same-origin via nginx) uses `sameSite: 'lax'`.
 * In development, falls back to Authorization header for cross-origin dev servers.
 */
export function AUTH_COOKIE_CONFIG(isProduction: boolean): AuthCookieConfig {
  const base: CookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
    path: '/api',
    secure: isProduction,
  };

  return {
    access: { ...base, maxAge: 2 * 60 * 60 * 1000 }, // 2h
    refresh: { ...base, maxAge: 7 * 24 * 60 * 60 * 1000 }, // 7d
  };
}
