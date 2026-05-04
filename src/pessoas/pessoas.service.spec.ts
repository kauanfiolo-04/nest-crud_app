/* eslint-disable @typescript-eslint/unbound-method */
import { Repository } from 'typeorm';
import { PessoasService } from './pessoas.service';
import { Pessoa } from './entities/pessoa.entity';
import { HashingService } from '../auth/hashing/hashing.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';

describe('Pessoas service', () => {
  let pessoasService: PessoasService;
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
            save: jest.fn(),
            findOneBy: jest.fn(),
            find: jest.fn(),
            preload: jest.fn(),
            remove: jest.fn()
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

    pessoasService = module.get<PessoasService>(PessoasService);
    pessoaRepository = module.get<Repository<Pessoa>>(getRepositoryToken(Pessoa));
    hashingService = module.get<HashingService>(HashingService);
  });

  it('pessoaService should be defined', () => {
    expect(pessoasService).toBeDefined();
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
      const result = await pessoasService.create(createPessoaDto);

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

    it('deve lançar ConflictException quando email já existe', async () => {
      jest.spyOn(pessoaRepository, 'save').mockRejectedValue({ code: '23505' });

      await expect(pessoasService.create({} as CreatePessoaDto)).rejects.toThrow(ConflictException);
    });

    it('deve lançar erro generico', async () => {
      jest.spyOn(pessoaRepository, 'save').mockRejectedValue(new Error('Erro genérico'));

      await expect(pessoasService.create({} as CreatePessoaDto)).rejects.toThrow(new Error('Erro genérico'));
    });
  });

  describe('findOne', () => {
    it('deve retornar uma pessoa se a pessoa for encontrada', async () => {
      const pessoaId = 1;
      const pessoaEncontrada = {
        id: pessoaId,
        nome: 'KAUAN Fiolo',
        email: 'kauan@email.com',
        passwordHash: '123456'
      };

      jest.spyOn(pessoaRepository, 'findOneBy').mockResolvedValue(pessoaEncontrada as Pessoa);

      const result = await pessoasService.findOne(pessoaId);

      expect(result).toEqual(pessoaEncontrada);
    });

    it('deve retornar erro', async () => {
      await expect(pessoasService.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('deve retornar todas as pessoas', async () => {
      const pessoasMock: Pessoa[] = [
        {
          id: 1,
          nome: 'KAUAN Fiolo',
          email: 'kauan@email.com',
          passwordHash: '123456'
        } as Pessoa
      ];

      jest.spyOn(pessoaRepository, 'find').mockResolvedValue(pessoasMock);

      const result = await pessoasService.findAll();

      expect(result).toEqual(pessoasMock);
      expect(pessoaRepository.find).toHaveBeenCalledWith({
        order: {
          id: 'desc'
        }
      });
    });
  });

  describe('update', () => {
    it('deve atualizar uma pessoa se for autorizado', async () => {
      // Arrange
      const pessoaId = 1;
      const updatePessoaDto = { nome: 'Joana', password: '654321' };
      const tokenPayload = { sub: pessoaId };
      const passwordHash = 'HASHDESENHA';
      const updatedPessoa = { id: pessoaId, nome: 'Joana', passwordHash };

      jest.spyOn(hashingService, 'hash').mockResolvedValue(passwordHash);
      jest.spyOn(pessoaRepository, 'preload').mockResolvedValue(updatedPessoa as any);
      jest.spyOn(pessoaRepository, 'save').mockResolvedValue(updatedPessoa as any);

      // Act
      const result = await pessoasService.update(pessoaId, updatePessoaDto, tokenPayload as any);

      // Assert
      expect(result).toEqual(updatedPessoa);
      expect(hashingService.hash).toHaveBeenCalledWith(updatePessoaDto.password);
      expect(pessoaRepository.preload).toHaveBeenCalledWith({
        id: pessoaId,
        nome: updatedPessoa.nome,
        passwordHash
      });
      expect(pessoaRepository.save).toHaveBeenCalledWith(updatedPessoa);
    });

    it('deve lancar ForbiddenException se usuario nao autorizado', async () => {
      // Arrange
      const pessoaId = 1;
      const updatePessoaDto = { nome: 'Jane Doe' };
      const tokenPayload = { sub: 2 };
      const existingPessoa = { id: pessoaId, nome: 'John Doe' };

      // Simula que pessoa existe
      jest.spyOn(pessoaRepository, 'preload').mockResolvedValue(existingPessoa as any);

      // Act e Assert
      await expect(pessoasService.update(pessoaId, updatePessoaDto, tokenPayload as any)).rejects.toThrow(
        ForbiddenException
      );
    });

    it('deve lancar NotFoundException se a pessoa nao existir', async () => {
      // Arrange
      const pessoaId = 1;
      const updatePessoaDto = { nome: 'Jane Doe' };
      const tokenPayload = { sub: pessoaId };

      // Simula que preload retornou null
      jest.spyOn(pessoaRepository, 'preload').mockResolvedValue(undefined);

      // Act e Assert
      await expect(pessoasService.update(pessoaId, updatePessoaDto, tokenPayload as any)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('remove', () => {
    it('deve remover uma pessoa se autorizado', async () => {
      // Arrange
      const pessoaId = 1;
      const tokenPayload = { sub: pessoaId };
      const existingPessoa = { id: pessoaId, nome: 'Jane Doe' };

      // findOne do service vai retornar a pessoa existe
      jest.spyOn(pessoasService, 'findOne').mockResolvedValue(existingPessoa as Pessoa);

      // o metódo remove do repositório também vai retornar a pessoa existente
      jest.spyOn(pessoaRepository, 'remove').mockResolvedValue(existingPessoa as Pessoa);

      // Act
      const result = await pessoasService.remove(pessoaId, tokenPayload as any);

      // Assert
      // Espero que findOne do pessoaService seja chamado com o Id da pessoa
      expect(pessoasService.findOne).toHaveBeenCalledWith(pessoaId);

      // Espero que o remove do repositório seja chamado com a pessoa existente
      expect(pessoaRepository.remove).toHaveBeenCalledWith(existingPessoa);
      // Espero que a pessoa apagada seja retornada
      expect(result).toEqual(existingPessoa);
    });

    it('deve lancar ForbiddenException se nao autorizado', async () => {
      // Arrange
      const pessoaId = 1;
      const tokenPayload = { sub: 2 };
      const existingPessoa = { id: pessoaId, nome: 'Jane Doe' };

      // findOne seja chamado com pessoa existente
      jest.spyOn(pessoasService, 'findOne').mockResolvedValue(existingPessoa as Pessoa);

      // Espero que o servico rejeite porque o usuario é diferente da pessoa
      await expect(pessoasService.remove(pessoaId, tokenPayload as any)).rejects.toThrow(ForbiddenException);
    });

    it('deve lancar NotFoundException se a pessoa nao for encontrada', async () => {
      // Arrange
      const pessoaId = 1;
      const tokenPayload = { sub: pessoaId };

      // Simula que preload retornou null
      jest.spyOn(pessoasService, 'findOne').mockRejectedValue(new NotFoundException());

      // Act e Assert
      await expect(pessoasService.remove(pessoaId, tokenPayload as any)).rejects.toThrow(NotFoundException);
    });
  });
});
