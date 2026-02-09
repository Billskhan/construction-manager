import { Injectable } from '@angular/core';
import { SQLiteService } from '../../core/services/sqlite.service';
import { Vendor } from '../../shared/models/vendor.model';

@Injectable({ providedIn: 'root' })
export class VendorService {

  constructor(private sqlite: SQLiteService) {}

  async getAll(): Promise<Vendor[]> {
    await this.sqlite.init();

    // Seed test vendor if empty
    const countRes = await this.sqlite.database.query(
      `SELECT COUNT(*) as cnt FROM vendors`
    );

    if ((countRes.values?.[0]?.cnt ?? 0) === 0) {
      await this.sqlite.run(
        `INSERT INTO vendors
         (projectId, name, phone, vendorType, hasApp, createdAt)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          1,
          'Test Vendor',
          '03001234567',
          'Material',
          1,
          new Date().toISOString(),
        ]
      );
    }

    const res = await this.sqlite.database.query(
      `SELECT * FROM vendors ORDER BY name`
    );

    console.log('VENDORS FROM DB:', res.values);
    return (res.values ?? []) as Vendor[];
  }

async getByProject(projectId: number): Promise<Vendor[]> {
  await this.sqlite.init();

  const res = await this.sqlite.database.query(
    `SELECT * FROM vendors 
     WHERE projectId = ?
     ORDER BY name`,
    [projectId]
  );

  return (res.values ?? []) as Vendor[];
}

  async getById(id: number) {
    await this.sqlite.init();

    const res = await this.sqlite.database.query(
      `SELECT * FROM vendors WHERE id = ?`,
      [id]
    );

    return res.values?.[0];
  }

  async create(vendor: Vendor) {
    await this.sqlite.init();

    await this.sqlite.run(
      `INSERT INTO vendors
       (projectId, name, phone, vendorType, hasApp, createdAt)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        vendor.projectId,
        vendor.name,
        vendor.phone,
        vendor.vendorType,
        vendor.hasApp ? 1 : 0,
        new Date().toISOString(),
      ]
    );
  }
}
