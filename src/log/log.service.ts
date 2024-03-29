import { Injectable } from '@nestjs/common';

@Injectable()
export class LogService {
  scope: string;
  setScope(scope: string) {
    this.scope = scope;
  }

  write(message: string) {
    console.log(`[${this.getLocalDate()}]: \x1b[32m[LOG]\x1b[0m\x1b[35m[${this.scope}]\x1b[0m ${message}`);
  }

  error(message: string) {
    console.log(`[${this.getLocalDate()}]: \x1b[31m[ERROR]\x1b[0m\x1b[35m[${this.scope}]\x1b[0m ${message}`);
  }

  getLocalDate() {
    const date = new Date();
    date.setHours(date.getHours() + 3);
    return date.toJSON().slice(0, -5).replace(/T/, ' ');
  }
}
