import { User } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/repositories/user.repository';

export class ValidateJwtPayloadUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User nicht gefunden');
    }

    if (!user.isActive) {
      throw new Error('Dieses Konto wurde deaktiviert');
    }

    return user;
  }
}
