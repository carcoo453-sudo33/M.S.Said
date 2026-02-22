import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { ProjectEntry } from '../../models/portfolio.models';
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="min-h-screen bg-zinc-950 text-white pb-20">
      <section class="max-w-6xl mx-auto pt-20 px-6 mb-20 text-center">
        <h1 class="text-6xl md:text-8xl font-black mb-6 tracking-tighter">
          LATEST <span class="bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">PROJECTS</span>
        </h1>
        <p class="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto">
          Explore a curated selection of my technical work.
        </p>
      </section>

      <section class="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div *ngFor="let project of projects" 
             class="group relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-600 transition-all duration-300">
          <div class="aspect-video bg-zinc-800 relative overflow-hidden">
            <img [src]="project.imageUrl" [alt]="project.title" 
                 class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60"></div>
          </div>
          
          <div class="p-8">
            <div class="flex gap-2 mb-4">
              <span *ngFor="let tech of project.techStack?.split(',')" 
                    class="text-[10px] bg-red-600/10 text-red-500 font-bold px-2 py-1 rounded-md tracking-wider uppercase">
                {{tech.trim()}}
              </span>
            </div>
            <h3 class="text-2xl font-bold mb-2">{{project.title}}</h3>
            <p class="text-zinc-400 mb-6 leading-relaxed">{{project.description}}</p>
            
            <div class="flex items-center gap-4">
              <a *ngIf="project.demoUrl" [href]="project.demoUrl" target="_blank" 
                 class="text-sm font-bold border-b border-red-600 pb-1 hover:text-red-500 transition-colors">Live Project</a>
              <a *ngIf="project.repoUrl" [href]="project.repoUrl" target="_blank" 
                 class="text-sm font-bold border-b border-zinc-600 pb-1 hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  `
})
export class ProjectsComponent implements OnInit {
  private portfolio = inject(PortfolioService);
  projects: ProjectEntry[] = [];

  ngOnInit() {
    this.portfolio.getProjects().subscribe(data => this.projects = data);
  }
}
