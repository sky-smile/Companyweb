import { Request } from 'express';

export interface AuthenticatedAdminUser {
  userId: string;
  username: string;
  isSuperAdmin: boolean;
  roles: string[];
  permissions: string[];
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedAdminUser;
}
