import { Injectable, NotFoundException } from '@nestjs/common';
import { Recado } from './entities/recado.entity';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RecadosService {
  constructor(
    @InjectRepository(Recado)
    private readonly recadoRepository: Repository<Recado>
  ) {}

  throwNotFoundException(): never {
    throw new NotFoundException('Recado não econtrado');
  }

  async findAll() {
    const recados = await this.recadoRepository.find();

    return recados;
  }

  async findOne(id: number) {
    const recado = await this.recadoRepository.findOne({
      where: { id }
    });

    if (!recado) this.throwNotFoundException();

    return recado;
  }

  async create(createRecadoDto: CreateRecadoDto) {
    const novoRecado: Omit<Recado, 'id'> = {
      ...createRecadoDto,
      lido: false,
      data: new Date()
    };

    const recado = this.recadoRepository.create(novoRecado);

    return await this.recadoRepository.save(recado);
  }

  async update(id: number, updateRecadoDto: UpdateRecadoDto) {
    const partialUpdateRecadoDto = {
      lido: updateRecadoDto.lido,
      texto: updateRecadoDto.texto
    };

    const recado = await this.recadoRepository.preload({
      id,
      ...partialUpdateRecadoDto
    });

    if (!recado) this.throwNotFoundException();

    await this.recadoRepository.save(recado);

    return recado;
  }

  async remove(id: number) {
    const recado = await this.recadoRepository.findOneBy({ id });

    if (!recado) this.throwNotFoundException();

    return this.recadoRepository.remove(recado);
  }
}
