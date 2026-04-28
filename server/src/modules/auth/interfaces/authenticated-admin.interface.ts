export interface AuthenticatedAdmin {
  id: string;
  username: string;
  nickname: string;
  passwordHash: string;
  isSuperAdmin: boolean;
  status: number;
  roles: string[];
  permissions: string[];
  tokenVersion: number;
}
