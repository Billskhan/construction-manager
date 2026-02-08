import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { ProjectStore } from "../projects/project.store";

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Manager Dashboard</h2>

    <h3>Projects</h3>

    <div *ngIf="store.loading()">Loading projects...</div>

    <ul>
      <li *ngFor="let p of store.projects()"
          (click)="open(p.id)"
          style="cursor:pointer; padding:8px; border-bottom:1px solid #ccc;">
        <strong>{{ p.name }}</strong>
        <small> — {{ p.location }}</small>
      </li>
    </ul>

    <hr />

    <p>Total Spent: {{ totalSpent() }}</p>
    <p>Total Credit: {{ totalCredit() }}</p>
  `,
})
export class ManagerDashboardComponent implements OnInit {

  constructor(
    public store: ProjectStore,
    private router: Router
  ) {}

  ngOnInit() {
    this.store.loadProjects();   // ⭐ very important
  }

  open(id?: number) {
      if (!id) return;
  this.router.navigate(['/projects', id]);
  }

  totalSpent = () => 0;
  totalCredit = () => 0;
}

