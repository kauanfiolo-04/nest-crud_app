import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Recado } from './entities/recado.entity';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PessoasService } from '../pessoas/pessoas.service';
import { PaginationDTO } from '../common/dto/pagination.dto';
// import { type ConfigType } from '@nestjs/config';
// import recadosConfig from './recados.config';
import { TokenPayloadDto } from '../auth/dto/tokenPayload.dto';
import { EmailService } from '../email/email.service';
import { ResponseRecadoDto } from './dto/response-recado.dto';

@Injectable()
export class RecadosService {
  constructor(
    @InjectRepository(Recado)
    private readonly recadoRepository: Repository<Recado>,
    private readonly pessoasService: PessoasService,
    private readonly emailService: EmailService
    // @Inject(recadosConfig.KEY)
    // private readonly recadosConfiguration: ConfigType<typeof recadosConfig>
  ) {
    // console.log(this.recadosConfiguration);
  }

  throwNotFoundException(): never {
    throw new NotFoundException('Recado não econtrado');
  }

  throwForbiddenException(): never {
    throw new ForbiddenException('Esse recado não é seu!');
  }

  async findAll(paginationDto?: PaginationDTO): Promise<ResponseRecadoDto[]> {
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

  async findOne(id: number): Promise<ResponseRecadoDto> {
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

  async create(createRecadoDto: CreateRecadoDto, tokenPayload: TokenPayloadDto): Promise<ResponseRecadoDto> {
    const { paraId } = createRecadoDto;

    // Encontrar a pessoa que esta criando o recado
    const de = await this.pessoasService.findOne(tokenPayload.sub);

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

    await this.emailService.sendEmail(
      para.email,
      `Você recebeu um recado de "${de.nome}" <${de.email}>`,
      createRecadoDto.texto
    );

    return {
      ...recado,
      de: {
        id: recado.de.id,
        nome: recado.de.nome
      },
      para: {
        id: recado.para.id,
        nome: recado.para.nome
      }
    };
  }

  async update(
    id: number,
    updateRecadoDto: UpdateRecadoDto,
    tokenPayload: TokenPayloadDto
  ): Promise<ResponseRecadoDto> {
    const recado = await this.findOne(id);

    if (recado.de.id !== tokenPayload.sub) this.throwForbiddenException();

    recado.texto = updateRecadoDto.texto ?? recado.texto;
    recado.lido = updateRecadoDto.lido ?? recado.lido;

    await this.recadoRepository.save(recado);

    return recado;
  }

  async remove(id: number, tokenPayload: TokenPayloadDto): Promise<ResponseRecadoDto> {
    const recado = await this.findOne(id);

    if (!recado) this.throwNotFoundException();

    if (recado.de.id !== tokenPayload.sub) this.throwForbiddenException();

    await this.recadoRepository.delete(recado.id);

    return recado;
  }
}
