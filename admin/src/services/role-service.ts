import { http, unwrapResponse } from './http';
import { CreateRolePayload, PermissionItem, RoleItem } from '../types/role';

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
};
