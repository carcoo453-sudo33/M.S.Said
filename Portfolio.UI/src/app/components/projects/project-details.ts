import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PortfolioService } from '../../services/portfolio.service';
import { ProjectEntry } from '../../models/portfolio.models';
import { NavbarComponent } from '../navbar/navbar';
import { LucideAngularModule, ArrowLeft, Github, ChevronRight, ExternalLink, Code, Layers, Monitor, AlertCircle } from 'lucide-angular';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterLink, LucideAngularModule],
  templateUrl: './project-details.html'
})
export class ProjectDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private portfolio = inject(PortfolioService);
  project?: ProjectEntry;
  isLoading = true;
  hasError = false;

  ArrowLeftIcon = ArrowLeft;
  GithubIcon = Github;
  ChevronRightIcon = ChevronRight;
  ExternalLinkIcon = ExternalLink;
  CodeIcon = Code;
  LayersIcon = Layers;
  MonitorIcon = Monitor;
  AlertCircleIcon = AlertCircle;

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.portfolio.getProject(slug).subscribe({
        next: (data) => {
          this.project = data;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.hasError = true;
        }
      });
    } else {
      this.isLoading = false;
      this.hasError = true;
    }
  }
}
