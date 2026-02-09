import { Injectable, signal } from '@angular/core';
import initSqlJs from 'sql.js';

@Injectable({ providedIn: 'root' })
export class SQLiteService {

  private db: any;
  private _database: any;

  readonly ready = signal(false);

  async init(): Promise<void> {
    if (this.db) return;

    console.log('⏳ Initializing SQL.js...');

    const SQL = await initSqlJs({
      locateFile: (file: string) => `assets/${file}`,
    });

//    this.db = new SQL.Database();
const saved = localStorage.getItem('construction-db');

if (saved) {
  const bytes = Uint8Array.from(atob(saved), c => c.charCodeAt(0));
  this.db = new SQL.Database(bytes);
} else {
  this.db = new SQL.Database();
}

    // ✅ Build compatibility layer ONCE
    this._database = {
      run: (sql: string, params: any[] = []) => {
        const stmt = this.db.prepare(sql, params);
        stmt.step();
        stmt.free();

          this.persist(); 

        const idStmt = this.db.prepare(
          'SELECT last_insert_rowid() as id'
        );
        idStmt.step();
        const lastId = idStmt.getAsObject().id as number;
        idStmt.free();

        return { changes: { lastId } };
      },

      query: (sql: string, params: any[] = []) => {
        const stmt = this.db.prepare(sql, params);
        const rows: any[] = [];

        while (stmt.step()) {
          rows.push(stmt.getAsObject());
        }

        stmt.free();
        return { values: rows };
      },

      execute: (sql: string) => {
        this.db.exec(sql);
      }
    };

    await this.createTables();

    this.ready.set(true);
    console.log('✅ SQL.js initialized');
    // DEBUG ONLY
(window as any).sqlite = this;
  }

  private persist() {
  const data = this.db.export();
  const base64 = btoa(String.fromCharCode(...data));
  localStorage.setItem('construction-db', base64);
}


  // ✅ THIS now behaves exactly like Capacitor
  get database() {
    return this._database;
  }
// 🔥 BACKWARD COMPATIBILITY FOR YOUR WHOLE APP

async query(sql: string, params: any[] = []) {
  return this.database.query(sql, params);
}

async run(sql: string, params: any[] = []) {
  return this.database.run(sql, params);
}

  private async createTables() {
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
        
      `CREATE TABLE IF NOT EXISTS stage_templates (
        id INTEGER PRIMARY KEY,
        name TEXT,
        defaultSequence INTEGER
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
      this.db.exec(q);
    }
    // ✅ Seed stage templates only once (App Configuration)
const checkStmt = this.db.prepare(
  `SELECT COUNT(*) as count FROM stage_templates`
);

checkStmt.step();
const count = checkStmt.getAsObject().count as number;
checkStmt.free();

if (count === 0) {
  console.log('🌱 Seeding stage templates...');

  this.db.exec(`
    INSERT INTO stage_templates (name, defaultSequence) VALUES
    ('Excavation', 1),
    ('PCC', 2),
    ('RCC', 3),
    ('Brick Work', 4),
    ('Plaster', 5),
    ('Electrical', 6),
    ('Plumbing', 7),
    ('Paint', 8);
  `);

  this.persist(); // important: save to localStorage
}

  }
}