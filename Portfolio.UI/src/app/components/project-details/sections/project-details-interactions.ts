import { Component, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Heart, Share2, User, X, Facebook, Twitter, Linkedin, Link, MessageCircle, CheckCircle, AlertCircle, Eye } from 'lucide-angular';
import { ProjectEntry } from '../../../models';
import { ProjectService } from '../../../services/project.service';

@Component({
    selector: 'app-project-details-interactions',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule, TranslateModule],
    template: `
    <div *ngIf="project" class="space-y-32">
        <!-- Toast Notifications -->
        <div *ngIf="toastMessage" 
            class="fixed top-24 right-6 z-50 animate-fade-in-up">
            <div [class]="'flex items-center gap-3 px-6 py-4 rounded-xl border shadow-2xl ' + 
                (toastType === 'success' ? 'bg-green-950 border-green-800 text-green-100' : 
                 toastType === 'error' ? 'bg-red-950 border-red-800 text-red-100' : 
                 'bg-blue-950 border-blue-800 text-blue-100')">
                <lucide-icon [img]="toastType === 'success' ? CheckCircleIcon : AlertCircleIcon" 
                    class="w-5 h-5"></lucide-icon>
                <span class="font-bold text-sm">{{ toastMessage }}</span>
                <button (click)="closeToast()" class="ml-4 hover:opacity-70 transition-opacity">
                    <lucide-icon [img]="XIcon" class="w-4 h-4"></lucide-icon>
                </button>
            </div>
        </div>

        <!-- Share Modal -->
        <div *ngIf="showShareModal" 
            class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-fade-in"
            (click)="closeShareModal()">
            <div class="bg-zinc-950 border border-zinc-800 rounded-xl p-8 max-w-md w-full space-y-6 animate-scale-in"
                (click)="$event.stopPropagation()">
                <div class="flex items-center justify-between">
                    <h3 class="text-xl font-black italic uppercase tracking-tighter text-white">{{ 'projectDetails.interactions.shareProject' | translate }}</h3>
                    <button (click)="closeShareModal()" 
                        class="text-zinc-400 hover:text-white transition-colors">
                        <lucide-icon [img]="XIcon" class="w-6 h-6"></lucide-icon>
                    </button>
                </div>

                <div class="grid grid-cols-2 gap-6">
                    <button (click)="shareToFacebook()" 
                        class="flex flex-col items-center gap-3 bg-zinc-900 hover:bg-blue-600 border border-zinc-800 hover:border-blue-600 rounded-xl p-6 transition-all group">
                        <lucide-icon [img]="FacebookIcon" class="w-8 h-8 text-blue-500 group-hover:text-white"></lucide-icon>
                        <span class="text-xs font-black uppercase text-zinc-400 group-hover:text-white">Facebook</span>
                    </button>

                    <button (click)="shareToTwitter()" 
                        class="flex flex-col items-center gap-3 bg-zinc-900 hover:bg-sky-500 border border-zinc-800 hover:border-sky-500 rounded-xl p-6 transition-all group">
                        <lucide-icon [img]="TwitterIcon" class="w-8 h-8 text-sky-400 group-hover:text-white"></lucide-icon>
                        <span class="text-xs font-black uppercase text-zinc-400 group-hover:text-white">Twitter</span>
                    </button>

                    <button (click)="shareToLinkedIn()" 
                        class="flex flex-col items-center gap-3 bg-zinc-900 hover:bg-blue-700 border border-zinc-800 hover:border-blue-700 rounded-xl p-6 transition-all group">
                        <lucide-icon [img]="LinkedinIcon" class="w-8 h-8 text-blue-600 group-hover:text-white"></lucide-icon>
                        <span class="text-xs font-black uppercase text-zinc-400 group-hover:text-white">LinkedIn</span>
                    </button>

                    <button (click)="shareToWhatsApp()" 
                        class="flex flex-col items-center gap-3 bg-zinc-900 hover:bg-green-600 border border-zinc-800 hover:border-green-600 rounded-xl p-6 transition-all group">
                        <lucide-icon [img]="MessageCircleIcon" class="w-8 h-8 text-green-500 group-hover:text-white"></lucide-icon>
                        <span class="text-xs font-black uppercase text-zinc-400 group-hover:text-white">WhatsApp</span>
                    </button>
                </div>

                <div class="pt-4 border-t border-zinc-800">
                    <div class="flex gap-3">
                        <input readonly [value]="shareUrl" 
                            class="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-400 text-sm">
                        <button (click)="copyLink()" 
                            class="bg-white text-black px-6 py-3 rounded-xl font-black text-xs uppercase hover:bg-red-600 hover:text-white transition-all">
                            <lucide-icon [img]="LinkIcon" class="w-4 h-4"></lucide-icon>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Discussion -->
        <section class="space-y-16">
            <h2 class="text-2xl font-black italic uppercase tracking-tighter">{{ 'projectDetails.interactions.discussion' | translate }}</h2>

            <!-- User Info Form (shown if not set) -->
            <div *ngIf="!userName" class="bg-zinc-950 border border-zinc-900 rounded-xl p-8 space-y-6">
                <div class="flex items-center gap-3 mb-4">
                    <lucide-icon [img]="UserIcon" class="w-5 h-5 text-red-600"></lucide-icon>
                    <h3 class="text-sm font-black uppercase text-white">{{ 'projectDetails.interactions.joinDiscussion' | translate }}</h3>
                </div>
                
                <div class="space-y-4">
                    <div>
                        <label for="comment-user-name" class="block text-[10px] font-black uppercase text-zinc-500 mb-2">{{ 'projectDetails.interactions.yourName' | translate }}</label>
                        <input 
                            type="text"
                            id="comment-user-name"
                            name="userName"
                            [(ngModel)]="tempUserName"
                            [placeholder]="'projectDetails.interactions.enterName' | translate"
                            autocomplete="name"
                            class="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:border-red-600 outline-none transition-colors">
                    </div>
                    
                    <div>
                        <label class="block text-[10px] font-black uppercase text-zinc-500 mb-3">{{ 'projectDetails.interactions.chooseAvatar' | translate }}</label>
                        <div class="flex gap-4">
                            <button 
                                (click)="selectGender('male')"
                                [class.ring-2]="tempGender === 'male'"
                                [class.ring-red-600]="tempGender === 'male'"
                                class="flex flex-col items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl p-4 transition-all group">
                                <img [src]="maleAvatar" class="w-16 h-16 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all">
                                <span class="text-[10px] font-black uppercase text-zinc-400 group-hover:text-white">{{ 'projectDetails.interactions.male' | translate }}</span>
                            </button>
                            
                            <button 
                                (click)="selectGender('female')"
                                [class.ring-2]="tempGender === 'female'"
                                [class.ring-red-600]="tempGender === 'female'"
                                class="flex flex-col items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl p-4 transition-all group">
                                <img [src]="femaleAvatar" class="w-16 h-16 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all">
                                <span class="text-[10px] font-black uppercase text-zinc-400 group-hover:text-white">{{ 'projectDetails.interactions.female' | translate }}</span>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="flex justify-end pt-2">
                    <button 
                        (click)="saveUserInfo()"
                        [disabled]="!tempUserName || !tempGender"
                        [class.opacity-50]="!tempUserName || !tempGender"
                        [class.cursor-not-allowed]="!tempUserName || !tempGender"
                        class="bg-white text-black px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-lg disabled:hover:bg-white disabled:hover:text-black">
                        {{ 'projectDetails.interactions.continue' | translate }}
                    </button>
                </div>
            </div>

            <!-- Comment Form (shown after user info is set) -->
            <div *ngIf="userName" class="flex gap-6">
                <img [src]="userAvatar" class="w-14 h-14 rounded-xl object-cover shrink-0 grayscale">
                <div class="flex-1 space-y-4">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-xs font-black text-zinc-400">{{ 'projectDetails.interactions.commentingAs' | translate }} <span class="text-white">{{ userName }}</span></span>
                        <button 
                            (click)="changeUser()"
                            class="text-[10px] font-black uppercase text-zinc-600 hover:text-red-600 transition-colors">
                            {{ 'projectDetails.interactions.change' | translate }}
                        </button>
                    </div>
                    <label for="comment-text" class="sr-only">{{ 'projectDetails.interactions.yourComment' | translate }}</label>
                    <textarea 
                        id="comment-text"
                        name="commentText"
                        [(ngModel)]="commentText"
                        [placeholder]="'projectDetails.interactions.joinConversation' | translate"
                        autocomplete="off"
                        class="w-full bg-zinc-950 border border-zinc-900 rounded-xl p-6 text-white text-sm focus:border-red-600 outline-none transition-colors min-h-[120px]"></textarea>
                    <div class="flex justify-end">
                        <button 
                            (click)="postComment()"
                            [disabled]="!commentText.trim() || isPosting"
                            [class.opacity-50]="!commentText.trim() || isPosting"
                            [class.cursor-not-allowed]="!commentText.trim() || isPosting"
                            class="bg-white text-black px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-lg disabled:hover:bg-white disabled:hover:text-black">
                            {{ isPosting ? ('projectDetails.interactions.posting' | translate) : ('projectDetails.interactions.postComment' | translate) }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Comments List -->
            <div class="space-y-12">
                <div *ngIf="!project.comments || project.comments.length === 0" class="text-center py-12">
                    <p class="text-zinc-600 text-sm font-medium">{{ 'projectDetails.interactions.noComments' | translate }}</p>
                </div>
                
                <div *ngFor="let comment of project.comments" class="flex gap-6 animate-fade-in-up">
                    <img [src]="comment.avatarUrl" class="w-14 h-14 rounded-xl object-cover shrink-0 grayscale hover:grayscale-0 transition-all">
                    <div class="flex-1 space-y-3">
                        <div class="flex items-center gap-4">
                            <h4 class="font-black text-zinc-100 text-sm italic uppercase">{{ comment.author }}</h4>
                            <span class="text-[10px] text-zinc-600 font-bold">{{ comment.date }}</span>
                        </div>
                        <p class="text-zinc-400 text-sm leading-relaxed font-medium">{{ comment.content }}</p>
                        <div class="flex items-center gap-4 pt-2">
                            <button 
                                (click)="likeComment(comment.id)"
                                [disabled]="likingComments.has(comment.id)"
                                class="flex items-center gap-2 bg-zinc-900 hover:bg-red-600 border border-zinc-800 hover:border-red-600 px-4 py-2 rounded-lg transition-all group disabled:opacity-50 disabled:cursor-not-allowed">
                                <lucide-icon [img]="HeartIcon" class="w-3 h-3 text-red-600 group-hover:text-white transition-colors"></lucide-icon>
                                <span class="text-[10px] font-black uppercase text-zinc-400 group-hover:text-white">{{ comment.likes }}</span>
                            </button>
                            <button 
                                *ngIf="userName"
                                (click)="startReply(comment.id)"
                                class="text-[10px] font-black uppercase text-zinc-600 hover:text-white transition-colors">
                                {{ 'projectDetails.interactions.reply' | translate }}
                            </button>
                        </div>

                        <!-- Reply Form -->
                        <div *ngIf="replyingTo === comment.id && userName" class="mt-4 pl-6 border-l-2 border-zinc-800">
                            <div class="flex gap-4">
                                <img [src]="userAvatar" class="w-10 h-10 rounded-lg object-cover shrink-0 grayscale">
                                <div class="flex-1 space-y-3">
                                    <label [attr.for]="'reply-text-' + comment.id" class="sr-only">{{ 'projectDetails.interactions.yourReply' | translate }}</label>
                                    <textarea 
                                        [attr.id]="'reply-text-' + comment.id"
                                        [attr.name]="'replyText-' + comment.id"
                                        [(ngModel)]="replyText"
                                        [placeholder]="'projectDetails.interactions.writeReply' | translate"
                                        autocomplete="off"
                                        class="w-full bg-zinc-950 border border-zinc-900 rounded-lg p-4 text-white text-sm focus:border-red-600 outline-none transition-colors min-h-[80px]"></textarea>
                                    <div class="flex justify-end gap-3">
                                        <button 
                                            (click)="cancelReply()"
                                            class="px-6 py-2 rounded-lg text-[10px] font-black uppercase text-zinc-400 hover:text-white transition-colors">
                                            {{ 'projectDetails.interactions.cancel' | translate }}
                                        </button>
                                        <button 
                                            (click)="postReply(comment.id)"
                                            [disabled]="!replyText.trim() || isPostingReply"
                                            [class.opacity-50]="!replyText.trim() || isPostingReply"
                                            [class.cursor-not-allowed]="!replyText.trim() || isPostingReply"
                                            class="bg-white text-black px-6 py-2 rounded-lg font-black text-[10px] uppercase hover:bg-red-600 hover:text-white transition-all disabled:hover:bg-white disabled:hover:text-black">
                                            {{ isPostingReply ? ('projectDetails.interactions.posting' | translate) : ('projectDetails.interactions.postReply' | translate) }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Replies List -->
                        <div *ngIf="comment.replies && comment.replies.length > 0" class="mt-6 pl-6 border-l-2 border-zinc-800 space-y-6">
                            <div *ngFor="let reply of comment.replies" class="flex gap-4">
                                <img [src]="reply.avatarUrl" class="w-10 h-10 rounded-lg object-cover shrink-0 grayscale hover:grayscale-0 transition-all">
                                <div class="flex-1 space-y-2">
                                    <div class="flex items-center gap-3">
                                        <h5 class="font-black text-zinc-200 text-xs italic uppercase">{{ reply.author }}</h5>
                                        <span class="text-[9px] text-zinc-600 font-bold">{{ reply.date }}</span>
                                    </div>
                                    <p class="text-zinc-400 text-sm leading-relaxed font-medium">{{ reply.content }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
  `
})
export class ProjectDetailsInteractionsComponent implements OnChanges {
    private projectService = inject(ProjectService);
    
