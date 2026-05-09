import { http, unwrapResponse } from './http';
import { AdminUserListResult, CreateAdminUserPayload, UpdateAdminUserPayload } from '../types/admin-user';
import { AuthProfile } from '../types/auth';

export const adminUserService = {
  list(params?: { page?: number; pageSize?: number; keyword?: string }) {
    return unwrapResponse<AdminUserListResult>(http.get('/admin-users', { params }));
  },

  create(payload: CreateAdminUserPayload) {
    return unwrapResponse(http.post('/admin-users', payload));
  },

  update(id: string, payload: UpdateAdminUserPayload) {
    return unwrapResponse(http.patch(`/admin-users/${id}`, payload));
  },

  updateStatus(id: string, status: number) {
    return unwrapResponse(http.patch(`/admin-users/${id}/status`, { status }));
  },

  delete(id: string) {
    return unwrapResponse(http.delete(`/admin-users/${id}`));
  },

  resetPassword(id: string, newPassword: string) {
    return unwrapResponse(http.patch(`/admin-users/${id}/reset-password`, { newPassword }));
  },

  changePassword(oldPassword: string, newPassword: string) {
    return unwrapResponse(http.post('/admin-users/change-password', { oldPassword, newPassword }));
  },

  updateProfile(payload: { nickname: string }) {
    return unwrapResponse<AuthProfile>(http.patch('/auth/profile', payload));
  },
};
