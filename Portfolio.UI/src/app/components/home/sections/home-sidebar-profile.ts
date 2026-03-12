import { Component, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { LucideAngularModule, Mail, MapPin, Linkedin, Github, MessageCircle, Download, Edit3, Twitter } from 'lucide-angular';
import { BioEntry } from '../../../models';
import { AuthService } from '../../../services/auth.service';
import { ProfileService } from '../../../services/profile.service';
import { ToastService } from '../../../services/toast.service';
import { TranslationService } from '../../../services/translation.service';
import { SignalRService } from '../../../services/signalr.service';
import { TranslationUtil, ImageUtil } from '../../../utils';
import { EditProfileModalComponent } from './edit-profile-modal';

@Component({
    selector: 'app-home-sidebar-profile',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, FormsModule, TranslateModule, EditProfileModalComponent],
    template: `
    <aside class="md:sticky md:top-24 lg:sticky lg:top-24 h-fit animate-fade-in-left">
        <div
            class="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden transition-all hover:shadow-xl">

            <!-- Avatar Section -->
            <div class="p-8 pb-4 flex flex-col items-center relative">
                <!-- Admin Edit Button -->
                <button *ngIf="auth.isLoggedIn()" (click)="openEditModal()"
                    class="absolute top-4 left-4 w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center hover:scale-110 hover:text-red-500 transition-all z-20">
                    <lucide-icon [img]="EditIcon" class="w-3.5 h-3.5"></lucide-icon>
                </button>

                <!-- Avatar -->
                <div class="relative mb-4">
                    <img [src]="getAvatarUrl()" [alt]="bio?.name"
                        class="w-40 h-40 rounded-xl object-cover border-4 border-white dark:border-zinc-700 shadow-xl ring-2 ring-red-500/20">
                    <!-- Online Status Indicator -->
                    <span 
                        class="absolute bottom-2 right-2 w-5 h-5 border-[3px] border-white dark:border-zinc-700 rounded-full transition-all duration-300"
                        [ngClass]="{
                            'bg-green-500 shadow-[0_0_16px_rgba(34,197,94,0.9)] animate-pulse': signalRService.adminOnlineStatus(),
                            'bg-gray-400 shadow-none': !signalRService.adminOnlineStatus()
                        }"
                        [title]="signalRService.adminOnlineStatus() ? 'Online - Available Now' : 'Offline'">
                    </span>
                </div>

                <!-- Name & Title -->
                <h2 class="text-xl font-black dark:text-white text-zinc-900 text-center mb-1.5 tracking-tight">
                    {{ translatedName }}
                </h2>
                <span
                    class="text-[#FF3B7E] font-bold text-[9px] uppercase tracking-[0.25em] bg-red-600/5 inline-block px-4 py-1.5 rounded-full border border-red-600/10 text-center">
                    {{ translatedTitle }}
                </span>
                
                <!-- Tech Stack Tags -->
                <div *ngIf="techStackArray.length > 0" class="flex flex-wrap gap-1.5 justify-center mt-3">
                    <span *ngFor="let tech of techStackArray"
                        class="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[8px] font-bold rounded-md border border-zinc-200 dark:border-zinc-700">
                        {{ tech }}
                    </span>
                </div>
            </div>

            

            <!-- Contact Info - Square Icons with Animated Tooltips -->
            <div class="px-6 pb-6 flex items-center justify-center gap-3">
                <!-- Email Icon -->
                <div *ngIf="bio?.email" class="group relative">
                    <a [href]="'mailto:' + bio?.email" 
                        class="w-10 h-10 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-300 border border-zinc-200 dark:border-zinc-700 hover:bg-red-500 hover:border-red-500 hover:shadow-[0_0_12px_rgba(239,68,68,0.4)] relative overflow-hidden">
                        <!-- Default Icon -->
                        <lucide-icon [img]="MailIcon" class="w-4 h-4 transition-all duration-300 group-hover:scale-0"></lucide-icon>
                        <!-- Hover Image -->
                        <img src="/Social/email.png" alt="Email" class="w-4 h-4 absolute transition-all duration-300 scale-0 group-hover:scale-100">
                    </a>
                    <!-- Tooltip -->
                    <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold rounded-md whitespace-nowrap opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none">
                        Email
                        <div class="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-900 dark:bg-white transform rotate-45"></div>
                    </div>
                </div>

                <!-- Location Icon - Navigate to Contact Page -->
                <div *ngIf="bio?.location || bio?.location_Ar" class="group relative">
                    <button (click)="navigateToContact()"
                        class="w-10 h-10 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-300 border border-zinc-200 dark:border-zinc-700 hover:bg-red-500 hover:border-red-500 hover:shadow-[0_0_12px_rgba(239,68,68,0.4)] relative overflow-hidden">
                        <!-- Default Icon -->
                        <lucide-icon [img]="MapPinIcon" class="w-4 h-4 transition-all duration-300 group-hover:scale-0"></lucide-icon>
                        <!-- Hover Image -->
                        <img src="/Social/maps.png" alt="Location" class="w-4 h-4 absolute transition-all duration-300 scale-0 group-hover:scale-100">
                    </button>
                    <!-- Tooltip -->
                    <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold rounded-md whitespace-nowrap opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none">
                        Location
                        <div class="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-900 dark:bg-white transform rotate-45"></div>
                    </div>
                </div>

                <!-- WhatsApp Icon -->
                <div *ngIf="bio?.whatsAppUrl" class="group relative">
                    <a [href]="getWhatsAppUrl()" target="_blank"
                        class="w-10 h-10 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-300 border border-zinc-200 dark:border-zinc-700 hover:bg-red-500 hover:border-red-500 hover:shadow-[0_0_12px_rgba(239,68,68,0.4)] relative overflow-hidden">
                        <!-- Default Icon -->
                        <lucide-icon [img]="MessageCircleIcon" class="w-4 h-4 transition-all duration-300 group-hover:scale-0"></lucide-icon>
                        <!-- Hover Image -->
                        <img src="/Social/waht'sapp.png" alt="WhatsApp" class="w-4 h-4 absolute transition-all duration-300 scale-0 group-hover:scale-100">
                    </a>
                    <!-- Tooltip -->
                    <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold rounded-md whitespace-nowrap opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none">
                        WhatsApp
                        <div class="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-900 dark:bg-white transform rotate-45"></div>
                    </div>
                </div>
            </div>

            <!-- Footer Socials -->
            <div class="bg-zinc-50/50 dark:bg-zinc-800/30 p-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-center gap-3 flex-wrap">
                <a *ngIf="bio?.linkedInUrl" [href]="bio?.linkedInUrl" target="_blank" 
                    class="w-12 h-12 bg-white dark:bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-500 border border-zinc-200 dark:border-zinc-800 hover:-rotate-12 hover:scale-110 hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:shadow-[0_0_20px_rgba(10,102,194,0.5)]">
                    <lucide-icon [img]="LinkedinIcon" class="w-5 h-5"></lucide-icon>
                </a>
                <a *ngIf="bio?.gitHubUrl" [href]="bio?.gitHubUrl" target="_blank" 
                    class="w-12 h-12 bg-white dark:bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-500 border border-zinc-200 dark:border-zinc-800 hover:rotate-12 hover:scale-110 hover:bg-[#333] hover:border-[#333] hover:shadow-[0_0_20px_rgba(51,51,51,0.5)]">
                    <lucide-icon [img]="GithubIcon" class="w-5 h-5"></lucide-icon>
                </a>
                <a *ngIf="bio?.twitterUrl" [href]="bio?.twitterUrl" target="_blank" 
                    class="w-12 h-12 bg-white dark:bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-500 border border-zinc-200 dark:border-zinc-800 hover:rotate-12 hover:scale-110 hover:bg-[#000000] hover:border-[#000000] hover:shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                    <lucide-icon [img]="TwitterIcon" class="w-5 h-5"></lucide-icon>
                </a>
            </div>
            
            <div class="p-4">
                <a *ngIf="bio?.cvUrl" [href]="getCVUrl()" target="_blank" download
                    class="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg hover:shadow-xl dark:shadow-none">
                    <lucide-icon [img]="DownloadIcon" class="w-3.5 h-3.5"></lucide-icon>
                    {{ 'common.downloadCV' | translate }}
                </a>
            </div>
        </div>
    </aside>

    <!-- Edit Profile Modal Component -->
    <app-edit-profile-modal 
        [isOpen]="showEditModal" 
        [bio]="bio" 
        (closeModal)="closeEditModal()" 
        (bioUpdated)="onModalBioUpdated($event)">
    </app-edit-profile-modal>
    `,
    styles: []
})
export class HomeSidebarProfileComponent implements OnChanges {
    public readonly auth = inject(AuthService);
    private readonly profileService = inject(ProfileService);
    private readonly toast = inject(ToastService);
    private readonly translationService = inject(TranslationService);
    public readonly signalRService = inject(SignalRService);
    private readonly router = inject(Router);

