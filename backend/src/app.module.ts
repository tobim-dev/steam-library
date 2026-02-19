import { Module } from '@nestjs/common';
import { DatabaseModule } from './infrastructure/modules/database.module';
import { AuthModule } from './infrastructure/modules/auth.module';
import { UsersModule } from './infrastructure/modules/users.module';
import { GamesModule } from './infrastructure/modules/games.module';
import { NotesModule } from './infrastructure/modules/notes.module';
import { DiaryModule } from './infrastructure/modules/diary.module';
import { SettingsModule } from './infrastructure/modules/settings.module';
import { SteamModule } from './infrastructure/modules/steam.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
    GamesModule,
    NotesModule,
    DiaryModule,
    SettingsModule,
    SteamModule,
  ],
})
export class AppModule {}
