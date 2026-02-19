import { User } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { compare } from 'bcrypt';

export class LoginUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(username: string, password: string): Promise<User> {
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new Error('Ungültiger Benutzername oder Passwort');
    }

    if (!user.isActive) {
      throw new Error('Dieses Konto wurde deaktiviert');
    }

    const isPasswordValid = await compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Ungültiger Benutzername oder Passwort');
    }

    return user;
  }
}
