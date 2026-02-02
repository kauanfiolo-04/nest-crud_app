import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pessoa } from './entities/pessoa.entity';
import { HashingService } from '../auth/hashing/hashing.service';
import { TokenPayloadDto } from '../auth/dto/tokenPayload.dto';
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class PessoasService {
  constructor(
    @InjectRepository(Pessoa)
    private readonly pessoaRepository: Repository<Pessoa>,
    private readonly hashingService: HashingService
  ) {}

  throwNotFoundException(): never {
    throw new NotFoundException('Pessoa não econtrada');
  }

  throwForbiddenException(): never {
    throw new ForbiddenException('Voce não é essa pessoa!');
  }

  async create(createPessoaDto: CreatePessoaDto) {
    try {
      const passwordHash = await this.hashingService.hash(createPessoaDto.password);

      const pessoaDados = {
        nome: createPessoaDto.nome,
        email: createPessoaDto.email,
        passwordHash
        // routePolicies: createPessoaDto.routePolicies
      };

      const novaPessoa = this.pessoaRepository.create(pessoaDados);

      await this.pessoaRepository.save(novaPessoa);

      return novaPessoa;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error?.code === '23505') {
        throw new ConflictException('Email já cadastrado');
      }

      throw error;
    }
  }

  async findAll() {
    const pessoas = await this.pessoaRepository.find({
      order: { id: 'desc' }
    });

    return pessoas;
  }

  async findOne(id: number) {
    const pessoa = await this.pessoaRepository.findOneBy({ id });

    if (!pessoa) this.throwNotFoundException();

    return pessoa;
  }

  async update(id: number, updatePessoaDto: UpdatePessoaDto, tokenPayload: TokenPayloadDto) {
    const dadosPessoa = {
      nome: updatePessoaDto.nome
    };

    if (updatePessoaDto.password) {
      const passwordHash = await this.hashingService.hash(updatePessoaDto.password);

      dadosPessoa['passwordHash'] = passwordHash;
    }

    const pessoa = await this.pessoaRepository.preload({
      id,
      ...dadosPessoa
    });

    if (!pessoa) this.throwNotFoundException();

    if (pessoa.id !== tokenPayload.sub) this.throwForbiddenException();

    return await this.pessoaRepository.save(pessoa);
  }

  async remove(id: number, tokenPayload: TokenPayloadDto) {
    const pessoa = await this.pessoaRepository.findOneBy({ id });

    if (!pessoa) this.throwNotFoundException();

    if (pessoa.id !== tokenPayload.sub) this.throwForbiddenException();

    return await this.pessoaRepository.remove(pessoa);
  }

  async uploadPicture(file: Express.Multer.File, tokenPayload: TokenPayloadDto) {
    if (file.size < 1024) throw new BadRequestException('Arquivo muito leve.');

    const pessoa = await this.findOne(tokenPayload.sub);

    const fileExtension = path.extname(file.originalname).toLocaleLowerCase().substring(1);

    const fileName = `${tokenPayload.sub}.${fileExtension}`;

    const fileFullPath = path.resolve(process.cwd(), 'pictures', fileName);

    await fs.writeFile(fileFullPath, file.buffer);

    console.log(fileFullPath);

    pessoa.picture = fileName;

    await this.pessoaRepository.save(pessoa);

    return pessoa;
  }
}
