import { Injectable } from '@nestjs/common';
import { Telegram } from 'telegraf';
import { LogService } from '../log/log.service';

@Injectable()
export class TelegramService {
  telegram: Telegram;
  chatID: string;
  adminID: string;

  constructor(private readonly logService: LogService) {
    this.logService.setScope('TELEGRAM');
  }

  createTelegram(apiToken: string, chatID: string, adminID: string) {
    this.telegram = new Telegram(apiToken);
    this.chatID = chatID;
    this.adminID = adminID;
  }

  async sendMessage(text: string) {
    try {
      await this.telegram.sendMessage(this.chatID, text, {
        parse_mode: 'HTML',
      });
    } catch (error) {
      this.logService.write(`Ошибка: ${error}`);
    }
  }

  async sendSticker(file_id: string) {
    try {
      await this.telegram.sendSticker(this.chatID, file_id);
    } catch (error) {
      this.logService.write(`Ошибка: ${error}`);
    }
  }

  async sendAlert(text: string) {
    try {
      await this.telegram.sendMessage(this.adminID, text, {
        parse_mode: 'HTML',
      });
    } catch (error) {
      this.logService.write(`Ошибка: ${error}`);
    }
  }

  async sendDocument(url: string, caption: string, resend: boolean) {
    try {
      await this.telegram.sendDocument(this.chatID, url, {
        caption,
      });
    } catch (error) {
      this.logService.write(`Ошибка: ${error}`);
      await this.sendAlert(`Ошибка: ${error}`);
      if (resend) {
        this.logService.write('Отправляем запрос повторно');
        await new Promise<void>((resolve) => {
          setTimeout(async () => {
            await this.sendDocument(url, caption, false);
            resolve();
          }, 5000);
        });
      }
    }
  }
}
