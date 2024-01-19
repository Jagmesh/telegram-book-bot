import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { TelegramModule } from './telegram/telegram.module';
import { TelegramBotService } from './telegram-bot/telegram-bot.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), BookModule, TelegramModule],
  controllers: [AppController],
  providers: [AppService, TelegramBotService],
})
export class AppModule {}
