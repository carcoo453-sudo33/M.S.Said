import { Component, Input, Output, EventEmitter, inject, OnChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Edit, Save, X, Plus, Trash2, Linkedin, Github, Layers, ExternalLink, Calendar, Tag, User } from 'lucide-angular';
import { BlogPost } from '../../../models';
import { BlogService } from '../../../services/blog.service';
import { ToastService } from '../../../services/toast.service';

@Component({
    selector: 'app-blog-manage',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    template: `
    <!-- Edit Modal -->
    <div *ngIf="isEditing" class="fixed inset-0 z-50 flex items-start justify-center p-6 bg-black/90 backdrop-blur-sm overflow-y-auto">
        <div class="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-4xl my-8 animate-scale-in">
            <!-- Header -->
            <div class="flex items-center justify-between p-8 border-b border-zinc-800">
                <h2 class="text-2xl font-black italic uppercase tracking-tighter text-white">
                    {{ isNewPost ? 'Add New Post' : 'Edit Post' }}
                </h2>
                <button (click)="closeModal()" class="text-zinc-400 hover:text-white transition-colors">
                    <lucide-icon [img]="XIcon" class="w-6 h-6"></lucide-icon>
                </button>
            </div>

            <!-- Content -->
            <div class="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                <!-- Import from URL Section -->
                <section *ngIf="isNewPost" class="space-y-6">
                    <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                        <div class="flex items-center gap-3">
                            <lucide-icon [img]="ExternalLinkIcon" class="w-5 h-5 text-red-600"></lucide-icon>
                            <h3 class="text-sm font-black uppercase text-white">Import from Social Media</h3>
                        </div>
                        <p class="text-xs text-zinc-500">Paste the URL and click Import to automatically fetch available post details</p>
                        <div class="flex gap-3">
                            <input type="url" [(ngModel)]="importUrl" id="import-url" name="importUrl"
                                placeholder="https://linkedin.com/posts/... or https://stackoverflow.com/..."
                                class="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white text-sm focus:border-red-600 outline-none">
                            <button (click)="importFromUrl()" [disabled]="isImporting || !importUrl"
                                class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-xs font-black uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                {{ isImporting ? 'Importing...' : 'Import' }}
                            </button>
                        </div>
                        <div class="bg-zinc-950 border border-zinc-700 rounded-lg p-4 space-y-2">
                            <p class="text-[10px] font-black uppercase text-zinc-400">Note:</p>
                            <ul class="text-[10px] text-zinc-500 space-y-1 list-disc list-inside">
                                <li>StackOverflow questions/answers work great</li>
                                <li>GitHub repositories and releases work best</li>
                                <li>LinkedIn posts may require manual entry due to authentication</li>
                                <li>Dev.to, Medium, and Pinterest posts are partially supported</li>
                                <li>Some fields may need manual completion after import</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <!-- Basic Info -->
                <section class="space-y-6">
                    <h3 class="text-lg font-black uppercase text-red-600">Post Information</h3>
                    
                    <div>
                        <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">
                            <lucide-icon [img]="EditIcon" class="w-3 h-3 inline mr-1"></lucide-icon>
                            Title
                        </label>
                        <input type="text" [(ngModel)]="editData.title" id="blog-title" name="title"
                            placeholder="Enter post title"
                            class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:border-red-600 outline-none transition-colors">
                    </div>

                    <div>
                        <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">
                            Summary
                        </label>
                        <textarea [(ngModel)]="editData.summary" rows="3" id="blog-summary" name="summary"
                            placeholder="Brief summary of the post"
                            class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:border-red-600 outline-none resize-none transition-colors"></textarea>
                    </div>

                    <div>
                        <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">
                            Content
                        </label>
                        <textarea [(ngModel)]="editData.content" rows="6" id="blog-content" name="content"
                            placeholder="Full post content"
                            class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:border-red-600 outline-none resize-none transition-colors"></textarea>
                    </div>

                    <div>
                        <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">
                            <lucide-icon [img]="UserIcon" class="w-3 h-3 inline mr-1"></lucide-icon>
                            Author
                        </label>
                        <input type="text" [(ngModel)]="editData.author" id="blog-author" name="author"
                            placeholder="Author name"
                            class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:border-red-600 outline-none transition-colors">
                    </div>
                </section>

                <!-- Social Media Info -->
                <section class="space-y-6">
                    <h3 class="text-lg font-black uppercase text-red-600">Social Media</h3>
                    
                    <div>
                        <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">
                            <lucide-icon [img]="ExternalLinkIcon" class="w-3 h-3 inline mr-1"></lucide-icon>
                            Social URL
                        </label>
                        <input type="url" [(ngModel)]="editData.socialUrl" id="blog-social-url" name="socialUrl"
                            placeholder="https://linkedin.com/posts/..."
                            class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:border-red-600 outline-none transition-colors">
                        <p class="text-[10px] text-zinc-600 mt-2">The URL to the original post on social media</p>
                    </div>

                    <div>
                        <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">
                            Platform Type
                        </label>
                        <select [(ngModel)]="editData.socialType" id="blog-social-type" name="socialType"
                            class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:border-red-600 outline-none transition-colors">
                            <option value="">Select Platform</option>
                            <option value="LinkedIn">LinkedIn</option>
                            <option value="GitHub">GitHub</option>
                            <option value="Dev.to">Dev.to</option>
                            <option value="Twitter">Twitter</option>
                            <option value="Medium">Medium</option>
                            <option value="Pinterest">Pinterest</option>
                            <option value="StackOverflow">StackOverflow</option>
                        </select>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">
                                Image URL (optional)
                            </label>
                            <input type="url" [(ngModel)]="editData.imageUrl" id="blog-image-url" name="imageUrl"
                                placeholder="https://example.com/image.jpg"
                                class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:border-red-600 outline-none transition-colors">
                        </div>

                        <div>
                            <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">
                                <lucide-icon [img]="CalendarIcon" class="w-3 h-3 inline mr-1"></lucide-icon>
                                Published Date
                            </label>
                            <input type="datetime-local" [(ngModel)]="editData.publishedAt" id="blog-published-at" name="publishedAt"
                                class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:border-red-600 outline-none transition-colors">
                        </div>
                    </div>
                </section>

                <!-- Engagement Stats -->
                <section class="space-y-6">
                    <h3 class="text-lg font-black uppercase text-red-600">Engagement Stats</h3>
                    
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">
                                Likes
                            </label>
                            <input type="number" [(ngModel)]="editData.likesCount" min="0" id="blog-likes" name="likesCount"
                                class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:border-red-600 outline-none transition-colors">
                        </div>

                        <div>
                            <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">
                                Comments
                            </label>
                            <input type="number" [(ngModel)]="editData.commentsCount" min="0" id="blog-comments" name="commentsCount"
                                class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:border-red-600 outline-none transition-colors">
                        </div>

                        <div>
                            <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">
                                Stars (GitHub)
                            </label>
                            <input type="number" [(ngModel)]="editData.starsCount" min="0" id="blog-stars" name="starsCount"
                                class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:border-red-600 outline-none transition-colors">
                        </div>

                        <div>
                            <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">
                                Forks (GitHub)
                            </label>
                            <input type="number" [(ngModel)]="editData.forksCount" min="0" id="blog-forks" name="forksCount"
                                class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:border-red-600 outline-none transition-colors">
                        </div>
                    </div>
                </section>

                <!-- Tags & Version -->
                <section class="space-y-6">
                    <h3 class="text-lg font-black uppercase text-red-600">Additional Info</h3>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">
                                <lucide-icon [img]="TagIcon" class="w-3 h-3 inline mr-1"></lucide-icon>
                                Tags (comma-separated)
                            </label>
                            <input type="text" [(ngModel)]="editData.tags" id="blog-tags" name="tags"
                                placeholder="typescript, angular, webdev"
                                class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:border-red-600 outline-none transition-colors">
                        </div>

                        <div>
                            <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">
                                Version (for releases)
                            </label>
                            <input type="text" [(ngModel)]="editData.version" id="blog-version" name="version"
                                placeholder="v1.0.0"
                                class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:border-red-600 outline-none transition-colors">
                        </div>
                    </div>
                </section>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-between p-8 border-t border-zinc-800">
                <button *ngIf="!isNewPost" (click)="deletePost()" [disabled]="isSaving"
                    class="flex items-center gap-2 text-red-600 hover:text-red-500 font-black text-[10px] uppercase transition-colors disabled:opacity-50">
                    <lucide-icon [img]="TrashIcon" class="w-4 h-4"></lucide-icon>
                    Delete Post
                </button>
                <div class="flex items-center gap-4" [class.ml-auto]="isNewPost">
                    <button (click)="closeModal()" 
                        class="px-8 py-3 rounded-xl font-black text-[10px] uppercase text-zinc-400 hover:text-white transition-colors">
                        Cancel
                    </button>
                    <button (click)="saveChanges()" [disabled]="isSaving || !isFormValid()"
                        class="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-xl font-black text-[10px] uppercase hover:bg-red-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        <lucide-icon [img]="SaveIcon" class="w-4 h-4"></lucide-icon>
                        {{ isSaving ? 'Saving...' : (isNewPost ? 'Create Post' : 'Save Changes') }}
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Add Post Button (Floating) -->
    <button *ngIf="canEdit && !isEditing" (click)="createNewPost()"
        class="fixed bottom-8 right-8 z-40 bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 group">
        <lucide-icon [img]="PlusIcon" class="w-6 h-6"></lucide-icon>
        <span class="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-zinc-900 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Add New Post
        </span>
    </button>
    `
})
export class BlogManageComponent implements OnChanges {
    private blogService = inject(BlogService);
    private toast = inject(ToastService);
    private cdr = inject(ChangeDetectorRef);
    
