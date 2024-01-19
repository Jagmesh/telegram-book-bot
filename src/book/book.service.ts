import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { getRandomIntInclusive } from '../helpers';
import { getDesiredPhrase } from '../helpers';
import { LogService } from '../log/log.service';

@Injectable()
export class BookService {
  constructor(private readonly logService: LogService) {
    this.logService.setScope('BOOK');
  }

  async getBookPrediction(page: number, row: number) {
    const bookArray = JSON.parse(fs.readFileSync('./books/parsed_book.txt', 'utf-8'));
    const bookName = 'Маленький принц';

    if (!bookArray) {
      this.logService.error('Не получилось открыть книгу');
      return;
    }

    const numberOfPages = bookArray.length;
    this.logService.write(`Количество cтраниц в книге: ${numberOfPages}`);
    const pageSize = bookArray[0].length;
    this.logService.write(`Количество строк на странице: ${pageSize}`);

    if (page < 1 || page > numberOfPages || row < 1 || row > pageSize) {
      this.logService.error(`Значение страницы и/или строки некорректно`);
      return (
        `Значение страницы и/или строки некорректно.\n\n` +
        `В книге *${bookName}* кол-во страниц: *${numberOfPages}*, кол-во строк на страницу: *${pageSize}*`
      );
    }

    return `${bookArray[page - 1][row - 1]} \n\n(Страница: ${page}, строка: ${row}. Из книги: ${bookName})`;
  }

  async createBook() {
    const bookArray = this.createBookFromFile('./books/book.txt', 20);

    if (!bookArray) {
      throw new HttpException('Не получилось создать файл', HttpStatus.BAD_REQUEST);
    }

    fs.writeFile('./books/parsed_book.txt', `${JSON.stringify(bookArray)}`, (error) => {});

    return 'Файл успешно создан';
  }

  private createBookFromFile(filePath: string, pageSize: number) {
    let fileContent: string;
    try {
      fileContent = fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
      this.logService.write(`Ошибка при чтении файла ${filePath}: ${error}`);
    }

    if (!fileContent) {
      this.logService.write(`Файл ${filePath} пуст`);
      return false;
    }

    const wordsArray = fileContent.split(' ');
    const resultingBook: string[][] = [];
    let bookPage: string[] = [];
    let phrasesOnPageCounter = 0;

    for (let i = 0; i < wordsArray.length; ) {
      if (phrasesOnPageCounter >= pageSize) {
        resultingBook.push(bookPage);
        bookPage = [];
        phrasesOnPageCounter = 0;
      }

      const chunkSize = getRandomIntInclusive(1, 13);
      bookPage.push(wordsArray.slice(i, i + chunkSize).join(' '));
      i += chunkSize;
      phrasesOnPageCounter++;
    }

    return resultingBook;
  }
}
