import { Injectable, signal } from '@angular/core';
import { Project } from '../../shared/models/project.model';
import { ProjectService } from './project.service';

@Injectable({ providedIn: 'root' })
export class ProjectStore {

  projects = signal<Project[]>([]);
  loading = signal(false);

  constructor(private service: ProjectService) {}

  async loadProjects() {
    this.loading.set(true);
    const data = await this.service.getAll();
    this.projects.set(data);
    this.loading.set(false);
  }

  async addProject(project: Project) {
    await this.service.create(project);
    await this.loadProjects();
  }
}

