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

@Entity('diary_entries')
export class DiaryEntryOrmEntity {
  @PrimaryColumn('varchar')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  gameId: string | null;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'datetime' })
  playDate: Date;

  @Column({ type: 'real', nullable: true })
  hoursPlayed: number | null;

  @Column({ type: 'integer', nullable: true })
  rating: number | null;

  @ManyToOne(() => GameOrmEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'gameId' })
  game: GameOrmEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
