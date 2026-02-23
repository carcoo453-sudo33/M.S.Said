import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Client } from '../../../models';
import { AuthService } from '../../../services/auth.service';
import { ProfileService } from '../../../services/profile.service';
import { ToastService } from '../../../services/toast.service';
import { LucideAngularModule, Edit3, Trash2, X, Save, Plus, AlertTriangle } from 'lucide-angular';

@Component({
    selector: 'app-projects-brand-slider',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, FormsModule],
    template: `
    <section class="mt-48 overflow-hidden py-20 border-t border-b border-zinc-100 dark:border-zinc-900 relative">
        <!-- Admin Panel -->
        <div *ngIf="auth.isLoggedIn()" class="absolute top-4 right-4 z-20">
            <button (click)="openCreateModal()"
                class="px-6 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 flex items-center gap-2">
                <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon>
                Add Client
            </button>
        </div>

        <div class="flex animate-marquee gap-24 items-center">
            <ng-container *ngFor="let i of [1,2]">
                <div *ngFor="let client of clients"
                    class="w-48 shrink-0 flex items-center justify-center grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-500 relative group">
                    <span class="text-2xl font-black tracking-tighter text-zinc-400 hover:text-red-600 transition-colors uppercase italic">{{ client.name }}</span>
                    
                    <!-- Admin Actions on Hover -->
                    <div *ngIf="auth.isLoggedIn()" class="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button (click)="onEdit(client)"
                            class="w-7 h-7 rounded-lg bg-black/80 backdrop-blur-md flex items-center justify-center text-white hover:text-red-500 border border-white/10 transition-all">
                            <lucide-icon [img]="EditIcon" class="w-3 h-3"></lucide-icon>
                        </button>
                        <button (click)="onDelete(client)"
                            class="w-7 h-7 rounded-lg bg-black/80 backdrop-blur-md flex items-center justify-center text-white hover:text-red-600 border border-white/10 transition-all">
                            <lucide-icon [img]="DeleteIcon" class="w-3 h-3"></lucide-icon>
                        </button>
                    </div>
                </div>
            </ng-container>
        </div>
    </section>

    <!-- Edit/Create Modal -->
    <div *ngIf="showEditModal" class="modal-overlay" (click)="closeEditModal()">
        <div class="modal-content max-w-lg max-h-[90vh]" (click)="$event.stopPropagation()">
            <div class="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 p-5 flex items-center justify-between z-10">
                <h3 class="text-base font-black dark:text-white text-zinc-900">{{ isCreating ? 'Add Client' : 'Edit Client' }}</h3>
                <button (click)="closeEditModal()"
                    class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-red-500 transition-all">
                    <lucide-icon [img]="XIcon" class="w-4 h-4"></lucide-icon>
                </button>
            </div>

            <div class="p-5 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                <div>
                    <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Client Name *</label>
                    <input [(ngModel)]="editingClient.name" placeholder="Company or brand name"
                        [class]="submitted && !editingClient.name?.trim() ? 'border-red-500 ring-2 ring-red-500/30' : 'border-zinc-200 dark:border-zinc-700'"
                        class="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all border">
                    <p *ngIf="submitted && !editingClient.name?.trim()" class="text-red-500 text-[10px] font-bold mt-1.5">Client name is required</p>
                </div>

                <div>
                    <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 block">Logo URL</label>
                    <input [(ngModel)]="editingClient.logoUrl" placeholder="https://... or /uploads/clients/logo.png"
                        class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all">
                    <p class="text-zinc-400 text-[10px] mt-1.5">Optional: URL to client logo image</p>
                </div>
            </div>

            <div class="sticky bottom-0 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 p-5 flex items-center justify-end gap-3">
                <button (click)="closeEditModal()"
                    class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all">Cancel</button>
                <button (click)="saveClient()" [disabled]="isSaving"
                    class="px-8 py-2.5 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center gap-2">
                    <lucide-icon [img]="SaveIcon" class="w-3.5 h-3.5"></lucide-icon>
                    {{ isSaving ? 'Saving...' : 'Save' }}
                </button>
            </div>
        </div>
    </div>

    <!-- Delete Confirmation -->
    <div *ngIf="deleteClient" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" (click)="deleteClient = null"></div>
        <div class="relative bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl w-full max-w-sm p-6 text-center animate-modal-enter">
            <div class="w-14 h-14 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <lucide-icon [img]="AlertIcon" class="w-7 h-7 text-red-500"></lucide-icon>
            </div>
            <h4 class="text-base font-black dark:text-white text-zinc-900 mb-2">Delete Client?</h4>
            <p class="text-sm text-zinc-500 mb-6">Are you sure you want to delete <strong class="text-zinc-900 dark:text-white">{{ deleteClient?.name }}</strong>?</p>
            <div class="flex items-center justify-center gap-3">
                <button (click)="deleteClient = null"
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
export class ProjectsBrandSliderComponent {
    public auth = inject(AuthService);
    private profileService = inject(ProfileService);
    private toast = inject(ToastService);

    @Input() clients: Client[] = [];
    @Output() clientsUpdated = new EventEmitter<Client[]>();

    EditIcon = Edit3;
    DeleteIcon = Trash2;
    XIcon = X;
    SaveIcon = Save;
    PlusIcon = Plus;
    AlertIcon = AlertTriangle;

    showEditModal = false;
    isSaving = false;
    isDeleting = false;
    submitted = false;
    isCreating = false;
    deleteClient: Client | null = null;
    editingClient: Partial<Client> = {};

    onEdit(client: Client) {
        this.editingClient = { ...client };
        this.isCreating = false;
        this.submitted = false;
        this.showEditModal = true;
    }

    onDelete(client: Client) {
        this.deleteClient = client;
    }

    openCreateModal() {
        this.editingClient = {
            name: '',
            logoUrl: ''
        };
        this.isCreating = true;
        this.submitted = false;
        this.showEditModal = true;
    }

    closeEditModal() {
        this.showEditModal = false;
        this.editingClient = {};
    }

    saveClient() {
        this.submitted = true;

        if (!this.editingClient.name?.trim()) {
            this.toast.error('Please fill in all required fields');
            return;
        }

        this.isSaving = true;

        const clientData: any = {
            id: this.editingClient.id || crypto.randomUUID(),
            name: this.editingClient.name,
            logoUrl: this.editingClient.logoUrl || ''
        };

        const request = this.isCreating
            ? this.profileService.createClient(clientData)
            : this.profileService.updateClient(this.editingClient.id!, clientData);

        request.subscribe({
            next: (savedClient: Client) => {
                if (this.isCreating) {
                    this.clients = [...this.clients, savedClient];
                } else {
                    const index = this.clients.findIndex(c => c.id === savedClient.id);
                    if (index !== -1) {
                        this.clients[index] = savedClient;
                        this.clients = [...this.clients];
                    }
                }
                this.clientsUpdated.emit(this.clients);
                this.isSaving = false;
                this.showEditModal = false;
                this.toast.success(`Client ${this.isCreating ? 'created' : 'updated'} successfully`);
            },
            error: (err) => {
                this.isSaving = false;
                this.toast.error(`Failed to ${this.isCreating ? 'create' : 'update'} client`);
                console.error('Client Save Error:', err);
            }
        });
    }

    executeDelete() {
        if (!this.deleteClient?.id) return;

        this.isDeleting = true;
        this.profileService.deleteClient(this.deleteClient.id).subscribe({
            next: () => {
                this.clients = this.clients.filter(c => c.id !== this.deleteClient!.id);
                this.clientsUpdated.emit(this.clients);
                this.deleteClient = null;
                this.isDeleting = false;
                this.toast.success('Client deleted successfully');
            },
            error: (err) => {
                this.isDeleting = false;
                this.deleteClient = null;
                if (err.status === 401) {
                    this.toast.error('Authentication failed. Please log in again.');
                    this.auth.logout();
                    window.location.href = '/login';
                } else {
                    this.toast.error('Failed to delete client');
                }
                console.error('Client Delete Error:', err);
            }
        });
    }
}