    @Input() bio?: BioEntry;
    @Output() bioUpdated = new EventEmitter<BioEntry>();

    // Icons
    MailIcon = Mail;
    MapPinIcon = MapPin;
    LinkedinIcon = Linkedin;
    GithubIcon = Github;
    TwitterIcon = Twitter;
    MessageCircleIcon = MessageCircle;
    DownloadIcon = Download;
    EditIcon = Edit3;

    // Edit modal state
    showEditModal = false;
    
    // Cached URLs to prevent ExpressionChangedAfterItHasBeenCheckedError
    cachedAvatarUrl: string = '';
    cachedCVUrl: string | null = null;

    get translatedName(): string {
        const currentLang = this.translationService.currentLang$();
        return TranslationUtil.getTranslatedField(this.bio, 'name', currentLang);
    }

    get translatedTitle(): string {
        const currentLang = this.translationService.currentLang$();
        return TranslationUtil.getTranslatedField(this.bio, 'title', currentLang);
    }

    get translatedLocation(): string {
        const currentLang = this.translationService.currentLang$();
        return TranslationUtil.getTranslatedField(this.bio, 'location', currentLang);
    }

    get techStackArray(): string[] {
        if (!this.bio?.technicalFocusItems) return [];
        return this.bio.technicalFocusItems
            .split(',')
            .map(tech => tech.trim())
            .filter(tech => tech.length > 0);
    }

