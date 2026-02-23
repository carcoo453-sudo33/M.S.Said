import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogService } from '../../services/blog.service';
import { ProfileService } from '../../services/profile.service';
import { BlogPost, BioEntry } from '../../models';
import { NavbarComponent } from '../shared/navbar/navbar';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

// Section Components
import { BlogProfileCardComponent } from './sections/blog-profile-card';
import { BlogPlatformFilterComponent } from './sections/blog-platform-filter';
import { BlogTrendingTopicsComponent } from './sections/blog-trending-topics';
import { BlogFeedHeaderComponent } from './sections/blog-feed-header';
import { BlogPostCardComponent } from './sections/blog-post-card';

// Shared Global Components
import { SharedFooterComponent } from '../shared/footer/footer';
import { SharedEmptyStateComponent } from '../shared/empty-state/empty-state';
import { SharedSkeletonComponent } from '../shared/skeleton/skeleton';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    LucideAngularModule,
    BlogProfileCardComponent,
    BlogPlatformFilterComponent,
    BlogTrendingTopicsComponent,
    BlogFeedHeaderComponent,
    BlogPostCardComponent,
    SharedFooterComponent,
    SharedEmptyStateComponent,
    SharedSkeletonComponent
  ],
  templateUrl: './blog.html'
})
export class BlogComponent implements OnInit {
  private blogService = inject(BlogService);
  private profileService = inject(ProfileService);
  private router = inject(Router);

  posts: BlogPost[] = [];
  bio: BioEntry | null = null;
  isLoading = true;
  hasError = false;

  selectedPlatform = 'All Posts';
  platforms = ['All Posts', 'LinkedIn', 'Dev.to', 'GitHub'];
  trendingTopics: string[] = [];
  viewMode: 'grid' | 'list' = 'list';

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;

    // Fetch Bio for Sidebar
    this.profileService.getBio().subscribe(data => this.bio = data);

    // Fetch Posts
    this.blogService.getBlogPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.extractTrendingTopics();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.hasError = true;
      }
    });
  }

  extractTrendingTopics() {
    const allTags = this.posts.flatMap(p => p.tags?.split(',') || []);
    const uniqueTags = [...new Set(allTags.map(t => t.trim()))];
    this.trendingTopics = uniqueTags.slice(0, 6); // Top 6 for the sidebar
  }

  get filteredPosts() {
    if (this.selectedPlatform === 'All Posts') return this.posts;
    return this.posts.filter(p => p.socialType === this.selectedPlatform);
  }

  setPlatform(platform: string) {
    this.selectedPlatform = platform;
  }

  get platformCounts(): { [key: string]: number } {
    const counts: { [key: string]: number } = {};
    this.platforms.forEach(p => {
      if (p === 'All Posts') {
        counts[p] = this.posts.length;
      } else {
        counts[p] = this.posts.filter(post => post.socialType === p).length;
      }
    });
    return counts;
  }

  get skeletonItems() { return Array(4); }

  navigateToPost(post: BlogPost) {
    if (post.socialUrl) {
      window.open(post.socialUrl, '_blank');
    } else {
      this.router.navigate(['/blog', post.id]);
    }
  }
}
