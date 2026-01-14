import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecadosModule } from '../recados/recados.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PessoasModule } from '../pessoas/pessoas.module';
import { SimpleMiddleware } from '../common/middlewares/simple.middleware';
import { OutroMiddleware } from '../common/middlewares/outro.middleware';
import { APP_FILTER } from '@nestjs/core';
import { ErrorExceptionFilter } from '../common/filters/error-exception.filter';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      database: 'postgres',
      password: '123456',
      autoLoadEntities: true, // carrega entidades sem precisar especifica-las
      synchronize: true // sincronize com o BD. Nao deve ser usado em producao
    }),
    RecadosModule,
    PessoasModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ErrorExceptionFilter
    }
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SimpleMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL
    });

    consumer.apply(OutroMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL
    });
  }
}
