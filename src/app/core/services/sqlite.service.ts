import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteDBConnection } from '@capacitor-community/sqlite';

@Injectable({ providedIn: 'root' })
export class SQLiteService {

  private db!: SQLiteDBConnection;

  async init(): Promise<void>  {
    const sqlite = CapacitorSQLite;
    const conn = await sqlite.createConnection({
      database: 'construction.db',
      version: 1,
      encrypted: false,
      mode: 'no-encryption',
    });

    //this.db = conn;
    await this.db.open();
    await this.createTables();
  }

  get database() {
    return this.db;
  }

  async createTables() {

  const queries = [

`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  phone TEXT,
  role TEXT,
  isActive INTEGER,
  createdAt TEXT
);`,

`CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  location TEXT,
  status TEXT,
  startDate TEXT,
  endDate TEXT,
  createdBy INTEGER,
  createdAt TEXT
);`,

`CREATE TABLE IF NOT EXISTS stages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  projectId INTEGER,
  name TEXT,
  sequence INTEGER,
  budget REAL,
  isActive INTEGER
);`,

`CREATE TABLE IF NOT EXISTS vendors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  projectId INTEGER,
  name TEXT,
  phone TEXT,
  vendorType TEXT,
  hasApp INTEGER,
  createdAt TEXT
);`,

`CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  projectId INTEGER,
  stageId INTEGER,
  vendorId INTEGER,
  date TEXT,
  entryType TEXT,
  paymentMode TEXT,
  totalAmount REAL,
  creditAmount REAL,
  comments TEXT,
  createdBy INTEGER,
  createdAt TEXT
);`,

`CREATE TABLE IF NOT EXISTS transaction_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  transactionId INTEGER,
  category TEXT,
  subCategory TEXT,
  itemName TEXT,
  quantity REAL,
  unit TEXT,
  length REAL,
  rate REAL,
  carriage REAL,
  amount REAL
);`,

`CREATE TABLE IF NOT EXISTS acknowledgements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  transactionId INTEGER,
  status TEXT,
  method TEXT,
  acknowledgedAt TEXT,
  remarks TEXT
);`,
`CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER,
  transactionId INTEGER,
  title TEXT,
  message TEXT,
  isRead INTEGER,
  createdAt TEXT
);`
  ];

  for (const q of queries) {
    await this.db.execute(q);
  }
}

  }

