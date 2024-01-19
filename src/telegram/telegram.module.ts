import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { LogModule } from '../log/log.module';

@Module({
  providers: [TelegramService],
  exports: [TelegramService],
  imports: [LogModule],
})
export class TelegramModule {}
