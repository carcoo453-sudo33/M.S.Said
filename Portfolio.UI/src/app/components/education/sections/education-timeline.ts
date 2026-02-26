import { Component, Input, Output, EventEmitter, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { LucideAngularModule, GraduationCap, BookOpen, Award, MapPin, Edit3, X, Save, Plus, Trash2, AlertTriangle, Upload, ChevronLeft, ChevronRight } from 'lucide-angular';
import { EducationEntry } from '../../../models';
import { AuthService } from '../../../services/auth.service';
import { ProfileService } from '../../../services/profile.service';
import { ToastService } from '../../../services/toast.service';
import { TranslationService } from '../../../services/translation.service';
import { TranslationHelperService } from '../../../services/translation-helper.service';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-education-timeline',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, FormsModule],
    template: `
    <div class="relative">
        <button *ngIf="auth.isLoggedIn()" (click)="openEditModal()"
            class="absolute -top-16 right-0 w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center hover:scale-110 hover:text-red-500 transition-all z-20">
            <lucide-icon [img]="EditIcon" class="w-3.5 h-3.5"></lucide-icon>
        </button>

        <div class="space-y-12 relative before:absolute before:inset-0 before:left-1/2 before:-translate-x-1/2 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-zinc-200 before:via-zinc-300 before:to-zinc-200 dark:before:from-zinc-800 dark:before:via-zinc-700 dark:before:to-zinc-800">
            <div *ngFor="let item of education; let i = index"
                class="relative flex items-center justify-between group animate-fade-in-up"
                [style.animation-delay]="(0.1 * i) + 's'">

                <!-- Connector Icon - Centered on Timeline (Always shows category icon) -->
                <div
                    class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-14 h-14 rounded-2xl border-4 bg-white dark:bg-zinc-950 transition-all duration-500 shadow-2xl"
                    [ngClass]="{
                        'border-indigo-600 shadow-indigo-500/40 group-hover:shadow-indigo-500/70 group-hover:scale-110': item.category === 'Education',
                        'border-emerald-600 shadow-emerald-500/40 group-hover:shadow-emerald-500/70 group-hover:scale-110': item.category === 'Training',
                        'border-violet-600 shadow-violet-500/40 group-hover:shadow-violet-500/70 group-hover:scale-110': item.category === 'Certification'
                    }">
                    <div class="flex items-center justify-center w-full h-full rounded-xl transition-all duration-500"
                        [ngClass]="{
                            'text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white': item.category === 'Education',
                            'text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white': item.category === 'Training',
                            'text-violet-600 group-hover:bg-violet-600 group-hover:text-white': item.category === 'Certification'
                        }">
                        <lucide-icon *ngIf="item.category === 'Education'" [img]="GraduationCapIcon" class="w-6 h-6"></lucide-icon>
                        <lucide-icon *ngIf="item.category === 'Training'" [img]="BookOpenIcon" class="w-6 h-6"></lucide-icon>
                        <lucide-icon *ngIf="item.category === 'Certification'" [img]="AwardIcon" class="w-6 h-6"></lucide-icon>
                    </div>
                </div>

                <!-- Details Card (Left Side) -->
                <div
                    class="w-[calc(50%-3.5rem)] bg-white/90 dark:bg-zinc-900/70 p-6 rounded-2xl border-2 transition-all duration-500 backdrop-blur-xl relative hover:shadow-2xl"
                    [ngClass]="{
                        'border-indigo-500/30 group-hover:border-indigo-500/60 group-hover:shadow-indigo-500/20': item.category === 'Education',
                        'border-emerald-500/30 group-hover:border-emerald-500/60 group-hover:shadow-emerald-500/20': item.category === 'Training',
                        'border-violet-500/30 group-hover:border-violet-500/60 group-hover:shadow-violet-500/20': item.category === 'Certification'
                    }">
                    
                    <!-- Category Badge -->
                    <div class="flex items-center gap-2 mb-3 flex-wrap">
                        <span
                            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-bold tracking-widest uppercase border-2 shadow-sm"
                            [ngClass]="{
                                'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 border-indigo-500/40': item.category === 'Education',
                                'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-500/40': item.category === 'Training',
                                'bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-400 border-violet-500/40': item.category === 'Certification'
                            }">
                            <lucide-icon *ngIf="item.category === 'Education'" [img]="GraduationCapIcon" class="w-2.5 h-2.5"></lucide-icon>
                            <lucide-icon *ngIf="item.category === 'Training'" [img]="BookOpenIcon" class="w-2.5 h-2.5"></lucide-icon>
                            <lucide-icon *ngIf="item.category === 'Certification'" [img]="AwardIcon" class="w-2.5 h-2.5"></lucide-icon>
                            {{ item.category }}
                        </span>
                        <span
                            class="inline-block bg-red-50 dark:bg-red-950/30 px-3 py-1 rounded-lg text-red-700 dark:text-red-400 text-[9px] font-bold tracking-widest uppercase border-2 border-red-500/40 shadow-sm">
                            {{ item.duration }}
                        </span>
                    </div>

                    <h3 class="text-base font-black mb-2 uppercase tracking-tight leading-tight dark:text-white text-zinc-900">
                        {{ getDegree(item) }}</h3>
                    <p class="text-[10px] font-bold uppercase tracking-wide text-zinc-400 mb-3">{{ getInstitution(item) }}</p>
                    <p class="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-3" *ngIf="item.description">"{{ getDescription(item) }}"</p>
                    <div class="flex items-center gap-2 text-zinc-400 transition-colors"
                        [ngClass]="{
                            'group-hover:text-indigo-600 dark:group-hover:text-indigo-400': item.category === 'Education',
                            'group-hover:text-emerald-600 dark:group-hover:text-emerald-400': item.category === 'Training',
                            'group-hover:text-violet-600 dark:group-hover:text-violet-400': item.category === 'Certification'
                        }">
                        <lucide-icon [img]="MapPinIcon" class="w-3 h-3"></lucide-icon>
                        <span class="text-[10px] uppercase tracking-wide font-bold">{{ getLocation(item) }}</span>
                    </div>
                </div>

                <!-- Image Card (Right Side) -->
                <div
                    class="w-[calc(50%-3.5rem)] bg-white/90 dark:bg-zinc-900/70 rounded-2xl border-2 transition-all duration-500 backdrop-blur-xl relative hover:shadow-2xl overflow-hidden"
                    [class.cursor-pointer]="item.imageUrl"
                    (click)="item.imageUrl && openLightbox(item.imageUrl)"
                    [ngClass]="{
                        'border-indigo-500/30 group-hover:border-indigo-500/60 group-hover:shadow-indigo-500/20': item.category === 'Education',
                        'border-emerald-500/30 group-hover:border-emerald-500/60 group-hover:shadow-emerald-500/20': item.category === 'Training',
                        'border-violet-500/30 group-hover:border-violet-500/60 group-hover:shadow-violet-500/20': item.category === 'Certification'
                    }">
                    <!-- Image if available -->
                    <div *ngIf="item.imageUrl" class="aspect-square">
                        <img [src]="getImageUrl(item.imageUrl)" [alt]="item.institution"
                            class="w-full h-full object-cover">
                    </div>
                    <!-- Placeholder if no image -->
                    <div *ngIf="!item.imageUrl" class="aspect-square flex items-center justify-center bg-gradient-to-br"
                        [ngClass]="{
                            'from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-900/30': item.category === 'Education',
                            'from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/30': item.category === 'Training',
                            'from-violet-50 to-violet-100 dark:from-violet-950/30 dark:to-violet-900/30': item.category === 'Certification'
                        }">
                        <div class="text-center p-6">
                            <lucide-icon [img]="item.category === 'Education' ? GraduationCapIcon : item.category === 'Training' ? BookOpenIcon : AwardIcon" 
                                class="w-16 h-16 mx-auto mb-3 opacity-30"
                                [ngClass]="{
                                    'text-indigo-600': item.category === 'Education',
                                    'text-emerald-600': item.category === 'Training',
                                    'text-violet-600': item.category === 'Certification'
                                }"></lucide-icon>
                            <p class="text-xs font-bold uppercase tracking-widest text-zinc-400">No Image</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Lightbox Modal -->
    <div *ngIf="showLightbox" 
        class="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in"
        (click)="closeLightbox()">
        
        <!-- Close Button -->
        <button (click)="closeLightbox()" 
            class="absolute top-4 ltr:right-4 rtl:left-4 z-[210] w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-red-600 hover:border-red-600 transition-all group">
            <lucide-icon [img]="XIcon" class="w-6 h-6 group-hover:rotate-90 transition-transform duration-300"></lucide-icon>
        </button>

        <!-- Image Counter (only show if multiple images) -->
        <div *ngIf="getAllEducationImages().length > 1" class="absolute top-4 left-1/2 -translate-x-1/2 z-[210] px-6 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
            <span class="text-white font-black text-sm tracking-widest">
                {{ currentLightboxIndex + 1 }} / {{ getAllEducationImages().length }}
            </span>
        </div>

        <!-- Main Image Container -->
        <div class="relative w-full h-full flex items-center justify-center p-4 md:p-8 lg:p-16" (click)="$event.stopPropagation()">
            <img [src]="getImageUrl(lightboxImage)" 
                class="max-w-full max-h-full object-contain rounded-2xl shadow-2xl animate-scale-in"
                [class.animate-slide-left]="slideDirection === 'left'"
                [class.animate-slide-right]="slideDirection === 'right'">
        </div>

        <!-- Navigation Buttons (only show if multiple images) -->
        <button *ngIf="getAllEducationImages().length > 1"
            (click)="previousLightboxImage(); $event.stopPropagation()"
            class="absolute ltr:left-4 ltr:md:left-8 rtl:right-4 rtl:md:right-8 top-1/2 -translate-y-1/2 z-[210] w-14 h-14 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-red-600 hover:border-red-600 transition-all group">
            <lucide-icon [img]="ChevronLeftIcon" class="w-7 h-7 group-hover:scale-110 transition-transform"></lucide-icon>
        </button>

        <button *ngIf="getAllEducationImages().length > 1"
            (click)="nextLightboxImage(); $event.stopPropagation()"
            class="absolute ltr:right-4 ltr:md:right-8 rtl:left-4 rtl:md:left-8 top-1/2 -translate-y-1/2 z-[210] w-14 h-14 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-red-600 hover:border-red-600 transition-all group">
            <lucide-icon [img]="ChevronRightIcon" class="w-7 h-7 group-hover:scale-110 transition-transform"></lucide-icon>
        </button>

        <!-- Thumbnail Strip (only show if multiple images) -->
        <div *ngIf="getAllEducationImages().length > 1" 
            class="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-[210] max-w-[90%]"
            (click)="$event.stopPropagation()">
            <div class="overflow-x-auto no-scrollbar">
                <div class="flex gap-2 md:gap-3 px-4 py-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                    <div *ngFor="let img of getAllEducationImages(); let i = index"
                        (click)="goToLightboxImage(i)"
                        [class.ring-2]="i === currentLightboxIndex"
                        [class.ring-red-600]="i === currentLightboxIndex"
                        [class.opacity-50]="i !== currentLightboxIndex"
                        class="w-16 md:w-20 aspect-video rounded-lg overflow-hidden shrink-0 cursor-pointer hover:opacity-100 transition-all hover:scale-105 border border-white/20">
                        <img [src]="getImageUrl(img)" class="w-full h-full object-cover">
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Close Button - Red Background (Always visible) -->
        <button (click)="closeLightbox()"
            class="absolute top-20 md:top-24 ltr:right-4 ltr:md:right-8 rtl:left-4 rtl:md:left-8 z-[210] w-12 h-12 rounded-xl bg-red-600 backdrop-blur-md border border-red-500 flex items-center justify-center text-white hover:bg-red-700 transition-all group shadow-lg">
            <lucide-icon [img]="XIcon" class="w-6 h-6 group-hover:rotate-90 transition-transform duration-300"></lucide-icon>
        </button>
    </div>

    <!-- Edit Modal -->
    <div *ngIf="showEditModal" class="modal-overlay" (click)="closeEditModal()">
        <div class="modal-content max-w-2xl" (click)="$event.stopPropagation()">
            <div class="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 p-5 flex items-center justify-between z-10">
                <h3 class="text-base font-black dark:text-white text-zinc-900">Manage Education</h3>
                <div class="flex items-center gap-2">
                    <button (click)="addNewEntry()"
                        class="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-all">
                        <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon>
                    </button>
                    <button (click)="closeEditModal()"
                        class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-red-500 transition-all">
                        <lucide-icon [img]="XIcon" class="w-4 h-4"></lucide-icon>
                    </button>
                </div>
            </div>

            <div class="p-5 space-y-4 overflow-y-auto custom-scrollbar flex-1 max-h-[70vh]">
                <div *ngFor="let item of editList; let i = index"
                    class="p-4 rounded-xl border space-y-3"
                    [class]="submitted && (!item.institution.trim() || !item.degree.trim()) ? 'border-red-500/50 bg-red-600/5' : 'border-zinc-200 dark:border-zinc-700'">
                    <div class="flex items-center justify-between">
                        <span class="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Entry {{ i + 1 }}</span>
                        <button (click)="confirmDelete(i)"
                            class="w-7 h-7 rounded-lg bg-red-600/10 text-red-500 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all">
                            <lucide-icon [img]="TrashIcon" class="w-3.5 h-3.5"></lucide-icon>
                        </button>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Category *</label>
                            <select [(ngModel)]="item.category"
                                class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                                <option value="Education">Education</option>
                                <option value="Training">Training</option>
                                <option value="Certification">Certification</option>
                            </select>
                        </div>
                        <div>
                            <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Duration *</label>
                            <input [(ngModel)]="item.duration" placeholder="e.g. 2020-2024"
                                class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Institution (EN) *</label>
                            <input [(ngModel)]="item.institution" placeholder="Institution name"
                                [class]="submitted && !item.institution.trim() ? 'border-red-500 ring-2 ring-red-500/30' : 'border-zinc-200 dark:border-zinc-700 focus:ring-red-500/30 focus:border-red-500'"
                                class="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 transition-all border">
                            <p *ngIf="submitted && !item.institution.trim()" class="text-red-500 text-[10px] font-bold mt-1.5 ms-1">Institution is required</p>
                        </div>
                        <div>
                            <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Institution (AR)</label>
                            <input [(ngModel)]="item.institution_Ar" placeholder="اسم المؤسسة" dir="rtl"
                                class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Degree/Title (EN) *</label>
                            <input [(ngModel)]="item.degree" placeholder="Degree or certification title"
                                [class]="submitted && !item.degree.trim() ? 'border-red-500 ring-2 ring-red-500/30' : 'border-zinc-200 dark:border-zinc-700 focus:ring-red-500/30 focus:border-red-500'"
                                class="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 transition-all border">
                            <p *ngIf="submitted && !item.degree.trim()" class="text-red-500 text-[10px] font-bold mt-1.5 ms-1">Degree is required</p>
                        </div>
                        <div>
                            <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Degree/Title (AR)</label>
                            <input [(ngModel)]="item.degree_Ar" placeholder="الدرجة أو اللقب" dir="rtl"
                                class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Description (EN)</label>
                            <textarea [(ngModel)]="item.description" placeholder="Brief description" rows="2"
                                class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all resize-none"></textarea>
                        </div>
                        <div>
                            <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Description (AR)</label>
                            <textarea [(ngModel)]="item.description_Ar" placeholder="وصف مختصر" rows="2" dir="rtl"
                                class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all resize-none"></textarea>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Location (EN)</label>
                            <input [(ngModel)]="item.location" placeholder="City, Country"
                                class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                        </div>
                        <div>
                            <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Location (AR)</label>
                            <input [(ngModel)]="item.location_Ar" placeholder="المدينة، البلد" dir="rtl"
                                class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                        </div>
                    </div>

                    <!-- Image Upload -->
                    <div>
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Institution Logo/Image</label>
                        <div class="flex items-center gap-3">
                            <div *ngIf="item.imageUrl" class="w-16 h-16 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 overflow-hidden flex-shrink-0">
                                <img [src]="getImageUrl(item.imageUrl)" [alt]="item.institution" class="w-full h-full object-cover">
                            </div>
                            <div class="flex-1">
                                <label class="px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-[10px] font-black uppercase tracking-widest cursor-pointer hover:border-red-500 hover:text-red-500 transition-all flex items-center gap-2 w-fit">
                                    <lucide-icon [img]="UploadIcon" class="w-3.5 h-3.5"></lucide-icon>
                                    {{ uploadingImageFor === item.id ? 'Uploading...' : 'Upload Image' }}
                                    <input type="file" class="hidden" (change)="onImageSelected($event, i)" accept="image/*" [disabled]="uploadingImageFor === item.id">
                                </label>
                                <p class="text-zinc-400 text-[9px] mt-1">Upload logo or certificate image (optional)</p>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center gap-2">
                        <input type="checkbox" [(ngModel)]="item.isCompleted" [id]="'completed-' + i"
                            class="w-4 h-4 rounded border-zinc-300 text-red-600 focus:ring-red-500">
                        <label [for]="'completed-' + i" class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 cursor-pointer">Completed</label>
                    </div>
                </div>
            </div>

            <div class="sticky bottom-0 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 p-5 flex items-center justify-end gap-3">
                <button (click)="closeEditModal()"
                    class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all">Cancel</button>
                <button (click)="saveEducation()" [disabled]="isSaving"
                    class="px-8 py-2.5 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center gap-2">
                    <lucide-icon [img]="SaveIcon" class="w-3.5 h-3.5"></lucide-icon>
                    {{ isSaving ? 'Saving...' : 'Save All' }}
                </button>
            </div>
        </div>
    </div>

    <!-- Delete Confirmation -->
    <div *ngIf="deleteIndex !== null" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" (click)="deleteIndex = null"></div>
        <div class="relative bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl w-full max-w-sm p-6 text-center animate-modal-enter">
            <div class="w-14 h-14 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <lucide-icon [img]="AlertIcon" class="w-7 h-7 text-red-500"></lucide-icon>
            </div>
            <h4 class="text-base font-black dark:text-white text-zinc-900 mb-2">Delete Entry?</h4>
            <p class="text-sm text-zinc-500 mb-6">Are you sure you want to delete <strong class="text-zinc-900 dark:text-white">{{ editList[deleteIndex!]?.degree || 'this entry' }}</strong>?</p>
            <div class="flex items-center justify-center gap-3">
                <button (click)="deleteIndex = null"
                    class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-700 transition-all">Cancel</button>
                <button (click)="executeDelete()" [disabled]="isDeleting"
                    class="px-6 py-2.5 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-50">
                    {{ isDeleting ? 'Deleting...' : 'Delete' }}
                </button>
            </div>
        </div>
    </div>
  `
})
export class EducationTimelineComponent {
    public auth = inject(AuthService);
    private profileService = inject(ProfileService);
    private toast = inject(ToastService);
    public translationService = inject(TranslationService);
    public translationHelper = inject(TranslationHelperService);

