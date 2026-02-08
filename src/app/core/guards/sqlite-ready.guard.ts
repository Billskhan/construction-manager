import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { SQLiteService } from '../services/sqlite.service';

@Injectable({ providedIn: 'root' })
export class SqliteReadyGuard implements CanActivate {

  constructor(private sqlite: SQLiteService) {}

  async canActivate(): Promise<boolean> {
    if (!this.sqlite.ready()) {
      //await this.sqlite.init();
    }
    return true;
  }
}
