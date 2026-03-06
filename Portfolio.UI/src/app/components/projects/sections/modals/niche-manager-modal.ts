import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Plus, Trash2 } from 'lucide-angular';

@Component({
    selector: 'app-niche-manager-modal',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    template: `
        <div *ngIf="show" class="modal-overlay" (click)="close.emit()">
            <div class="modal-content max-w-3xl" (click)="$event.stopPropagation()">
                <div class="p-6">
                    <h4 class="text-base font-black dark:text-white text-zinc-900 mb-4">Manage Niches</h4>

                    <div class="grid grid-cols-[1fr_1fr_auto] gap-2 mb-4">
                        <input [(ngModel)]="newNicheName" placeholder="Niche (EN)" (keyup.enter)="addNiche.emit({name: newNicheName, name_Ar: newNicheNameAr})"
                            class="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30">
                        <input [(ngModel)]="newNicheNameAr" placeholder="التخصص (AR)" dir="rtl" (keyup.enter)="addNiche.emit({name: newNicheName, name_Ar: newNicheNameAr})"
                            class="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30">
                        <button (click)="addNiche.emit({name: newNicheName, name_Ar: newNicheNameAr})" [disabled]="!newNicheName.trim()"
                            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon>
                        </button>
                    </div>

                    <div class="border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden mb-4">
                        <table class="w-full">
                            <thead class="bg-zinc-100 dark:bg-zinc-800">
                                <tr>
                                    <th class="px-4 py-2 text-left text-[10px] font-black uppercase text-zinc-600 dark:text-zinc-400">English</th>
                                    <th class="px-4 py-2 text-right text-[10px] font-black uppercase text-zinc-600 dark:text-zinc-400">العربية</th>
                                    <th class="px-4 py-2 text-center text-[10px] font-black uppercase text-zinc-600 dark:text-zinc-400 w-20">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-zinc-200 dark:divide-zinc-700">
                                <tr *ngFor="let niche of niches" class="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                                    <td class="px-4 py-2 text-sm text-zinc-900 dark:text-white">{{ niche.name }}</td>
                                    <td class="px-4 py-2 text-sm text-zinc-900 dark:text-white text-right" dir="rtl">{{ niche.name_Ar || '-' }}</td>
                                    <td class="px-4 py-2 text-center">
                                        <button (click)="removeNiche.emit(niche.id)" class="text-red-600 hover:text-red-700 transition-colors">
                                            <lucide-icon [img]="DeleteIcon" class="w-4 h-4"></lucide-icon>
                                        </button>
                                    </td>
                                </tr>
                                <tr *ngIf="niches.length === 0">
                                    <td colspan="3" class="px-4 py-8 text-center text-sm text-zinc-500">No niches yet. Add one above.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <button (click)="close.emit()"
                        class="w-full px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-700 transition-all">
                        Close
                    </button>
                </div>
            </div>
        </div>
    `
})
export class NicheManagerModalComponent {
    @Input() show = false;
    @Input() niches: any[] = [];
    @Output() close = new EventEmitter<void>();
    @Output() addNiche = new EventEmitter<{name: string, name_Ar?: string}>();
    @Output() removeNiche = new EventEmitter<string>();

    PlusIcon = Plus;
    DeleteIcon = Trash2;
    newNicheName = '';
    newNicheNameAr = '';
}
