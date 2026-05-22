import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateRecadoDto } from './create-recado.dto';

export class UpdateRecadoDto extends PartialType(CreateRecadoDto) {
  @IsBoolean()
  @IsOptional()
  readonly lido?: boolean;
}
