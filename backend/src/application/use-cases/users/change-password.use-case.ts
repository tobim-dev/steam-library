import { User } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { compare, hash } from 'bcrypt';

export class ChangePasswordUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User nicht gefunden');
    }

    const isCurrentValid = await compare(currentPassword, user.passwordHash);
    if (!isCurrentValid) {
      throw new Error('Aktuelles Passwort ist falsch');
    }

    if (newPassword.length < 4) {
      throw new Error('Das neue Passwort muss mindestens 4 Zeichen lang sein');
    }

    const newHash = await hash(newPassword, 10);
    const now = new Date();

    const updated = new User(
      user.id,
      user.username,
      user.displayName,
      newHash,
      user.role,
      user.steamId,
      user.isActive,
      false, // mustChangePassword -> false
      user.createdAt,
      now,
    );

    return this.userRepository.save(updated);
  }
}
