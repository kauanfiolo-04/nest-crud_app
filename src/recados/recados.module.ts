import { Module } from '@nestjs/common';
import { RecadosController } from './recados.controller';
import { RecadosService } from './recados.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recado } from './entities/recado.entity';
import { PessoasModule } from '../pessoas/pessoas.module';
import { RecadosUtils } from './recados.utils';

@Module({
  imports: [TypeOrmModule.forFeature([Recado]), PessoasModule],
  controllers: [RecadosController],
  providers: [RecadosService, RecadosUtils]
})
export class RecadosModule {}
