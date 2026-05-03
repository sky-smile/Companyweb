import { AuthProfile } from '../types/auth';

const PROFILE_KEY = 'company-web-admin-profile';
const LEGACY_TOKEN_KEY = 'company-web-admin-token';
const LEGACY_REFRESH_TOKEN_KEY = 'company-web-admin-refresh-token';

export const authStore = {
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

  clearSession() {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    localStorage.removeItem(LEGACY_REFRESH_TOKEN_KEY);
  },

  setProfile(profile: AuthProfile) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  },

  isAuthenticated(): boolean {
    return this.getProfile() !== null;
  },

  hasPermission(permission?: string): boolean {
    if (permission === undefined) {
      return true;
    }

    const profile = this.getProfile();

    if (profile === null) {
      return false;
    }

    return profile.isSuperAdmin || profile.permissions.includes('*:*') || profile.permissions.includes(permission);
  },
};
