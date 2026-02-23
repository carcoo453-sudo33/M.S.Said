import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { BlogPost } from '../../models/portfolio.models';
import { NavbarComponent } from '../navbar/navbar';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule, ArrowRight, MessageSquare, Share2, Linkedin, Github, Twitter, ExternalLink, BookOpen, AlertCircle } from 'lucide-angular';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, NavbarComponent, LucideAngularModule],
  templateUrl: './blog.html'
})
export class BlogComponent implements OnInit {
  private portfolioService = inject(PortfolioService);
  private router = inject(Router);
  posts: BlogPost[] = [];
  isLoading = true;
  hasError = false;

  ArrowRightIcon = ArrowRight;
  MessageSquareIcon = MessageSquare;
  Share2Icon = Share2;
  LinkedinIcon = Linkedin;
  GithubIcon = Github;
  TwitterIcon = Twitter;
  ExternalLinkIcon = ExternalLink;
  BookOpenIcon = BookOpen;
  AlertCircleIcon = AlertCircle;

  ngOnInit() {
    this.portfolioService.getBlogPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.hasError = true;
      }
    });
  }

  get skeletonItems() { return Array(6); }

  getSocialIcon(type?: string) {
    if (!type) return this.ArrowRightIcon;
    switch (type.toLowerCase()) {
      case 'linkedin': return this.LinkedinIcon;
      case 'github': return this.GithubIcon;
      case 'twitter':
      case 'x': return this.TwitterIcon;
      default: return this.ExternalLinkIcon;
    }
  }

  navigateToPost(post: BlogPost) {
    if (post.socialUrl) {
      window.open(post.socialUrl, '_blank');
    } else {
      this.router.navigate(['/blog', post.id]);
    }
  }
}
