import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { UserOrmEntity } from './user.orm-entity';

@Entity('games')
@Unique(['steamAppId', 'userId'])
export class GameOrmEntity {
  @PrimaryColumn('varchar')
  id: string;

  @Column({ type: 'integer' })
  steamAppId: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  headerImageUrl: string;

  @Column({ type: 'varchar' })
  storeUrl: string;

  @Column({ type: 'integer', default: 0 })
  playtimeForeverMinutes: number;

  @Column({ type: 'integer', nullable: true })
  playtimeRecentMinutes: number | null;

  @Column({ type: 'varchar', nullable: true })
  iconUrl: string | null;

  @Column({ type: 'datetime' })
  lastSyncedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'varchar' })
  userId: string;

  @ManyToOne(() => UserOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserOrmEntity;
}
