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

      const hashSpy = jest.spyOn(hashingService, 'hash').mockResolvedValue('HASH_DE_SENHA');
      // const createSpy = jest.spyOn(pessoaRepository, 'create');

      // Act
      await pessoaService.create(createPessoaDto);

      // Assert
      expect(hashSpy).toHaveBeenCalledWith(createPessoaDto.password);

      // Posso usar o createSpy pra n dar erro no eslint
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(pessoaRepository.create).toHaveBeenCalledWith({
        nome: createPessoaDto.nome,
        email: createPessoaDto.email,
        passwordHash: 'HASH_DE_SENHA'
      });
    });
  });
});
