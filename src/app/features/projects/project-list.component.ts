import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectStore } from './project.store';
import { Router } from '@angular/router';
import { Project } from '../../shared/models/project.model';

@Component({
  standalone: true,
  selector: 'app-project-list',
  imports: [CommonModule],
  template: `
    <h2>Projects</h2>

    <button (click)="add()">+ New Project</button>

    <div *ngIf="projectstore.loading()">Loading...</div>

    <ul>
      <li *ngFor="let p of projectstore.projects()"
          (click)="openProject(p)">
        <strong>{{ p.name }}</strong>
        <small>({{ p.status }})</small>
       
      </li>
    </ul>
  `,
})
export class ProjectListComponent implements OnInit {

  constructor(
    public projectstore: ProjectStore,
    private router: Router
  ) {}

  ngOnInit() {
    this.projectstore.loadProjects();
  }

  add() {
    this.router.navigateByUrl('/projects/add');
  }
// openProject(project: Project) {
//   this.projectstore.setActiveProject(project.id!);   // ← POINT #3
//   this.router.navigate(['/dashboard']);            // or tx-form or stages
// }
openProject(project: Project) {
  this.router.navigate(['/projects', project.id]);
}
  open(id?: number) {
    this.router.navigateByUrl(`/projects/${id}`);
  }
}
