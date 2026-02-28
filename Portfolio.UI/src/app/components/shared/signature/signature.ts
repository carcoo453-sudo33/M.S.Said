import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, CheckCircle, Edit3, X, Save } from 'lucide-angular';
import { BioEntry } from '../../../models';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../services/auth.service';
import { ProfileService } from '../../../services/profile.service';
import { ToastService } from '../../../services/toast.service';
import { TranslationService } from '../../../services/translation.service';

@Component({
    selector: 'app-shared-signature',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    template: `
    <section *ngIf="bio" class="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 mt-2 relative overflow-hidden">
        
        <!-- Animated Background Elements -->
        <div class="absolute inset-0 pointer-events-none opacity-30">
            <div class="absolute top-0 left-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-float"></div>
            <div class="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed"></div>
        </div>
        
        <!-- Edit Button -->
        <button *ngIf="auth.isLoggedIn()" (click)="openEditModal()"
            class="absolute top-4 z-10 w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center hover:scale-110 hover:text-red-500 transition-all"
            [ngClass]="isArabic() ? 'left-4' : 'right-4'">
            <lucide-icon [img]="EditIcon" class="w-3.5 h-3.5"></lucide-icon>
        </button>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-center relative z-10">
            <!-- Image Column with Enhanced Animations -->
            <div class="lg:col-span-4 relative group mx-auto w-full max-w-xs lg:max-w-none animate-fade-in-up"
                 [ngClass]="isArabic() ? 'lg:order-2' : 'lg:order-1'">
                <!-- Animated Background Shape -->
                <div class="absolute inset-0 bg-gradient-to-br from-red-600/20 to-purple-600/20 rounded-xl lg:rounded-[3rem] transition-all duration-700 animate-pulse-slow"
                     [ngClass]="isArabic() ? '-rotate-6 group-hover:-rotate-12 group-hover:scale-105' : 'rotate-6 group-hover:rotate-12 group-hover:scale-105'"></div>
                
                <!-- Floating Particles -->
                <div class="absolute -top-4 -left-4 w-3 h-3 bg-red-500/50 rounded-full animate-float-particle"></div>
                <div class="absolute top-1/4 -right-4 w-2 h-2 bg-purple-500/50 rounded-full animate-float-particle-delayed"></div>
                <div class="absolute bottom-1/4 -left-6 w-2 h-2 bg-blue-500/50 rounded-full animate-float-particle-slow"></div>
                
                <!-- Main Image -->
                <img [src]="getAvatarUrl()" [alt]="bio.name"
                    class="relative w-full aspect-square object-cover rounded-xl lg:rounded-[3rem] border-4 border-white dark:border-zinc-800 shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-[1.02]">
                
                <!-- Badge with Animation -->
                <div class="absolute -bottom-4 w-20 h-20 lg:w-24 lg:h-24 bg-zinc-950 rounded-full flex items-center justify-center border-4 border-white dark:border-zinc-800 shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500"
                     [ngClass]="isArabic() ? '-left-4 lg:-left-6' : '-right-4 lg:-right-6'">
                    <span class="text-white font-black text-lg lg:text-xl italic uppercase tracking-tighter animate-pulse">M.S</span>
                </div>
            </div>
            
            <!-- Content Column with Staggered Animations -->
            <div class="lg:col-span-8 space-y-6 lg:space-y-8"
                 [ngClass]="isArabic() ? 'lg:order-1' : 'lg:order-2'">
                
                <!-- Name and Title with Gradient Animation -->
                <div class="animate-fade-in-up">
                    <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black dark:text-white text-zinc-900 tracking-tighter uppercase leading-tight break-words"
                        [ngClass]="isArabic() ? 'text-center lg:text-right' : 'text-center lg:text-left'"
                        [attr.dir]="isArabic() ? 'rtl' : 'ltr'">
                        <span class="inline-block hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-red-600 hover:to-purple-600 transition-all duration-500">
                            {{ getSignatureName() }}
                        </span>
                    </h2>
                    <p class="text-zinc-400 text-lg md:text-xl lg:text-2xl font-bold mt-2 animate-fade-in animation-delay-200"
                       [ngClass]="isArabic() ? 'text-center lg:text-right' : 'text-center lg:text-left'"
                       [attr.dir]="isArabic() ? 'rtl' : 'ltr'">
                        {{ getSignatureSubtitle() }}
                    </p>
                </div>
                
                <!-- Role Badge -->
                <div class="animate-fade-in-up animation-delay-200">
                    <p class="text-red-600 font-bold text-[10px] uppercase tracking-[0.4em] lg:tracking-[0.6em] inline-block relative"
                       [ngClass]="isArabic() ? 'text-center lg:text-right' : 'text-center lg:text-left'"
                       [attr.dir]="isArabic() ? 'rtl' : 'ltr'">
                        {{ getSignatureRole() }}
                        <span class="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-red-600 to-transparent animate-expand-width"></span>
                    </p>
                </div>
                
                <!-- Quote with Border Animation -->
                <div *ngIf="getQuote()" class="animate-fade-in-up animation-delay-400">
                    <p class="text-zinc-500 dark:text-zinc-400 text-sm md:text-base leading-relaxed italic relative"
                       [attr.dir]="isArabic() ? 'rtl' : 'ltr'"
                       [ngClass]="isArabic() ? 'pr-6 lg:pr-8' : 'pl-6 lg:pl-8'">
                        <span class="absolute top-0 h-full w-0.5 bg-gradient-to-b from-transparent via-red-600 to-transparent animate-pulse-slow"
                              [ngClass]="isArabic() ? 'right-0' : 'left-0'"></span>
                        "{{ getQuote() }}"
                    </p>
                </div>
                
                <!-- Verified Badge with Glow Effect -->
                <div class="flex flex-wrap gap-6 lg:gap-8 animate-fade-in-up animation-delay-600"
                     [ngClass]="isArabic() ? 'justify-center lg:justify-end' : 'justify-center lg:justify-start'">
                    <div class="flex items-center gap-3 lg:gap-4 group cursor-default">
                        <div class="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 shrink-0 group-hover:bg-green-500/20 group-hover:scale-110 transition-all duration-300 relative">
                            <lucide-icon [img]="CheckIcon" class="w-5 h-5 relative z-10"></lucide-icon>
                            <span class="absolute inset-0 rounded-xl bg-green-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        </div>
                        <span class="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-green-500 transition-colors duration-300"
                              [attr.dir]="isArabic() ? 'rtl' : 'ltr'">{{ getVerifiedText() }}</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Edit Modal -->
    <div *ngIf="showEditModal" class="modal-overlay" (click)="closeEditModal()">
        <div class="modal-content max-w-lg" (click)="$event.stopPropagation()">
            <div class="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-5 flex items-center justify-between z-10">
                <h3 class="text-base font-black dark:text-white text-zinc-900">Edit Signature Quote</h3>
                <button (click)="closeEditModal()"
                    class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-red-500 transition-all">
                    <lucide-icon [img]="XIcon" class="w-4 h-4"></lucide-icon>
                </button>
            </div>

            <div class="p-5 space-y-5 overflow-y-auto custom-scrollbar flex-1">
                <div>
                    <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Role/Badge (EN)</label>
                    <input [(ngModel)]="editForm.signatureRole" placeholder="e.g., Strategic Lead"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                </div>
                <div>
                    <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Role/Badge (AR)</label>
                    <input [(ngModel)]="editForm.signatureRole_Ar" placeholder="e.g., قائد استراتيجي" dir="rtl"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                </div>
                <div>
                    <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Name (EN)</label>
                    <input [(ngModel)]="editForm.signatureName" placeholder="e.g., Mostafa Samir Said"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                </div>
                <div>
                    <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Name (AR)</label>
                    <input [(ngModel)]="editForm.signatureName_Ar" placeholder="e.g., مصطفى سمير سعيد" dir="rtl"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                </div>
                <div>
                    <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Subtitle (EN)</label>
                    <input [(ngModel)]="editForm.signatureSubtitle" placeholder="e.g., Arch. Design"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                </div>
                <div>
                    <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Subtitle (AR)</label>
                    <input [(ngModel)]="editForm.signatureSubtitle_Ar" placeholder="e.g., تصميم معماري" dir="rtl"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                </div>
                <div>
                    <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Verified Text (EN)</label>
                    <input [(ngModel)]="editForm.signatureVerifiedText" placeholder="e.g., Verified Origin"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                </div>
                <div>
                    <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Verified Text (AR)</label>
                    <input [(ngModel)]="editForm.signatureVerifiedText_Ar" placeholder="e.g., أصل موثق" dir="rtl"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                </div>
                <div>
                    <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Quote (EN)</label>
                    <textarea [(ngModel)]="editForm.educationQuote" rows="4"
                        placeholder="Enter your signature quote..."
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all resize-none"></textarea>
                </div>
                <div>
                    <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Quote (AR)</label>
                    <textarea [(ngModel)]="editForm.educationQuote_Ar" rows="4" dir="rtl"
                        placeholder="أدخل اقتباسك التوقيعي..."
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all resize-none"></textarea>
                </div>
            </div>

            <div class="sticky bottom-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 p-5 flex items-center justify-end gap-3">
                <button (click)="closeEditModal()"
                    class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all">
                    Cancel
                </button>
                <button (click)="saveQuote()" [disabled]="isSaving"
                    class="px-8 py-2.5 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center gap-2">
                    <lucide-icon [img]="SaveIcon" class="w-3.5 h-3.5"></lucide-icon>
                    {{ isSaving ? 'Saving...' : 'Save Changes' }}
                </button>
            </div>
        </div>
    </div>
  `,
    styles: [`
        @keyframes float {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-20px) scale(1.05); }
        }
        
        @keyframes float-delayed {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(20px) scale(1.1); }
        }
        
        @keyframes float-particle {
            0%, 100% { 
                transform: translate(0, 0) scale(1);
                opacity: 0.3;
            }
            50% { 
                transform: translate(15px, -20px) scale(1.5);
                opacity: 0.7;
            }
        }
        
        @keyframes float-particle-delayed {
            0%, 100% { 
                transform: translate(0, 0) scale(1);
                opacity: 0.3;
            }
            50% { 
                transform: translate(-20px, 15px) scale(1.3);
                opacity: 0.6;
            }
        }
        
        @keyframes float-particle-slow {
            0%, 100% { 
                transform: translate(0, 0) scale(1);
                opacity: 0.2;
            }
            50% { 
                transform: translate(10px, 20px) scale(1.4);
                opacity: 0.5;
            }
        }
        
        @keyframes pulse-slow {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
        }
        
        @keyframes expand-width {
            from { width: 0%; }
            to { width: 100%; }
        }
        
        @keyframes fade-in-up {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .animate-float {
            animation: float 8s ease-in-out infinite;
        }
        
        .animate-float-delayed {
            animation: float-delayed 10s ease-in-out infinite;
        }
        
        .animate-float-particle {
            animation: float-particle 6s ease-in-out infinite;
        }
        
        .animate-float-particle-delayed {
            animation: float-particle-delayed 8s ease-in-out infinite;
        }
        
        .animate-float-particle-slow {
            animation: float-particle-slow 10s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
            animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .animate-expand-width {
            animation: expand-width 1s ease-out forwards;
        }
        
        .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out forwards;
            opacity: 0;
        }
        
        .animate-fade-in {
            animation: fade-in 0.6s ease-out forwards;
            opacity: 0;
        }
        
        .animation-delay-200 {
            animation-delay: 0.2s;
        }
        
        .animation-delay-400 {
            animation-delay: 0.4s;
        }
        
        .animation-delay-600 {
            animation-delay: 0.6s;
        }
    `]
})
export class SharedSignatureComponent {
    @Input() bio: BioEntry | null = null;
    @Input() quote: string = '';
    @Output() bioUpdated = new EventEmitter<BioEntry>();
    
