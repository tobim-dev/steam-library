import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from '../persistence/typeorm/entities/user.orm-entity';
import { TypeOrmUserRepository } from '../persistence/typeorm/repositories/typeorm-user.repository';
import { CreateUserUseCase } from '../../application/use-cases/users/create-user.use-case';
import { GetAllUsersUseCase } from '../../application/use-cases/users/get-all-users.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/users/update-user.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/users/delete-user.use-case';
import { UpdateProfileUseCase } from '../../application/use-cases/users/update-profile.use-case';
import { AdminController } from '../../interface-adapters/controllers/admin.controller';
import { ProfileController } from '../../interface-adapters/controllers/profile.controller';
import { AdminSeederService } from '../seeding/admin-seeder.service';
import { USER_REPOSITORY } from '../../shared/constants';
import { SteamModule } from './steam.module';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity]),
    forwardRef(() => SteamModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [AdminController, ProfileController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: TypeOrmUserRepository,
    },
    {
      provide: CreateUserUseCase,
      useFactory: (repo: TypeOrmUserRepository) => new CreateUserUseCase(repo),
      inject: [USER_REPOSITORY],
    },
    {
      provide: GetAllUsersUseCase,
      useFactory: (repo: TypeOrmUserRepository) => new GetAllUsersUseCase(repo),
      inject: [USER_REPOSITORY],
    },
    {
      provide: UpdateUserUseCase,
      useFactory: (repo: TypeOrmUserRepository) => new UpdateUserUseCase(repo),
      inject: [USER_REPOSITORY],
    },
    {
      provide: DeleteUserUseCase,
      useFactory: (repo: TypeOrmUserRepository) => new DeleteUserUseCase(repo),
      inject: [USER_REPOSITORY],
    },
    {
      provide: UpdateProfileUseCase,
      useFactory: (repo: TypeOrmUserRepository) =>
        new UpdateProfileUseCase(repo),
      inject: [USER_REPOSITORY],
    },
    AdminSeederService,
  ],
  exports: [USER_REPOSITORY],
})
export class UsersModule {}
