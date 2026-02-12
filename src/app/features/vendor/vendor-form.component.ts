import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorStore } from './vendor.store';
import { VendorService } from './vendor.service';
import { AuthService } from '../../core/services/auth.service';
import { VendorType } from '../../shared/models/vendor.model';
import { ProjectService } from '../projects/project.service';

@Component({
  standalone: true,
  selector: 'app-vendor-form',
  imports: [CommonModule, FormsModule],
  template: `
    <h2>{{ vendorId ? 'Edit Vendor' : 'Add Vendor' }}</h2>

    <form (ngSubmit)="save()">

      <label>
        Name
        <input [(ngModel)]="name" name="name" required />
      </label>

      <label>
        Phone
        <input [(ngModel)]="phone" name="phone" required />
      </label>

      <label>
        Type
        <select [(ngModel)]="vendorType" name="vendorType">
          <option value="Material">Material</option>
          <option value="Contractor">Contractor</option>
          <option value="Service">Service</option>
        </select>
      </label>

      <!-- Manager only -->
<div *ngIf="isManager">
  <label>Select Projects</label>
<label>
    <input type="checkbox"
           [(ngModel)]="isPublic"
           name="isPublic" />
    Public Vendor Profile
  </label>
  <div *ngFor="let p of projects">
    <input type="checkbox"
           [checked]="selectedProjects.includes(p.id)"
           (change)="toggleProject(p.id, $event)" />
    {{ p.name }}
  </div>
</div>

      <button type="submit">Save</button>

    </form>
  `,
})
export class VendorFormComponent {

  projects: any[] = [];
selectedProjects: number[] = [];

  vendorId?: number;

  name = '';
  phone = '';
  vendorType: VendorType = 'Material';
  isPublic = false;

  isManager = false;

  constructor(
    private projectService: ProjectService,
    private vendorService: VendorService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

async ngOnInit() {

  const user = this.auth.user();
  if (!user) return;

  this.isManager = user.role === 'MANAGER';

  if (user.role === 'VENDOR') {
    this.vendorId = user.vendorId;
  } else {
    const id = this.route.snapshot.paramMap.get('vendorId');
    this.vendorId = id ? Number(id) : undefined;
  }

  if (this.vendorId) {
    const vendor =
      await this.vendorService.getById(this.vendorId);

    if (vendor) {
      this.name = vendor.name;
      this.phone = vendor.phone;
      this.vendorType = vendor.vendorType;
      this.isPublic = vendor.isPublic === 1;
    }
  }

  if (this.isManager) {
    this.projects =
      await this.projectService.getByManager(user.id!);

    if (this.vendorId) {
      const attached =
        await this.vendorService.getProjectsByVendor(this.vendorId);

     this.selectedProjects =
      attached
        .map(p => p.id)
        .filter((id): id is number => id !== undefined);
        }
  }
}


async save() {

  const user = this.auth.user();
  if (!user) return;

  if (user.role === 'VENDOR' &&
      user.vendorId !== this.vendorId) {
    return;
  }

  // =============================
  // EDIT EXISTING VENDOR
  // =============================
  if (this.vendorId) {

    const vendorId = this.vendorId;

    await this.vendorService.update({
      id: vendorId,
      name: this.name,
      phone: this.phone,
      vendorType: this.vendorType,
      isPublic: this.isManager ? (this.isPublic ? 1 : 0) : 0
    });

    if (this.isManager) {

      const existing =
        await this.vendorService.getProjectsByVendor(vendorId);

      const existingIds =
        existing
          .map(p => p.id)
          .filter((id): id is number => id !== undefined);

      for (const pid of this.selectedProjects) {
        if (!existingIds.includes(pid)) {
          await this.vendorService.attachToProject(pid, vendorId);
        }
      }

      for (const pid of existingIds) {
        if (!this.selectedProjects.includes(pid)) {
          await this.vendorService.detachFromProject(pid, vendorId);
        }
      }
    }

  }

  // =============================
  // CREATE NEW VENDOR
  // =============================
  else {

    const result = await this.vendorService.create({
      name: this.name,
      phone: this.phone,
      vendorType: this.vendorType,
      isPublic: this.isManager ? (this.isPublic ? 1 : 0) : 0,
      createdBy: user.id
    });

    const vendorId = result.changes.lastId as number;

    for (const pid of this.selectedProjects) {
      await this.vendorService.attachToProject(pid, vendorId);
    }
  }

  this.router.navigate(['/vendor/dashboard']);
}


  toggleProject(projectId: number, event: any) {

    if (event.target.checked) {
      this.selectedProjects.push(projectId);
    } else {
      this.selectedProjects =
        this.selectedProjects.filter(id => id !== projectId);
    }
  }
}
