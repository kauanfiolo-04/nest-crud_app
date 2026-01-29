import JwtPayload from '../jwt-payload.protocol';

export class TokenPayloadDto implements JwtPayload {
  email: string;
  sub: number;
  iat: number;
  exp: number;
  aud: string;
  iss: string;
}
