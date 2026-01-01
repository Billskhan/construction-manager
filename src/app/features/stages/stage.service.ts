import { Injectable } from '@angular/core';
import { SQLiteService } from '../../core/services/sqlite.service';
import { Stage } from '../../shared/models/stage.model';

@Injectable({ providedIn: 'root' })
export class StageService {

  constructor(private sqlite: SQLiteService) {}

  async getByProject(projectId: number): Promise<Stage[]> {
    const res = await this.sqlite.database.query(
      `SELECT * FROM stages 
       WHERE projectId = ? 
       ORDER BY sequence`,
      [projectId]
    );
    return res.values || [];
  }

  async create(stage: Stage) {
    await this.sqlite.database.run(
      `INSERT INTO stages (projectId, name, sequence, budget, isActive)
       VALUES (?, ?, ?, ?, ?)`,
      [
        stage.projectId,
        stage.name,
        stage.sequence,
        stage.budget ?? null,
        stage.isActive ? 1 : 0,
      ]
    );
  }
}
