import { User, UserRole } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/repositories/user.repository';

export interface UpdateUserInput {
  displayName?: string;
  role?: UserRole;
  isActive?: boolean;
}

export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string, input: UpdateUserInput): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error(`User mit ID ${id} nicht gefunden`);
    }

    // Verhindere Deaktivierung oder Rollenänderung des letzten Admins
    if (user.isAdmin && (input.isActive === false || input.role === 'user')) {
      const allUsers = await this.userRepository.findAll();
      const activeAdmins = allUsers.filter(
        (u) => u.isAdmin && u.isActive && u.id !== id,
      );
      if (activeAdmins.length === 0) {
        throw new Error(
          'Der letzte aktive Admin kann nicht deaktiviert oder degradiert werden',
        );
      }
    }

    const now = new Date();
    const updated = new User(
      user.id,
      user.username,
      input.displayName ?? user.displayName,
      user.passwordHash,
      input.role ?? user.role,
      user.steamId,
      input.isActive ?? user.isActive,
      user.mustChangePassword,
      user.createdAt,
      now,
    );

    return this.userRepository.save(updated);
  }
}
