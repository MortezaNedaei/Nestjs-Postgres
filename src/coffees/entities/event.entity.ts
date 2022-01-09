import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@Index(['name', 'type'])
export class Event {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column('json')
  payload: Record<string, any>;
}
