import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Plus, Trash2 } from 'lucide-angular';

@Component({
    selector: 'app-project-manage-responsibilities',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    template: `
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
  `
})
export class ProjectManageResponsibilitiesComponent {
    @Input() editData: any = {};
    
    PlusIcon = Plus;
    TrashIcon = Trash2;

    // Responsibilities
    addResponsibility() {
        if (!this.editData.responsibilities) {
            this.editData.responsibilities = [];
        }
        this.editData.responsibilities.push('');
    }

    removeResponsibility(index: number) {
        this.editData.responsibilities.splice(index, 1);
    }
}