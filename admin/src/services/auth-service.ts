import { http, unwrapResponse } from './http';
import { AuthProfile, LoginPayload, LoginResponse } from '../types/auth';

export const authService = {
  login(payload: LoginPayload) {
    return unwrapResponse<LoginResponse>(http.post('/auth/login', payload));
  },

  getProfile() {
    return unwrapResponse<AuthProfile>(http.get('/auth/profile'));
  },

  logout() {
    return unwrapResponse<void>(http.post('/auth/logout'));
  },
};
