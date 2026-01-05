import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecadosModule } from '../recados/recados.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      database: 'postgres',
      password: '123456',
      autoLoadEntities: true, // carrega entidades sem precisar especifica-las
      synchronize: true // sincronize com o BD. Nao deve ser usado em producao
    }),
    RecadosModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
