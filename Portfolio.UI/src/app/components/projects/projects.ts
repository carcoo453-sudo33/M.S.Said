import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { ProjectEntry } from '../../models/portfolio.models';
import { NavbarComponent } from '../navbar/navbar';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, ArrowRight, ExternalLink, Github, FolderOpen, AlertCircle } from 'lucide-angular';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterLink, LucideAngularModule],
  templateUrl: './projects.html'
})
export class ProjectsComponent implements OnInit {
  private portfolio = inject(PortfolioService);
  projects: ProjectEntry[] = [];
  isLoading = true;
  hasError = false;

  ArrowRightIcon = ArrowRight;
  ExternalLinkIcon = ExternalLink;
  GithubIcon = Github;
  FolderOpenIcon = FolderOpen;
  AlertCircleIcon = AlertCircle;

  ngOnInit() {
    this.portfolio.getProjects().subscribe({
      next: (data) => {
        this.projects = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.hasError = true;
      }
    });
  }

  get skeletonItems() { return Array(6); }
}
