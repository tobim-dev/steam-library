import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  Min,
  Max,
} from 'class-validator';

export class CreateDiaryEntryDto {
  @IsOptional()
  @IsString()
  gameId?: string | null;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsDateString()
  playDate: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  hoursPlayed?: number | null;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number | null;
}