    @Input() set education(value: EducationEntry[]) {
        this._education = value;
        if (value && value.length > 0) {
            console.log('=== EDUCATION DATA RECEIVED ===');
            console.log('First entry:', value[0]);
            console.log('Arabic fields:', {
                institution_Ar: value[0]?.institution_Ar,
                degree_Ar: value[0]?.degree_Ar,
                description_Ar: value[0]?.description_Ar,
                location_Ar: value[0]?.location_Ar
            });
            console.log('isRTL:', this.translationService.isRTL());
            console.log('=== END ===');
        }
    }
    get education(): EducationEntry[] {
        return this._education;
    }
    private _education: EducationEntry[] = [];
    
    @Output() educationUpdated = new EventEmitter<EducationEntry[]>();

    GraduationCapIcon = GraduationCap;
    BookOpenIcon = BookOpen;
    AwardIcon = Award;
    MapPinIcon = MapPin;
    EditIcon = Edit3;
    XIcon = X;
    SaveIcon = Save;
    PlusIcon = Plus;
    TrashIcon = Trash2;
    AlertIcon = AlertTriangle;
    UploadIcon = Upload;
    ChevronLeftIcon = ChevronLeft;
    ChevronRightIcon = ChevronRight;

    showEditModal = false;
    isSaving = false;
    isDeleting = false;
    submitted = false;
    editList: EducationEntry[] = [];
    deleteIndex: number | null = null;
    uploadingImageFor: string | null = null;
    
