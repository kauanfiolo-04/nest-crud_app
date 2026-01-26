import { Injectable, NotFoundException } from '@nestjs/common';
import { Recado } from './entities/recado.entity';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PessoasService } from '../pessoas/pessoas.service';
import { PaginationDTO } from '../common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RecadosService {
  constructor(
    @InjectRepository(Recado)
    private readonly recadoRepository: Repository<Recado>,
    private readonly pessoasService: PessoasService,
    private readonly configService: ConfigService
  ) {
    const databaseUsername = this.configService.get<string>('DATABASE_USERNAME');

    console.log(databaseUsername);
  }

  throwNotFoundException(): never {
    throw new NotFoundException('Recado não econtrado');
  }

  async findAll(paginationDto?: PaginationDTO) {
    const recados = await this.recadoRepository.find({
      take: paginationDto?.limit ?? 10,
      skip: paginationDto?.offset ?? 0,
      relations: ['de', 'para'],
      order: {
        id: 'desc'
      },
      select: {
        de: {
          id: true,
          nome: true
        },
        para: {
          id: true,
          nome: true
        }
      }
    });

    return recados;
  }

  async findOne(id: number) {
    const recado = await this.recadoRepository.findOne({
      where: { id },
      relations: ['de', 'para'],
      select: {
        de: {
          id: true,
          nome: true
        },
        para: {
          id: true,
          nome: true
        }
      }
    });

    if (!recado) this.throwNotFoundException();

    return recado;
  }

  async create(createRecadoDto: CreateRecadoDto) {
    const { deId, paraId } = createRecadoDto;

    // Encontrar a pessoa que esta criando o recado
    const de = await this.pessoasService.findOne(deId);

    // Encontrar a pessoa para quem o recado esta sendo enviado
    const para = await this.pessoasService.findOne(paraId);

    const novoRecado: Omit<Recado, 'id'> = {
      texto: createRecadoDto.texto,
      de,
      para,
      lido: false,
      data: new Date()
    };

    const recado = this.recadoRepository.create(novoRecado);

    await this.recadoRepository.save(recado);

    return {
      ...recado,
      de: {
        id: recado.de.id
      },
      para: {
        id: recado.para.id
      }
    };
  }

  async update(id: number, updateRecadoDto: UpdateRecadoDto) {
    const recado = await this.findOne(id);

    recado.texto = updateRecadoDto.texto ?? recado.texto;
    recado.lido = updateRecadoDto.lido ?? recado.lido;

    await this.recadoRepository.save(recado);

    return recado;
  }

  async remove(id: number) {
    const recado = await this.recadoRepository.findOneBy({ id });

    if (!recado) this.throwNotFoundException();

    return this.recadoRepository.remove(recado);
  }
}
