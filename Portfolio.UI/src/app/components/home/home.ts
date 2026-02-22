import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { BioEntry, ServiceEntry, ProjectEntry } from '../../models/portfolio.models';
import { NavbarComponent } from '../navbar/navbar';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, NavbarComponent, RouterLink],
    template: `
    <app-navbar></app-navbar>
    
    <main class="min-h-screen bg-zinc-950 text-white">
      <!-- Hero Section -->
      <section class="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 px-6">
        <div class="absolute inset-0 z-0">
          <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-[128px] animate-pulse"></div>
          <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] animate-pulse" style="animation-delay: 2s"></div>
        </div>

        <div class="max-w-6xl mx-auto z-10 text-center">
          <h2 class="text-red-500 font-bold tracking-[0.2em] uppercase mb-6 animate-fade-in">
            {{ bio?.title }}
          </h2>
          <h1 class="text-7xl md:text-9xl font-black mb-8 tracking-tighter leading-none animate-slide-up">
            {{ bio?.name }}
          </h1>
          <p class="text-zinc-400 text-xl md:text-2xl max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in" style="animation-delay: 0.5s">
            {{ bio?.description }}
          </p>
          
          <div class="flex flex-col md:flex-row items-center justify-center gap-6 animate-fade-in" style="animation-delay: 0.8s">
            <a routerLink="/projects" class="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-10 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-600/25">
              View My Work
            </a>
            <a routerLink="/timeline" class="border border-zinc-700 hover:border-zinc-500 text-white font-bold py-4 px-10 rounded-full transition-all">
              My Journey
            </a>
          </div>
        </div>

        <div class="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
          <div class="w-px h-12 bg-gradient-to-b from-transparent via-zinc-500 to-transparent"></div>
        </div>
      </section>

      <!-- Services Section -->
      <section class="py-32 px-6 bg-zinc-900/30 border-y border-zinc-900">
        <div class="max-w-6xl mx-auto">
          <div class="mb-20 text-center">
            <h2 class="text-4xl md:text-6xl font-black mb-4 tracking-tighter">WHAT I <span class="bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">OFFER</span></h2>
            <div class="w-20 h-1 bg-red-600 mx-auto"></div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div *ngFor="let service of services" class="group bg-zinc-950 p-8 rounded-3xl border border-zinc-800 hover:border-red-600/50 transition-all duration-500 hover:-translate-y-2">
              <div class="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-600 transition-colors">
                <i class="text-2xl text-red-500 group-hover:text-white transition-colors" [class]="service.icon"></i>
              </div>
              <h3 class="text-xl font-bold mb-4">{{ service.title }}</h3>
              <p class="text-zinc-500 leading-relaxed text-sm">{{ service.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Projects Preview -->
      <section class="py-32 px-6">
        <div class="max-w-6xl mx-auto">
          <div class="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div class="md:w-2/3 text-left">
              <h2 class="text-4xl md:text-6xl font-black mb-4 tracking-tighter">FEATURED <span class="text-zinc-800">PROJECTS</span></h2>
              <p class="text-zinc-500 text-lg">A selection of my personal favorites and most impactful work.</p>
            </div>
            <a routerLink="/projects" class="text-red-500 font-bold flex items-center gap-2 group whitespace-nowrap">
              Explore All <i class="lucide-arrow-right group-hover:translate-x-1 transition-transform"></i>
            </a>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div *ngFor="let project of featuredProjects" class="group cursor-pointer">
              <div class="aspect-video bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 mb-6 relative">
                <img [src]="project.imageUrl" [alt]="project.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-100">
                <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80"></div>
              </div>
              <h3 class="text-2xl font-bold mb-2">{{ project.title }}</h3>
              <div class="flex gap-2 mb-4">
                <span *ngFor="let tech of project.techStack?.split(',')" class="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">
                  {{ tech.trim() }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="py-32 px-6 bg-red-600">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-white uppercase">Ready to start a project?</h2>
          <p class="text-red-100 text-xl mb-12 max-w-2xl mx-auto">Let's build something exceptional together. I'm currently available for full-time roles and freelance projects.</p>
          <a [href]="'mailto:' + bio?.email" class="inline-block bg-white text-red-600 font-bold py-5 px-12 rounded-full text-lg hover:scale-105 transition-transform shadow-2xl">
            Get In Touch
          </a>
        </div>
      </section>
    </main>
  `,
    styles: [`
    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slide-up {
      from { opacity: 0; transform: translateY(40px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fade-in 1.2s ease-out forwards;
    }
    .animate-slide-up {
      animation: slide-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `]
})
export class HomeComponent implements OnInit {
    private portfolio = inject(PortfolioService);
    bio?: BioEntry;
    services: ServiceEntry[] = [];
    featuredProjects: ProjectEntry[] = [];

    ngOnInit() {
        this.portfolio.getBio().subscribe(data => this.bio = data);
        this.portfolio.getServices().subscribe(data => this.services = data);
        this.portfolio.getProjects().subscribe(data => {
            this.featuredProjects = data.slice(0, 2);
        });
    }
}
