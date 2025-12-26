import { PartialType } from '@nestjs/mapped-types';
import { RecadoDto } from './recado.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateRecadoDto extends PartialType(RecadoDto) {
  @IsBoolean()
  @IsOptional()
  readonly lido?: boolean;
}
