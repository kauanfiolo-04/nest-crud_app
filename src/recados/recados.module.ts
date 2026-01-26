import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recado } from './entities/recado.entity';
import { RecadosController } from './recados.controller';
import { RecadosService } from './recados.service';
import { PessoasModule } from '../pessoas/pessoas.module';
import { RecadosUtils } from './recados.utils';
import { RegexFactory } from '../common/regex/regex.factory';
import { ConfigModule } from '@nestjs/config';
import recadosConfig from './recados.config';

@Module({
  imports: [
    ConfigModule.forFeature(recadosConfig),
    TypeOrmModule.forFeature([Recado]),
    forwardRef(() => PessoasModule)
    // MyDinamicModule.register({
    //   apiKey: 'Aqui vem a chave de API',
    //   apiUrl: 'https://bla.bla.com'
    // })
  ],
  controllers: [RecadosController],
  providers: [
    RecadosService,
    RecadosUtils,
    RegexFactory
    // {
    //   provide: REMOVE_SPACES_REGEX, // token
    //   useFactory: (regexFactory: RegexFactory) => {
    //     return regexFactory.create('RemoveSpacesRegex');
    //   }, // Factory
    //   inject: [RegexFactory] // Oq estou injetando na factory seguindo a ordem
    // },
    // {
    //   provide: ONLY_LOWERCASE_LETTERS_REGEX, // token
    //   useFactory: async (regexFactory: RegexFactory) => {
    //     console.log('Esperando promise no useFactory');

    //     await new Promise(resolve => setTimeout(resolve, 3000));

    //     console.log('Promise no useFactory resolvida');

    //     return regexFactory.create('OnlyLowercaseLettersRegex');
    //   }, // Factory
    //   inject: [RegexFactory] // Oq estou injetando na factory seguindo a ordem
    // }
  ],
  exports: [RecadosUtils]
})
export class RecadosModule {}
