import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { ExperienceEntry } from '../../models/portfolio.models';
import { NavbarComponent } from '../navbar/navbar';
import { LucideAngularModule, Briefcase, AlertCircle } from 'lucide-angular';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, NavbarComponent, LucideAngularModule],
  templateUrl: './timeline.html'
})
export class TimelineComponent implements OnInit {
  private portfolio = inject(PortfolioService);
  experiences: ExperienceEntry[] = [];
  isLoading = true;
  hasError = false;

  BriefcaseIcon = Briefcase;
  AlertCircleIcon = AlertCircle;

  ngOnInit() {
    this.portfolio.getExperiences().subscribe({
      next: (data) => {
        this.experiences = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.hasError = true;
      }
    });
  }

  get skeletonItems() { return Array(4); }
}
