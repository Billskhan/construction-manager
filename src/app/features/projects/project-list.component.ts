import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectStore } from './project.store';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-project-list',
  imports: [CommonModule],
  template: `
    <h2>Projects</h2>

    <button (click)="add()">+ New Project</button>

    <div *ngIf="store.loading()">Loading...</div>

    <ul>
      <li *ngFor="let p of store.projects()"
          (click)="open(p.id)">
        <strong>{{ p.name }}</strong>
        <small>({{ p.status }})</small>
      </li>
    </ul>
  `,
})
export class ProjectListComponent implements OnInit {

  constructor(
    public store: ProjectStore,
    private router: Router
  ) {}

  ngOnInit() {
    this.store.loadProjects();
  }

  add() {
    this.router.navigateByUrl('/projects/add');
  }

  open(id?: number) {
    this.router.navigateByUrl(`/projects/${id}`);
  }
}
