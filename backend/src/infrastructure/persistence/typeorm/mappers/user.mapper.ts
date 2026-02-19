import { User, UserRole } from '../../../../domain/entities/user.entity';
import { UserOrmEntity } from '../entities/user.orm-entity';

export class UserMapper {
  static toDomain(orm: UserOrmEntity): User {
    return new User(
      orm.id,
      orm.username,
      orm.displayName,
      orm.passwordHash,
      orm.role as UserRole,
      orm.steamId,
      orm.isActive,
      orm.mustChangePassword,
      orm.createdAt,
      orm.updatedAt,
    );
  }

  static toOrm(domain: User): UserOrmEntity {
    const orm = new UserOrmEntity();
    orm.id = domain.id;
    orm.username = domain.username;
    orm.displayName = domain.displayName;
    orm.passwordHash = domain.passwordHash;
    orm.role = domain.role;
    orm.steamId = domain.steamId;
    orm.isActive = domain.isActive;
    orm.mustChangePassword = domain.mustChangePassword;
    orm.createdAt = domain.createdAt;
    orm.updatedAt = domain.updatedAt;
    return orm;
  }
}
