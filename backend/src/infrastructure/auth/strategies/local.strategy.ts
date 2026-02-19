import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { LoginUseCase } from '../../../application/use-cases/auth/login.use-case';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly loginUseCase: LoginUseCase) {
    super({ usernameField: 'username' });
  }

  async validate(username: string, password: string) {
    try {
      const user = await this.loginUseCase.execute(username, password);
      return { id: user.id, username: user.username, role: user.role };
    } catch {
      throw new UnauthorizedException('Ungültiger Benutzername oder Passwort');
    }
  }
}
