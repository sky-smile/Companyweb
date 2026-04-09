export interface AdminUserItem {
  id: string;
  username: string;
  nickname: string;
  email: string;
  phone: string;
  status: number;
  isSuperAdmin: boolean;
  roles: string[];
}

export interface AdminUserListResult {
  list: AdminUserItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

export interface CreateAdminUserPayload {
  username: string;
  password: string;
  nickname: string;
  email?: string;
  phone?: string;
  roleIds?: string[];
}
