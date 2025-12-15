import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DefaultEntity } from '../../../common/default.entity'
@Entity()
export class Crud extends DefaultEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  age: number;

}
