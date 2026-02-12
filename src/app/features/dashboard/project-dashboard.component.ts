import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectDashboardStore } from './project-dashboard.store';
import { TransactionStore } from '../transactions/transaction.store';
import { StageStore } from '../stages/stage.store';
import { AuthService } from '../../core/services/auth.service';
import { ProjectService } from '../projects/project.service';
import { ProjectStore } from '../projects/project.store';
import { Project } from '../../shared/models/project.model';

@Component({
  standalone: true,
  selector: 'app-project-dashboard',
  imports: [CommonModule],
  template: `
    <h2>{{ projectName() ? projectName() + ' Dashboard' : 'Project Dashboard' }}</h2>

      <h3>Project Details</h3>

      <div class="project-details" *ngIf="project() as p">
        <div><strong>Location:</strong> {{ p.location || '—' }}</div>
        <div><strong>StartDate:</strong> {{ p.startDate || '—' }}</div>
        <div><strong>Project Manager:</strong> {{ p.projectManager || '—' }}</div>

        <div><strong>Plot Size:</strong> {{ p.plotSize || '—' }}</div>
        <div><strong>Description:</strong> {{ p.description || '—' }}</div>
      </div>

    <!-- KPI CARDS -->
     <h3>KPI Cards</h3>
    <div class="kpis">
      <div>Total Spent: {{ dashboard.totalSpent() }}</div>
      <div>Outstanding Credit: {{ dashboard.totalCredit() }}</div>
      
    </div>

    <!-- STAGE SUMMARY -->
    <h3>Stage-wise Summary</h3>
    <table>
      <tr>
        <th>Stage</th>
        <th>Budget</th>
        <th>Actual</th>
        <th>Variance</th>
      </tr>

      @for (s of dashboard.stageCostSummary(); track s.stageId) {
        <tr>
          <td>{{ s.stage }}</td>
          <td>{{ s.budget }}</td>
          <td>{{ s.actual }}</td>
          <td [style.color]="s.variance < 0 ? 'red' : 'green'">
            {{ s.variance }}
          </td>
        </tr>
      }
    </table>





    <!-- RECENT TRANSACTIONS -->
    <h3>Recent Transactions</h3>
    <ul>
      @for (t of dashboard.recentTransactions(); track t.id) {
        <li>
          {{ t.date }} — {{ t.totalAmount }}
        </li>
      }
    </ul>

    <!-- QUICK ACTIONS (PART E) -->
    @if (auth.isManager()) {
      <div>
        <button (click)="addTx()">+ Add Transaction</button>
        <button (click)="viewReports()">📊 Reports</button>
      </div>
    }
  `,
})
export class ProjectDashboardComponent implements OnInit {
  projectId!: number;
  isManager = false;
  //projectName = signal('');
  project = signal<Project | null>(null);
  projectName = computed(() => this.project()?.name ?? '');

  constructor(
    public dashboard: ProjectDashboardStore,
    private txStore: TransactionStore,
    private stageStore: StageStore,
    private route: ActivatedRoute,
    private router: Router,
    public auth: AuthService,
    public projectstore: ProjectStore,
    private projectService: ProjectService,
  ) {}

async ngOnInit() {

  const id = this.route.snapshot.paramMap.get('id');

  if (!id) {
    console.error('Project ID missing from route');
    return;
  }

  this.projectId = Number(id);

  if (isNaN(this.projectId)) {
    console.error('Invalid Project ID');
    return;
  }

  this.isManager = this.auth.isManager();

  await this.stageStore.load(this.projectId);
  await this.txStore.load(this.projectId);

  const p = await this.projectService.getById(this.projectId);
  this.project.set(p);
}


  addTx() {
    this.router.navigateByUrl(`/projects/${this.projectId}/transactions/add`);
  }

  viewReports() {
    this.router.navigateByUrl(`/projects/${this.projectId}/reports`);
  }
}