    // Lightbox state
    showLightbox = false;
    lightboxImage = '';
    currentLightboxIndex = 0;
    slideDirection: 'left' | 'right' | null = null;

    openEditModal() {
        this.editList = this.education.map(e => ({ ...e }));
        this.submitted = false;
        this.showEditModal = true;
    }

    closeEditModal() {
        this.showEditModal = false;
    }

    addNewEntry() {
        this.editList.push({
            id: crypto.randomUUID(),
            institution: '',
            institution_Ar: '',
            degree: '',
            degree_Ar: '',
            duration: '',
            description: '',
            description_Ar: '',
            location: '',
            location_Ar: '',
            imageUrl: '',
            isCompleted: true,
            category: 'Education'
        });
    }

    confirmDelete(index: number) {
        this.deleteIndex = index;
    }

    executeDelete() {
        if (this.deleteIndex === null) return;
        const item = this.editList[this.deleteIndex];
        
        if (item.id && this.education.some(e => e.id === item.id)) {
            this.isDeleting = true;
            this.profileService.deleteEducation(item.id).subscribe({
                next: () => {
                    this.editList.splice(this.deleteIndex!, 1);
                    this.education = [...this.editList];
                    this.educationUpdated.emit(this.education);
                    this.deleteIndex = null;
                    this.isDeleting = false;
                    this.toast.success('Education entry deleted successfully');
                },
                error: (err) => {
                    this.isDeleting = false;
                    this.deleteIndex = null;
                    this.toast.error('Failed to delete: ' + (err.error?.message || err.statusText || 'Server error'));
                }
            });
        } else {
            this.editList.splice(this.deleteIndex, 1);
            this.deleteIndex = null;
        }
    }

