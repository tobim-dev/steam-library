import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsIn,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  displayName: string;

  @IsString()
  @MinLength(4)
  password: string;

  @IsOptional()
  @IsString()
  @IsIn(['admin', 'user'])
  role?: 'admin' | 'user';
}
