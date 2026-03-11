import { Component, Input, Output, EventEmitter, inject, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
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
    imports: [CommonModule, TranslateModule, LucideAngularModule, FormsModule],
    template: `
    <div class="relative">
        <!-- Edit Button (moved to flow to prevent overlapping absolute buttons) -->
        <div class="flex items-center justify-end mb-8" *ngIf="auth.isLoggedIn()">
            <button (click)="openEditModal()"
                class="px-5 py-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-red-600 text-zinc-600 dark:text-zinc-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all">
                <lucide-icon [img]="EditIcon" class="w-4 h-4"></lucide-icon>
                Manage {{ sectionCategory }}
            </button>
        </div>

        <div class="space-y-12 relative before:absolute before:top-0 before:bottom-0 before:ltr:left-1/2 before:rtl:right-1/2 before:ltr:-translate-x-1/2 before:rtl:translate-x-1/2 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-zinc-200 before:via-zinc-300 before:to-zinc-200 dark:before:from-zinc-800 dark:before:via-zinc-700 dark:before:to-zinc-800"
             [class.before:hidden]="continuousMode">
             
            <!-- Empty State Headline (Shows only when 0 items exist) -->
            <div *ngIf="displayEducation().length === 0 && sectionTitle" class="w-full text-center py-8 relative z-10">
                <div class="inline-block bg-white dark:bg-zinc-950 px-8 py-6 rounded-[2rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800 shadow-sm relative z-20">
                    <h2 class="text-2xl font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600 drop-shadow-sm">{{ sectionTitle }}</h2>
                    <p class="text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 mt-2 uppercase">{{ 'education.emptyDesc' | translate }}</p>
                </div>
            </div>

            <div *ngFor="let item of displayEducation(); let i = index"
                class="relative flex items-center justify-between group animate-fade-in-up"
                [class.flex-row-reverse]="(i + layoutStartIndex) % 2 !== 0"
                [style.animation-delay]="(0.1 * i) + 's'">

                <!-- Connector Icon - Centered on Timeline (Always shows category icon) -->
                <div
                    class="absolute top-1/2 ltr:left-1/2 rtl:right-1/2 -translate-y-1/2 ltr:-translate-x-1/2 rtl:translate-x-1/2 z-20 flex items-center justify-center w-14 h-14 rounded-xl border-4 bg-white dark:bg-zinc-950 transition-all duration-500 shadow-2xl"
                    [ngClass]="{
                        'border-indigo-600 shadow-indigo-500/40 group-hover:shadow-indigo-500/70 group-hover:scale-110': item.category === 'Education',
                        'border-emerald-600 shadow-emerald-500/40 group-hover:shadow-emerald-500/70 group-hover:scale-110': item.category === 'Training',
                        'border-violet-600 shadow-violet-500/40 group-hover:shadow-violet-500/70 group-hover:scale-110': item.category === 'Certification',
                        'border-amber-600 shadow-amber-500/40 group-hover:shadow-amber-500/70 group-hover:scale-110': item.category === 'Achievement'
                    }">
                    <div class="flex items-center justify-center w-full h-full rounded-xl transition-all duration-500"
                        [ngClass]="{
                            'text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white': item.category === 'Education',
                            'text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white': item.category === 'Training',
                            'text-violet-600 group-hover:bg-violet-600 group-hover:text-white': item.category === 'Certification',
                            'text-amber-600 group-hover:bg-amber-600 group-hover:text-white': item.category === 'Achievement'
                        }">
                        <img *ngIf="item.category === 'Education'" src="/education/education.png" class="w-8 h-8 object-contain">
                        <img *ngIf="item.category === 'Training'" src="/education/Training.png" class="w-8 h-8 object-contain">
                        <img *ngIf="item.category === 'Certification'" src="/education/Certification.png" class="w-8 h-8 object-contain">
                        <img *ngIf="item.category === 'Achievement'" src="/education/Acheivements.png" class="w-8 h-8 object-contain">
                    </div>
                </div>

                <!-- Details Container (Left Side Default) -->
                <div class="w-[calc(50%-3.5rem)] flex flex-col justify-center">
                    
                    <!-- Integrated Section Headline (Shows above the FIRST item's details card) -->
                    <div *ngIf="i === 0 && sectionTitle" class="mb-6 relative z-10" [ngClass]="{ 'text-end': (i + layoutStartIndex) % 2 !== 0 }">
                        <h2 class="text-3xl sm:text-4xl font-black uppercase tracking-tight text-zinc-900 dark:text-white drop-shadow-sm">{{ sectionTitle }}</h2>
                        <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-sm" [ngClass]="{ 'ms-auto': (i + layoutStartIndex) % 2 !== 0 }">{{ sectionDesc }}</p>
                    </div>

                    <!-- Details Card -->
                    <div
                        class="bg-white/90 dark:bg-zinc-900/70 p-6 rounded-xl border-2 transition-all duration-500 backdrop-blur-xl relative hover:shadow-2xl"
                        [ngClass]="{
                            'border-indigo-500/30 group-hover:border-indigo-500/60 group-hover:shadow-indigo-500/20': item.category === 'Education',
                            'border-emerald-500/30 group-hover:border-emerald-500/60 group-hover:shadow-emerald-500/20': item.category === 'Training',
                            'border-violet-500/30 group-hover:border-violet-500/60 group-hover:shadow-violet-500/20': item.category === 'Certification',
                            'border-amber-500/30 group-hover:border-amber-500/60 group-hover:shadow-amber-500/20': item.category === 'Achievement'
                        }">
                        
                        <!-- Category Badge -->
                        <div class="flex items-center gap-2 mb-3 flex-wrap">
                            <span
                                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-bold tracking-widest uppercase border-2 shadow-sm"
                                [ngClass]="{
                                    'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 border-indigo-500/40': item.category === 'Education',
                                    'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-500/40': item.category === 'Training',
                                    'bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-400 border-violet-500/40': item.category === 'Certification',
                                    'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-500/40': item.category === 'Achievement'
                                }">
                                <img *ngIf="item.category === 'Education'" src="/education/education.png" class="w-3.5 h-3.5 object-contain">
                                <img *ngIf="item.category === 'Training'" src="/education/Training.png" class="w-3.5 h-3.5 object-contain">
                                <img *ngIf="item.category === 'Certification'" src="/education/Certification.png" class="w-3.5 h-3.5 object-contain">
                                <img *ngIf="item.category === 'Achievement'" src="/education/Acheivements.png" class="w-3.5 h-3.5 object-contain">
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
                                'group-hover:text-violet-600 dark:group-hover:text-violet-400': item.category === 'Certification',
                                'group-hover:text-amber-600 dark:group-hover:text-amber-400': item.category === 'Achievement'
                            }">
                            <lucide-icon [img]="MapPinIcon" class="w-3 h-3"></lucide-icon>
                            <span class="text-[10px] uppercase tracking-wide font-bold">{{ getLocation(item) }}</span>
                        </div>
                    </div>
                </div>

                <!-- Image Container (Right Side Default) -->
                <div class="w-[calc(50%-3.5rem)] flex flex-col justify-center">
                    
                    <!-- Image Card -->
                    <div class="bg-white/90 dark:bg-zinc-900/70 rounded-xl border-2 transition-all duration-500 backdrop-blur-xl relative hover:shadow-2xl overflow-hidden cursor-pointer"
                        (click)="openLightbox(item.imageUrl || getDefaultImage(item.category))"
                        [ngClass]="{
                            'border-indigo-500/30 group-hover:border-indigo-500/60 group-hover:shadow-indigo-500/20': item.category === 'Education',
                            'border-emerald-500/30 group-hover:border-emerald-500/60 group-hover:shadow-emerald-500/20': item.category === 'Training',
                            'border-violet-500/30 group-hover:border-violet-500/60 group-hover:shadow-violet-500/20': item.category === 'Certification',
                            'border-amber-500/30 group-hover:border-amber-500/60 group-hover:shadow-amber-500/20': item.category === 'Achievement'
                        }">
                        <!-- Image if available -->
                        <div *ngIf="item.imageUrl" class="aspect-video w-full">
                            <img [src]="getImageUrl(item.imageUrl)" [alt]="item.institution"
                                class="w-full h-full object-cover object-center">
                        </div>
                        <!-- Placeholder if no image (Default Icon Lightbox) -->
                        <div *ngIf="!item.imageUrl" class="aspect-video w-full flex items-center justify-center bg-gradient-to-br"
                            [ngClass]="{
                                'from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-900/30': item.category === 'Education',
                                'from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/30': item.category === 'Training',
                                'from-violet-50 to-violet-100 dark:from-violet-950/30 dark:to-violet-900/30': item.category === 'Certification',
                                'from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/30': item.category === 'Achievement'
                            }">
                            <div class="text-center p-6">
                                <img *ngIf="item.category === 'Education'" src="/education/education.png" class="w-12 h-12 sm:w-16 sm:h-16 object-contain mx-auto mb-3 opacity-60 transition-transform group-hover:scale-110">
                                <img *ngIf="item.category === 'Training'" src="/education/Training.png" class="w-12 h-12 sm:w-16 sm:h-16 object-contain mx-auto mb-3 opacity-60 transition-transform group-hover:scale-110">
                                <img *ngIf="item.category === 'Certification'" src="/education/Certification.png" class="w-12 h-12 sm:w-16 sm:h-16 object-contain mx-auto mb-3 opacity-60 transition-transform group-hover:scale-110">
                                <img *ngIf="item.category === 'Achievement'" src="/education/Acheivements.png" class="w-12 h-12 sm:w-16 sm:h-16 object-contain mx-auto mb-3 opacity-60 transition-transform group-hover:scale-110">
                                <p class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-500">View Image</p>
                            </div>
                        </div>
                    </div>

                    <!-- Integrated "View List" Toggle Button (Shows BELOW the first item's image instead of on parent component) -->
                    <div *ngIf="i === 0 && hasViewListBtn" class="mt-6 flex justify-start items-center" [ngClass]="{ 'justify-end': (i + layoutStartIndex) % 2 !== 0 }">
                        <button (click)="viewListClicked.emit()"
                            class="px-8 py-3 bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white border border-red-600/20 hover:border-red-600 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                            {{ viewListText }}
                        </button>
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
                class="max-w-full max-h-full object-contain rounded-xl shadow-2xl animate-scale-in"
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
            <div class="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-5 flex items-center justify-between z-10">
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
                <!-- Empty State for Edit Modal -->
                <div *ngIf="editList.length === 0" class="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50">
                    <div class="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                        <lucide-icon [img]="BookOpenIcon" class="w-8 h-8 text-zinc-400"></lucide-icon>
                    </div>
                    <h4 class="text-sm font-black dark:text-white text-zinc-900 mb-2">No Entries Found</h4>
                    <p class="text-xs text-zinc-500 mb-6">There are no {{ sectionCategory }} entries yet.</p>
                    <button (click)="addNewEntry()" class="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all">Add New Entry</button>
                </div>

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
                                <option value="Achievement">Achievement</option>
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

            <div class="sticky bottom-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 p-5 flex items-center justify-end gap-3">
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
    <div *ngIf="deleteIndex !== null" class="modal-overlay">
        <div class="modal-content max-w-sm" (click)="$event.stopPropagation()">
            <div class="p-6 text-center">
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
export class EducationTimelineComponent implements OnDestroy {
    public auth = inject(AuthService);
    private profileService = inject(ProfileService);
    private toast = inject(ToastService);
    public translationService = inject(TranslationService);
    public translationHelper = inject(TranslationHelperService);

    @Input() sectionCategory: 'Education' | 'Training' | 'Certification' | 'Achievement' = 'Education';
    @Input() sectionTitle?: string;
    @Input() sectionDesc?: string;
    @Input() hasViewListBtn = false;
    @Input() viewListText = 'View List';
    @Output() viewListClicked = new EventEmitter<void>();
    @Input() limitItems?: number;
    @Input() layoutStartIndex: number = 0;
    @Input() continuousMode = false;

    displayEducation(): EducationEntry[] {
        if (!this.education) return [];
        return this.limitItems ? this.education.slice(0, this.limitItems) : this.education;
    }

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
            createdAt: new Date(),
            category: this.sectionCategory
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
    getDefaultImage(category: string): string {
        switch (category) {
            case 'Training': return '/education/Training.png';
            case 'Certification': return '/education/Certification.png';
            case 'Achievement': return '/education/Acheivements.png';
            default: return '/education/education.png';
        }
    }

    getAllEducationImages(): string[] {
        return this.education
            .map(item => item.imageUrl ? this.getImageUrl(item.imageUrl) : this.getDefaultImage(item.category));
    }

    openLightbox(imageUrl: string) {
        if (!imageUrl) return;
        const processedUrl = imageUrl.startsWith('/') ? imageUrl : this.getImageUrl(imageUrl);
        const images = this.getAllEducationImages();

        this.currentLightboxIndex = images.indexOf(processedUrl);
        if (this.currentLightboxIndex === -1) {
            // If somehow not in array, just show it directly
            images.unshift(processedUrl);
            this.currentLightboxIndex = 0;
        }

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

        switch (event.key) {
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

    ngOnDestroy() {
        // Guarantee the global scroll lock is released if the component is destroyed
        // while the lightbox or edit modal is active (e.g. from router navigation)
        document.body.style.overflow = '';
    }
}
