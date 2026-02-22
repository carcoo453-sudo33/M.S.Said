import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { ProjectEntry } from '../../models/portfolio.models';
import { NavbarComponent } from '../navbar/navbar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterLink],
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

      <section class="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        <div *ngFor="let project of projects" 
             [routerLink]="['/projects', project.id]"
             class="group cursor-pointer">
          <div class="aspect-[16/10] bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-zinc-900 mb-8 relative">
            <img [src]="project.imageUrl" [alt]="project.title" 
                 class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-100">
            <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60"></div>
          </div>
          
          <div class="px-2">
            <div class="flex gap-2 mb-4">
              <span *ngFor="let tech of project.techStack?.split(',')" 
                    class="text-[10px] text-zinc-500 font-bold tracking-[0.2em] uppercase">
                {{tech.trim()}}
              </span>
            </div>
            <h3 class="text-3xl font-black mb-4 leading-tight group-hover:text-red-500 transition-colors uppercase tracking-tighter">{{project.title}}</h3>
            <p class="text-zinc-500 mb-8 line-clamp-2 leading-relaxed italic text-sm">{{project.description}}</p>
            
            <span class="text-red-500 font-bold flex items-center gap-2 text-xs uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                Explore Project <i class="lucide-arrow-right"></i>
            </span>
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
