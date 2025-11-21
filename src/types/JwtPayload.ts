import { UserRole } from '../orm/entities/users/types';

export type JwtPayload = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  created_at: Date;
};
