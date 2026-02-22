import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { ProjectEntry } from '../../models/portfolio.models';
import { NavbarComponent } from '../navbar/navbar';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, ArrowRight } from 'lucide-angular';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterLink, LucideAngularModule],
  templateUrl: './projects.html'
})
export class ProjectsComponent implements OnInit {
  private portfolio = inject(PortfolioService);
  projects: ProjectEntry[] = [];

  ArrowRightIcon = ArrowRight;

  ngOnInit() {
    this.portfolio.getProjects().subscribe(data => this.projects = data);
  }
}
