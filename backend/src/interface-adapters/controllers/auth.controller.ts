import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../../infrastructure/auth/guards/jwt-auth.guard';
import { ChangePasswordUseCase } from '../../application/use-cases/users/change-password.use-case';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { UserPresenter } from '../presenters/user.presenter';
import { ValidateJwtPayloadUseCase } from '../../application/use-cases/auth/validate-jwt-payload.use-case';
import type { AuthenticatedRequest } from '../../shared/authenticated-request';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly changePassword: ChangePasswordUseCase,
    private readonly validateJwtPayload: ValidateJwtPayloadUseCase,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Request() req: AuthenticatedRequest) {
    const payload = {
      sub: req.user.id,
      username: req.user.username,
      role: req.user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: req.user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Request() req: AuthenticatedRequest) {
    const user = await this.validateJwtPayload.execute(req.user.id);
    return UserPresenter.toResponse(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePasswordHandler(
    @Request() req: AuthenticatedRequest,
    @Body() dto: ChangePasswordDto,
  ) {
    try {
      const user = await this.changePassword.execute(
        req.user.id,
        dto.currentPassword,
        dto.newPassword,
      );
      return { success: true, user: UserPresenter.toResponse(user) };
    } catch (error) {
      throw new UnauthorizedException(
        error instanceof Error ? error.message : 'Fehler beim Passwort ändern',
      );
    }
  }
}
