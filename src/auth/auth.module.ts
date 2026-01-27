import { Global, Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pessoa } from '../pessoas/entities/pessoa.entity';

@Global() // nao há necessidade de importar em outros modulos para utilizar
@Module({
  imports: [TypeOrmModule.forFeature([Pessoa])],
  controllers: [AuthController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService
    },
    AuthService
  ],
  exports: [HashingService]
})
export class AuthModule {}
