import { Component, OnInit } from "@angular/core";
import { ReportStore } from "./report.store";
import { ActivatedRoute } from "@angular/router";
import { JsonPipe } from '@angular/common';
import { CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-reports',
   imports: [JsonPipe],
  template: `
    <h2>Reports</h2>

    @if (store.loading()) {
  <div>Loading...</div>
}

    <h3>Financial Summary</h3>
    <pre>{{ store.financial() | json }}</pre>

    <h3>Material Consumption</h3>
    <table>
  <tr>
    <th>Item</th>
    <th>Qty</th>
    <th>Unit</th>
    <th>Cost</th>
  </tr>

  @for (m of store.materials(); track m.itemName) {
    <tr>
      <td>{{ m.itemName }}</td>
      <td>{{ m.totalQuantity }}</td>
      <td>{{ m.unit }}</td>
      <td>{{ m.totalCost }}</td>
    </tr>
  }
</table>

<h3>Stage-wise Cost</h3>

<table>
  <tr>
    <th>Stage</th>
    <th>Budget</th>
    <th>Actual</th>
    <th>Variance</th>
  </tr>

  @for (s of store.stages(); track s.stage) {
    <tr>
      <td>{{ s.stage }}</td>
      <td>{{ s.budget }}</td>
      <td>{{ s.actual }}</td>
      <td>{{ (s.budget ?? 0) - (s.actual ?? 0) }}</td>
    </tr>
  }
</table>
  `,
})
export class ReportsComponent implements OnInit {
  projectId!: number;

  constructor(
    public store: ReportStore,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.store.loadAll(this.projectId);
  }
}
