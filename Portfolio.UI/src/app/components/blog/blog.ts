import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { BlogPost } from '../../models/portfolio.models';
import { NavbarComponent } from '../navbar/navbar';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, ArrowRight } from 'lucide-angular';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterLink, LucideAngularModule],
  templateUrl: './blog.html'
})
export class BlogComponent implements OnInit {
  private portfolio = inject(PortfolioService);
  posts: BlogPost[] = [];

  ArrowRightIcon = ArrowRight;

  ngOnInit() {
    this.portfolio.getBlogPosts().subscribe(data => {
      this.posts = data;
    });
  }
}
