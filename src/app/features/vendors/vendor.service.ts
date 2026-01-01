import { Injectable } from '@angular/core';
import { SQLiteService } from '../../core/services/sqlite.service';
import { Vendor } from '../../shared/models/vendor.model';

@Injectable({ providedIn: 'root' })
export class VendorService {

  constructor(private sqlite: SQLiteService) {}

  async getByProject(projectId: number): Promise<Vendor[]> {
    const res = await this.sqlite.database.query(
      `SELECT * FROM vendors WHERE projectId = ? ORDER BY name`,
      [projectId]
    );
    return res.values as Vendor[] || [];
  }

  async getById(id: number) {
    const res = await this.sqlite.database.query(
      `SELECT * FROM vendors WHERE id = ?`,
      [id]
    );
    return res.values?.[0];
  }

  async create(vendor: Vendor) {
    const query = `
      INSERT INTO vendors (projectId, name, phone, vendorType, hasApp, createdAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
      vendor.projectId,
      vendor.name,
      vendor.phone,
      vendor.vendorType,
      vendor.hasApp ? 1 : 0,
      new Date().toISOString(),
    ];
    await this.sqlite.database.run(query, values);
  }
}
