export interface JwtPayload {
  sub: string;
  username: string;
  isSuperAdmin: boolean;
  roles: string[];
  permissions: string[];
}