    @Input() project?: ProjectEntry;
    @Input() triggerShare: boolean = false;
    @Output() onReact = new EventEmitter<void>();
    @Output() onShare = new EventEmitter<void>();
    @Output() onCommentAdded = new EventEmitter<void>();
    
    HeartIcon = Heart;
    ShareIcon = Share2;
    UserIcon = User;
    XIcon = X;
    FacebookIcon = Facebook;
    TwitterIcon = Twitter;
    LinkedinIcon = Linkedin;
    LinkIcon = Link;
    MessageCircleIcon = MessageCircle;
    CheckCircleIcon = CheckCircle;
    AlertCircleIcon = AlertCircle;
    EyeIcon = Eye;

    // Share modal
    showShareModal = false;
    shareUrl = '';

    // Toast notification
    toastMessage = '';
    toastType: 'success' | 'error' | 'info' = 'info';
    private toastTimeout?: any;

    // User info
    userName: string = '';
    userAvatar: string = '';
    tempUserName: string = '';
    tempGender: 'male' | 'female' | '' = '';
    
    // Avatar URLs
    maleAvatar = '/Male.png';
    femaleAvatar = '/Female.png';
    
    // Comment state
    commentText: string = '';
    isPosting: boolean = false;
    likingComments = new Set<string>();
    
