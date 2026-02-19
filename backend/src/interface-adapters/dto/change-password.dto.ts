import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @MinLength(4, { message: 'Das Passwort muss mindestens 4 Zeichen lang sein' })
  newPassword: string;
}
