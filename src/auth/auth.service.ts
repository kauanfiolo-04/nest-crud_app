import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { type ConfigType } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { Pessoa } from '../pessoas/entities/pessoa.entity';
import { HashingService } from './hashing/hashing.service';
import jwtConfig from './config/jwt.config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Pessoa)
    private readonly pessoaRepository: Repository<Pessoa>,
    private readonly hashingService: HashingService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
  ) {}

  async login(loginDto: LoginDto) {
    let passwordIsValid = false;
    let throwError = true;

    const pessoa = await this.pessoaRepository.findOneBy({ email: loginDto.email });

    if (pessoa) {
      passwordIsValid = await this.hashingService.compare(loginDto.password, pessoa.passwordHash);
    }

    if (passwordIsValid) {
      throwError = false;
    }

    if (throwError) {
      throw new UnauthorizedException('Usuário ou senha inválidos.');
    }

    return {
      message: 'Usuário logado!'
    };
  }
}