    // Reply state
    replyingTo: string | null = null;
    replyText: string = '';
    isPostingReply: boolean = false;

    ngOnInit() {
        // Load user info from localStorage
        const savedName = localStorage.getItem('portfolio_comment_name');
        const savedAvatar = localStorage.getItem('portfolio_comment_avatar');
        if (savedName && savedAvatar) {
            this.userName = savedName;
            this.userAvatar = savedAvatar;
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['triggerShare'] && changes['triggerShare'].currentValue === true) {
            this.openShareModal();
        }
    }

    // Toast methods
    showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
        // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
            this.toastMessage = message;
            this.toastType = type;
            
            if (this.toastTimeout) {
                clearTimeout(this.toastTimeout);
            }
            
            this.toastTimeout = setTimeout(() => {
                this.closeToast();
            }, 5000);
        }, 0);
    }

    closeToast() {
        this.toastMessage = '';
        if (this.toastTimeout) {
            clearTimeout(this.toastTimeout);
        }
    }

    // Share methods
    openShareModal() {
        this.shareUrl = window.location.href;
        this.showShareModal = true;
        this.onShare.emit();
    }

    closeShareModal() {
        this.showShareModal = false;
    }

    shareToFacebook() {
        const url = encodeURIComponent(this.shareUrl);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        this.showToast('Opening Facebook...', 'info');
    }

    shareToTwitter() {
        const url = encodeURIComponent(this.shareUrl);
        const text = encodeURIComponent(this.project?.title || 'Check out this project!');
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
        this.showToast('Opening Twitter...', 'info');
    }

    shareToLinkedIn() {
        const url = encodeURIComponent(this.shareUrl);
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
        this.showToast('Opening LinkedIn...', 'info');
    }

    shareToWhatsApp() {
        const url = encodeURIComponent(this.shareUrl);
        const text = encodeURIComponent(this.project?.title || 'Check out this project!');
        window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
        this.showToast('Opening WhatsApp...', 'info');
    }

    copyLink() {
        navigator.clipboard.writeText(this.shareUrl).then(() => {
            this.showToast('Link copied to clipboard!', 'success');
        }).catch(() => {
            this.showToast('Failed to copy link', 'error');
        });
    }

    selectGender(gender: 'male' | 'female') {
        this.tempGender = gender;
    }

    saveUserInfo() {
        if (!this.tempUserName || !this.tempGender) return;
        
        this.userName = this.tempUserName;
        this.userAvatar = this.tempGender === 'male' ? this.maleAvatar : this.femaleAvatar;
        
        // Save to localStorage
        localStorage.setItem('portfolio_comment_name', this.userName);
        localStorage.setItem('portfolio_comment_avatar', this.userAvatar);
        
        this.showToast('Profile saved! You can now comment.', 'success');
    }

    changeUser() {
        this.userName = '';
        this.userAvatar = '';
        this.tempUserName = '';
        this.tempGender = '';
        localStorage.removeItem('portfolio_comment_name');
        localStorage.removeItem('portfolio_comment_avatar');
        this.showToast('User profile cleared', 'info');
    }

    postComment() {
        if (!this.project || !this.commentText.trim() || this.isPosting) return;

        console.log('Project object:', this.project);
        console.log('Project ID:', this.project.id);
        console.log('Project ID type:', typeof this.project.id);

        if (!this.project.id) {
            this.showToast('Cannot post comment: Project ID is missing', 'error');
            return;
        }

        this.isPosting = true;
        const comment = {
            author: this.userName,
            avatarUrl: this.userAvatar || '',
            content: this.commentText.trim()
        };

        console.log('Posting comment to project ID:', this.project.id);
        console.log('Comment data:', comment);

        this.projectService.addComment(this.project.id, comment).subscribe({
            next: (newComment) => {
                console.log('Comment posted successfully:', newComment);
                if (this.project) {
                    if (!this.project.comments) {
                        this.project.comments = [];
                    }
                    this.project.comments.unshift(newComment);
                    this.commentText = '';
                    this.onCommentAdded.emit();
                    this.showToast('Comment posted successfully!', 'success');
                }
                this.isPosting = false;
            },
            error: (err) => {
                console.error('Failed to post comment - Full error:', err);
                let errorMessage = 'Failed to post comment. ';
                
                if (err.status === 0) {
                    errorMessage = 'Cannot connect to server. Make sure the API is running.';
                } else if (err.status === 404) {
                    errorMessage = 'Project not found. Please refresh the page.';
                } else if (err.error?.message) {
                    errorMessage = err.error.message;
                } else if (err.message) {
                    errorMessage = err.message;
                } else {
                    errorMessage = 'Unknown error occurred.';
                }
                
                this.showToast(errorMessage, 'error');
                this.isPosting = false;
            }
        });
    }

    likeComment(commentId: string) {
        if (!this.project || this.likingComments.has(commentId)) return;

        this.likingComments.add(commentId);
        this.projectService.likeComment(this.project.id, commentId).subscribe({
            next: (updatedComment) => {
                if (this.project) {
                    const comment = this.project.comments?.find(c => c.id === commentId);
                    if (comment) {
                        comment.likes = updatedComment.likes;
                        this.showToast('Comment liked!', 'success');
                    }
                }
                this.likingComments.delete(commentId);
            },
            error: (err) => {
                console.error('Failed to like comment:', err);
                this.showToast('Failed to like comment', 'error');
                this.likingComments.delete(commentId);
            }
        });
    }

    startReply(commentId: string) {
        this.replyingTo = commentId;
        this.replyText = '';
    }

    cancelReply() {
        this.replyingTo = null;
        this.replyText = '';
    }

    postReply(commentId: string) {
        if (!this.project || !this.replyText.trim() || this.isPostingReply) return;

        this.isPostingReply = true;
        const reply = {
            author: this.userName,
            avatarUrl: this.userAvatar || '',
            content: this.replyText.trim()
        };

        this.projectService.addReply(this.project.id, commentId, reply).subscribe({
            next: (updatedComment) => {
                console.log('Reply posted successfully:', updatedComment);
                if (this.project) {
                    const comment = this.project.comments?.find(c => c.id === commentId);
                    if (comment) {
                        comment.replies = updatedComment.replies || [];
                        this.showToast('Reply posted successfully!', 'success');
                    }
                }
                this.replyingTo = null;
                this.replyText = '';
                this.isPostingReply = false;
            },
            error: (err) => {
                console.error('Failed to post reply:', err);
                this.showToast('Failed to post reply', 'error');
                this.isPostingReply = false;
            }
        });
    }
}
