import { AuthProfile, LoginResponse } from '../types/auth';

const TOKEN_KEY = 'company-web-admin-token';
const REFRESH_TOKEN_KEY = 'company-web-admin-refresh-token';
const PROFILE_KEY = 'company-web-admin-profile';

export const authStore = {
  getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  getProfile(): AuthProfile | null {
    const value = localStorage.getItem(PROFILE_KEY);

    if (value === null) {
      return null;
    }

    try {
      return JSON.parse(value) as AuthProfile;
    } catch {
      return null;
    }
  },

  setSession(payload: LoginResponse) {
    localStorage.setItem(TOKEN_KEY, payload.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, payload.refreshToken);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(payload.profile));
  },

  clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(PROFILE_KEY);
  },

  isAuthenticated(): boolean {
    return this.getAccessToken() !== null;
  },
};
