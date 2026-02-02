import { IsEmail } from 'class-validator';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Recado } from '../../recados/entities/recado.entity';

@Entity()
export class Pessoa {
  @PrimaryGeneratedColumn()
  id: number;

  @IsEmail()
  @Column({ unique: true })
  email: string;

  @Column({ length: 255 })
  passwordHash: string;

  @Column({ length: 100 })
  nome: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  // Uma pessoa pode ter enviado muitos recados (como "de")
  // Esses recados sao relacionados ao campo "de" na entidade recado
  @OneToMany(() => Recado, recado => recado.de)
  recadosEnviados: Recado[];

  // Uma pessoa pode ter enviado muitos recados (como "para")
  // Esses recados sao relacionados ao campo "para" na entidade recado
  @OneToMany(() => Recado, recado => recado.para)
  recadosRecebidos: Recado[];

  @Column({ default: true })
  active: boolean;

  @Column({ default: '' })
  picture: string;

  // @Column({ type: 'simple-array', default: [] })
  // routePolicies: RoutePolicies[];
}
