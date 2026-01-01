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

    <form (ngSubmit)="save()">
      <label>
        Project Name
        <input [(ngModel)]="name" name="name" required />
      </label>

      <label>
        Location
        <input [(ngModel)]="location" name="location" />
      </label>

      <label>
        Start Date
        <input type="date" [(ngModel)]="startDate" name="startDate" />
      </label>

      <button type="submit">Save</button>
    </form>
  `,
})
export class ProjectFormComponent {

  name = '';
  location = '';
  startDate = '';

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
    });

    this.router.navigateByUrl('/projects');
  }
}
