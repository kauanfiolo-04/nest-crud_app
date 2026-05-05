import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ParseIntIdPipe } from '../../common/pipes/parse-int-id.pipe';

export default (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove os campos que nao estao no DTO
      forbidNonWhitelisted: true, //traz erro quando campo nao existe
      transform: false // tenta transformar os types dos dados de param e dtos, custa performance
    }),
    new ParseIntIdPipe()
  );

  return app;
};
