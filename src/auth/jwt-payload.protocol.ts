import { Pessoa } from '../pessoas/entities/pessoa.entity';

export default interface JwtPayload {
  email?: string;
  pessoa?: Pessoa;
  sub: number;
  iat: number;
  exp: number;
  aud: string;
  iss: string;
}
