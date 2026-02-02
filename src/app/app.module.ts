import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecadosModule } from '../recados/recados.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PessoasModule } from '../pessoas/pessoas.module';
import { ConfigModule, type ConfigType } from '@nestjs/config';
import globalConfig from '../global-config/global.config';
import { GlobalConfigModule } from '../global-config/global-config.module';
import { AuthModule } from '../auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forFeature(globalConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(globalConfig)],
      inject: [globalConfig.KEY],
      useFactory: (globalConfiguration: ConfigType<typeof globalConfig>) => {
        return {
          type: globalConfiguration.database.type,
          host: globalConfiguration.database.host,
          port: globalConfiguration.database.port,
          username: globalConfiguration.database.username,
          database: globalConfiguration.database.database,
          password: globalConfiguration.database.password,
          autoLoadEntities: globalConfiguration.database.autoLoadEntities,
          synchronize: globalConfiguration.database.synchronize
        };
      }
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, '..', '..', 'pictures'),
      serveRoot: '/pictures'
    }),
    RecadosModule,
    PessoasModule,
    GlobalConfigModule,
    AuthModule
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
