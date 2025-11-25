import { UserRole, UserStatus } from 'orm/entities/users/types';
import { User } from 'orm/entities/users/User';

export class UserResponseDTO {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  position: string | null;
  contactInfo: Record<string, unknown> | null;
  shortDescription: string | null;
  status: UserStatus;
  createdAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.role = user.role;
    this.firstName = user.first_name;
    this.lastName = user.last_name;
    this.avatarUrl = user.avatar_url;
    this.position = user.position;
    this.contactInfo = user.contact_info;
    this.shortDescription = user.short_description;
    this.status = user.status;
    this.createdAt = user.created_at;
  }
}
