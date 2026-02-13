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
<div class="vendor-wrapper">

  <h2>{{ vendorId ? 'Edit Vendor' : 'Add Vendor' }}</h2>
  
  <div *ngIf="isManager && projects.length === 0">
    <p style="color:#c62828">
      No projects available. Please create a project first.
    </p>
  </div>

  <form (ngSubmit)="save()" class="vendor-form">

    <!-- BASIC INFO -->
    <section class="section">
      <h3>Basic Information</h3>

      <div class="grid">
        <div class="form-group">
          <label>Name</label>
          <input [(ngModel)]="name" name="name" required />
        </div>

        <div class="form-group">
          <label>Type</label>
          <select [(ngModel)]="vendorType" name="vendorType">
            <option value="Material">Material</option>
            <option value="Contractor">Contractor</option>
            <option value="Service">Service</option>
          </select>
        </div>
      </div>
    </section>

    <!-- ADDRESS -->
    <section class="section">
      <h3>Address</h3>

      <div class="grid">
        <div class="form-group">
          <label>Address Line 1</label>
          <input [(ngModel)]="addressLine1" name="addressLine1" />
        </div>

        <div class="form-group">
          <label>Address Line 2</label>
          <input [(ngModel)]="addressLine2" name="addressLine2" />
        </div>

        <div class="form-group">
          <label>City</label>
          <input [(ngModel)]="city" name="city" />
        </div>
      </div>
    </section>

    <!-- CONTACT INFO -->
    <section class="section">
      <h3>Contact Information</h3>

      <div class="grid">
        <div class="form-group">
          <label>Contact Person 1</label>
          <input [(ngModel)]="contactPerson1" name="contactPerson1" />
        </div>

        <div class="form-group">
          <label>Contact Number 1</label>
          <input [(ngModel)]="contactNumber1" name="contactNumber1" />
        </div>

        <div class="form-group">
          <label>Contact Person 2</label>
          <input [(ngModel)]="contactPerson2" name="contactPerson2" />
        </div>

        <div class="form-group">
          <label>Contact Number 2</label>
          <input [(ngModel)]="contactNumber2" name="contactNumber2" />
        </div>
      </div>
    </section>

    <!-- BUSINESS -->
    <section class="section">
      <h3>Business Details</h3>

      <div class="grid">
        <div class="form-group full">
          <label>Deals In</label>
          <input [(ngModel)]="dealsIn" name="dealsIn" />
        </div>
      </div>
    </section>

    <!-- MANAGER SECTION -->
    <section class="section" *ngIf="isManager">
      <h3>Manager Controls</h3>

      <div class="form-group checkbox">
        <label>
          <input type="checkbox"
                 [(ngModel)]="isPublic"
                 name="isPublic" />
          Public Vendor Profile
        </label>
      </div>

      <div class="project-grid">
        <div *ngFor="let p of projects" class="project-item">
          <label>
            <input type="checkbox"
                   [checked]="selectedProjects.includes(p.id)"
                   (change)="toggleProject(p.id, $event)" />
            {{ p.name }}
          </label>
        </div>
      </div>
    </section>

    <!-- ACTION -->
    <div class="actions">
      <button type="submit" class="primary-btn">
        {{ vendorId ? 'Update Vendor' : 'Create Vendor' }}
      </button>
    </div>

  </form>
</div>
`,
styles: [`
.vendor-wrapper {
  max-width: 900px;
  margin: 40px auto;
  padding: 30px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
}

h2 {
  margin-bottom: 25px;
}

.section {
  margin-bottom: 30px;
}

.section h3 {
  font-size: 16px;
  margin-bottom: 15px;
  padding-bottom: 5px;
  border-bottom: 1px solid #eee;
  color: #333;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full {
  grid-column: span 2;
}

label {
  font-size: 14px;
  margin-bottom: 5px;
  font-weight: 500;
}

input, select {
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  transition: 0.2s ease;
}

input:focus, select:focus {
  border-color: #1976d2;
  outline: none;
}

.checkbox label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.project-grid {
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 8px;
}

.project-item {
  font-size: 14px;
}

.actions {
  margin-top: 20px;
  text-align: right;
}

.primary-btn {
  background: #1976d2;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: 0.2s ease;
}

.primary-btn:hover {
  background: #145ea8;
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .form-group.full {
    grid-column: span 1;
  }
}
`]

})
export class VendorFormComponent {

  projects: any[] = [];
selectedProjects: number[] = [];

  vendorId?: number;

  name = '';
  //phone = '';
  vendorType: VendorType = 'Material';
  isPublic = false;

  isManager = false;


addressLine1 = '';
addressLine2 = '';
city = '';

contactPerson1 = '';
contactNumber1 = '';
contactPerson2 = '';
contactNumber2 = '';

dealsIn = '';



  constructor(
    private projectService: ProjectService,
    private vendorService: VendorService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

async ngOnInit() {

  const user = this.auth.user();

  console.log('USER:', user);

  if (!user) {
    console.warn('No user found in session');
    return;
  }

  this.isManager = user.role === 'MANAGER';

  console.log('IS MANAGER:', this.isManager);

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
        this.addressLine1 = vendor.addressLine1 ?? '';
        this.addressLine2 = vendor.addressLine2 ?? '';
        this.city = vendor.city ?? '';

        this.contactPerson1 = vendor.contactPerson1 ?? '';
        this.contactNumber1 = vendor.contactNumber1 ?? '';
        this.contactPerson2 = vendor.contactPerson2 ?? '';
        this.contactNumber2 = vendor.contactNumber2 ?? '';

        this.dealsIn = vendor.dealsIn ?? '';
        this.vendorType = vendor.vendorType;
        this.isPublic = vendor.isPublic === 1;
    }
  }

if (this.isManager && user.id) {

  const managerProjects =
    await this.projectService.getByManager(user.id);

  console.log('Manager Projects:', managerProjects);

  this.projects = managerProjects;

  if (this.vendorId) {

    const attached =
      await this.vendorService.getProjectsByVendor(this.vendorId);

    console.log('Attached Projects:', attached);

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
        addressLine1: this.addressLine1,
        addressLine2: this.addressLine2,
        city: this.city,
        contactPerson1: this.contactPerson1,
        contactNumber1: this.contactNumber1,
        contactPerson2: this.contactPerson2,
        contactNumber2: this.contactNumber2,
        dealsIn: this.dealsIn,
        vendorType: this.vendorType,
        isPublic: this.isManager ? (this.isPublic ? 1 : 0) : 0
      },
      user.id!
      );

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
  addressLine1: this.addressLine1,
  addressLine2: this.addressLine2,
  city: this.city,
  contactPerson1: this.contactPerson1,
  contactNumber1: this.contactNumber1,
  contactPerson2: this.contactPerson2,
  contactNumber2: this.contactNumber2,
  dealsIn: this.dealsIn,
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
