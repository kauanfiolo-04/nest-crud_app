import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pessoa } from './entities/pessoa.entity';
import { HashingService } from '../auth/hashing/hashing.service';
import { TokenPayloadDto } from '../auth/dto/tokenPayload.dto';

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

  async create(createPessoaDto: CreatePessoaDto) {
    try {
      const passwordHash = await this.hashingService.hash(createPessoaDto.password);

      const pessoaDados = {
        nome: createPessoaDto.nome,
        email: createPessoaDto.email,
        passwordHash
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

    return await this.pessoaRepository.save(pessoa);
  }

  async remove(id: number, tokenPayload: TokenPayloadDto) {
    const pessoa = await this.pessoaRepository.findOneBy({ id });

    if (!pessoa) this.throwNotFoundException();

    return await this.pessoaRepository.remove(pessoa);
  }
}
