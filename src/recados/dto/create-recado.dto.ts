import { RecadoDto } from '../entities/recado.entity';

export class CreateRecadoDto implements RecadoDto {
  texto: string;
  de: string;
  para: string;
}
