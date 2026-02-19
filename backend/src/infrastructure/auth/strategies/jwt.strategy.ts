import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ValidateJwtPayloadUseCase } from '../../../application/use-cases/auth/validate-jwt-payload.use-case';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly validatePayload: ValidateJwtPayloadUseCase) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'gaming-library-secret-dev-key',
    });
  }

  async validate(payload: { sub: string; username: string; role: string }) {
    try {
      const user = await this.validatePayload.execute(payload.sub);
      return {
        id: user.id,
        username: user.username,
        role: user.role,
        mustChangePassword: user.mustChangePassword,
      };
    } catch {
      throw new UnauthorizedException();
    }
  }
}
