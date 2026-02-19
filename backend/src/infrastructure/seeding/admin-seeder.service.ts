import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { USER_REPOSITORY } from '../../shared/constants';
import { hash } from 'bcrypt';
import { randomUUID } from 'crypto';

@Injectable()
export class AdminSeederService implements OnModuleInit {
  private readonly logger = new Logger(AdminSeederService.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async onModuleInit(): Promise<void> {
    const userCount = await this.userRepository.count();
    if (userCount === 0) {
      this.logger.log('Kein User vorhanden — erstelle Standard-Admin...');
      const passwordHash = await hash('admin', 10);
      const now = new Date();
      const admin = new User(
        randomUUID(),
        'admin',
        'Administrator',
        passwordHash,
        'admin',
        null,
        true,
        true, // mustChangePassword
        now,
        now,
      );
      await this.userRepository.save(admin);
      this.logger.log(
        'Standard-Admin erstellt (Benutzer: admin / Passwort: admin)',
      );
    }
  }
}
