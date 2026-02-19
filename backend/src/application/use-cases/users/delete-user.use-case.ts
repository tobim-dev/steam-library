import { UserRepository } from '../../../domain/repositories/user.repository';

export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string, currentUserId: string): Promise<void> {
    if (id === currentUserId) {
      throw new Error('Du kannst dich nicht selbst löschen');
    }

    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error(`User mit ID ${id} nicht gefunden`);
    }

    // Verhindere Löschung des letzten Admins
    if (user.isAdmin) {
      const allUsers = await this.userRepository.findAll();
      const activeAdmins = allUsers.filter(
        (u) => u.isAdmin && u.isActive && u.id !== id,
      );
      if (activeAdmins.length === 0) {
        throw new Error('Der letzte Admin kann nicht gelöscht werden');
      }
    }

    await this.userRepository.delete(id);
  }
}
