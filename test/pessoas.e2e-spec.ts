import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { AuthModule } from '../src/auth/auth.module';
import { GlobalConfigModule } from '../src/global-config/global-config.module';
import globalConfig from '../src/global-config/global.config';
import { PessoasModule } from '../src/pessoas/pessoas.module';
import { RecadosModule } from '../src/recados/recados.module';
import appConfig from '../src/app/config/app.config';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forFeature(globalConfig),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          database: 'testing', // ATENÇÂO
          password: process.env.TESTING_DATABASE_PASSWORD,
          autoLoadEntities: true,
          synchronize: true,
          dropSchema: true
        }),
        ServeStaticModule.forRoot({
          rootPath: path.resolve(__dirname, '..', '..', 'pictures'),
          serveRoot: '/pictures'
        }),
        RecadosModule,
        PessoasModule,
        GlobalConfigModule,
        AuthModule
      ]
    }).compile();

    app = module.createNestApplication();

    appConfig(app);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/ (GET)', () => {});
});
