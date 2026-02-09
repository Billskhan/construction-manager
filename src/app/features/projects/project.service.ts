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

// 1️⃣ Insert project AND get id correctly
const result = await this.sqlite.run(query, values);
const projectId = result.changes.lastId;

  // 3️⃣ Create stages from templates
  const templates = await this.sqlite.query(
    `SELECT * FROM stage_templates ORDER BY defaultSequence`
  );

  for (const t of templates.values ?? []) {
    await this.sqlite.run(`
      INSERT INTO stages (projectId, name, sequence, budget, isActive)
      VALUES (?, ?, ?, ?, 1)
    `, [
      projectId,
      t.name,
      t.defaultSequence,
      0
    ]);
  }

  console.log('✅ Project + stages created');
}
}
