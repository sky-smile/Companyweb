import { http, unwrapResponse } from './http';
import { CreateRolePayload, PermissionItem, RoleItem, UpdateRolePayload } from '../types/role';

export const roleService = {
  list() {
    return unwrapResponse<RoleItem[]>(http.get('/roles'));
  },

  listPermissions() {
    return unwrapResponse<PermissionItem[]>(http.get('/roles/permissions'));
  },

  create(payload: CreateRolePayload) {
    return unwrapResponse<RoleItem>(http.post('/roles', payload));
  },

  update(id: string, payload: UpdateRolePayload) {
    return unwrapResponse<RoleItem>(http.patch(`/roles/${id}`, payload));
  },

  updateStatus(id: string, status: number) {
    return unwrapResponse<RoleItem>(http.patch(`/roles/${id}/status`, { status }));
  },
};
