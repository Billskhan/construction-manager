import { Injectable, signal } from '@angular/core';
import { Stage } from '../../shared/models/stage.model';
import { StageService } from './stage.service';

@Injectable({ providedIn: 'root' })
export class StageStore {

  stages = signal<Stage[]>([]);
  loading = signal(false);

  constructor(private service: StageService) {}

  async load(projectId: number) {
    this.loading.set(true);
    const data = await this.service.getByProject(projectId);
    this.stages.set(data);
    this.loading.set(false);
  }

  async add(stage: Stage) {
    await this.service.create(stage);
    await this.load(stage.projectId);
  }
}
