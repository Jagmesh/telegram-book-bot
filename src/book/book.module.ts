import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { LogModule } from '../log/log.module';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  controllers: [BookController],
  providers: [BookService],
  imports: [LogModule, TelegramModule],
  exports: [BookService],
})
export class BookModule {}
