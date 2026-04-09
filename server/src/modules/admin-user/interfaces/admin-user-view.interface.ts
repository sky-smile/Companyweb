export interface AdminUserView {
  id: string;
  username: string;
  nickname: string;
  email: string;
  phone: string;
  status: number;
  isSuperAdmin: boolean;
  roles: string[];
}
