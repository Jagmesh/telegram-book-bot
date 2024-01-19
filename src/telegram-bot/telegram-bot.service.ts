import { Injectable } from '@nestjs/common';
import * as process from 'process';
import { BookService } from '../book/book.service';
const TelegramBot = require('node-telegram-bot-api');
@Injectable()
export class TelegramBotService {
  constructor(private readonly book: BookService) {}
  startBot() {
    const bot = new TelegramBot(process.env.TELEGRAM_BOT_API_TOKEN, {
      polling: true,
    });

    bot.onText(/\/help_book/, async ({ chat }) => {
      const chatID = chat.id;
      await bot.sendMessage(
        chatID,
        `Привет! Введи сообщение вида *"${process.env.TELEGRAM_BOT_NAME} 10 10"*, ` +
          `где первое число — номер страницы, а второе — номер строки, и получишь предсказание!\n\n` +
          `_Пока что я не волшебник и только учусь, поэтому сейчас я могу гадать только по книге "Маленький принц" (В которой 82 страницы по 20 строк.)_`,
        { parse_mode: 'Markdown' },
      );
    });

    bot.on('message', async ({ chat, text }) => {
      const chatID = chat.id;
      const messageText: string = text;
      if (!messageText) return;

      if (messageText.includes(process.env.TELEGRAM_BOT_NAME)) {
        const parsedMessage = messageText.match(/\d+/g);
        if (!parsedMessage || parsedMessage.length < 2) {
          await bot.sendMessage(chatID, `Укажи номер страницы и номер строки. Например "${process.env.TELEGRAM_BOT_NAME} 20 17"`);
          return;
        }

        const [page, row] = parsedMessage.map((value) => Number(value));

        const predictionPhrase = await this.book.getBookPrediction(page, row);
        await bot.sendMessage(chatID, `${predictionPhrase}`, {
          parse_mode: 'Markdown',
        });
      }
    });
  }
}
