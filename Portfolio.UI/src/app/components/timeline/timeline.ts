import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { ExperienceEntry } from '../../models/portfolio.models';
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './timeline.html'
})
export class TimelineComponent implements OnInit {
  private portfolio = inject(PortfolioService);
  experiences: ExperienceEntry[] = [];
  ngOnInit() {
    this.portfolio.getExperiences().subscribe(data => this.experiences = data);
  }
}
