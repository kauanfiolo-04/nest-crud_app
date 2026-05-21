export class ResponseRecadoDto {
  id: number;
  texto: string;
  de: {
    id: number;
    nome: string;
  };
  para: {
    id: number;
    nome: string;
  };
  lido: boolean;
  data: Date;
  createdAta?: Date;
  updatededAt?: Date;
}
