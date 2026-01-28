import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { REQUEST_TOKEN_PAYLOAD_KEY } from '../auth.constants';
import { TokenPayloadDto } from '../dto/tokenPayload.dto';

export const TokenPayloadParam = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const context = ctx.switchToHttp();

  const request = context.getRequest<Request>();

  return request[REQUEST_TOKEN_PAYLOAD_KEY] as TokenPayloadDto;
});
