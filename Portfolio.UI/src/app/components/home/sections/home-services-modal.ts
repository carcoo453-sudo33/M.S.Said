import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Code, Zap, Monitor, Database, Terminal, FileCode, Mail, Phone, MapPin, X, Save, Plus, Trash2 } from 'lucide-angular';
import { ServiceEntry } from '../../../models';
import { TranslationService } from '../../../services/translation.service';
import { DeleteConfirmationModalComponent } from '../../shared/modals/delete-confirmation-modal';

@Component({
    selector: 'app-home-services-modal',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule, LucideAngularModule, DeleteConfirmationModalComponent],
    template: `
        <!-- Edit Modal -->
        <div *ngIf="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" (click)="onClose()">
            <div class="relative bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-2xl w-2/3 max-h-[90vh] overflow-hidden flex flex-col animate-modal-enter mt-20" (click)="$event.stopPropagation()">
                <!-- Header -->
                <div class="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-5 flex items-center justify-between z-20">
                    <h3 class="text-base font-black dark:text-white text-zinc-900">{{ 'home.services.manageTitle' | translate }}</h3>
                    <div class="flex items-center gap-2">
                        <button (click)="addNewService()"
                            class="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-all">
                            <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon>
                        </button>
                        <button (click)="onClose()"
                            class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-red-500 transition-all">
                            <lucide-icon [img]="XIcon" class="w-4 h-4"></lucide-icon>
                        </button>
                    </div>
                </div>

                <!-- Body -->
                <div class="p-5 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                    <div *ngFor="let item of editList; let i = index"
                        class="p-4 rounded-xl border space-y-3"
                        [class]="submitted && !item.title.trim() ? 'border-red-500/50 bg-red-600/5' : 'border-zinc-200 dark:border-zinc-700'">
                        <div class="flex items-center justify-between">
                            <span class="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{{ 'home.services.serviceLabel' | translate }} {{ i + 1 }}</span>
                            <button (click)="confirmDelete(i)"
                                class="w-7 h-7 rounded-lg bg-red-600/10 text-red-500 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all">
                                <lucide-icon [img]="TrashIcon" class="w-3.5 h-3.5"></lucide-icon>
                            </button>
                        </div>
                        <div>
                            <label [attr.for]="'service-title-' + i" class="hidden">Service Title</label>
                            <input [id]="'service-title-' + i" [name]="'service-title-' + i" [(ngModel)]="item.title" placeholder="Title (EN) *"
                                [class]="submitted && !item.title.trim() ? 'border-red-500 ring-2 ring-red-500/30' : 'border-zinc-200 dark:border-zinc-700 focus:ring-red-500/30 focus:border-red-500'"
                                class="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 transition-all border">
                            <p *ngIf="submitted && !item.title.trim()" class="text-red-500 text-[10px] font-bold mt-1.5 ms-1">Title is required</p>
                        </div>
                        <div>
                            <label [attr.for]="'service-title-ar-' + i" class="hidden">Service Title (AR)</label>
                            <input [id]="'service-title-ar-' + i" [name]="'service-title-ar-' + i" [ngModel]="item.title_Ar" (ngModelChange)="item.title_Ar = $event" placeholder="Title (AR)" dir="rtl"
                                class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                        </div>
                        <div>
                            <label [attr.for]="'service-desc-' + i" class="hidden">Service Description</label>
                            <textarea [id]="'service-desc-' + i" [name]="'service-desc-' + i" [(ngModel)]="item.description" placeholder="Description (EN)" rows="2"
                                class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all resize-none"></textarea>
                        </div>
                        <div>
                            <label [attr.for]="'service-desc-ar-' + i" class="hidden">Service Description (AR)</label>
                            <textarea [id]="'service-desc-ar-' + i" [name]="'service-desc-ar-' + i" [ngModel]="item.description_Ar" (ngModelChange)="item.description_Ar = $event" placeholder="Description (AR)" rows="2" dir="rtl"
                                class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all resize-none"></textarea>
                        </div>
                        <div>
                            <label [attr.for]="'service-icon-' + i" class="hidden">Service Icon</label>
                            <input [id]="'service-icon-' + i" [name]="'service-icon-' + i" [(ngModel)]="item.icon" placeholder="Icon (e.g. code, zap, monitor)"
                                class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="sticky bottom-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 p-5 flex items-center justify-end gap-3">
                    <button (click)="onClose()"
                        class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all">{{ 'common.cancel' | translate }}</button>
                    <button (click)="onSave()" [disabled]="isSaving"
                        class="px-8 py-2.5 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center gap-2">
                        <lucide-icon [img]="SaveIcon" class="w-3.5 h-3.5"></lucide-icon>
                        {{ isSaving ? ('common.saving' | translate) : ('common.saveAll' | translate) }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <app-delete-confirmation-modal
            [isOpen]="deleteIndex !== null"
            [itemName]="editList[deleteIndex!]?.title || 'this service'"
            [isDeleting]="isDeleting"
            (cancel)="deleteIndex = null"
            (confirm)="executeDelete()">
        </app-delete-confirmation-modal>
    `
})
export class HomeServicesModalComponent implements OnChanges {
    private readonly translationService = inject(TranslationService);

    @Input() isOpen = false;
    @Input() services: ServiceEntry[] = [];
    @Input() isSaving = false;
    @Input() isDeleting = false;
    @Output() closed = new EventEmitter<void>();
    @Output() saved = new EventEmitter<ServiceEntry[]>();
    @Output() deleted = new EventEmitter<string>();

    XIcon = X;
    SaveIcon = Save;
    PlusIcon = Plus;
    TrashIcon = Trash2;

    editList: ServiceEntry[] = [];
    submitted = false;
    deleteIndex: number | null = null;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['isOpen'] && this.isOpen && this.services) {
            this.editList = this.services.map(s => ({ ...s }));
            this.submitted = false;
        }
    }

    onClose(): void {
        this.closed.emit();
    }

    onSave(): void {
        this.submitted = true;
        if (this.editList.some(item => !item.title.trim())) {
            return;
        }
        this.saved.emit(this.editList);
    }

    addNewService(): void {
        this.editList.push({ id: crypto.randomUUID(), title: '', description: '', icon: 'code' });
    }

    confirmDelete(index: number): void {
        this.deleteIndex = index;
    }

    executeDelete(): void {
        if (this.deleteIndex === null) return;
        const item = this.editList[this.deleteIndex];
        if (item.id) {
            this.deleted.emit(item.id);
            this.editList.splice(this.deleteIndex, 1);
        } else {
            this.editList.splice(this.deleteIndex, 1);
        }
        this.deleteIndex = null;
    }

    getServiceIcon(iconName: string): any {
        const icons: { [key: string]: any } = {
            'code': Code, 'code-2': Code, 'zap': Zap, 'monitor': Monitor,
            'database': Database, 'terminal': Terminal, 'file-code': FileCode,
            'mail': Mail, 'phone': Phone, 'map-pin': MapPin, 'layout': Monitor,
            'smartphone': Monitor, 'shopping-cart': Database, 'activity': Zap
        };
        const cleanName = iconName?.replace('lucide-', '')?.toLowerCase();
        return icons[cleanName] || Code;
    }
}
