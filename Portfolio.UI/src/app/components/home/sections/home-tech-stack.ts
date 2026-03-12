import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { LucideAngularModule, Edit3, Image as LucideImage } from 'lucide-angular';
import { SkillEntry } from '../../../models';
import { AuthService } from '../../../services/auth.service';
import { HomeService } from '../../../services/home.service';
import { ToastService } from '../../../services/toast.service';
import { TranslationService } from '../../../services/translation.service';
import { ImageUtil, TranslationUtil } from '../../../utils';
import { HomeTechStackModalComponent } from './home-tech-stack-modal';

@Component({
    selector: 'app-home-tech-stack',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, TranslateModule, HomeTechStackModalComponent],
    template: `
    <section class="animate-fade-in-up pt-12 border-t border-zinc-200 dark:border-zinc-900 relative">
        <button *ngIf="auth.isLoggedIn()" (click)="openEditModal()"
            class="absolute top-4 right-0 w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center hover:scale-110 hover:text-red-500 transition-all z-20">
            <lucide-icon [img]="EditIcon" class="w-3.5 h-3.5"></lucide-icon>
        </button>
        <p class="text-center text-[10px] font-black uppercase tracking-[0.6em] text-zinc-400 mb-10">{{ 'home.techStack.title' | translate }}</p>
        <div class="flex flex-wrap justify-center gap-6">
            <div *ngFor="let skill of translatedSkills"
                class="w-20 h-20 bg-white dark:bg-zinc-900/40 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center group hover:border-red-600/30 hover:scale-105 transition-all cursor-pointer">
                <img *ngIf="isImageUrl(skill.icon)" [src]="getFullUrl(skill.icon)" class="w-8 h-8 object-contain mb-1.5 filter grayscale group-hover:grayscale-0 transition-all opacity-40 group-hover:opacity-100">
                <lucide-icon *ngIf="!isImageUrl(skill.icon)" [img]="ImageIcon" class="w-6 h-6 text-zinc-400 dark:text-zinc-600 group-hover:text-red-500 transition-colors mb-1.5"></lucide-icon>
                <span class="text-[9px] font-bold uppercase tracking-wide text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{{ skill.name }}</span>
            </div>
        </div>
    </section>

    <!-- Modal Component -->
    <app-home-tech-stack-modal
        [isOpen]="showEditModal"
        [skills]="skills"
        [isSaving]="isSaving"
        [isDeleting]="isDeleting"
        (close)="closeEditModal()"
        (save)="saveSkills($event)"
        (delete)="deleteSkill($event)"
        (uploadIcon)="onIconUploaded($event)">
    </app-home-tech-stack-modal>
  `
})
export class HomeTechStackComponent {
    public readonly auth = inject(AuthService);
    private readonly homeService = inject(HomeService);
    private readonly toast = inject(ToastService);
    private readonly translationService = inject(TranslationService);

    @Input() skills: SkillEntry[] = [];
    @Output() skillsUpdated = new EventEmitter<SkillEntry[]>();

    EditIcon = Edit3;
    ImageIcon = LucideImage;

    showEditModal = false;
    isSaving = false;
    isDeleting = false;

    get translatedSkills(): SkillEntry[] {
        const currentLang = this.translationService.currentLang$();
        return TranslationUtil.translateArray(this.skills, ['name'], currentLang);
    }

    isImageUrl(icon?: string): boolean {
        if (!icon) return false;
        return icon.includes('/') || icon.includes('.') || icon.startsWith('http');
    }

    getFullUrl(path?: string): string {
        return ImageUtil.getFullImageUrl(path);
    }

    openEditModal() {
        this.showEditModal = true;
    }

    closeEditModal() {
        this.showEditModal = false;
    }

    onIconUploaded(event: { index: number; url: string }) {
        // Icon upload is handled in the modal component
    }

    deleteSkill(skillId: string) {
        this.isDeleting = true;
        this.homeService.deleteSkill(skillId).subscribe({
            next: () => {
                this.skills = this.skills.filter(s => s.id !== skillId);
                this.skillsUpdated.emit(this.skills);
                this.isDeleting = false;
                this.toast.success('Skill deleted successfully');
            },
            error: (err) => {
                this.isDeleting = false;
                this.toast.error('Failed to delete: ' + (err.error?.message || err.statusText || 'Server error'));
            }
        });
    }

    saveSkills(editList: SkillEntry[]) {
        this.isSaving = true;
        console.log('💾 saveSkills called with:', editList);

        if (editList.length === 0) {
            this.skills = [];
            this.skillsUpdated.emit(this.skills);
            this.showEditModal = false;
            this.isSaving = false;
            return;
        }

        const requests = editList.map(item => {
            const isExisting = this.skills.some(s => s.id === item.id);
            console.log(`📝 ${isExisting ? 'Updating' : 'Creating'} skill:`, item.name, 'ID:', item.id);
            
            if (isExisting) {
                return this.homeService.updateSkill(item.id, item);
            } else {
                // For new items, strip out the fake frontend UUID so the backend generates a real one
                const { id, ...newItem } = item;
                return this.homeService.createSkill(newItem as SkillEntry);
            }
        });

        forkJoin(requests).subscribe({
            next: (savedSkills) => {
                console.log('✅ Saved skills response:', savedSkills);
                // Map iconPath back to icon for frontend display
                this.skills = savedSkills.map(skill => ({
                    ...skill,
                    icon: skill.iconPath || skill.icon // Use iconPath from backend, fallback to icon
                }));
                this.skillsUpdated.emit(this.skills);
                this.isSaving = false;
                this.showEditModal = false;
                this.toast.success('Tech stack saved successfully');
            },
            error: (err) => {
                this.isSaving = false;
                this.toast.error('Some skills could not be saved. Please try again.');
                console.error('Skill Save Error:', err);
            }
        });
    }
}
