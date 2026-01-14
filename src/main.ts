import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ParseIntIdPipe } from './common/pipes/parse-int-id.pipe';
import { IsAdminGuard } from './common/guards/is-admin.guard';
// import { MyExceptionFilter } from './common/filters/my-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove os campos que nao estao no DTO
      forbidNonWhitelisted: true, //traz erro quando campo nao existe
      transform: false // tenta transformar os types dos dados de param e dtos, custa performance
    }),
    new ParseIntIdPipe()
  );

  // app.useGlobalFilters(new MyExceptionFilter()); perde o DI

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
