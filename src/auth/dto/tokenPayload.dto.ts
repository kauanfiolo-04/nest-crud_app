import JwtPayload from '../jwt-payload.protocol';

export class TokenPayloadDto implements JwtPayload {
  sub: number;
  email: string;
  iat: number;
  exp: number;
  aud: string;
  iss: string;
}
