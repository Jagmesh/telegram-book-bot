import { Controller, Get } from '@nestjs/common';
import { BookService } from './book.service';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  getBookPrediction() {
    return this.bookService.getBookPrediction(10, 10);
  }

  @Get('create')
  createBook() {
    return this.bookService.createBook();
  }
}
