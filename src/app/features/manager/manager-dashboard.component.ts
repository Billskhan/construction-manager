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

        <div class="actions">
          <button (click)="goToProjects()">📁 View Projects</button>

          <button (click)="addProject()">➕ New Project</button>

          <button (click)="goToVendors()">🏪 Vendor Dashboard</button>
        </div>

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

goToVendors() {
  this.router.navigateByUrl('/vendor/dashboard');
}


  constructor(
    public store: ProjectStore,
    private router: Router
  ) {}

  ngOnInit() {
    this.store.loadProjects();   // ⭐ very important
  }
  goToProjects() {
    this.router.navigateByUrl('/projects');
  }

  // ✅ This is the important part
  addProject() {
    this.router.navigateByUrl('/projects/add');
  }
  open(id?: number) {
      if (!id) return;
  this.router.navigate(['/projects', id]);
  }

  totalSpent = () => 0;
  totalCredit = () => 0;
}

