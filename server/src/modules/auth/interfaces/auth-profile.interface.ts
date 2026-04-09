export interface AuthProfile {
  id: string;
  username: string;
  nickname: string;
  isSuperAdmin: boolean;
  roles: string[];
  permissions: string[];
}