    public auth = inject(AuthService);
    private profileService = inject(ProfileService);
    private toast = inject(ToastService);
    private translationService = inject(TranslationService);
    
    CheckIcon = CheckCircle;
    EditIcon = Edit3;
    XIcon = X;
    SaveIcon = Save;

    // Edit state
    showEditModal = false;
    isSaving = false;
    editForm: Partial<BioEntry> = {};

    getAvatarUrl() {
        const avatar = this.bio?.avatarUrl;
        if (!avatar) return 'https://ui-avatars.com/api/?name=' + (this.bio?.name || 'User') + '&background=f20d0d&color=fff';
        if (avatar.startsWith('http')) return avatar;
        const baseUrl = environment.apiUrl.replace('/api', '');
        return `${baseUrl}${avatar}`;
    }

    getQuote(): string {
        const currentLang = this.translationService.currentLang$();
        
        if (currentLang === 'ar' && this.bio?.educationQuote_Ar) {
            return this.bio.educationQuote_Ar;
        }
        
        return this.quote || this.bio?.educationQuote || '';
    }

    getSignatureRole(): string {
        const currentLang = this.translationService.currentLang$();
        
        if (currentLang === 'ar' && this.bio?.signatureRole_Ar) {
            return this.bio.signatureRole_Ar;
        }
        
        return this.bio?.signatureRole || 'Strategic Lead';
    }

