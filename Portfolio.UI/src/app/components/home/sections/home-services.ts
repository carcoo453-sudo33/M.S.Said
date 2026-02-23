import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { LucideAngularModule, Code2, Zap, Monitor, Database, Terminal, FileCode, Mail, Phone, MapPin, Edit3, X, Save, Plus, Trash2, AlertTriangle, CheckCircle } from 'lucide-angular';
import { ServiceEntry } from '../../../models';
import { AuthService } from '../../../services/auth.service';
import { ProfileService } from '../../../services/profile.service';
import { ToastService } from '../../../services/toast.service';

@Component({
    selector: 'app-home-services',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, FormsModule],
    template: `
    <section class="animate-fade-in-up pt-10">
        <div class="flex items-center gap-4 mb-10 relative">
            <div class="w-1 h-8 bg-red-600 rounded-full"></div>
            <h2 class="text-xl font-black dark:text-white text-zinc-900 tracking-tight">What I Do</h2>
            <button *ngIf="auth.isLoggedIn()" (click)="openEditModal()"
                class="ms-auto w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center hover:scale-110 hover:text-red-500 transition-all">
                <lucide-icon [img]="EditIcon" class="w-3.5 h-3.5"></lucide-icon>
            </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div *ngFor="let service of services"
                class="group bg-zinc-50 dark:bg-zinc-900/40 p-6 rounded-xl border border-zinc-100 dark:border-zinc-800/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-500">
                <div class="w-12 h-12 bg-white dark:bg-zinc-800 rounded-xl flex items-center justify-center mb-5 group-hover:bg-red-600 transition-all shadow-sm">
                    <lucide-icon [img]="getServiceIcon(service.icon)" class="w-5 h-5 text-red-600 group-hover:text-white transition-colors"></lucide-icon>
                </div>
                <h3 class="text-base font-bold mb-2 dark:text-white text-zinc-900 group-hover:text-red-600 transition-colors">{{ service.title }}</h3>
                <p class="text-zinc-500 text-sm leading-relaxed">{{ service.description }}</p>
            </div>
        </div>
    </section>

    <!-- Edit Modal -->
    <div *ngIf="showEditModal" class="modal-overlay" (click)="closeEditModal()">
        <div class="modal-content max-w-lg" (click)="$event.stopPropagation()">
            <div class="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 p-5 flex items-center justify-between z-10">
                <h3 class="text-base font-black dark:text-white text-zinc-900">Manage Services</h3>
                <div class="flex items-center gap-2">
                    <button (click)="addNewService()"
                        class="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-all">
                        <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon>
                    </button>
                    <button (click)="closeEditModal()"
                        class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-red-500 transition-all">
                        <lucide-icon [img]="XIcon" class="w-4 h-4"></lucide-icon>
                    </button>
                </div>
            </div>

            <div class="p-5 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                <div *ngFor="let item of editList; let i = index"
                    class="p-4 rounded-xl border space-y-3"
                    [class]="submitted && !item.title?.trim() ? 'border-red-500/50 bg-red-600/5' : 'border-zinc-200 dark:border-zinc-700'">
                    <div class="flex items-center justify-between">
                        <span class="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Service {{ i + 1 }}</span>
                        <button (click)="confirmDelete(i)"
                            class="w-7 h-7 rounded-lg bg-red-600/10 text-red-500 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all">
                            <lucide-icon [img]="TrashIcon" class="w-3.5 h-3.5"></lucide-icon>
                        </button>
                    </div>
                    <div>
                        <input [(ngModel)]="item.title" placeholder="Title *"
                            [class]="submitted && !item.title?.trim() ? 'border-red-500 ring-2 ring-red-500/30' : 'border-zinc-200 dark:border-zinc-700 focus:ring-red-500/30 focus:border-red-500'"
                            class="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 transition-all border">
                        <p *ngIf="submitted && !item.title?.trim()" class="text-red-500 text-[10px] font-bold mt-1.5 ms-1">Title is required</p>
                    </div>
                    <textarea [(ngModel)]="item.description" placeholder="Description" rows="2"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all resize-none"></textarea>
                    <input [(ngModel)]="item.icon" placeholder="Icon (e.g. code, zap, monitor)"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                </div>
            </div>
            <div class="sticky bottom-0 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 p-5 flex items-center justify-end gap-3">
                <button (click)="closeEditModal()"
                    class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all">Cancel</button>
                <button (click)="saveServices()" [disabled]="isSaving"
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
            <h4 class="text-base font-black dark:text-white text-zinc-900 mb-2">Delete Service?</h4>
            <p class="text-sm text-zinc-500 mb-6">Are you sure you want to delete <strong class="text-zinc-900 dark:text-white">{{ editList[deleteIndex!]?.title || 'this service' }}</strong>? This action cannot be undone.</p>
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
export class HomeServicesComponent {
    public auth = inject(AuthService);
    private profileService = inject(ProfileService);
    private toast = inject(ToastService);

    @Input() services: ServiceEntry[] = [];
    @Output() servicesUpdated = new EventEmitter<ServiceEntry[]>();

    EditIcon = Edit3; XIcon = X; SaveIcon = Save; PlusIcon = Plus; TrashIcon = Trash2;
    AlertIcon = AlertTriangle; CheckIcon = CheckCircle;

    showEditModal = false;
    isSaving = false;
    isDeleting = false;
    submitted = false;
    editList: ServiceEntry[] = [];
    deleteIndex: number | null = null;

    getServiceIcon(iconName: string): any {
        const icons: { [key: string]: any } = {
            'code': Code2, 'code-2': Code2, 'zap': Zap, 'monitor': Monitor,
            'database': Database, 'terminal': Terminal, 'file-code': FileCode,
            'mail': Mail, 'phone': Phone, 'map-pin': MapPin, 'layout': Monitor,
            'smartphone': Monitor, 'shopping-cart': Database, 'activity': Zap
        };
        const cleanName = iconName?.replace('lucide-', '')?.toLowerCase();
        return icons[cleanName] || Code2;
    }

    openEditModal() {
        this.editList = this.services.map(s => ({ ...s }));
        this.submitted = false;
        this.showEditModal = true;
    }

    closeEditModal() { this.showEditModal = false; }

    addNewService() {
        this.editList.push({ id: crypto.randomUUID(), title: '', description: '', icon: 'code' });
    }

    confirmDelete(index: number) { this.deleteIndex = index; }

    executeDelete() {
        if (this.deleteIndex === null) return;
        const item = this.editList[this.deleteIndex];
        if (item.id) {
            console.log('HomeServices: Deleting service with ID:', item.id);
            this.isDeleting = true;
            this.profileService.deleteService(item.id).subscribe({
                next: () => {
                    this.editList.splice(this.deleteIndex!, 1);
                    this.services = [...this.editList]; // Sync local services
                    this.servicesUpdated.emit(this.services); // Notify parent
                    this.deleteIndex = null;
                    this.isDeleting = false;
                    this.toast.success('Service deleted successfully');
                },
                error: (err) => {
                    this.isDeleting = false;
                    this.deleteIndex = null;
                    this.toast.error('Failed to delete service: ' + (err.error?.message || err.statusText || 'Server error'));
                }
            });
        } else {
            this.editList.splice(this.deleteIndex, 1);
            this.deleteIndex = null;
        }
    }

    saveServices() {
        this.submitted = true;
        if (this.editList.some(item => !item.title?.trim())) {
            this.toast.error('Please fill in all required fields'); return;
        }
        this.isSaving = true;

        if (this.editList.length === 0) {
            this.services = []; this.servicesUpdated.emit(this.services);
            this.showEditModal = false; this.isSaving = false; return;
        }

        const requests = this.editList.map(item => {
            const isExisting = this.services.some(s => s.id === item.id);
            return isExisting
                ? this.profileService.updateService(item.id, item)
                : this.profileService.createService(item);
        });

        forkJoin(requests).subscribe({
            next: (savedServices) => {
                this.services = [...savedServices];
                this.servicesUpdated.emit(this.services);
                this.isSaving = false;
                this.showEditModal = false;
                this.toast.success('Services saved successfully');
            },
            error: (err) => {
                this.isSaving = false;
                this.toast.error('Some services could not be saved');
                console.error('Service Save Error:', err);
            }
        });
    }


}
