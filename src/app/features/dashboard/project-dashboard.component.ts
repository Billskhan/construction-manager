import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectDashboardStore } from './project-dashboard.store';
import { TransactionStore } from '../transactions/transaction.store';
import { StageStore } from '../stages/stage.store';
import { AuthService } from '../../core/services/auth.service';
import { ProjectService } from '../projects/project.service';

@Component({
  standalone: true,
  selector: 'app-project-dashboard',
  imports: [CommonModule],
  template: `
    <h2>{{ projectName() ? projectName() + ' Dashboard' : 'Project Dashboard' }}</h2>

    <!-- KPI CARDS -->
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

      @for (s of dashboard.stageCostSummary(); track s.stage) {
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
  projectName = signal('');

  constructor(
    public dashboard: ProjectDashboardStore,
    private txStore: TransactionStore,
    private stageStore: StageStore,
    private route: ActivatedRoute,
    private router: Router,
    public auth: AuthService,
    private projectService: ProjectService
  ) {}

  async ngOnInit() {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.isManager = this.auth.isManager();
    this.stageStore.load(this.projectId);
    this.txStore.load(this.projectId);

    const project = await this.projectService.getById(this.projectId);
    this.projectName.set(project?.name ?? '');
  }

  addTx() {
    this.router.navigateByUrl(`/projects/${this.projectId}/transactions/add`);
  }

  viewReports() {
    this.router.navigateByUrl(`/projects/${this.projectId}/reports`);
  }
}
