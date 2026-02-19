import { User } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/repositories/user.repository';

export interface UpdateProfileInput {
  displayName?: string;
  steamId?: string | null;
}

export class UpdateProfileUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string, input: UpdateProfileInput): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User nicht gefunden');
    }

    const now = new Date();
    const updated = new User(
      user.id,
      user.username,
      input.displayName ?? user.displayName,
      user.passwordHash,
      user.role,
      input.steamId !== undefined ? input.steamId : user.steamId,
      user.isActive,
      user.mustChangePassword,
      user.createdAt,
      now,
    );

    return this.userRepository.save(updated);
  }
}
