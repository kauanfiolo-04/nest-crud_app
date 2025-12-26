import { Recado } from './recado.entity';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

type RecadoProps = Pick<Recado, 'texto' | 'de' | 'para'>;

export class RecadoDto implements RecadoProps {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(255)
  readonly texto: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  readonly de: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  readonly para: string;
}