    getEmptyBio(): BioEntry {
        return {
            id: '',
            name: '',
            title: '',
            description: '',
            location: '',
            email: '',
            phone: '',
            yearsOfExperience: '',
            projectsCompleted: '',
            codeCommits: '',
            avatarUrl: '',
            linkedInUrl: '',
            gitHubUrl: '',
            whatsAppUrl: '',
            cvUrl: '',
            twitterUrl: ''
        };
    }

    ngOnChanges(changes: SimpleChanges): void {
        // Reset cached URLs when bio changes to ensure they're recalculated
        if (changes['bio']) {
            this.cachedAvatarUrl = '';
            this.cachedCVUrl = null;
        }
    }

    openEditModal() {
        this.showEditModal = true;
    }

    closeEditModal() {
        this.showEditModal = false;
    }

    onModalBioUpdated(updatedBio: BioEntry) {
        this.bio = updatedBio;
        this.cachedAvatarUrl = '';
        this.cachedCVUrl = null;
        this.bioUpdated.emit(this.bio);
    }

    getAvatarUrl() {
        // Return cached URL to prevent ExpressionChangedAfterItHasBeenCheckedError
        if (this.cachedAvatarUrl) {
            return this.cachedAvatarUrl;
        }
        
        const avatar = this.bio?.avatarUrl;
        if (!avatar) {
            this.cachedAvatarUrl = 'https://ui-avatars.com/api/?name=' + (this.bio?.name || 'User') + '&background=f20d0d&color=fff';
        } else if (avatar.startsWith('http')) {
            this.cachedAvatarUrl = avatar;
        } else {
            this.cachedAvatarUrl = ImageUtil.getFullImageUrl(avatar);
        }
        
        return this.cachedAvatarUrl;
    }

    getCVUrl() {
        // Return cached URL to prevent ExpressionChangedAfterItHasBeenCheckedError
        if (this.cachedCVUrl !== null) {
            return this.cachedCVUrl;
        }
        
        const cv = this.bio?.cvUrl;
        if (!cv) {
            this.cachedCVUrl = null;
            return null;
        }
        
        if (cv.startsWith('http')) {
            this.cachedCVUrl = cv;
        } else {
            this.cachedCVUrl = ImageUtil.getFullImageUrl(cv);
        }
        
        return this.cachedCVUrl;
    }

    getWhatsAppUrl() {
        if (!this.bio?.whatsAppUrl) return '#';
        // Remove all non-digit characters for WhatsApp API
        const cleanNumber = this.bio.whatsAppUrl.replaceAll(/\D/g, '');
        return `https://wa.me/${cleanNumber}`;
    }

    navigateToContact() {
        this.router.navigate(['/contact']);
    }
}
