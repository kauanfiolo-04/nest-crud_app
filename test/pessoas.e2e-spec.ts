/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
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

  describe('/pessoas (POST)', () => {
    it('deve criar uma pessoa com sucesso', async () => {
      const createPessoaDTO = {
        email: 'teste_e2e@email.com',
        password: '123456',
        nome: 'Test_E2E'
      };

      const response = await request(app.getHttpServer())
        .post('/pessoas')
        .send(createPessoaDTO)
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual({
        email: createPessoaDTO.email,
        passwordHash: expect.any(String),
        nome: createPessoaDTO.nome,
        active: true,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        picture: '',
        id: expect.any(Number)
      });
    });
  });
});
