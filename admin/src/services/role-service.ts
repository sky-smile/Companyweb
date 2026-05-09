import { http, unwrapResponse } from './http';
import { CreateRolePayload, PermissionItem, RoleItem, UpdateRolePayload } from '../types/role';
import { PERMISSION_GROUPS } from '../config/permissions';

// 从配置中获取权限列表（强制使用中文名称覆盖后端返回的值）
function enrichPermissions(permissions: PermissionItem[]): PermissionItem[] {
  const permMap = new Map<string, string>();
  PERMISSION_GROUPS.forEach((group) => {
    group.permissions.forEach((p) => {
      permMap.set(p.code, p.name);
    });
  });

  return permissions.map((p) => ({
    ...p,
    // 始终优先使用配置中的中文名称
    name: permMap.get(p.code) || p.name || p.code,
    group: p.group || getGroupKeyFromCode(p.code),
  }));
}

function getGroupKeyFromCode(code: string): string {
  const group = PERMISSION_GROUPS.find((g) => code.startsWith(g.key));
  return group?.key || 'other';
}

export const roleService = {
  async list() {
    const result = await unwrapResponse<RoleItem[]>(http.get('/roles'));
    return result;
  },

  async listPermissions() {
    const result = await unwrapResponse<PermissionItem[]>(http.get('/roles/permissions'));
    return enrichPermissions(result);
  },

  create(payload: CreateRolePayload) {
    return unwrapResponse<RoleItem>(http.post('/roles', payload));
  },

  update(id: string, payload: UpdateRolePayload) {
    return unwrapResponse<RoleItem>(http.patch(`/roles/${id}`, payload));
  },

  delete(id: string) {
    return unwrapResponse(http.delete(`/roles/${id}`));
  },

  updateStatus(id: string, status: number) {
    return unwrapResponse<RoleItem>(http.patch(`/roles/${id}/status`, { status }));
  },
};
