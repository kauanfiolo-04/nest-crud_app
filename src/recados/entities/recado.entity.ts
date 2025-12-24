export interface Recado {
  id: number;
  texto: string;
  de: string;
  para: string;
  lido: boolean;
  data: Date;
}

export type RecadoDto = Readonly<Pick<Recado, 'texto' | 'de' | 'para'>>;
