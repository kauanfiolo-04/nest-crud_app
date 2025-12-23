/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Recado } from './entities/recado.entity';

@Injectable()
export class RecadosService {
  private lastId = 1;
  private recados: Recado[] = [
    {
      id: 1,
      texto: 'Este é um recado de teste',
      de: 'Joana',
      para: 'João',
      lido: false,
      data: new Date()
    }
  ];

  throwNotFoundException() {
    throw new NotFoundException('Recado não econtrado');
  }

  findAll() {
    return this.recados;
  }

  findOne(id: string) {
    const recado = this.recados.find(item => item.id === +id);

    if (!recado) this.throwNotFoundException();

    return recado;
  }

  create(body: any) {
    this.lastId++;
    const id = this.lastId;
    const novoRecado = {
      id,
      ...body
    };

    this.recados.push(novoRecado as Recado);

    return novoRecado;
  }

  update(id: string, body: any) {
    const recadoExistenteIndex = this.recados.findIndex(item => item.id === +id);

    if (recadoExistenteIndex < 0) {
      this.throwNotFoundException();
    }

    const recadoExistente = this.recados[recadoExistenteIndex];

    this.recados[recadoExistenteIndex] = {
      ...recadoExistente,
      ...body
    };

    return this.recados[recadoExistenteIndex];
  }

  remove(id: string) {
    const recadoExistenteIndex = this.recados.findIndex(item => item.id === +id);

    if (recadoExistenteIndex < 0) {
      this.throwNotFoundException();
    }

    const recado = this.recados[recadoExistenteIndex];

    this.recados.splice(recadoExistenteIndex, 1);

    return recado;
  }
}