    saveEducation() {
        this.submitted = true;
        if (this.editList.some(item => !item.institution.trim() || !item.degree.trim())) {
            this.toast.error('Please fill in all required fields');
            return;
        }

        this.isSaving = true;

        if (this.editList.length === 0) {
            this.education = [];
            this.educationUpdated.emit(this.education);
            this.showEditModal = false;
            this.isSaving = false;
            return;
        }

        const requests = this.editList.map(item => {
            const isExisting = this.education.some(e => e.id === item.id);
            return isExisting
                ? this.profileService.updateEducation(item.id, item)
                : this.profileService.createEducation(item);
        });

        forkJoin(requests).subscribe({
            next: (savedEntries) => {
                console.log('=== EDUCATION SAVE DEBUG ===');
                console.log('Saved education entries from server:', savedEntries);
                console.log('First entry Arabic fields:', {
                    institution_Ar: savedEntries[0]?.institution_Ar,
                    degree_Ar: savedEntries[0]?.degree_Ar,
                    description_Ar: savedEntries[0]?.description_Ar,
                    location_Ar: savedEntries[0]?.location_Ar
                });
                console.log('=== END DEBUG ===');
                this.education = [...savedEntries];
                this.educationUpdated.emit(this.education);
                this.isSaving = false;
                this.showEditModal = false;
                this.toast.success('Education entries saved successfully');
            },
            error: (err) => {
                this.isSaving = false;
                this.toast.error('Some entries could not be saved');
                console.error('Education Save Error:', err);
            }
        });
    }

