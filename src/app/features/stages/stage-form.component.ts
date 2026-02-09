import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StageStore } from './stage.store';

@Component({
  standalone: true,
  selector: 'app-stage-form',
  imports: [CommonModule, FormsModule],
  template: `
    <h3>Add Stage</h3>

    <form (ngSubmit)="save()">
      <input placeholder="Stage Name" [(ngModel)]="name" name="name" />
      <input type="number" placeholder="Sequence" [(ngModel)]="sequence" name="seq" />
      <input type="number" placeholder="Budget" [(ngModel)]="budget" name="budget" />

      <button type="submit">Save</button>
    </form>
  `,
})
export class StageFormComponent {

  projectId!: number;
  name = '';
  sequence = 1;
  budget = 0;

  constructor(
    private store: StageStore,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    
  }

  async save() {
    await this.store.add({
      projectId: this.projectId,
      name: this.name,
      sequence: this.sequence,
      budget: this.budget,
      isActive: true,
    });

    this.router.navigateByUrl(`/projects/${this.projectId}`);
  }
}
