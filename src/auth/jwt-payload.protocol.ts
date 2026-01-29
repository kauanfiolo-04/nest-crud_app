export default interface JwtPayload {
  sub: number;
  iat: number;
  exp: number;
  aud: string;
  iss: string;
}
