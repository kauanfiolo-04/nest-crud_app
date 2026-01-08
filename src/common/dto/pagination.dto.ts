import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationDTO {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Max(50)
  @Min(0)
  limit: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset: number;
}
