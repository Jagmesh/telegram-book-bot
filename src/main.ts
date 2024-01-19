import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TelegramBotService } from './telegram-bot/telegram-bot.service';
import * as process from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const telegramBot = app.get(TelegramBotService);
  telegramBot.startBot();

  await app.listen(process.env.APP_PORT, () => {
    console.log(`\x1b[32m[LOG]\x1b[0m Сервер запустился на порту: ${process.env.APP_PORT}`);
  });
}

bootstrap();