    @Input() post?: BlogPost;
    @Input() canEdit = false;
    @Input() triggerEdit = false;
    @Output() onUpdate = new EventEmitter<void>();
    @Output() onCreate = new EventEmitter<BlogPost>();
    @Output() onDelete = new EventEmitter<string>();

    EditIcon = Edit;
    SaveIcon = Save;
    XIcon = X;
    PlusIcon = Plus;
    TrashIcon = Trash2;
    LinkedinIcon = Linkedin;
    GithubIcon = Github;
    LayersIcon = Layers;
    ExternalLinkIcon = ExternalLink;
    CalendarIcon = Calendar;
    TagIcon = Tag;
    UserIcon = User;

    isEditing = false;
    isSaving = false;
    isNewPost = false;
    isImporting = false;
    importUrl = '';
    editData: any = {};

    ngOnChanges() {
        if (this.triggerEdit && !this.isEditing && this.post) {
            this.openModal();
        }
    }

    createNewPost() {
        this.isNewPost = true;
        this.editData = {
            title: '',
            summary: '',
            content: '',
            author: 'Mostafa Samir Said',
            socialUrl: '',
            socialType: '',
            imageUrl: '',
            publishedAt: new Date().toISOString().slice(0, 16),
            tags: '',
            likesCount: 0,
            commentsCount: 0,
            starsCount: 0,
            forksCount: 0,
            version: ''
        };
        this.isEditing = true;
    }

