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
    <section *ngIf="bio" class="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 border-t border-zinc-100 dark:border-zinc-900 mt-2 relative overflow-hidden">
        
        <!-- Edit Button -->
        <button *ngIf="auth.isLoggedIn()" (click)="openEditModal()"
            class="absolute top-4 right-4 w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center hover:scale-110 hover:text-red-500 transition-all z-10">
            <lucide-icon [img]="EditIcon" class="w-3.5 h-3.5"></lucide-icon>
        </button>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            <div class="lg:col-span-4 relative group mx-auto w-full max-w-xs lg:max-w-none">
                <div class="absolute inset-0 bg-red-600/20 rounded-3xl lg:rounded-[3rem] rotate-6 group-hover:rotate-12 transition-transform duration-700"></div>
                <img [src]="getAvatarUrl()" [alt]="bio.name"
                    class="relative w-full aspect-square object-cover rounded-3xl lg:rounded-[3rem] border-4 border-white dark:border-zinc-800 shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-700">
                <div class="absolute -bottom-4 -right-4 lg:-bottom-6 lg:-right-6 w-20 h-20 lg:w-24 lg:h-24 bg-zinc-950 rounded-full flex items-center justify-center border-4 border-white dark:border-zinc-800 shadow-xl group-hover:scale-110 transition-transform">
                    <span class="text-white font-black text-lg lg:text-xl italic uppercase tracking-tighter">M.S</span>
                </div>
            </div>
            <div class="lg:col-span-8 space-y-6 lg:space-y-8">
                <div>
                    <p class="text-red-600 font-bold text-[10px] uppercase tracking-[0.4em] lg:tracking-[0.6em] mb-3 lg:mb-4 text-center lg:text-left"
                       [attr.dir]="isArabic() ? 'rtl' : 'ltr'">
                        {{ getSignatureRole() }}
                    </p>
                    <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black dark:text-white text-zinc-900 tracking-tighter uppercase leading-tight text-center lg:text-left break-words"
                        [attr.dir]="isArabic() ? 'rtl' : 'ltr'">
                        {{ getSignatureName() }}<br>
                        <span class="text-zinc-400">{{ getSignatureSubtitle() }}</span>
                    </h2>
                </div>
                <p *ngIf="getQuote()" 
                   class="text-zinc-500 dark:text-zinc-400 text-sm md:text-base leading-relaxed italic pl-6 lg:pl-8"
                   [attr.dir]="isArabic() ? 'rtl' : 'ltr'"
                   [ngClass]="isArabic() ? 'border-r-2 pr-6 lg:pr-8 pl-0' : 'border-l-2 border-zinc-100 dark:border-zinc-800'">
                    "{{ getQuote() }}"
                </p>
                <div class="flex flex-wrap justify-center lg:justify-start gap-6 lg:gap-8">
                    <div class="flex items-center gap-3 lg:gap-4">
                        <div class="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 shrink-0">
                            <lucide-icon [img]="CheckIcon" class="w-5 h-5"></lucide-icon>
                        </div>
                        <span class="text-[10px] font-black uppercase tracking-widest text-zinc-400"
                              [attr.dir]="isArabic() ? 'rtl' : 'ltr'">{{ getVerifiedText() }}</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Edit Modal -->
    <div *ngIf="showEditModal" class="modal-overlay" (click)="closeEditModal()">
        <div class="modal-content max-w-lg" (click)="$event.stopPropagation()">
            <div class="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 p-5 flex items-center justify-between z-10">
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

            <div class="sticky bottom-0 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 p-5 flex items-center justify-end gap-3">
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
  `
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