    getSignatureName(): string {
        const currentLang = this.translationService.currentLang$();
        
        if (currentLang === 'ar' && this.bio?.signatureName_Ar) {
            return this.bio.signatureName_Ar;
        }
        
        return this.bio?.signatureName || this.bio?.name || 'Mostafa Samir Said';
    }

    getSignatureSubtitle(): string {
        const currentLang = this.translationService.currentLang$();
        
        if (currentLang === 'ar' && this.bio?.signatureSubtitle_Ar) {
            return this.bio.signatureSubtitle_Ar;
        }
        
        return this.bio?.signatureSubtitle || 'Arch. Design';
    }

    getVerifiedText(): string {
        const currentLang = this.translationService.currentLang$();
        
        if (currentLang === 'ar' && this.bio?.signatureVerifiedText_Ar) {
            return this.bio.signatureVerifiedText_Ar;
        }
        
        return this.bio?.signatureVerifiedText || 'Verified Origin';
    }

    isArabic(): boolean {
        return this.translationService.currentLang$() === 'ar';
    }

    openEditModal() {
        if (this.bio) {
            this.editForm = { ...this.bio };
        } else {
            this.editForm = {};
        }
        this.showEditModal = true;
    }

    closeEditModal() {
        this.showEditModal = false;
    }

    saveQuote() {
        if (!this.bio?.id) {
            this.toast.error('Bio ID is missing. Please refresh the page.');
            return;
        }

        this.isSaving = true;
        this.profileService.updateBio(this.bio.id, this.editForm as BioEntry).subscribe({
            next: (updatedBio: BioEntry) => {
                this.bio = updatedBio;
                this.bioUpdated.emit(updatedBio);
                this.showEditModal = false;
                this.isSaving = false;
                this.toast.success('Signature quote updated successfully');
            },
            error: (err) => {
                this.isSaving = false;
                this.toast.error('Failed to save: ' + (err.error?.message || err.statusText || 'Server error'));
            }
        });
    }
}
