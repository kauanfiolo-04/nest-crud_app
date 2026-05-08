/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { Request } from 'express';
import request from 'supertest';
import { CreatePessoaDto } from '../src/pessoas/dto/create-pessoa.dto';
import { Pessoa } from '../src/pessoas/entities/pessoa.entity';

export const login = async (app: INestApplication<App>, email: string, password: string) => {
  const response = await request(app.getHttpServer()).post('/auth').send({ email, password });

  return response.body.accessToken as string;
};

export const createUserAndLogin = async (app: INestApplication<App>) => {
  const createPessoaDTO: CreatePessoaDto = {
    email: 'anyEmail@email.com',
    password: 'any123',
    nome: 'anyName'
  };

  const createResponse = await request(app.getHttpServer()).post('/pessoas').send(createPessoaDTO);
  const pessoa = createResponse.body as Pessoa;

  const accessToken = await login(app, createPessoaDTO.email, createPessoaDTO.password);

  return { pessoa, accessToken };
};
