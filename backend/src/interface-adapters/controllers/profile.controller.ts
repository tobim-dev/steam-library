import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../infrastructure/auth/guards/jwt-auth.guard';
import { UpdateProfileUseCase } from '../../application/use-cases/users/update-profile.use-case';
import { ValidateJwtPayloadUseCase } from '../../application/use-cases/auth/validate-jwt-payload.use-case';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { UserPresenter } from '../presenters/user.presenter';
import type { AuthenticatedRequest } from '../../shared/authenticated-request';

@Controller('api/profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(
    private readonly updateProfile: UpdateProfileUseCase,
    private readonly validateJwtPayload: ValidateJwtPayloadUseCase,
  ) {}

  @Get()
  async getProfile(@Request() req: AuthenticatedRequest) {
    const user = await this.validateJwtPayload.execute(req.user.id);
    return UserPresenter.toResponse(user);
  }

  @Put()
  async update(
    @Request() req: AuthenticatedRequest,
    @Body() dto: UpdateProfileDto,
  ) {
    const user = await this.updateProfile.execute(req.user.id, {
      displayName: dto.displayName,
      steamId: dto.steamId,
    });
    return UserPresenter.toResponse(user);
  }
}
