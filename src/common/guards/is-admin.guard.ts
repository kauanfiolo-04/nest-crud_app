import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

// Nao existe NestGuard kkkkkk

@Injectable()
export class IsAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const role: string | undefined = (request['user'] as Record<string, string>)?.role;

    if (role === 'admin') {
      return true;
    }

    return false;
  }
}
