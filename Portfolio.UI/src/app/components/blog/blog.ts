import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BlogService } from '../../services/blog.service';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';
import { BlogPost, BioEntry } from '../../models';
import { NavbarComponent } from '../shared/navbar/navbar';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { TranslationService } from '../../services/translation.service';

// Section Components
import { BlogProfileCardComponent } from './sections/blog-profile-card';
import { BlogPlatformFilterComponent } from './sections/blog-platform-filter';
import { BlogTrendingTopicsComponent } from './sections/blog-trending-topics';
import { BlogFeedHeaderComponent } from './sections/blog-feed-header';
import { BlogPostCardComponent } from './sections/blog-post-card';
import { BlogManageComponent } from './sections/blog-manage';

// Shared Global Components
import { SharedFooterComponent } from '../shared/footer/footer';
import { SharedEmptyStateComponent } from '../shared/empty-state/empty-state';
import { SharedSkeletonComponent } from '../shared/skeleton/skeleton';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NavbarComponent,
    LucideAngularModule,
    BlogProfileCardComponent,
    BlogPlatformFilterComponent,
    BlogTrendingTopicsComponent,
    BlogFeedHeaderComponent,
    BlogPostCardComponent,
    BlogManageComponent,
    SharedFooterComponent,
    SharedEmptyStateComponent,
    SharedSkeletonComponent
  ],
  templateUrl: './blog.html'
})
export class BlogComponent implements OnInit {
  private blogService = inject(BlogService);
  private profileService = inject(ProfileService);
  private authService = inject(AuthService);
  private router = inject(Router);
  public translationService = inject(TranslationService);

  posts = signal<BlogPost[]>([]);
  bio = signal<BioEntry | null>(null);
  isLoading = signal(true);
  hasError = signal(false);

  selectedPlatform = signal('All Posts');
  platforms = ['All Posts', 'LinkedIn', 'Dev.to', 'GitHub', 'Pinterest', 'StackOverflow'];
  trendingTopics = signal<string[]>([]);
  viewMode: 'grid' | 'list' = 'list';

  selectedPost = signal<BlogPost | undefined>(undefined);
  triggerEdit = signal(false);

  get canEdit(): boolean {
    return this.authService.isLoggedIn();
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);

    // Fetch Bio for Sidebar
    this.profileService.getBio().subscribe({
      next: (data) => this.bio.set(data),
      error: (err) => console.error('Blog: Failed to load bio', err)
    });

    // Fetch Posts
    this.blogService.getBlogPosts().subscribe({
      next: (data) => {
        this.posts.set(data);
        this.extractTrendingTopics();
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.hasError.set(true);
      }
    });
  }

  extractTrendingTopics() {
    const allTags = this.posts().flatMap(p => p.tags?.split(',') || []);
    const uniqueTags = [...new Set(allTags.map(t => t.trim()))];
    this.trendingTopics.set(uniqueTags.slice(0, 6)); // Top 6 for the sidebar
  }

  get filteredPosts() {
    const allPostsKey = this.selectedPlatform();
    if (allPostsKey === 'All Posts' || allPostsKey === 'جميع المنشورات') return this.posts();
    return this.posts().filter(p => p.socialType === this.selectedPlatform());
  }

  setPlatform(platform: string) {
    this.selectedPlatform.set(platform);
  }

  get platformCounts(): { [key: string]: number } {
    const counts: { [key: string]: number } = {};
    this.platforms.forEach(p => {
      if (p === 'All Posts' || p === 'جميع المنشورات') {
        counts[p] = this.posts().length;
      } else {
        counts[p] = this.posts().filter(post => post.socialType === p).length;
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

  onPostCreated(post: BlogPost) {
    this.posts.set([post, ...this.posts()]);
    this.extractTrendingTopics();
  }

  onPostUpdated() {
    this.loadData();
    this.selectedPost.set(undefined);
    this.triggerEdit.set(false);
  }

  onPostDeleted(postId: string) {
    this.posts.set(this.posts().filter(p => p.id !== postId));
    this.extractTrendingTopics();
    this.selectedPost.set(undefined);
    this.triggerEdit.set(false);
  }

  editPost(post: BlogPost) {
    this.selectedPost.set(post);
    this.triggerEdit.set(true);
    setTimeout(() => {
      this.triggerEdit.set(false);
    }, 100);
  }
}
