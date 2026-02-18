import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  Min,
  Max,
} from 'class-validator';

export class UpdateDiaryEntryDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsDateString()
  playDate?: string;

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
