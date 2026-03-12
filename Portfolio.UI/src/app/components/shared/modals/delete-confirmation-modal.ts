import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, AlertTriangle } from 'lucide-angular';

@Component({
    selector: 'app-delete-confirmation-modal',
    standalone: true,
    imports: [CommonModule, TranslateModule, LucideAngularModule],
    template: `
        <!-- Delete Confirmation Modal -->
        <div *ngIf="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" (click)="onCancel()">
            <div class="relative bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-2xl w-full max-w-sm overflow-hidden flex flex-col animate-modal-enter" (click)="$event.stopPropagation()">
                <div class="p-6 text-center">
                    <div class="w-14 h-14 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <lucide-icon [img]="AlertIcon" class="w-7 h-7 text-red-500"></lucide-icon>
                    </div>
                    <h4 class="text-base font-black dark:text-white text-zinc-900 mb-2">{{ 'common.deleteConfirm' | translate }}</h4>
                    <p class="text-sm text-zinc-500 mb-6">
                        {{ 'common.deleteMessage' | translate }} 
                        <strong class="text-zinc-900 dark:text-white">{{ itemName }}</strong>? 
                        {{ 'common.deleteWarning' | translate }}
                    </p>
                    <div class="flex items-center justify-center gap-3">
                        <button (click)="onCancel()"
                            class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-700 transition-all">
                            {{ 'common.cancel' | translate }}
                        </button>
                        <button (click)="onConfirm()" [disabled]="isDeleting"
                            class="px-6 py-2.5 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-50">
                            {{ isDeleting ? ('common.deleting' | translate) : ('common.delete' | translate) }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class DeleteConfirmationModalComponent {
    @Input() isOpen = false;
    @Input() itemName = 'this item';
    @Input() isDeleting = false;
    @Output() cancel = new EventEmitter<void>();
    @Output() confirm = new EventEmitter<void>();

    AlertIcon = AlertTriangle;

    onCancel(): void {
        this.cancel.emit();
    }

    onConfirm(): void {
        this.confirm.emit();
    }
}
