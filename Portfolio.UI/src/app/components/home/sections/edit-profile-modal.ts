import { Component, Input, Output, EventEmitter, inject, OnChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Upload as LucideUpload, X } from 'lucide-angular';
import { BioEntry } from '../../../models';
import { ProfileService } from '../../../services/profile.service';
import { HomeService } from '../../../services/home.service';
import { ToastService } from '../../../services/toast.service';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-edit-profile-modal',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    template: `
    <!-- Edit Modal -->
    <div *ngIf="isOpen" class="modal-overall fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" (click)="onClose()">
        <div class="relative bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-2xl w-2/3 max-h-[90vh] overflow-hidden flex flex-col animate-modal-enter" (click)="$event.stopPropagation()">
            <!-- Modal Header -->
            <div class="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-5 flex items-center justify-between z-20">
                <h3 class="text-base font-black dark:text-white text-zinc-900">Edit Profile</h3>
                <button (click)="onClose()"
                    class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-red-500 transition-all">
                    <lucide-icon [img]="XIcon" class="w-4 h-4"></lucide-icon>
                </button>
            </div>

            <!-- Modal Body -->
            <div class="p-5 space-y-5 overflow-y-auto custom-scrollbar flex-1">
                <!-- Avatar Upload -->
                <div class="flex items-center gap-6 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
                    <div class="relative group">
                        <img [src]="avatarPreview || getAvatarUrl()" 
                            class="w-20 h-20 rounded-xl object-cover border-2 border-white dark:border-zinc-700 shadow-lg">
                        <div *ngIf="isUploadingAvatar" class="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
                            <div class="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                        </div>
                    </div>
                    <div class="flex-1">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2 block">Profile Photo</label>
                        <div class="flex gap-2">
                            <label class="px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-[10px] font-black uppercase tracking-widest cursor-pointer hover:border-red-500 hover:text-red-500 transition-all flex items-center gap-2">
                                <lucide-icon [img]="UploadIcon" class="w-3.5 h-3.5"></lucide-icon>
                                {{ isUploadingAvatar ? 'Uploading...' : 'Upload Photo' }}
                                <input type="file" class="hidden" (change)="onAvatarSelected($event)" accept="image/*">
                            </label>
                        </div>
                        <p class="text-zinc-400 text-[9px] mt-2">Upload from your device. Preview will show immediately.</p>
                    </div>
                </div>

                <!-- Personal Info -->
                <div>
                    <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Name (EN) *</label>
                    <input [(ngModel)]="editForm.name" type="text"
                        [class]="submitted && !editForm.name.trim() ? 'border-red-500 ring-2 ring-red-500/30' : 'border-zinc-200 dark:border-zinc-700 focus:ring-red-500/30 focus:border-red-500'"
                        class="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 transition-all border">
                    <p *ngIf="submitted && !editForm.name.trim()" class="text-red-500 text-[10px] font-bold mt-1 ms-1">Name is required</p>
                </div>
                <div>
                    <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Name (AR)</label>
                    <input [ngModel]="editForm.name_Ar" (ngModelChange)="editForm.name_Ar = $event" type="text" dir="rtl"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                </div>
                <div>
                    <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Title (EN)</label>
                    <input [(ngModel)]="editForm.title" type="text"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                </div>
                <div>
                    <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Title (AR)</label>
                    <input [ngModel]="editForm.title_Ar" (ngModelChange)="editForm.title_Ar = $event" type="text" dir="rtl"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                </div>
                <div>
                    <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Location (EN)</label>
                    <input [(ngModel)]="editForm.location" type="text"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                </div>
                <div>
                    <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Location (AR)</label>
                    <input [ngModel]="editForm.location_Ar" (ngModelChange)="editForm.location_Ar = $event" type="text" dir="rtl"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                </div>
                <div>
                    <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Email *</label>
                    <input [(ngModel)]="editForm.email" type="email"
                        [class]="submitted && !editForm.email?.trim() ? 'border-red-500 ring-2 ring-red-500/30' : 'border-zinc-200 dark:border-zinc-700 focus:ring-red-500/30 focus:border-red-500'"
                        class="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 transition-all border">
                    <p *ngIf="submitted && !editForm.email?.trim()" class="text-red-500 text-[10px] font-bold mt-1 ms-1">Email is required</p>
                </div>
                <div>
                    <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Phone</label>
                    <input [(ngModel)]="editForm.phone" type="tel"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                </div>

                <!-- Divider -->
                <div class="border-t border-zinc-200 dark:border-zinc-800"></div>

                <!-- Statistics Configuration -->
                <div>
                    <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3 block">Statistics Configuration</label>
                    <div class="space-y-3">
                        <div>
                            <label class="text-[9px] font-bold text-zinc-500 mb-1 block">Career Start Date</label>
                            <input [(ngModel)]="editForm.careerStartDate" type="date"
                                class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                            <p class="text-zinc-400 text-[9px] mt-1 ms-1">Used to calculate years of experience</p>
                        </div>
                        <div>
                            <label class="text-[9px] font-bold text-zinc-500 mb-1 block">GitHub Username</label>
                            <input [(ngModel)]="editForm.gitHubUsername" type="text" placeholder="e.g., Mostafa-SAID7"
                                class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                            <p class="text-zinc-400 text-[9px] mt-1 ms-1">Used to fetch public repository count from GitHub</p>
                        </div>
                    </div>
                </div>

                <!-- Divider -->
                <div class="border-t border-zinc-200 dark:border-zinc-800"></div>

                <!-- Tech Stack -->
                <div>
                    <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Tech Stack (comma-separated)</label>
                    <input [(ngModel)]="editForm.technicalFocusItems" type="text" placeholder="e.g., .NET, Angular, EF, MVC"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                    <p class="text-zinc-400 text-[9px] mt-1 ms-1">Separate technologies with commas (e.g., .NET, Angular, EF, MVC)</p>
                </div>

                <!-- Divider -->
                <div class="border-t border-zinc-200 dark:border-zinc-800"></div>

                <!-- Social Media URLs -->
                <div>
                    <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3 block">Social Media Links</label>
                    <div class="space-y-3">
                        <div>
                            <label class="text-[9px] font-bold text-zinc-500 mb-1 block">LinkedIn</label>
                            <input [(ngModel)]="editForm.linkedInUrl" type="text" placeholder="https://linkedin.com/in/username"
                                class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                        </div>
                        <div>
                            <label class="text-[9px] font-bold text-zinc-500 mb-1 block">GitHub</label>
                            <input [(ngModel)]="editForm.gitHubUrl" type="text" placeholder="https://github.com/username"
                                class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                        </div>
                        <div>
                            <label class="text-[9px] font-bold text-zinc-500 mb-1 block">Twitter / X</label>
                            <input [(ngModel)]="editForm.twitterUrl" type="text" placeholder="https://x.com/username"
                                class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                        </div>
                        <div>
                            <label class="text-[9px] font-bold text-zinc-500 mb-1 block">Facebook</label>
                            <input [(ngModel)]="editForm.facebookUrl" type="text" placeholder="https://facebook.com/username"
                                class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                        </div>
                        <div>
                            <label class="text-[9px] font-bold text-zinc-500 mb-1 block">Dev.to</label>
                            <input [(ngModel)]="editForm.devToUrl" type="text" placeholder="https://dev.to/username"
                                class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                        </div>
                        <div>
                            <label class="text-[9px] font-bold text-zinc-500 mb-1 block">Pinterest</label>
                            <input [(ngModel)]="editForm.pinterestUrl" type="text" placeholder="https://pinterest.com/username"
                                class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                        </div>
                        <div>
                            <label class="text-[9px] font-bold text-zinc-500 mb-1 block">Stack Overflow</label>
                            <input [(ngModel)]="editForm.stackOverflowUrl" type="text" placeholder="https://stackoverflow.com/users/id/username"
                                class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                        </div>
                        <div>
                            <label class="text-[9px] font-bold text-zinc-500 mb-1 block">WhatsApp Number</label>
                            <input [(ngModel)]="editForm.whatsAppUrl" type="text" placeholder="+1234567890"
                                class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                        </div>
                    </div>
                </div>

                <!-- Divider -->
                <div class="border-t border-zinc-200 dark:border-zinc-800"></div>

                <!-- CV Upload -->
                <div>
                    <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">CV Document (PDF)</label>
                    <div class="flex gap-2">
                        <input [(ngModel)]="editForm.cvUrl" type="text" readonly
                            class="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800/50 text-[10px] text-zinc-500 focus:outline-none cursor-not-allowed">
                        <label class="px-6 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:scale-[1.02] transition-all flex items-center gap-2">
                            <lucide-icon [img]="UploadIcon" class="w-3.5 h-3.5"></lucide-icon>
                            {{ isUploadingCV ? 'Uploading...' : 'Upload CV' }}
                            <input type="file" class="hidden" (change)="onCVSelected($event)" accept=".pdf,.doc,.docx">
                        </label>
                    </div>
                </div>
            </div>

            <!-- Modal Footer -->
            <div class="sticky bottom-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 p-5 flex items-center justify-end gap-3">
                <button (click)="onClose()"
                    class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all">
                    Cancel
                </button>
                <button (click)="onSave()" [disabled]="isSaving"
                    class="px-8 py-2.5 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center gap-2">
                    {{ isSaving ? 'Saving...' : 'Save Changes' }}
                </button>
            </div>
        </div>
    </div>
    `
})
export class EditProfileModalComponent implements OnChanges {
    private readonly profileService = inject(ProfileService);
    private readonly homeService = inject(HomeService);
    private readonly toast = inject(ToastService);
    private readonly cdr = inject(ChangeDetectorRef);

    @Input() isOpen = false;
    @Input() bio?: BioEntry;
    @Output() closeModal = new EventEmitter<void>();
    @Output() bioUpdated = new EventEmitter<BioEntry>();

    XIcon = X;
    UploadIcon = LucideUpload;

    isSaving = false;
    submitted = false;
    isUploadingAvatar = false;
    isUploadingCV = false;
    avatarPreview: string | null = null;
    editForm: BioEntry = this.getEmptyBio();

    ngOnChanges() {
        if (this.isOpen && this.bio) {
            this.editForm = { ...this.bio };
            this.avatarPreview = null;
        }
    }

    onClose() {
        this.closeModal.emit();
        this.avatarPreview = null;
    }

    onAvatarSelected(event: any) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            this.avatarPreview = reader.result as string;
            // Trigger change detection after setting preview to avoid ExpressionChangedAfterItHasBeenCheckedError
            this.cdr.markForCheck();
        };
        reader.readAsDataURL(file);

        this.isUploadingAvatar = true;
        this.profileService.uploadAvatar(file).subscribe({
            next: (res) => {
                this.editForm.avatarUrl = res.url;
                this.isUploadingAvatar = false;
                this.cdr.markForCheck();
                this.toast.success('Photo uploaded! Save to apply changes.');
            },
            error: (err) => {
                this.isUploadingAvatar = false;
                this.avatarPreview = null;
                this.cdr.markForCheck();
                this.toast.error('Upload failed: ' + (err.error?.message || 'Server error'));
            }
        });
    }

    onCVSelected(event: any) {
        const file = event.target.files[0];
        if (!file) return;

        this.isUploadingCV = true;
        this.profileService.uploadCV(file).subscribe({
            next: (res) => {
                this.editForm.cvUrl = res.url;
                this.isUploadingCV = false;
                this.cdr.markForCheck();
                this.toast.success('CV uploaded! Save to apply changes.');
            },
            error: (err) => {
                this.isUploadingCV = false;
                this.cdr.markForCheck();
                this.toast.error('CV upload failed: ' + (err.error?.message || 'Server error'));
            }
        });
    }

    onSave() {
        this.submitted = true;
        if (!this.editForm.name?.trim() || !this.editForm.email?.trim()) {
            this.toast.error('Please fill in all required fields');
            return;
        }
        
        // Generate ID if it doesn't exist (first time save)
        if (!this.editForm.id) {
            this.editForm.id = this.generateUUID();
        }
        
        // Prepare data for backend - create TechnicalFocusDto if items exist
        const bioToSave = { ...this.editForm };
        
        // Convert careerStartDate to ISO 8601 format if it's a date string
        if (bioToSave.careerStartDate && typeof bioToSave.careerStartDate === 'string') {
            // If it's in YYYY-MM-DD format, convert to ISO 8601 with time
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (dateRegex.exec(bioToSave.careerStartDate)) {
                bioToSave.careerStartDate = new Date(bioToSave.careerStartDate + 'T00:00:00Z').toISOString();
            }
        }
        
        if (bioToSave.technicalFocusItems) {
            bioToSave.technicalFocus = {
                items: bioToSave.technicalFocusItems
            } as any;
        } else {
            bioToSave.technicalFocus = undefined;
        }
        
        console.log('📤 Sending bio to backend:', bioToSave);
        
        this.isSaving = true;
        this.homeService.updateBio(this.editForm.id, bioToSave).subscribe({
            next: (updatedBio: BioEntry) => {
                console.log('📥 Received bio from backend:', updatedBio);
                // Merge API response with local form data to ensure all fields are present
                const bio = { ...this.editForm, ...updatedBio };
                this.bioUpdated.emit(bio);
                this.onClose();
                this.isSaving = false;
                this.cdr.markForCheck();
                this.toast.success('Profile updated successfully');
            },
            error: (err: any) => {
                this.isSaving = false;
                this.cdr.markForCheck();
                this.toast.error('Failed to save: ' + (err.error?.message || err.statusText || 'Server error'));
            }
        });
    }

    private generateUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replaceAll(/[xy]/g, function(c) {
            const r = Math.random() * 16;
            const v = c === 'x' ? Math.trunc(r) : (Math.trunc(r) & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    getAvatarUrl() {
        const avatar = this.bio?.avatarUrl;
        if (!avatar) {
            return 'https://ui-avatars.com/api/?name=' + (this.bio?.name || 'User') + '&background=f20d0d&color=fff';
        }
        if (avatar.startsWith('http')) {
            return avatar;
        }
        // Clean up leading slashes to avoid double slashes
        const cleanPath = avatar.startsWith('/') ? avatar.substring(1) : avatar;
        const baseUrl = environment.apiUrl.replace('/api', '').replace(/\/$/, '');
        return `${baseUrl}/${cleanPath}`;
    }

    private getEmptyBio(): BioEntry {
        // Default career start date to 3 years ago for new bios
        const threeYearsAgo = new Date();
        threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);
        
        return {
            id: '',
            name: '',
            title: '',
            description: '',
            location: '',
            email: '',
            phone: '',
            careerStartDate: threeYearsAgo.toISOString().split('T')[0],
            gitHubUsername: '',
            yearsOfExperience: '',
            projectsCompleted: '',
            codeCommits: '',
            technicalFocusItems: ''
        };
    }
}
