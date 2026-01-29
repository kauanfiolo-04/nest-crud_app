import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { type ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { Pessoa } from '../../pessoas/entities/pessoa.entity';
import jwtConfig from '../config/jwt.config';
import { REQUEST_TOKEN_PAYLOAD_KEY } from '../auth.constants';
import JwtPayload from '../jwt-payload.protocol';

@Injectable()
export class AuthTokenGuard implements CanActivate {
  constructor(
    @InjectRepository(Pessoa)
    private readonly pessoaRepository: Repository<Pessoa>,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException('Não logado!');

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, this.jwtConfiguration);

      const pessoa = await this.pessoaRepository.findOneBy({ id: payload.sub, active: true });

      if (!pessoa) throw new UnauthorizedException('Pessoa não autorizada');

      request[REQUEST_TOKEN_PAYLOAD_KEY] = payload;
    } catch (error: unknown) {
      throw new UnauthorizedException((error instanceof Error ? error.message : undefined) ?? 'Falha ao logar!');
    }

    return true;
  }

  extractTokenFromHeader(request: Request): string | undefined {
    const authorization = request.headers.authorization;

    if (!authorization || typeof authorization !== 'string') return;

    return authorization.split(' ')[1];
  }
}