    // Helper methods for translated fields
    getDegree(item: EducationEntry): string {
        return this.translationHelper.getTranslatedField(item, 'degree');
    }

    getInstitution(item: EducationEntry): string {
        return this.translationHelper.getTranslatedField(item, 'institution');
    }

    getDescription(item: EducationEntry): string {
        return this.translationHelper.getTranslatedField(item, 'description');
    }

    getLocation(item: EducationEntry): string {
        return this.translationHelper.getTranslatedField(item, 'location');
    }

    // Image handling methods
    onImageSelected(event: any, index: number) {
        const file = event.target.files[0];
        if (!file) return;

        const item = this.editList[index];
        this.uploadingImageFor = item.id;

        this.profileService.uploadAvatar(file).subscribe({
            next: (res: any) => {
                item.imageUrl = res.url;
                this.uploadingImageFor = null;
                this.toast.success('Image uploaded successfully');
            },
            error: (err: any) => {
                this.uploadingImageFor = null;
                this.toast.error('Image upload failed: ' + (err.error?.message || 'Server error'));
            }
        });
    }

    getImageUrl(imageUrl: string): string {
        if (!imageUrl) return '';
        if (imageUrl.startsWith('http')) return imageUrl;
        const cleanPath = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;
        const baseUrl = environment.apiUrl.replace('/api', '').replace(/\/$/, '');
        return `${baseUrl}/${cleanPath}`;
    }

