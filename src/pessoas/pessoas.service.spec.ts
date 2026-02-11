/* eslint-disable @typescript-eslint/unbound-method */
import { Repository } from 'typeorm';
import { PessoasService } from './pessoas.service';
import { Pessoa } from './entities/pessoa.entity';
import { HashingService } from '../auth/hashing/hashing.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreatePessoaDto } from './dto/create-pessoa.dto';

describe('Pessoas service', () => {
  let pessoaService: PessoasService;
  let pessoaRepository: Repository<Pessoa>;
  let hashingService: HashingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PessoasService,
        {
          provide: getRepositoryToken(Pessoa),
          useValue: {
            create: jest.fn(),
            save: jest.fn()
          }
        },
        {
          provide: HashingService,
          useValue: {
            hash: jest.fn()
          }
        }
      ]
    }).compile();

    pessoaService = module.get<PessoasService>(PessoasService);
    pessoaRepository = module.get<Repository<Pessoa>>(getRepositoryToken(Pessoa));
    hashingService = module.get<HashingService>(HashingService);
  });

  it('pessoaService should be defined', () => {
    expect(pessoaService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new person', async () => {
      // CreatePessoaDTO
      // Que o hashing service tenha o método hash
      // Saber se o hashing service foi chamado com CreatePessoaDTO
      // Saber se o pessoaRepository.create foi chamado com dados pessoa
      // Saber se pessoaRepository.save foi chamado com a pessoa criada
      // O retorno final deve ser a nova pessoa criada -> expect

      // Arrange
      const createPessoaDto: CreatePessoaDto = {
        email: 'JEST@email.com',
        nome: 'Jest da Silva',
        password: '123456'
      };

      const passwordHash = 'HASH_DE_SENHA';

      const novaPessoa = {
        id: 1,
        nome: createPessoaDto.nome,
        email: createPessoaDto.email,
        passwordHash
      };

      // Como o valor retornado por hashinService.hash é necessário, vamos simular este valor
      const hashSpy = jest.spyOn(hashingService, 'hash').mockResolvedValue(passwordHash);

      // Como a pessoa retornada por pessoaRepository.create é necessária em pessoaRepository.save, vamos simular este valor
      jest.spyOn(pessoaRepository, 'create').mockReturnValue(novaPessoa as Pessoa);

      // Act
      const result = await pessoaService.create(createPessoaDto);

      // Assert
      // O método hashinService.hash foi chamado com createPessoaDto.password?
      expect(hashSpy).toHaveBeenCalledWith(createPessoaDto.password);

      // O método pessoaRepository.create foi chamado com os dados da nova pessoa com o hash de senha gerado por hashingService.hash ?
      // Posso criar e usar o createSpy pra n dar erro no eslint
      expect(pessoaRepository.create).toHaveBeenCalledWith({
        nome: createPessoaDto.nome,
        email: createPessoaDto.email,
        passwordHash
      });

      // O método pessoaRepository.save foi chamado com os dados da nova pessoa gerada por pessoaRepository.create ?
      expect(pessoaRepository.save).toHaveBeenCalledWith(novaPessoa);

      // o resultado do método retornou a nova pessoa criada?
      expect(result).toEqual(novaPessoa);
    });
  });
});
