import { Injectable } from '@angular/core';
import { SQLiteService } from '../../core/services/sqlite.service';
import { Project } from '../../shared/models/project.model';

@Injectable({ providedIn: 'root' })
export class ProjectService {

  constructor(private sqlite: SQLiteService) {}

async getAll(): Promise<Project[]> {
  const res = await this.sqlite.query(
    `SELECT * FROM projects ORDER BY createdAt DESC`
  );

  return res.values ?? [];
}

  async getById(projectId: number): Promise<Project | null> {
    const res = await this.sqlite.query(
      `SELECT * FROM projects WHERE id = ? LIMIT 1`,
      [projectId]
    );

    const project = res.values?.[0] as Project | undefined;
    return project ?? null;
  }


  // async getAll(): Promise<Project[]> {
  //   const res = await this.sqlite.query(
  //     `SELECT * FROM projects ORDER BY createdAt DESC`
  //   );
  //   return res.values as Project[] || [];
  // }

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
    //await this.sqlite.beginTransaction();
    await this.sqlite.run(query, values);
    //await this.sqlite.commitTransaction();
    const test = await this.sqlite.query('SELECT * FROM projects');
console.log('AFTER INSERT', test);
  }
}
