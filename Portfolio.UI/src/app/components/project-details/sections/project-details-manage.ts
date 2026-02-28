import { Component, Input, Output, EventEmitter, inject, OnChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, Edit, Save, X, Plus, Trash2, Code, Clock, Layers, CheckCircle, Github, Upload, Image as ImageIcon } from 'lucide-angular';
import { ProjectEntry, KeyFeature, ChangelogItem } from '../../../models';
import { ProjectService } from '../../../services/project.service';
import { ToastService } from '../../../services/toast.service';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-project-details-manage',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    template: `
    <div *ngIf="project && isEditing" class="modal-overlay">
        <div class="modal-content max-w-6xl" (click)="$event.stopPropagation()">
            <!-- Header -->
            <div class="sticky top-0 bg-zinc-950 border-b border-zinc-800 p-6 flex items-center justify-between z-10">
                <h2 class="text-xl font-black uppercase text-white">Edit Project</h2>
                <button (click)="closeModal()" class="text-zinc-400 hover:text-white transition-colors">
                    <lucide-icon [img]="XIcon" class="w-5 h-5"></lucide-icon>
                </button>
            </div>

            <!-- Content -->
            <div class="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                <!-- GitHub Import Section -->
                <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
                    <div class="flex items-center gap-2">
                        <lucide-icon [img]="GithubIcon" class="w-4 h-4 text-red-600"></lucide-icon>
                        <h3 class="text-xs font-black uppercase text-white">Import from GitHub</h3>
                    </div>
                    <p class="text-[10px] text-zinc-500">Automatically populate features and changelog from a GitHub repository</p>
                    <div class="flex gap-2">
                        <input type="text" [(ngModel)]="githubUrl" placeholder="https://github.com/owner/repo"
                            class="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-600 outline-none">
                        <button (click)="importFromGitHub()" [disabled]="isImporting || !githubUrl"
                            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            {{ isImporting ? 'Importing...' : 'Import' }}
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-6">
                    <!-- Title EN -->
                    <div class="col-span-2">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Title (EN) *</label>
                        <input [(ngModel)]="editData.title" placeholder="Project title"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                    </div>

                    <!-- Title AR -->
                    <div class="col-span-2">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Title (AR)</label>
                        <input [(ngModel)]="editData.title_Ar" placeholder="عنوان المشروع" dir="rtl"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                    </div>

                    <!-- Description EN -->
                    <div class="col-span-2">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Description (EN) *</label>
                        <textarea [(ngModel)]="editData.description" placeholder="Project description" rows="3"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all resize-none"></textarea>
                    </div>

                    <!-- Description AR -->
                    <div class="col-span-2">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Description (AR)</label>
                        <textarea [(ngModel)]="editData.description_Ar" placeholder="وصف المشروع" rows="3" dir="rtl"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all resize-none"></textarea>
                    </div>

                    <!-- Summary EN -->
                    <div class="col-span-2">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Summary (EN)</label>
                        <textarea [(ngModel)]="editData.summary" placeholder="Brief project summary" rows="2"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all resize-none"></textarea>
                    </div>

                    <!-- Summary AR -->
                    <div class="col-span-2">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Summary (AR)</label>
                        <textarea [(ngModel)]="editData.summary_Ar" placeholder="ملخص المشروع" rows="2" dir="rtl"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all resize-none"></textarea>
                    </div>

                    <!-- Category EN -->
                    <div>
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Category (EN)</label>
                        <input [(ngModel)]="editData.category" placeholder="e.g. Frontend, Backend"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                    </div>

                    <!-- Category AR -->
                    <div>
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Category (AR)</label>
                        <input [(ngModel)]="editData.category_Ar" placeholder="الفئة" dir="rtl"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                    </div>

                    <!-- Niche EN -->
                    <div>
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Niche (EN)</label>
                        <input [(ngModel)]="editData.niche" placeholder="e.g. SaaS & Productivity"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                    </div>

                    <!-- Niche AR -->
                    <div>
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Niche (AR)</label>
                        <input [(ngModel)]="editData.niche_Ar" placeholder="التخصص" dir="rtl"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                    </div>

                    <!-- Company EN -->
                    <div class="relative">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Company (EN)</label>
                        <input [(ngModel)]="editData.company" 
                            (input)="onCompanyInput($any($event.target).value)"
                            (focus)="onCompanyInput(editData.company || '')" 
                            (blur)="onCompanyBlur()"
                            placeholder="e.g. WE3DS, Remote"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                        
                        <!-- Company Suggestions Dropdown -->
                        <div *ngIf="showCompanySuggestions && filteredCompanySuggestions.length > 0"
                            class="absolute z-20 w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-xl shadow-lg max-h-40 overflow-y-auto">
                            <button *ngFor="let suggestion of filteredCompanySuggestions"
                                (click)="selectCompany(suggestion)" type="button"
                                class="w-full px-4 py-2 text-left text-sm text-white hover:bg-zinc-700 transition-colors">
                                {{ suggestion }}
                            </button>
                        </div>
                    </div>

                    <!-- Company AR -->
                    <div class="relative">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Company (AR)</label>
                        <input [(ngModel)]="editData.company_Ar" 
                            (input)="onCompanyArInput($any($event.target).value)"
                            (focus)="onCompanyArInput(editData.company_Ar || '')" 
                            (blur)="onCompanyArBlur()"
                            placeholder="الشركة" dir="rtl"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                        
                        <!-- Company AR Suggestions Dropdown -->
                        <div *ngIf="showCompanyArSuggestions && filteredCompanyArSuggestions.length > 0"
                            class="absolute z-20 w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-xl shadow-lg max-h-40 overflow-y-auto">
                            <button *ngFor="let suggestion of filteredCompanyArSuggestions"
                                (click)="selectCompanyAr(suggestion)" type="button"
                                class="w-full px-4 py-2 text-right text-sm text-white hover:bg-zinc-700 transition-colors"
                                dir="rtl">
                                {{ suggestion }}
                            </button>
                        </div>
                    </div>

                    <!-- Tags -->
                    <div class="col-span-2">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">
                            Tags / Technologies
                            <span class="text-zinc-500 font-normal normal-case tracking-normal ml-2">- Click to add from suggestions</span>
                        </label>
                        
                        <!-- Selected Tags Display -->
                        <div class="flex flex-wrap gap-2 mb-2" *ngIf="selectedTags.length > 0">
                            <span *ngFor="let tag of selectedTags; let i = index"
                                class="inline-flex items-center gap-1.5 bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold">
                                {{ tag }}
                                <button (click)="removeTag(i)" type="button"
                                    class="hover:bg-red-700 rounded-full p-0.5 transition-colors">
                                    <lucide-icon [img]="XIcon" class="w-3 h-3"></lucide-icon>
                                </button>
                            </span>
                        </div>
                        
                        <!-- Tag Input with Suggestions -->
                        <div class="relative">
                            <input [(ngModel)]="tagInput" 
                                (input)="onTagInputChange($any($event.target).value)"
                                (focus)="showTechSuggestions = true; onTagInputChange(tagInput)" 
                                (blur)="onTagsBlur()"
                                (keyup.enter)="addCustomTag()" 
                                placeholder="Type to search or add custom tag..."
                                class="w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">

                            <!-- Technology Suggestions Dropdown -->
                            <div *ngIf="showTechSuggestions && filteredTechSuggestions.length > 0"
                                class="absolute z-20 w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                                <button *ngFor="let tech of filteredTechSuggestions" 
                                    (click)="selectTech(tech)"
                                    type="button"
                                    class="w-full px-4 py-2 text-left text-sm text-white hover:bg-zinc-700 transition-colors flex items-center gap-2">
                                    <span class="w-2 h-2 bg-red-600 rounded-full"></span>
                                    {{ tech }}
                                </button>
                            </div>
                        </div>
                        <p class="text-[9px] text-zinc-500 mt-1.5">Press Enter to add custom tag or select from suggestions</p>
                    </div>

                    <!-- Project Metadata Section -->
                    <div class="col-span-2 mt-4 p-4 bg-zinc-900 rounded-xl">
                        <h4 class="text-xs font-black uppercase text-white mb-4 flex items-center gap-2">
                            <lucide-icon [img]="CodeIcon" class="w-4 h-4 text-red-600"></lucide-icon>
                            Project Metadata
                        </h4>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Language (EN)</label>
                                <input type="text" [(ngModel)]="editData.language" placeholder="e.g. TypeScript"
                                    class="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:border-red-600 outline-none transition-colors">
                            </div>
                            <div>
                                <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Language (AR)</label>
                                <input type="text" [(ngModel)]="editData.language_Ar" placeholder="مثال: تايب سكريبت" dir="rtl"
                                    class="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:border-red-600 outline-none transition-colors">
                            </div>
                            <div>
                                <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Duration (EN)</label>
                                <input type="text" [(ngModel)]="editData.duration" placeholder="e.g. 2025"
                                    class="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:border-red-600 outline-none transition-colors">
                            </div>
                            <div>
                                <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Duration (AR)</label>
                                <input type="text" [(ngModel)]="editData.duration_Ar" placeholder="مثال: 2025" dir="rtl"
                                    class="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:border-red-600 outline-none transition-colors">
                            </div>
                            <div>
                                <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Architecture (EN)</label>
                                <input type="text" [(ngModel)]="editData.architecture" placeholder="e.g. Scalable Architecture"
                                    class="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:border-red-600 outline-none transition-colors">
                            </div>
                            <div>
                                <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Architecture (AR)</label>
                                <input type="text" [(ngModel)]="editData.architecture_Ar" placeholder="مثال: هندسة قابلة للتوسع" dir="rtl"
                                    class="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:border-red-600 outline-none transition-colors">
                            </div>
                            <div>
                                <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Status (EN)</label>
                                <input type="text" [(ngModel)]="editData.status" placeholder="e.g. Active"
                                    class="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:border-red-600 outline-none transition-colors">
                            </div>
                            <div>
                                <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Status (AR)</label>
                                <input type="text" [(ngModel)]="editData.status_Ar" placeholder="مثال: نشط" dir="rtl"
                                    class="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:border-red-600 outline-none transition-colors">
                            </div>
                        </div>
                    </div>

                    <!-- URLs Section -->
                    <div class="col-span-2">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Project URL</label>
                        <input [(ngModel)]="editData.projectUrl" placeholder="https://..."
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                    </div>

                    <div class="col-span-2">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">GitHub URL</label>
                        <input [(ngModel)]="editData.gitHubUrl" placeholder="https://github.com/..."
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                    </div>

                    <!-- Image Upload -->
                    <div class="col-span-2">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Project Image</label>
                        <div class="flex gap-3">
                            <div class="flex-1">
                                <input [(ngModel)]="editData.imageUrl" placeholder="Image URL or upload below"
                                    class="w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-900 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                            </div>
                            <label [class.opacity-50]="isUploading" [class.pointer-events-none]="isUploading"
                                class="px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white hover:bg-zinc-700 transition-all cursor-pointer flex items-center gap-2">
                                <lucide-icon [img]="UploadIcon" class="w-4 h-4"></lucide-icon>
                                <span class="text-[10px] font-black uppercase tracking-widest">{{ isUploading ? 'Uploading...' : 'Upload' }}</span>
                                <input type="file" accept="image/*" (change)="onImageFileSelected($event)" class="hidden">
                            </label>
                        </div>
                        <!-- Image Preview -->
                        <div *ngIf="editData.imageUrl"
                            class="mt-3 relative w-full h-40 rounded-xl overflow-hidden border border-zinc-700">
                            <img [src]="getFullImageUrl(editData.imageUrl)" alt="Preview"
                                class="w-full h-full object-cover">
                            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-3">
                                <lucide-icon [img]="ImageIcon" class="w-4 h-4 text-white"></lucide-icon>
                            </div>
                        </div>
                    </div>

                    <!-- Gallery Images Upload -->
                    <div class="col-span-2">
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">
                            Gallery Images (Max 10)
                            <span class="text-zinc-500 font-normal normal-case tracking-normal ml-2">- For project details page</span>
                        </label>
                        <label [class.opacity-50]="isUploadingGallery" [class.pointer-events-none]="isUploadingGallery"
                            class="w-full px-4 py-8 border-2 border-dashed border-zinc-700 rounded-xl hover:border-red-500 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 bg-zinc-800/50">
                            <lucide-icon [img]="UploadIcon" class="w-6 h-6 text-zinc-400"></lucide-icon>
                            <span class="text-sm text-zinc-400">
                                {{ isUploadingGallery ? 'Uploading images...' : 'Click to upload or drag and drop' }}
                            </span>
                            <span class="text-[10px] text-zinc-500">PNG, JPG, GIF up to 5MB each</span>
                            <input type="file" accept="image/*" multiple (change)="onGalleryFilesSelected($event)" class="hidden">
                        </label>

                        <!-- Gallery Preview Grid -->
                        <div *ngIf="editData.gallery && editData.gallery.length > 0" class="mt-3 grid grid-cols-4 gap-2">
                            <div *ngFor="let img of editData.gallery; let i = index"
                                class="relative group aspect-square rounded-lg overflow-hidden border border-zinc-700">
                                <img [src]="getFullImageUrl(img)" alt="Gallery image {{ i + 1 }}"
                                    class="w-full h-full object-cover">
                                <button (click)="removeGalleryImage(i)" type="button"
                                    class="absolute top-1 right-1 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <lucide-icon [img]="XIcon" class="w-3 h-3 text-white"></lucide-icon>
                                </button>
                                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1">
                                    <span class="text-[8px] text-white font-bold">{{ i + 1 }}</span>
                                </div>
                            </div>
                        </div>
                        <p *ngIf="editData.gallery && editData.gallery.length > 0" class="text-[10px] text-zinc-400 mt-2">
                            {{ editData.gallery.length }} / 10 images uploaded
                        </p>
                    </div>

                    <!-- Is Featured -->
                    <div class="col-span-2 flex items-center gap-6 p-4 bg-zinc-900 rounded-xl">
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" [(ngModel)]="editData.isFeatured"
                                class="w-4 h-4 rounded border-zinc-600 text-red-600 focus:ring-red-500 focus:ring-2">
                            <span class="text-sm font-bold text-white">Mark as Featured</span>
                        </label>
                    </div>
                </div>

                <!-- Key Features -->
                <section class="space-y-6">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-black uppercase text-red-600">Key Features</h3>
                        <button (click)="addFeature()" 
                            class="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-colors">
                            <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon>
                            Add Feature
                        </button>
                    </div>
                    <div class="space-y-4">
                        <div *ngFor="let feature of editData.keyFeatures; let i = index"
                            class="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                            <div class="flex items-center justify-between">
                                <span class="text-[10px] font-black uppercase text-zinc-600">Feature {{i + 1}}</span>
                                <button (click)="removeFeature(i)" 
                                    class="text-red-600 hover:text-red-500 transition-colors">
                                    <lucide-icon [img]="TrashIcon" class="w-4 h-4"></lucide-icon>
                                </button>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Icon</label>
                                    <select [(ngModel)]="feature.icon"
                                        class="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-600 outline-none">
                                        <option value="Layers">Layers</option>
                                        <option value="Rocket">Rocket</option>
                                        <option value="Monitor">Monitor</option>
                                        <option value="Code">Code</option>
                                    </select>
                                </div>
                                <div class="md:col-span-2">
                                    <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Title (EN)</label>
                                    <input type="text" [(ngModel)]="feature.title"
                                        class="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-600 outline-none">
                                </div>
                            </div>
                            <div>
                                <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Title (AR)</label>
                                <input type="text" [(ngModel)]="feature.title_Ar" dir="rtl"
                                    placeholder="العنوان"
                                    class="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-600 outline-none">
                            </div>
                            <div>
                                <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Description (EN)</label>
                                <textarea [(ngModel)]="feature.description" rows="2"
                                    class="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-600 outline-none resize-none"></textarea>
                            </div>
                            <div>
                                <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Description (AR)</label>
                                <textarea [(ngModel)]="feature.description_Ar" rows="2" dir="rtl"
                                    placeholder="الوصف"
                                    class="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-600 outline-none resize-none"></textarea>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Responsibilities -->
                <section class="space-y-6">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-black uppercase text-red-600">Responsibilities</h3>
                        <button (click)="addResponsibility()" 
                            class="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-colors">
                            <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon>
                            Add
                        </button>
                    </div>
                    <div class="space-y-3">
                        <div *ngFor="let resp of editData.responsibilities; let i = index"
                            class="flex gap-3 bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                            <input type="text" [(ngModel)]="editData.responsibilities[i]"
                                class="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-600 outline-none">
                            <button (click)="removeResponsibility(i)" 
                                class="text-red-600 hover:text-red-500 transition-colors">
                                <lucide-icon [img]="TrashIcon" class="w-4 h-4"></lucide-icon>
                            </button>
                        </div>
                    </div>
                </section>

                <!-- Changelog -->
                <section class="space-y-6">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-black uppercase text-red-600">Changelog</h3>
                        <button (click)="addChangelogItem()" 
                            class="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-colors">
                            <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon>
                            Add Entry
                        </button>
                    </div>
                    <div class="space-y-4">
                        <div *ngFor="let item of editData.changelog; let i = index"
                            class="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
                            <div class="flex items-center justify-between">
                                <span class="text-[10px] font-black uppercase text-zinc-600">Entry {{i + 1}}</span>
                                <button (click)="removeChangelogItem(i)" 
                                    class="text-red-600 hover:text-red-500 transition-colors">
                                    <lucide-icon [img]="TrashIcon" class="w-4 h-4"></lucide-icon>
                                </button>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Date</label>
                                    <input type="text" [(ngModel)]="item.date"
                                        class="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-600 outline-none">
                                </div>
                                <div>
                                    <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Version</label>
                                    <input type="text" [(ngModel)]="item.version"
                                        class="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-600 outline-none">
                                </div>
                                <div>
                                    <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Title (EN)</label>
                                    <input type="text" [(ngModel)]="item.title"
                                        class="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-600 outline-none">
                                </div>
                            </div>
                            <div>
                                <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Title (AR)</label>
                                <input type="text" [(ngModel)]="item.title_Ar" dir="rtl"
                                    placeholder="العنوان"
                                    class="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-600 outline-none">
                            </div>
                            <div>
                                <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Description (EN)</label>
                                <textarea [(ngModel)]="item.description" rows="2"
                                    class="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-600 outline-none resize-none"></textarea>
                            </div>
                            <div>
                                <label class="block text-[10px] font-black uppercase text-zinc-500 mb-2">Description (AR)</label>
                                <textarea [(ngModel)]="item.description_Ar" rows="2" dir="rtl"
                                    placeholder="الوصف"
                                    class="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-600 outline-none resize-none"></textarea>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-end gap-4 p-8 border-t border-zinc-800">
                <button (click)="closeModal()" 
                    class="px-8 py-3 rounded-xl font-black text-[10px] uppercase text-zinc-400 hover:text-white transition-colors">
                    Cancel
                </button>
                <button (click)="saveChanges()" [disabled]="isSaving"
                    class="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-xl font-black text-[10px] uppercase hover:bg-red-600 hover:text-white transition-all disabled:opacity-50">
                    <lucide-icon [img]="SaveIcon" class="w-4 h-4"></lucide-icon>
                    {{ isSaving ? 'Saving...' : 'Save Changes' }}
                </button>
            </div>
        </div>
    </div>
    `
})
export class ProjectDetailsManageComponent implements OnChanges {
    private projectService = inject(ProjectService);
    private toast = inject(ToastService);
    private cdr = inject(ChangeDetectorRef);
    private http = inject(HttpClient);
    private auth = inject(AuthService);
    
    @Input() project?: ProjectEntry;
    @Input() canEdit = false;
    @Input() triggerEdit = false;
    @Output() onUpdate = new EventEmitter<ProjectEntry>();

    EditIcon = Edit;
    SaveIcon = Save;
    XIcon = X;
    PlusIcon = Plus;
    TrashIcon = Trash2;
    CodeIcon = Code;
    ClockIcon = Clock;
    LayersIcon = Layers;
    CheckIcon = CheckCircle;
    GithubIcon = Github;
    UploadIcon = Upload;
    ImageIcon = ImageIcon;

    isEditing = false;
    isSaving = false;
    isImporting = false;
    isUploading = false;
    isUploadingGallery = false;
    githubUrl = '';
    editData: any = {};

    // Autocomplete suggestions
    companySuggestions: string[] = ['WE3DS', 'Remote', 'Self Work', 'Freelance', 'Contract'];
    filteredCompanySuggestions: string[] = [];
    showCompanySuggestions = false;

    companyArSuggestions: string[] = ['WE3DS', 'عن بعد', 'عمل حر', 'مستقل', 'عقد'];
    filteredCompanyArSuggestions: string[] = [];
    showCompanyArSuggestions = false;

    // Tag suggestions
    techSuggestions = [
        'Angular', 'React', 'Vue', 'TypeScript', 'JavaScript',
        '.NET Core', 'ASP.NET', 'C#', 'Node.js', 'Express',
        'SQL Server', 'PostgreSQL', 'MongoDB', 'MySQL', 'Redis',
        'Azure', 'AWS', 'Docker', 'Kubernetes', 'CI/CD',
        'Tailwind CSS', 'Bootstrap', 'Material UI', 'SASS', 'CSS3',
        'REST API', 'GraphQL', 'SignalR', 'WebSockets', 'gRPC',
        'Entity Framework', 'Dapper', 'Prisma', 'TypeORM',
        'JWT', 'OAuth', 'Identity Server', 'Auth0',
        'Git', 'GitHub Actions', 'Azure DevOps', 'Jenkins',
        'Microservices', 'Clean Architecture', 'DDD', 'CQRS',
        'RxJS', 'NgRx', 'Redux', 'MobX', 'Zustand',
        'Jest', 'Vitest', 'Cypress', 'Playwright', 'xUnit',
        'Webpack', 'Vite', 'Rollup', 'ESBuild'
    ];
    filteredTechSuggestions: string[] = [];
    showTechSuggestions = false;
    selectedTags: string[] = [];
    tagInput = '';

    ngOnChanges() {
        if (this.triggerEdit && !this.isEditing) {
            this.openModal();
        }
    }

    openModal() {
        if (!this.project) return;
        
        this.editData = {
            title: this.project.title || '',
            title_Ar: this.project.title_Ar || '',
            description: this.project.description || '',
            description_Ar: this.project.description_Ar || '',
            summary: this.project.summary || '',
            summary_Ar: this.project.summary_Ar || '',
            category: this.project.category || '',
            category_Ar: this.project.category_Ar || '',
            niche: this.project.niche || '',
            niche_Ar: this.project.niche_Ar || '',
            company: this.project.company || '',
            company_Ar: this.project.company_Ar || '',
            tags: this.project.tags || '',
            imageUrl: this.project.imageUrl || '',
            gallery: this.project.gallery ? [...this.project.gallery] : [],
            projectUrl: this.project.projectUrl || '',
            gitHubUrl: this.project.gitHubUrl || '',
            language: this.project.language || '',
            language_Ar: this.project.language_Ar || '',
            duration: this.project.duration || '',
            duration_Ar: this.project.duration_Ar || '',
            architecture: this.project.architecture || '',
            architecture_Ar: this.project.architecture_Ar || '',
            status: this.project.status || 'Active',
            status_Ar: this.project.status_Ar || '',
            isFeatured: this.project.isFeatured || false,
            keyFeatures: JSON.parse(JSON.stringify(this.project.keyFeatures || [])),
            responsibilities: [...(this.project.responsibilities || [])],
            changelog: JSON.parse(JSON.stringify(this.project.changelog || []))
        };
        
        // Parse tags into selectedTags array
        this.selectedTags = this.project.tags ? this.project.tags.split(',').map(t => t.trim()).filter(t => t) : [];
        this.tagInput = '';
        
        // Pre-fill GitHub URL if available
        this.githubUrl = this.project.gitHubUrl || '';
        
        this.isEditing = true;
    }

    closeModal() {
        this.isEditing = false;
    }

    // Key Features
    addFeature() {
        this.editData.keyFeatures.push({
            icon: 'Layers',
            title: '',
            description: ''
        });
    }

    removeFeature(index: number) {
        this.editData.keyFeatures.splice(index, 1);
    }

    // Responsibilities
    addResponsibility() {
        this.editData.responsibilities.push('');
    }

    removeResponsibility(index: number) {
        this.editData.responsibilities.splice(index, 1);
    }

    // Changelog
    addChangelogItem() {
        this.editData.changelog.push({
            date: '',
            version: '',
            title: '',
            description: ''
        });
    }

    removeChangelogItem(index: number) {
        this.editData.changelog.splice(index, 1);
    }

    saveChanges() {
        if (!this.project || this.isSaving) return;

        this.isSaving = true;

        const updatedProject = {
            ...this.project,
            title: this.editData.title,
            title_Ar: this.editData.title_Ar,
            description: this.editData.description,
            description_Ar: this.editData.description_Ar,
            summary: this.editData.summary,
            summary_Ar: this.editData.summary_Ar,
            category: this.editData.category,
            category_Ar: this.editData.category_Ar,
            niche: this.editData.niche,
            niche_Ar: this.editData.niche_Ar,
            company: this.editData.company,
            company_Ar: this.editData.company_Ar,
            tags: this.editData.tags,
            imageUrl: this.editData.imageUrl,
            gallery: this.editData.gallery,
            projectUrl: this.editData.projectUrl,
            gitHubUrl: this.editData.gitHubUrl,
            language: this.editData.language,
            language_Ar: this.editData.language_Ar,
            duration: this.editData.duration,
            duration_Ar: this.editData.duration_Ar,
            architecture: this.editData.architecture,
            architecture_Ar: this.editData.architecture_Ar,
            status: this.editData.status,
            status_Ar: this.editData.status_Ar,
            isFeatured: this.editData.isFeatured,
            keyFeatures: this.editData.keyFeatures,
            responsibilities: this.editData.responsibilities.filter((r: string) => r.trim()),
            changelog: this.editData.changelog
        };

        console.log('Saving project with data:', updatedProject);
        console.log('Key Features:', updatedProject.keyFeatures);
        console.log('Responsibilities:', updatedProject.responsibilities);
        console.log('Changelog:', updatedProject.changelog);

        this.projectService.updateProject(this.project.id, updatedProject).subscribe({
            next: (updated) => {
                console.log('Project updated successfully:', updated);
                console.log('Updated Key Features:', updated.keyFeatures);
                console.log('Updated Responsibilities:', updated.responsibilities);
                console.log('Updated Changelog:', updated.changelog);
                this.onUpdate.emit(updated);
                this.isEditing = false;
                this.isSaving = false;
                this.cdr.detectChanges();
                this.toast.success('Project updated successfully');
            },
            error: (err) => {
                console.error('Failed to update project:', err);
                this.isSaving = false;
                this.cdr.detectChanges();
                
                let errorMessage = 'Failed to save changes. ';
                
                if (err.status === 401) {
                    errorMessage = 'Your session has expired. Please log in again to continue editing.';
                } else if (err.error?.message) {
                    errorMessage += err.error.message;
                } else {
                    errorMessage += 'Please try again.';
                }
                
                this.toast.error(errorMessage);
            }
        });
    }

    importFromGitHub() {
        if (!this.project || !this.githubUrl || this.isImporting) return;

        console.log('[ManageComponent] Starting GitHub import...');
        console.log('[ManageComponent] Project ID:', this.project.id);
        console.log('[ManageComponent] GitHub URL:', this.githubUrl);

        this.isImporting = true;
        this.cdr.detectChanges();

        this.projectService.importFromGitHub(this.project.id, this.githubUrl).subscribe({
            next: (updated: ProjectEntry) => {
                console.log('GitHub import successful - Full response:', updated);
                console.log('Key Features:', updated.keyFeatures);
                console.log('Responsibilities:', updated.responsibilities);
                console.log('Changelog:', updated.changelog);
                console.log('Language:', updated.language);
                console.log('Image URL:', updated.imageUrl);
                console.log('Gallery:', updated.gallery);
                
                // Count imported items
                let importedCount = 0;
                const importedItems: string[] = [];
                
                // Update the edit data with imported values (only if they exist)
                if (updated.keyFeatures && updated.keyFeatures.length > 0) {
                    this.editData.keyFeatures = JSON.parse(JSON.stringify(updated.keyFeatures));
                    importedCount += updated.keyFeatures.length;
                    importedItems.push(`${updated.keyFeatures.length} Key Features`);
                }
                if (updated.responsibilities && updated.responsibilities.length > 0) {
                    this.editData.responsibilities = [...updated.responsibilities];
                    importedCount += updated.responsibilities.length;
                    importedItems.push(`${updated.responsibilities.length} Responsibilities`);
                }
                if (updated.changelog && updated.changelog.length > 0) {
                    this.editData.changelog = JSON.parse(JSON.stringify(updated.changelog));
                    importedCount += updated.changelog.length;
                    importedItems.push(`${updated.changelog.length} Changelog Entries`);
                }

                if (updated.language) {
                    this.editData.language = updated.language;
                    importedItems.push(`Language: ${updated.language}`);
                }
                
                // Note: Images are already saved to the project, just inform the user
                if (updated.imageUrl) {
                    importedItems.push('Main Image');
                }
                if (updated.gallery && updated.gallery.length > 0) {
                    importedItems.push(`${updated.gallery.length} Gallery Images`);
                }
                
                this.isImporting = false;
                this.cdr.detectChanges();
                
                if (importedCount > 0 || updated.imageUrl || (updated.gallery && updated.gallery.length > 0)) {
                    this.toast.success(`Successfully imported: ${importedItems.join(', ')}. Review and save changes.`);
                } else {
                    this.toast.warning('Import completed but no data was found. The repository may not have features, releases, screenshots folder, or README sections.');
                }
            },
            error: (err: any) => {
                console.error('Failed to import from GitHub:', err);
                console.error('Error details:', {
                    status: err.status,
                    statusText: err.statusText,
                    message: err.message,
                    error: err.error,
                    url: err.url
                });
                
                this.isImporting = false;
                this.cdr.detectChanges();
                
                let errorMessage = 'Failed to import from GitHub. ';
                if (err.status === 401) {
                    errorMessage = 'Your session has expired. Please log in again.';
                } else if (err.status === 404) {
                    errorMessage = 'Repository not found. Please check the URL.';
                } else if (err.error?.message) {
                    errorMessage += err.error.message;
                } else {
                    errorMessage += 'Please check the URL and try again.';
                }
                
                this.toast.error(errorMessage);
            }
        });
    }

    // Gallery Images Management
    onImageFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) return;

        const file = input.files[0];

        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.toast.error('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.toast.error('Image size must be less than 5MB');
            return;
        }

        this.uploadImage(file);
    }

    uploadImage(file: File) {
        // Check if user is logged in
        if (!this.auth.isLoggedIn()) {
            this.toast.error('You must be logged in to upload images');
            return;
        }

        this.isUploading = true;
        const formData = new FormData();
        formData.append('file', file);

        this.http.post<{ url: string }>(`${environment.apiUrl}/uploads/project-image`, formData)
            .subscribe({
                next: (response) => {
                    this.editData.imageUrl = response.url;
                    this.isUploading = false;
                    this.cdr.detectChanges();
                    this.toast.success('Image uploaded successfully');
                },
                error: (err) => {
                    this.isUploading = false;
                    this.cdr.detectChanges();
                    console.error('Image Upload Error:', err);

                    if (err.status === 401) {
                        this.toast.error('Authentication failed. Please log in again.');
                        this.auth.logout();
                        window.location.href = '/login';
                    } else if (err.status === 400) {
                        this.toast.error(err.error?.message || 'Invalid file. Please check file type and size.');
                    } else if (err.status === 500) {
                        this.toast.error(err.error || 'Server error while uploading image');
                    } else {
                        this.toast.error('Failed to upload image. Please try again.');
                    }
                }
            });
    }

    onGalleryFilesSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) return;

        // Check if user is logged in
        if (!this.auth.isLoggedIn()) {
            this.toast.error('You must be logged in to upload images');
            return;
        }

        const files = Array.from(input.files);

        // Initialize gallery array if it doesn't exist
        if (!this.editData.gallery) {
            this.editData.gallery = [];
        }

        // Validate total number of images (max 10)
        if (this.editData.gallery.length + files.length > 10) {
            this.toast.error('Maximum 10 gallery images allowed');
            return;
        }

        // Validate each file
        for (const file of files) {
            if (!file.type.startsWith('image/')) {
                this.toast.error(`${file.name} is not an image file`);
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                this.toast.error(`${file.name} is larger than 5MB`);
                return;
            }
        }

        this.uploadGalleryImages(files);
    }

    uploadGalleryImages(files: File[]) {
        this.isUploadingGallery = true;
        let uploadedCount = 0;
        const totalFiles = files.length;

        files.forEach(file => {
            const formData = new FormData();
            formData.append('file', file);

            this.http.post<{ url: string }>(`${environment.apiUrl}/uploads/project-image`, formData)
                .subscribe({
                    next: (response) => {
                        this.editData.gallery.push(response.url);
                        uploadedCount++;

                        if (uploadedCount === totalFiles) {
                            this.isUploadingGallery = false;
                            this.cdr.detectChanges();
                            this.toast.success(`${totalFiles} image(s) uploaded successfully`);
                        }
                    },
                    error: (err) => {
                        uploadedCount++;
                        console.error('Gallery Upload Error:', err);

                        if (uploadedCount === totalFiles) {
                            this.isUploadingGallery = false;
                            this.cdr.detectChanges();
                        }

                        if (err.status === 401) {
                            this.toast.error('Authentication failed. Please log in again.');
                            this.auth.logout();
                            window.location.href = '/login';
                        } else {
                            this.toast.error(`Failed to upload ${file.name}`);
                        }
                    }
                });
        });
    }

    removeGalleryImage(index: number) {
        if (this.editData.gallery) {
            this.editData.gallery.splice(index, 1);
            this.toast.success('Image removed from gallery');
            this.cdr.detectChanges();
        }
    }

    // Company autocomplete methods
    onCompanyInput(value: string) {
        if (!value || value.trim() === '') {
            this.filteredCompanySuggestions = this.companySuggestions;
            this.showCompanySuggestions = true;
            this.cdr.detectChanges();
            return;
        }

        this.filteredCompanySuggestions = this.companySuggestions.filter(company =>
            company.toLowerCase().includes(value.toLowerCase())
        );
        this.showCompanySuggestions = true;
        this.cdr.detectChanges();
    }

    selectCompany(company: string) {
        this.editData.company = company;
        this.showCompanySuggestions = false;
        this.cdr.detectChanges();
    }

    onCompanyBlur() {
        setTimeout(() => {
            this.showCompanySuggestions = false;
            this.cdr.detectChanges();
        }, 200);
    }

    // Company AR autocomplete methods
    onCompanyArInput(value: string) {
        if (!value || value.trim() === '') {
            this.filteredCompanyArSuggestions = this.companyArSuggestions;
            this.showCompanyArSuggestions = true;
            this.cdr.detectChanges();
            return;
        }

        this.filteredCompanyArSuggestions = this.companyArSuggestions.filter(company =>
            company.includes(value)
        );
        this.showCompanyArSuggestions = true;
        this.cdr.detectChanges();
    }

    selectCompanyAr(company: string) {
        this.editData.company_Ar = company;
        this.showCompanyArSuggestions = false;
        this.cdr.detectChanges();
    }

    onCompanyArBlur() {
        setTimeout(() => {
            this.showCompanyArSuggestions = false;
            this.cdr.detectChanges();
        }, 200);
    }

    // Tag/Technology management
    onTagInputChange(value: string) {
        this.tagInput = value;

        if (!value || value.trim() === '') {
            this.filteredTechSuggestions = this.techSuggestions.filter(tech =>
                !this.selectedTags.includes(tech)
            );
            this.showTechSuggestions = true;
            this.cdr.detectChanges();
            return;
        }

        this.filteredTechSuggestions = this.techSuggestions.filter(tech =>
            tech.toLowerCase().includes(value.toLowerCase()) &&
            !this.selectedTags.includes(tech)
        );

        this.showTechSuggestions = this.filteredTechSuggestions.length > 0;
        this.cdr.detectChanges();
    }

    selectTech(tech: string) {
        if (this.selectedTags.includes(tech)) {
            this.toast.warning(`"${tech}" is already added`);
            return;
        }

        this.selectedTags.push(tech);
        this.editData.tags = this.selectedTags.join(', ');
        this.tagInput = '';
        this.showTechSuggestions = false;
        this.cdr.detectChanges();
    }

    addCustomTag() {
        const tag = this.tagInput.trim();
        if (!tag) return;

        if (this.selectedTags.includes(tag)) {
            this.toast.warning(`"${tag}" is already added`);
            this.tagInput = '';
            return;
        }

        this.selectedTags.push(tag);
        this.editData.tags = this.selectedTags.join(', ');
        this.tagInput = '';
        this.showTechSuggestions = false;
        this.cdr.detectChanges();
    }

    removeTag(index: number) {
        this.selectedTags.splice(index, 1);
        this.editData.tags = this.selectedTags.join(', ');
        this.cdr.detectChanges();
    }

    onTagsBlur() {
        setTimeout(() => {
            this.showTechSuggestions = false;
            this.cdr.detectChanges();
        }, 200);
    }

    getFullImageUrl(url: string): string {
        if (!url) return 'assets/project-placeholder.svg';

        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }

        const baseUrl = environment.apiUrl.replace('/api', '');
        if (url.startsWith('/')) {
            return `${baseUrl}${url}`;
        }

        return `${baseUrl}/${url}`;
    }
}
