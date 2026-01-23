import { DynamicModule, Module } from '@nestjs/common';

@Module({})
export class MyDinamicModule {
  static register(configs: any): DynamicModule {
    return {
      module: MyDinamicModule,
      imports: [],
      providers: [],
      controllers: [],
      exports: []
    };
  }
}
