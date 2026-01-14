// Cliente (Navegador) -> (Servidor) -> Middleware (Request, Response) -> NestJS (Guards, Interceptors, Pipes, Filters)

import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class OutroMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('OutroMiddlware: Olá');

    const authorization = req.headers.authorization;

    if (authorization) {
      req['user'] = {
        nome: 'Kauan',
        sobrenome: 'Fiolo'
      };
    }

    res.setHeader('CABECALHO', 'Do Middleware');

    // Terminando a cadeia de chamadas
    // return res.status(404).send({
    //   message: 'Não encontrado'
    // });

    next();

    console.log('OutroMiddleware: Tchau');
  }
}
