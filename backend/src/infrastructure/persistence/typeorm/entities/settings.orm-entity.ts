import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('settings')
export class SettingsOrmEntity {
  @PrimaryColumn('varchar')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  steamApiKey: string | null;

  @Column({ type: 'varchar', nullable: true })
  steamId: string | null;

  @Column({ type: 'datetime', nullable: true })
  lastSyncAt: Date | null;

  @Column({ type: 'integer', nullable: true })
  lastSyncGameCount: number | null;
}
