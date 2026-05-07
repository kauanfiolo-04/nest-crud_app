/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
import { CreatePessoaDto } from '../src/pessoas/dto/create-pessoa.dto';
import { createUserAndLogin } from './helpers';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let accessToken: string;

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

    accessToken = await createUserAndLogin(app);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/pessoas (POST)', () => {
    it('deve criar uma pessoa com sucesso', async () => {
      const createPessoaDTO: CreatePessoaDto = {
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

    it('deve gerar um erro de e-mail já existente', async () => {
      const createPessoaDTO: CreatePessoaDto = {
        email: 'teste_e2e@email.com',
        password: '123456',
        nome: 'Test_E2E'
      };

      await request(app.getHttpServer()).post('/pessoas').send(createPessoaDTO).expect(HttpStatus.CREATED);

      const response = await request(app.getHttpServer())
        .post('/pessoas')
        .send(createPessoaDTO)
        .expect(HttpStatus.CONFLICT);

      expect(response.body.message).toBe('Email já cadastrado');
    });

    it('deve gerar erro de senha curta', async () => {
      const createPessoaDTO: CreatePessoaDto = {
        email: 'teste_e2e@email.com',
        nome: 'Test_E2E',
        password: '123'
      };

      const response = await request(app.getHttpServer())
        .post('/pessoas')
        .send(createPessoaDTO)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.message).toContain('password must be longer than or equal to 5 characters');
    });
  });

  describe('/pessoas/:id (GET)', () => {
    it('deve Unauthorized quando usuário nao está logado', async () => {
      const createPessoaDTO: CreatePessoaDto = {
        email: 'teste_e2e@email.com',
        password: '123456',
        nome: 'Test_E2E'
      };

      const pessoaResponse = await request(app.getHttpServer())
        .post('/pessoas')
        .send(createPessoaDTO)
        .expect(HttpStatus.CREATED);

      const response = await request(app.getHttpServer())
        .get(`/pessoas/${pessoaResponse.body.id}`)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body.message).toBe('Não logado!');
    });

    it('deve retonar a Pessoa quando usuário está logado', async () => {
      const createPessoaDTO: CreatePessoaDto = {
        email: 'teste_e2e@email.com',
        password: '123456',
        nome: 'Test_E2E'
      };

      const pessoaResponse = await request(app.getHttpServer())
        .post('/pessoas')
        .send(createPessoaDTO)
        .expect(HttpStatus.CREATED);

      const response = await request(app.getHttpServer())
        .get(`/pessoas/${pessoaResponse.body.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK);

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
