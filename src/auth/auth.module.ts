import { Global, Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';

@Global() // nao há necessidade de importar em outros modulos para utilizar
@Module({
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService
    }
  ]
})
export class AuthModule {}
