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
    <div class="dashboard-wrapper">

  <h2>
    {{ projectName() ? projectName() + ' Dashboard' : 'Project Dashboard' }}
  </h2>

  <!-- PROJECT DETAILS -->
  <div class="project-card" *ngIf="project() as p">
    <div><strong>Location:</strong> {{ p.location || '—' }}</div>
    <div><strong>Start Date:</strong> {{ p.startDate || '—' }}</div>
    <div><strong>Manager:</strong> {{ p.projectManager || '—' }}</div>
    <div><strong>Plot Size:</strong> {{ p.plotSize || '—' }}</div>
  </div>

  <!-- KPI SECTION -->
  <div class="kpi-grid">
    <div class="kpi-card">
      <span>Total Budget</span>
      <h3>{{ dashboard.totalBudget() }}</h3>
    </div>

    <div class="kpi-card">
      <span>Total Spent</span>
      <h3>{{ dashboard.totalSpent() }}</h3>
    </div>

    <div class="kpi-card">
      <span>Outstanding Credit</span>
      <h3>{{ dashboard.totalCredit() }}</h3>
    </div>

    <div class="kpi-card">
      <span>Budget Utilization</span>
      <h3>{{ dashboard.budgetUtilization() }}%</h3>
    </div>
  </div>

  <!-- STAGE SUMMARY -->
  <h3>Stage Summary</h3>
  <table class="stage-table">
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
        <td [class.negative]="s.variance < 0">
          {{ s.variance }}
        </td>
      </tr>
    }
  </table>

  <!-- TOP VENDORS -->
  <h3>Top Vendors (By Spend)</h3>
  <ul class="vendor-summary">
    @for (v of dashboard.topVendors(); track v.vendorId) {
      <li>
        Vendor ID: {{ v.vendorId }}
        <span>PKR {{ v.total }}</span>
      </li>
    }
  </ul>

  <!-- RECENT TX -->
  <h3>Recent Transactions</h3>
  <ul>
    @for (t of dashboard.recentTransactions(); track t.id) {
      <li>{{ t.date }} — {{ t.totalAmount }}</li>
    }
  </ul>

  <!-- ACTIONS -->
  @if (auth.isManager()) {
    <div class="actions">
      <button (click)="addTx()">+ Add Transaction</button>
      <button (click)="viewReports()">📊 Reports</button>
    </div>
  }

</div>
  `,styles: [`
.dashboard-wrapper {
  max-width: 1100px;
  margin: 30px auto;
}

.project-card {
  padding: 15px;
  background: #f7f9fc;
  border-radius: 8px;
  margin-bottom: 25px;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 30px;
}

.kpi-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.kpi-card span {
  font-size: 13px;
  color: #666;
}

.kpi-card h3 {
  margin-top: 10px;
}

.stage-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 25px;
}

.stage-table th, .stage-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.stage-table th {
  background: #f1f1f1;
}

.negative {
  color: #c62828;
}

.vendor-summary {
  list-style: none;
  padding: 0;
  margin-bottom: 25px;
}

.vendor-summary li {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
}

.actions {
  margin-top: 20px;
}
`]

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
