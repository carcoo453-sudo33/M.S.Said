import { Component, Input, Output, EventEmitter, inject, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Mail, MapPin, Linkedin, Github, MessageCircle, Download, Phone, Edit3, Twitter, X, Save, AlertTriangle, CheckCircle, Upload as LucideUpload, Image as LucideImage, FileText, Plus, Trash2 } from 'lucide-angular';
import { BioEntry } from '../../../models';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../services/auth.service';
import { ProfileService } from '../../../services/profile.service';
import { ToastService } from '../../../services/toast.service';
import { TranslationHelperService } from '../../../services/translation-helper.service';
import { SignalRService } from '../../../services/signalr.service';

@Component({
    selector: 'app-home-sidebar-profile',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, FormsModule, TranslateModule],
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

            <!-- Divider -->
            <div class="mx-6 border-t border-zinc-200 dark:border-zinc-800 my-4"></div>

            <!-- Contact Info -->
            <div class="px-6 space-y-2 pb-6">
                <!-- Mail -->
                <div class="flex items-center gap-3 py-2 group">
                    <div class="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-red-500 transition-all">
                        <lucide-icon [img]="MailIcon" class="w-3.5 h-3.5 text-zinc-400 group-hover:text-white"></lucide-icon>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-[8px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-0.5">Email</span>
                        <a [href]="'mailto:' + bio?.email" class="text-[10px] font-bold dark:text-white text-zinc-900 truncate hover:text-red-500 transition-colors">{{ bio?.email }}</a>
                    </div>
                </div>

                <!-- Phone -->
                <div class="flex items-center gap-3 py-2 group">
                    <div class="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-red-500 transition-all">
                        <lucide-icon [img]="PhoneIcon" class="w-3.5 h-3.5 text-zinc-400 group-hover:text-white"></lucide-icon>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-[8px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-0.5">Phone</span>
                        <span class="text-[10px] font-bold dark:text-white text-zinc-900">{{ bio?.phone }}</span>
                    </div>
                </div>

                <!-- Location -->
                <div class="flex items-center gap-3 py-2 group">
                    <div class="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-red-500 transition-all">
                        <lucide-icon [img]="MapPinIcon" class="w-3.5 h-3.5 text-zinc-400 group-hover:text-white"></lucide-icon>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-[8px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-0.5">{{ 'common.location' | translate }}</span>
                        <span class="text-[10px] font-bold dark:text-white text-zinc-900">{{ translatedLocation }}</span>
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
                <a *ngIf="bio?.whatsAppUrl" [href]="getWhatsAppUrl()" target="_blank" 
                    class="w-12 h-12 bg-white dark:bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-500 border border-zinc-200 dark:border-zinc-800 hover:-rotate-12 hover:scale-110 hover:bg-[#25D366] hover:border-[#25D366] hover:shadow-[0_0_20px_rgba(37,211,102,0.5)]">
                    <lucide-icon [img]="MessageCircleIcon" class="w-5 h-5"></lucide-icon>
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

    <!-- Edit Modal -->
    <div *ngIf="showEditModal" class="modal-overlay" (click)="closeEditModal()">
        <div class="modal-content max-w-lg" (click)="$event.stopPropagation()">
            <!-- Modal Header -->
            <div class="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-5 flex items-center justify-between z-10">
                <h3 class="text-base font-black dark:text-white text-zinc-900">Edit Profile</h3>
                <button (click)="closeEditModal()"
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

                <!-- URLs -->
                <div>
                    <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Avatar URL</label>
                    <input [(ngModel)]="editForm.avatarUrl" type="text"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                </div>
                <div class="grid grid-cols-2 gap-6">
                    <div>
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">LinkedIn URL</label>
                        <input [(ngModel)]="editForm.linkedInUrl" type="text"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                    </div>
                    <div>
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">GitHub URL</label>
                        <input [(ngModel)]="editForm.gitHubUrl" type="text"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-6">
                    <div>
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Twitter URL</label>
                        <input [(ngModel)]="editForm.twitterUrl" type="text"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                    </div>
                    <div>
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">WhatsApp Number</label>
                        <input [(ngModel)]="editForm.whatsAppUrl" type="text"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                    </div>
                </div>
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

                <!-- Divider -->
                <div class="border-t border-zinc-200 dark:border-zinc-800"></div>

                <!-- Stats -->
                <div class="grid grid-cols-3 gap-6 pb-4">
                    <div>
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Yrs Exp.</label>
                        <input [(ngModel)]="editForm.yearsOfExperience" type="text"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                    </div>
                    <div>
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Projects</label>
                        <input [(ngModel)]="editForm.projectsCompleted" type="text"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                    </div>
                    <div>
                        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Commits</label>
                        <input [(ngModel)]="editForm.codeCommits" type="text"
                            class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                    </div>
                </div>
            </div>

            <!-- Modal Footer -->
            <div class="sticky bottom-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 p-5 flex items-center justify-end gap-3">
                <button (click)="closeEditModal()"
                    class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all">
                    Cancel
                </button>
                <button (click)="saveBio()" [disabled]="isSaving"
                    class="px-8 py-2.5 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center gap-2">
                    <lucide-icon [img]="SaveIcon" class="w-3.5 h-3.5"></lucide-icon>
                    {{ isSaving ? 'Saving...' : 'Save Changes' }}
                </button>
            </div>
        </div>
    </div>
    `,
    styles: []
})
export class HomeSidebarProfileComponent implements OnChanges {
    public auth = inject(AuthService);
    private profileService = inject(ProfileService);
    private toast = inject(ToastService);
    public translationHelper = inject(TranslationHelperService);
    public signalRService = inject(SignalRService);

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
    PhoneIcon = Phone;
    EditIcon = Edit3; XIcon = X; SaveIcon = Save; PlusIcon = Plus; TrashIcon = Trash2; UploadIcon = LucideUpload; ImageIcon = LucideImage;
    FileIcon = FileText;

    // Edit modal state
    showEditModal = false;
    isSaving = false;
    submitted = false;
    isUploadingAvatar = false;
    isUploadingCV = false;
    avatarPreview: string | null = null;
    editForm: BioEntry = this.getEmptyBio();
    
    // Cached URLs to prevent ExpressionChangedAfterItHasBeenCheckedError
    cachedAvatarUrl: string = '';
    cachedCVUrl: string | null = null;

    get translatedName(): string {
        return this.translationHelper.getTranslatedField(this.bio, 'name');
    }

    get translatedTitle(): string {
        return this.translationHelper.getTranslatedField(this.bio, 'title');
    }

    get translatedLocation(): string {
        return this.translationHelper.getTranslatedField(this.bio, 'location');
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
        if (this.bio) {
            console.log('Bio data received:', this.bio);
            // Reconcile ID casing
            const id = this.bio.id || (this.bio as any).Id || (this.bio as any).ID || crypto.randomUUID();
            this.editForm = { ...this.bio, id };
        } else {
            this.editForm = this.getEmptyBio();
            this.editForm.id = crypto.randomUUID(); // Ensure we have an ID for upsert
        }
        this.submitted = false;
        this.showEditModal = true;
    }

    closeEditModal() {
        this.showEditModal = false;
        this.avatarPreview = null;
    }

    onAvatarSelected(event: any) {
        const file = event.target.files[0];
        if (!file) return;

        // Preview
        const reader = new FileReader();
        reader.onload = () => this.avatarPreview = reader.result as string;
        reader.readAsDataURL(file);

        // Upload
        this.isUploadingAvatar = true;
        this.profileService.uploadAvatar(file).subscribe({
            next: (res) => {
                this.editForm.avatarUrl = res.url;
                this.isUploadingAvatar = false;
                this.toast.success('Photo uploaded! Save to apply changes.');
            },
            error: (err) => {
                this.isUploadingAvatar = false;
                this.toast.error('Upload failed: ' + (err.error?.message || 'Server error'));
                this.avatarPreview = null;
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
                this.toast.success('CV uploaded! Save to apply changes.');
            },
            error: (err) => {
                this.isUploadingCV = false;
                this.toast.error('CV upload failed: ' + (err.error?.message || 'Server error'));
            }
        });
    }

    saveBio() {
        this.submitted = true;
        if (!this.editForm.name.trim() || !this.editForm.email.trim()) {
            this.toast.error('Please fill in all required fields');
            return;
        }
        if (!this.editForm.id) {
            this.toast.error('System error: Profile ID is missing. Please refresh.');
            return;
        }
        this.isSaving = true;
        this.profileService.updateBio(this.editForm.id, this.editForm).subscribe({
            next: () => {
                this.bio = { ...this.editForm };
                // Reset cached URLs after bio update
                this.cachedAvatarUrl = '';
                this.cachedCVUrl = null;
                this.bioUpdated.emit(this.bio);
                this.showEditModal = false;
                this.isSaving = false;
                this.toast.success('Profile updated successfully');
            },
            error: (err) => {
                this.isSaving = false;
                this.toast.error('Failed to save: ' + (err.error?.message || err.statusText || 'Server error'));
            }
        });
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
            // Clean up leading slashes to avoid double slashes
            const cleanPath = avatar.startsWith('/') ? avatar.substring(1) : avatar;
            const baseUrl = environment.apiUrl.replace('/api', '').replace(/\/$/, '');
            this.cachedAvatarUrl = `${baseUrl}/${cleanPath}`;
        }
        
        return this.cachedAvatarUrl;
    }

    getCVUrl() {
        const cv = this.bio?.cvUrl;
        if (!cv) return null;
        if (cv.startsWith('http')) return cv;
        const cleanPath = cv.startsWith('/') ? cv.substring(1) : cv;
        const baseUrl = environment.apiUrl.replace('/api', '').replace(/\/$/, '');
        return `${baseUrl}/${cleanPath}`;
    }

    getWhatsAppUrl() {
        if (!this.bio?.whatsAppUrl) return '#';
        // Remove all non-digit characters for WhatsApp API
        const cleanNumber = this.bio.whatsAppUrl.replace(/\D/g, '');
        return `https://wa.me/${cleanNumber}`;
    }
}
