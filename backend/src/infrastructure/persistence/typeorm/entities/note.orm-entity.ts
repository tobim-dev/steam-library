import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { GameOrmEntity } from './game.orm-entity';

@Entity('notes')
export class NoteOrmEntity {
  @PrimaryColumn('varchar')
  id: string;

  @Column({ type: 'varchar' })
  gameId: string;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => GameOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'gameId' })
  game: GameOrmEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