    // Lightbox methods
    getAllEducationImages(): string[] {
        return this.education
            .filter(item => item.imageUrl)
            .map(item => item.imageUrl!);
    }

    openLightbox(imageUrl: string) {
        const images = this.getAllEducationImages();
        this.currentLightboxIndex = images.indexOf(imageUrl);
        if (this.currentLightboxIndex === -1) this.currentLightboxIndex = 0;

        this.lightboxImage = imageUrl;
        this.showLightbox = true;
        this.slideDirection = null;

        // Prevent body scroll when lightbox is open
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        this.showLightbox = false;
        this.slideDirection = null;

        // Restore body scroll
        document.body.style.overflow = '';
    }

    nextLightboxImage() {
        const images = this.getAllEducationImages();
        if (images.length <= 1) return;

        this.slideDirection = 'right';
        this.currentLightboxIndex = (this.currentLightboxIndex + 1) % images.length;
        this.lightboxImage = images[this.currentLightboxIndex];

        // Reset animation
        setTimeout(() => this.slideDirection = null, 300);
    }

    previousLightboxImage() {
        const images = this.getAllEducationImages();
        if (images.length <= 1) return;

        this.slideDirection = 'left';
        this.currentLightboxIndex = this.currentLightboxIndex === 0 ? images.length - 1 : this.currentLightboxIndex - 1;
        this.lightboxImage = images[this.currentLightboxIndex];

        // Reset animation
        setTimeout(() => this.slideDirection = null, 300);
    }

    goToLightboxImage(index: number) {
        const images = this.getAllEducationImages();
        if (index < 0 || index >= images.length) return;

        this.slideDirection = index > this.currentLightboxIndex ? 'right' : 'left';
        this.currentLightboxIndex = index;
        this.lightboxImage = images[index];

        // Reset animation
        setTimeout(() => this.slideDirection = null, 300);
    }

    // Keyboard navigation for lightbox
    @HostListener('window:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (!this.showLightbox) return;

        switch(event.key) {
            case 'Escape':
                this.closeLightbox();
                break;
            case 'ArrowLeft':
                this.previousLightboxImage();
                break;
            case 'ArrowRight':
                this.nextLightboxImage();
                break;
        }
    }

}
