import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PortfolioService } from '../../services/portfolio.service';
import { ProjectEntry } from '../../models/portfolio.models';
import { NavbarComponent } from '../navbar/navbar';
import { LucideAngularModule, ArrowLeft, Github } from 'lucide-angular';

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

  ArrowLeftIcon = ArrowLeft;
  GithubIcon = Github;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.portfolio.getProject(id).subscribe(data => {
        this.project = data;
      });
    }
  }
}
