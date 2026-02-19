export interface User {
  id: string;
  username: string;
  displayName: string;
  role: 'admin' | 'user';
  steamId: string | null;
  isActive: boolean;
  mustChangePassword: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    username: string;
    role: string;
  };
}

export interface CreateUserInput {
  username: string;
  displayName: string;
  password: string;
  role?: 'admin' | 'user';
}

export interface UpdateUserInput {
  displayName?: string;
  role?: 'admin' | 'user';
  isActive?: boolean;
}
