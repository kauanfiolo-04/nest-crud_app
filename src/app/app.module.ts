import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecadosModule } from '../recados/recados.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PessoasModule } from '../pessoas/pessoas.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      // envFilePath: ['.env'],
      // ignoreEnvFile: true
    }),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      database: process.env.DATABASE_DATABASE,
      password: process.env.DATABASE_PASSWORD,
      autoLoadEntities: Boolean(process.env.DATABASE_AUTOLOADINGENTITIES), // carrega entidades sem precisar especifica-las
      synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE) // sincronize com o BD. Nao deve ser usado em producao
    }),
    RecadosModule,
    PessoasModule
  ],
  controllers: [AppController],
  providers: [
    AppService
    // {
    //   provide: APP_FILTER,
    //   useClass: ErrorExceptionFilter
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: IsAdminGuard
    // }
  ]
})
export class AppModule {}

// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(SimpleMiddleware).forRoutes({
//       path: '*',
//       method: RequestMethod.ALL
//     });

//     // consumer.apply(OutroMiddleware).forRoutes({
//     //   path: '*',
//     //   method: RequestMethod.ALL
//     // });
//   }
// }
