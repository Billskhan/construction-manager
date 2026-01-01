import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StageStore } from './stage.store';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-stage-list',
  imports: [CommonModule],
  template: `
    <h3>Project Stages</h3>

    <ul>
      <li *ngFor="let s of store.stages()">
        {{ s.sequence }}. {{ s.name }}
        <span *ngIf="s.budget"> — Budget: {{ s.budget }}</span>
      </li>
    </ul>
  `,
})
export class StageListComponent implements OnInit {

  projectId!: number;

  constructor(
    public store: StageStore,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.store.load(this.projectId);
  }
}
