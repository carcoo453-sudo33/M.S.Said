import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { ExperienceEntry } from '../../models/portfolio.models';
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="min-h-screen bg-zinc-950 text-white pb-20">
      <section class="max-w-6xl mx-auto pt-20 px-6 mb-20 text-center">
        <h1 class="text-6xl md:text-8xl font-black mb-6 tracking-tighter">
          WORK <span class="bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">EXPERIENCE</span>
        </h1>
        <p class="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto">
          A definitive timeline of my professional journey.
        </p>
      </section>

      <section class="max-w-4xl mx-auto px-6 relative">
        <div class="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-zinc-800 transform md:-translate-x-1/2"></div>
        <div class="space-y-12">
          <div *ngFor="let item of experiences; let i = index" class="relative flex flex-col md:flex-row items-center group">
            <div class="absolute left-6 md:left-1/2 w-4 h-4 rounded-full bg-red-600 transform -translate-x-1/2 z-10 shadow-[0_0_15px_rgba(220,38,38,0.5)] group-hover:scale-125 transition-transform"></div>
            <div [ngClass]="{'md:text-right md:pr-16': i % 2 === 0, 'md:pl-16 md:order-last': i % 2 !== 0}" class="ml-16 md:ml-0 w-full md:w-1/2">
              <div class="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl hover:border-zinc-700 transition-colors">
                <span class="text-red-500 text-sm font-bold tracking-widest uppercase mb-2 block">{{item.duration}}</span>
                <h3 class="text-2xl font-bold mb-1">{{item.role}}</h3>
                <h4 class="text-zinc-500 font-medium mb-4">{{item.company}}</h4>
                <p class="text-zinc-400 leading-relaxed">{{item.description}}</p>
              </div>
            </div>
            <div class="hidden md:block w-1/2"></div>
          </div>
        </div>
      </section>
    </main>
  `
})
export class TimelineComponent implements OnInit {
  private portfolio = inject(PortfolioService);
  experiences: ExperienceEntry[] = [];
  ngOnInit() {
    this.portfolio.getExperiences().subscribe(data => this.experiences = data);
  }
}
