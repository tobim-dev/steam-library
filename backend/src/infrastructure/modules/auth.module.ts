import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from '../auth/strategies/local.strategy';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { LoginUseCase } from '../../application/use-cases/auth/login.use-case';
import { ValidateJwtPayloadUseCase } from '../../application/use-cases/auth/validate-jwt-payload.use-case';
import { ChangePasswordUseCase } from '../../application/use-cases/users/change-password.use-case';
import { AuthController } from '../../interface-adapters/controllers/auth.controller';
import { UsersModule } from './users.module';
import { USER_REPOSITORY } from '../../shared/constants';
import { TypeOrmUserRepository } from '../persistence/typeorm/repositories/typeorm-user.repository';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'gaming-library-secret-dev-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: LoginUseCase,
      useFactory: (repo: TypeOrmUserRepository) => new LoginUseCase(repo),
      inject: [USER_REPOSITORY],
    },
    {
      provide: ValidateJwtPayloadUseCase,
      useFactory: (repo: TypeOrmUserRepository) =>
        new ValidateJwtPayloadUseCase(repo),
      inject: [USER_REPOSITORY],
    },
    {
      provide: ChangePasswordUseCase,
      useFactory: (repo: TypeOrmUserRepository) =>
        new ChangePasswordUseCase(repo),
      inject: [USER_REPOSITORY],
    },
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [JwtModule, ValidateJwtPayloadUseCase],
})
export class AuthModule {}
