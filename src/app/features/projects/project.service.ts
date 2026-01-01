import { Injectable } from '@angular/core';
import { SQLiteService } from '../../core/services/sqlite.service';
import { Project } from '../../shared/models/project.model';

@Injectable({ providedIn: 'root' })
export class ProjectService {

  constructor(private sqlite: SQLiteService) {}

  async getAll(): Promise<Project[]> {
    const res = await this.sqlite.database.query(
      `SELECT * FROM projects ORDER BY createdAt DESC`
    );
    return res.values as Project[] || [];
  }

  async create(project: Project) {
    const query = `
      INSERT INTO projects (name, location, status, startDate, createdBy, createdAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
      project.name,
      project.location ?? '',
      project.status,
      project.startDate ?? null,
      project.createdBy ?? null,
      new Date().toISOString(),
    ];

    await this.sqlite.database.run(query, values);
  }
}
