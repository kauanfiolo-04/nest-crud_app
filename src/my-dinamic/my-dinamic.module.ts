import { DynamicModule, Module } from '@nestjs/common';

export type MyDynamicModuleConfigs = {
  apiKey: string;
  apiUrl: string;
};

export const MY_DYNAMIC_CONFIG = 'MY_DYNAMIC_CONFIG';

@Module({})
export class MyDinamicModule {
  static register(configs: MyDynamicModuleConfigs): DynamicModule {
    // Aqui vou usar as configs
    console.log('MyDinamicModule', configs);

    return {
      module: MyDinamicModule,
      imports: [],
      providers: [
        {
          provide: MY_DYNAMIC_CONFIG,
          useValue: configs
        }
      ],
      controllers: [],
      exports: [MY_DYNAMIC_CONFIG]
    };
  }
}
