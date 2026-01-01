import { Injectable, signal } from '@angular/core';
import { ReportService } from './report.service';

@Injectable({ providedIn: 'root' })
export class ReportStore {

  financial = signal<any>(null);
  materials = signal<any[]>([]);
  stages = signal<any[]>([]);
  loading = signal(false);

  constructor(private service: ReportService) {}

  async loadAll(projectId: number) {
    this.loading.set(true);

    this.financial.set(await this.service.financialSummary(projectId));
    this.materials.set(await this.service.materialSummary(projectId));
    this.stages.set(await this.service.stageSummary(projectId));

    this.loading.set(false);
  }
}
