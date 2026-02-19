import { User, UserRole } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { hash } from 'bcrypt';
import { randomUUID } from 'crypto';

export interface CreateUserInput {
  username: string;
  displayName: string;
  password: string;
  role?: UserRole;
}

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: CreateUserInput): Promise<User> {
    const existing = await this.userRepository.findByUsername(input.username);
    if (existing) {
      throw new Error(`Benutzername "${input.username}" ist bereits vergeben`);
    }

    const passwordHash = await hash(input.password, 10);
    const now = new Date();

    const user = new User(
      randomUUID(),
      input.username,
      input.displayName,
      passwordHash,
      input.role ?? 'user',
      null,
      true,
      true,
      now,
      now,
    );

    return this.userRepository.save(user);
  }
}
