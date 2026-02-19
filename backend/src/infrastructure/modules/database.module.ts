import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameOrmEntity } from '../persistence/typeorm/entities/game.orm-entity';
import { NoteOrmEntity } from '../persistence/typeorm/entities/note.orm-entity';
import { DiaryEntryOrmEntity } from '../persistence/typeorm/entities/diary-entry.orm-entity';
import { SettingsOrmEntity } from '../persistence/typeorm/entities/settings.orm-entity';
import { UserOrmEntity } from '../persistence/typeorm/entities/user.orm-entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: process.env.DB_PATH || './data/gaming_library.db',
      entities: [
        GameOrmEntity,
        NoteOrmEntity,
        DiaryEntryOrmEntity,
        SettingsOrmEntity,
        UserOrmEntity,
      ],
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}
