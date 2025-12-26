import { PartialType } from '@nestjs/mapped-types';
import { RecadoDto } from '../entities/dto.entity';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateRecadoDto extends PartialType(RecadoDto) {
  @IsBoolean()
  @IsOptional()
  readonly lido?: string;
}
