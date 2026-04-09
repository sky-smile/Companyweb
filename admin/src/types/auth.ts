export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthProfile {
  id: string;
  username: string;
  nickname: string;
  isSuperAdmin: boolean;
  roles: string[];
  permissions: string[];
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  profile: AuthProfile;
}
