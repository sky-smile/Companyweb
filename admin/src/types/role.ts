export interface RoleItem {
  id: string;
  name: string;
  code: string;
  description: string;
  status: number;
  permissions: string[];
}

export interface PermissionItem {
  id: string;
  name: string;
  code: string;
  group?: string;
}

export interface CreateRolePayload {
  name: string;
  code: string;
  description?: string;
  permissionIds?: string[];
  status?: number;
}

export interface UpdateRolePayload {
  name?: string;
  code?: string;
  description?: string;
  permissionIds?: string[];
  status?: number;
}
