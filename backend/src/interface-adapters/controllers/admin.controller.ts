import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../infrastructure/auth/guards/jwt-auth.guard';
import { AdminGuard } from '../../infrastructure/auth/guards/admin.guard';
import { CreateUserUseCase } from '../../application/use-cases/users/create-user.use-case';
import { GetAllUsersUseCase } from '../../application/use-cases/users/get-all-users.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/users/update-user.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/users/delete-user.use-case';
import { SyncAllUsersUseCase } from '../../application/use-cases/games/sync-all-users.use-case';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserPresenter } from '../presenters/user.presenter';
import type { AuthenticatedRequest } from '../../shared/authenticated-request';

@Controller('api/admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly getAllUsers: GetAllUsersUseCase,
    private readonly updateUser: UpdateUserUseCase,
    private readonly deleteUser: DeleteUserUseCase,
    private readonly syncAllUsers: SyncAllUsersUseCase,
  ) {}

  @Get('users')
  async findAll() {
    const users = await this.getAllUsers.execute();
    return users.map((u) => UserPresenter.toResponse(u));
  }

  @Post('users')
  async create(@Body() dto: CreateUserDto) {
    try {
      const user = await this.createUser.execute({
        username: dto.username,
        displayName: dto.displayName,
        password: dto.password,
        role: dto.role,
      });
      return UserPresenter.toResponse(user);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Fehler beim Erstellen',
      );
    }
  }

  @Put('users/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    try {
      const user = await this.updateUser.execute(id, {
        displayName: dto.displayName,
        role: dto.role,
        isActive: dto.isActive,
      });
      return UserPresenter.toResponse(user);
    } catch (error) {
      throw new NotFoundException(
        error instanceof Error ? error.message : 'User nicht gefunden',
      );
    }
  }

  @Delete('users/:id')
  async remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    try {
      await this.deleteUser.execute(id, req.user.id);
      return { success: true };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Fehler beim Löschen',
      );
    }
  }

  @Post('sync-all')
  async syncAll() {
    const result = await this.syncAllUsers.execute();
    return result;
  }
}