    openModal() {
        if (!this.post) return;
        
        this.isNewPost = false;
        this.editData = {
            title: this.post.title || '',
            summary: this.post.summary || '',
            content: this.post.content || '',
            author: this.post.author || 'Mostafa Samir Said',
            socialUrl: this.post.socialUrl || '',
            socialType: this.post.socialType || '',
            imageUrl: this.post.imageUrl || '',
            publishedAt: this.post.publishedAt ? new Date(this.post.publishedAt).toISOString().slice(0, 16) : '',
            tags: this.post.tags || '',
            likesCount: this.post.likesCount || 0,
            commentsCount: this.post.commentsCount || 0,
            starsCount: this.post.starsCount || 0,
            forksCount: this.post.forksCount || 0,
            version: this.post.version || ''
        };
        
        this.isEditing = true;
    }

    closeModal() {
        this.isEditing = false;
        this.isNewPost = false;
        this.importUrl = '';
    }

    importFromUrl() {
        if (!this.importUrl || this.isImporting) return;

        this.isImporting = true;

        this.blogService.importFromUrl(this.importUrl).subscribe({
            next: (importedData) => {
                console.log('Successfully imported post data:', importedData);
                
                // Populate form with imported data
                this.editData = {
                    title: importedData.title || 'Untitled Post',
                    summary: importedData.summary || '',
                    content: importedData.content || '',
                    author: importedData.author || 'Mostafa Samir Said',
                    socialUrl: importedData.socialUrl || this.importUrl,
                    socialType: importedData.socialType || '',
                    imageUrl: importedData.imageUrl || '',
                    publishedAt: importedData.publishedAt ? new Date(importedData.publishedAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
                    tags: importedData.tags || '',
                    likesCount: importedData.likesCount || 0,
                    commentsCount: importedData.commentsCount || 0,
                    starsCount: importedData.starsCount || 0,
                    forksCount: importedData.forksCount || 0,
                    version: importedData.version || ''
                };

                this.isImporting = false;
                
                // Manually trigger change detection before showing toast
                this.cdr.detectChanges();
                
                // Show success message in next tick
                setTimeout(() => {
                    if (importedData.title && importedData.title !== 'Untitled Post') {
                        this.toast.success('Post data imported successfully! Review and complete any missing fields, then save.');
                    } else {
                        this.toast.info('URL detected. Platform identified, but some data may need to be entered manually. Please complete the form and save.');
                    }
                }, 0);
            },
            error: (err) => {
                console.error('Failed to import from URL:', err);
                
                // Even on error, set the URL and platform type
                const platformType = this.detectPlatformFromUrl(this.importUrl);
                this.editData.socialUrl = this.importUrl;
                this.editData.socialType = platformType;
                
                this.isImporting = false;
                
                // Manually trigger change detection before showing toast
                this.cdr.detectChanges();
                
                // Show error message in next tick
                setTimeout(() => {
                    let errorMessage = 'Could not automatically fetch post data. ';
                    
                    if (err.status === 401) {
                        errorMessage = 'Your session has expired. Please log in again.';
                    } else if (err.error?.message) {
                        errorMessage = err.error.message;
                    } else {
                        errorMessage += 'This may be due to platform restrictions. The URL and platform have been set. Please fill in the remaining fields manually.';
                    }
                    
                    this.toast.error(errorMessage);
                }, 0);
            }
        });
    }

    private detectPlatformFromUrl(url: string): string {
        if (url.includes('linkedin.com')) return 'LinkedIn';
        if (url.includes('github.com')) return 'GitHub';
        if (url.includes('dev.to')) return 'Dev.to';
        if (url.includes('twitter.com') || url.includes('x.com')) return 'Twitter';
        if (url.includes('medium.com')) return 'Medium';
        if (url.includes('pinterest.com')) return 'Pinterest';
        if (url.includes('stackoverflow.com')) return 'StackOverflow';
        return '';
    }

    isFormValid(): boolean {
        return !!(this.editData.title?.trim() && 
                  this.editData.summary?.trim() && 
                  this.editData.content?.trim());
    }

    saveChanges() {
        if (!this.isFormValid() || this.isSaving) return;

        this.isSaving = true;

        const postData = {
            title: this.editData.title.trim(),
            summary: this.editData.summary.trim(),
            content: this.editData.content.trim(),
            author: this.editData.author.trim() || 'Mostafa Samir Said',
            socialUrl: this.editData.socialUrl?.trim() || undefined,
            socialType: this.editData.socialType || undefined,
            imageUrl: this.editData.imageUrl?.trim() || undefined,
            publishedAt: this.editData.publishedAt ? new Date(this.editData.publishedAt).toISOString() : new Date().toISOString(),
            tags: this.editData.tags?.trim() || undefined,
            likesCount: this.editData.likesCount || 0,
            commentsCount: this.editData.commentsCount || 0,
            starsCount: this.editData.starsCount || 0,
            forksCount: this.editData.forksCount || 0,
            version: this.editData.version?.trim() || undefined
        };

        if (this.isNewPost) {
            this.blogService.createBlogPost(postData).subscribe({
                next: (created) => {
                    console.log('Blog post created successfully:', created);
                    this.isEditing = false;
                    this.isSaving = false;
                    this.isNewPost = false;
                    
                    // Emit event and show toast in next tick
                    setTimeout(() => {
                        this.onCreate.emit(created);
                        this.toast.success('Blog post created successfully!');
                    }, 0);
                },
                error: (err) => {
                    console.error('Failed to create blog post:', err);
                    this.handleError(err);
                }
            });
        } else if (this.post) {
            this.blogService.updateBlogPost(this.post.id, postData).subscribe({
                next: (updated) => {
                    console.log('Blog post updated successfully:', updated);
                    this.isEditing = false;
                    this.isSaving = false;
                    
                    // Emit event and show toast in next tick
                    setTimeout(() => {
                        this.onUpdate.emit();
                        this.toast.success('Blog post updated successfully!');
                    }, 0);
                },
                error: (err) => {
                    console.error('Failed to update blog post:', err);
                    this.handleError(err);
                }
            });
        }
    }

    deletePost() {
        if (!this.post || this.isSaving) return;

        if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            return;
        }

        this.isSaving = true;

        this.blogService.deleteBlogPost(this.post.id).subscribe({
            next: () => {
                console.log('Blog post deleted successfully');
                this.isEditing = false;
                this.isSaving = false;
                
                // Emit event and show toast in next tick
                setTimeout(() => {
                    this.onDelete.emit(this.post!.id);
                    this.toast.success('Blog post deleted successfully!');
                }, 0);
            },
            error: (err) => {
                console.error('Failed to delete blog post:', err);
                this.handleError(err);
            }
        });
    }

    private handleError(err: any) {
        let errorMessage = 'An error occurred. ';
        
        if (err.status === 401) {
            errorMessage = 'Your session has expired. Please log in again to continue.';
        } else if (err.error?.message) {
            errorMessage += err.error.message;
        } else {
            errorMessage += 'Please try again.';
        }
        
        this.isSaving = false;
        this.cdr.detectChanges();
        
        setTimeout(() => {
            this.toast.error(errorMessage);
        }, 0);
    }
}
