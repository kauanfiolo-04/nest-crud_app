import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUEST_TOKEN_PAYLOAD_KEY, ROUTE_POLICY_KEY } from '../auth.constants';
import { RoutePolicies } from '../enum/route-policies.enum';
import { Request } from 'express';
import { Pessoa } from '../../pessoas/entities/pessoa.entity';
import JwtPayload from '../jwt-payload.protocol';

@Injectable()
export class RoutePolicyGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const routePolicyRequired = this.reflector.get<RoutePolicies | undefined>(ROUTE_POLICY_KEY, context.getHandler());

    // Nao tem politica de permissao na rota
    if (!routePolicyRequired) return true;

    const request = context.switchToHttp().getRequest<Request>();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const tokenPayload: JwtPayload | undefined = request[REQUEST_TOKEN_PAYLOAD_KEY];

    if (!tokenPayload) {
      throw new UnauthorizedException(`Rota requer permissão ${routePolicyRequired}. Usuário não logado`);
    }

    const { pessoa } = tokenPayload;

    if (!(pessoa as Pessoa).routePolicies.includes(routePolicyRequired)) {
      throw new UnauthorizedException(`Usuário não tem permissão ${routePolicyRequired}`);
    }

    return true;
  }
}
