import { Request } from 'express';
import { UserRole } from '../domain/entities/user.entity';

export interface AuthenticatedUser {
  id: string;
  username: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
