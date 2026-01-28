import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { type ConfigType } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { Pessoa } from '../pessoas/entities/pessoa.entity';
import { HashingService } from './hashing/hashing.service';
import jwtConfig from './config/jwt.config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Pessoa)
    private readonly pessoaRepository: Repository<Pessoa>,
    private readonly hashingService: HashingService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService
  ) {}

  async login(loginDto: LoginDto) {
    const pessoa = await this.pessoaRepository.findOneBy({ email: loginDto.email });

    if (!pessoa) throw new NotFoundException('Nenhum usuário foi encontrado com este email');

    const passwordIsValid = await this.hashingService.compare(loginDto.password, pessoa.passwordHash);

    if (!passwordIsValid) throw new UnauthorizedException('Senha inválida');

    const accessToken = await this.jwtService.signAsync(
      {
        sub: pessoa.id,
        email: pessoa.email
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.jwtTtl
      }
    );

    return { accessToken };
  }
}
