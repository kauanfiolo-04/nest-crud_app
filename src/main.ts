import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import appConfig from './app/config/app.config';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { MyExceptionFilter } from './common/filters/my-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  appConfig(app);

  // app.useGlobalFilters(new MyExceptionFilter()); perde o DI

  // helmet -> security headers in the HTTP protocol
  // cors

  if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
    app.enableCors({
      origin: 'http://www.meuapp.com.br'
    });
  }

  const documentBuilderConfig = new DocumentBuilder()
    .setTitle('Recados API')
    .setDescription('Envie recados para seus amigos e familiares')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, documentBuilderConfig);

  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.APP_PORT ?? 3000);
}
bootstrap();
