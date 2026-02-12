import { Injectable } from '@angular/core';
import { SQLiteService } from '../../core/services/sqlite.service';
import { Vendor } from '../../shared/models/vendor.model';
import { Project } from '../../shared/models/project.model';

@Injectable({ providedIn: 'root' })
export class VendorService {

  constructor(private sqlite: SQLiteService) {}

  /* =========================
     GLOBAL VENDOR METHODS
  ========================== */

  async getAll(): Promise<Vendor[]> {
    await this.sqlite.init();

    const res = await this.sqlite.query(
      `SELECT * FROM vendors ORDER BY name`
    );

    return (res.values ?? []) as Vendor[];
  }

  async getPublicVendors(): Promise<Vendor[]> {
    const res = await this.sqlite.query(
      `SELECT * FROM vendors WHERE isPublic = 1 ORDER BY name`
    );
    return (res.values ?? []) as Vendor[];
  }

  async getById(id: number): Promise<Vendor | null> {
    const res = await this.sqlite.query(
      `SELECT * FROM vendors WHERE id = ?`,
      [id]
    );
    return res.values?.[0] ?? null;
  }

async create(vendor: {
  name: string;
  phone: string;
  vendorType: string;
  isPublic?: number;
  createdBy?: number;
}): Promise<{ changes: { lastId: number } }> {

  return await this.sqlite.run(
    `INSERT INTO vendors
     (name, phone, vendorType, isPublic, createdBy, createdAt)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      vendor.name,
      vendor.phone,
      vendor.vendorType,
      vendor.isPublic ?? 0,
      vendor.createdBy ?? null,
      new Date().toISOString()
    ]
  );
}


  async update(vendor: {
    id: number;
    name: string;
    phone: string;
    vendorType: string;
    isPublic?: number;
  }) {

    await this.sqlite.run(
      `UPDATE vendors
       SET name = ?, phone = ?, vendorType = ?, isPublic = ?
       WHERE id = ?`,
      [
        vendor.name,
        vendor.phone,
        vendor.vendorType,
        vendor.isPublic ?? 0,
        vendor.id
      ]
    );
  }

  async delete(id: number) {
    await this.sqlite.run(
      `DELETE FROM vendors WHERE id = ?`,
      [id]
    );
  }

  /* =========================
     PROJECT ASSIGNMENT
  ========================== */

async getByProject(projectId: number): Promise<Vendor[]> {
  const res = await this.sqlite.query(`
    SELECT v.*
    FROM vendors v
    JOIN project_vendors pv
      ON pv.vendorId = v.id
    WHERE pv.projectId = ?
      AND pv.isActive = 1
    ORDER BY v.name
  `, [projectId]);

  return (res.values ?? []) as Vendor[];
}


async attachToProject(projectId: number, vendorId: number) {
  await this.sqlite.run(`
    INSERT INTO project_vendors
    (projectId, vendorId, isActive)
    VALUES (?, ?, 1)
    ON CONFLICT(projectId, vendorId)
    DO UPDATE SET isActive = 1
  `, [projectId, vendorId]);
}


async detachFromProject(projectId: number, vendorId: number) {
  await this.sqlite.run(`
    UPDATE project_vendors
    SET isActive = 0
    WHERE projectId = ? AND vendorId = ?
  `, [projectId, vendorId]);
}
async getByManager(managerId: number): Promise<Vendor[]> {

  const res = await this.sqlite.query(`
    SELECT DISTINCT v.*
    FROM vendors v
    JOIN project_vendors pv ON pv.vendorId = v.id
    JOIN projects p ON p.id = pv.projectId
    WHERE p.createdBy = ?
      AND pv.isActive = 1
    ORDER BY v.name
  `, [managerId]);

  return (res.values ?? []) as Vendor[];
}
async getGlobalForManager(managerId: number): Promise<Vendor[]> {

  const res = await this.sqlite.query(`
    SELECT *
    FROM vendors
    WHERE id NOT IN (
      SELECT pv.vendorId
      FROM project_vendors pv
      JOIN projects p ON p.id = pv.projectId
      WHERE p.createdBy = ?
        AND pv.isActive = 1
    )
    ORDER BY name
  `, [managerId]);

  return (res.values ?? []) as Vendor[];
}
    async getProjectsByVendor(vendorId: number): Promise<Project[]> {

      const res = await this.sqlite.query(`
        SELECT p.*
        FROM projects p
        JOIN project_vendors pv
          ON pv.projectId = p.id
        WHERE pv.vendorId = ?
          AND pv.isActive = 1
      `, [vendorId]);

      return (res.values ?? []) as Project[];
    }
}
