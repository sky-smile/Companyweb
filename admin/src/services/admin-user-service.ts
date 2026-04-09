import { http, unwrapResponse } from './http';
import { AdminUserListResult, CreateAdminUserPayload } from '../types/admin-user';

export const adminUserService = {
  list(params?: { page?: number; pageSize?: number; keyword?: string }) {
    return unwrapResponse<AdminUserListResult>(http.get('/admin-users', { params }));
  },

  create(payload: CreateAdminUserPayload) {
    return unwrapResponse(http.post('/admin-users', payload));
  },

  updateStatus(id: string, status: number) {
    return unwrapResponse(http.patch(`/admin-users/${id}/status`, { status }));
  },
};
