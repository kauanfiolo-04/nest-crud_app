import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import appConfig from './app/config/app.config';
// import { MyExceptionFilter } from './common/filters/my-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  appConfig(app);

  // app.useGlobalFilters(new MyExceptionFilter()); perde o DI

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
