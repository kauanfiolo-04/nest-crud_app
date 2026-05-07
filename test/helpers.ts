/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { Request } from 'express';
import request from 'supertest';
import { CreatePessoaDto } from '../src/pessoas/dto/create-pessoa.dto';

export const login = async (app: INestApplication<App>, email: string, password: string) => {
  const response = await request(app.getHttpServer()).post('/auth').send({ email, password });

  return response.body.accessToken as string;
};

export const createUserAndLogin = async (app: INestApplication<App>) => {
  const createPessoaDTO: CreatePessoaDto = {
    email: 'teste_e2e@email.com',
    password: '123456',
    nome: 'Test_E2E'
  };

  await request(app.getHttpServer()).post('/pessoas').send(createPessoaDTO);

  return login(app, createPessoaDTO.email, createPessoaDTO.password);
};
