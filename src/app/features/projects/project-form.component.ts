import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectStore } from './project.store';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-project-form',
  imports: [CommonModule, FormsModule],
template: `
  <h2>New Project</h2>

  <form class="form-grid" (ngSubmit)="save()">

    <!-- BASIC INFO -->
    <div class="section-title">Basic Information</div>

    <div class="field">
      <label>Project Name</label>
      <input [(ngModel)]="name" name="name" required />
    </div>

    <div class="field">
      <label>Location</label>
      <input [(ngModel)]="location" name="location" />
    </div>

    <div class="field">
      <label>Start Date</label>
      <input type="date" [(ngModel)]="startDate" name="startDate" />
    </div>

    <div class="field">
      <label>Project Manager</label>
      <input [(ngModel)]="projectManager" name="projectManager" />
    </div>

    <div class="field full">
      <label>Description</label>
      <input [(ngModel)]="description" name="description" />
    </div>

    <div class="field">
      <label>Plot Size</label>
      <input [(ngModel)]="plotSize" name="plotSize" />
    </div>

    <!-- FINANCIALS -->
    <div class="section-title">Financials</div>

    <div class="field">
      <label>Cash Amount</label>
      <input type="number" [(ngModel)]="cashAmount" name="cashAmount" />
    </div>

    <div class="field">
      <label>Financed Amount</label>
      <input type="number" [(ngModel)]="financedAmount" name="financedAmount" />
    </div>

    <div class="actions full">
      <button type="submit">Save Project</button>
    </div>

  </form>
`,
styles: [`
  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px 24px;
    max-width: 900px;
  }

  .section-title {
    grid-column: 1 / -1;
    font-weight: 600;
    margin-top: 20px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 4px;
  }

  .field {
    display: flex;
    flex-direction: column;
  }

  .field.full {
    grid-column: 1 / -1;
  }

  label {
    font-size: 13px;
    margin-bottom: 4px;
    color: #444;
  }

  input {
    padding: 6px 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .actions {
    margin-top: 20px;
  }

  button {
    padding: 8px 16px;
    border: none;
    background: #1976d2;
    color: white;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background: #125aa0;
  }
`]

,
})
export class ProjectFormComponent {

  name = '';
  location = '';
  startDate = '';
  description= '';
  projectManager = '' ;
  plotSize ='';
  cashAmount= 0;
  financedAmount = 0;

  constructor(
    private store: ProjectStore,
    private auth: AuthService,
    private router: Router
  ) {}

  async save() {
    await this.store.addProject({
      name: this.name,
      location: this.location,
      status: 'Active',
      startDate: this.startDate,
      createdBy: this.auth.user()?.id,
      projectManager: this.projectManager ,
      plotSize: this.plotSize,
      cashAmount: this.cashAmount,
      financedAmount: this.financedAmount,
    });

    this.router.navigateByUrl('/projects');
  }
}
