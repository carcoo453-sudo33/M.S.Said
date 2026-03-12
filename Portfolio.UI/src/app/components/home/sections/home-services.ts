import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { LucideAngularModule, Code, Zap, Monitor, Database, Terminal, FileCode, Mail, Phone, MapPin, Pencil } from 'lucide-angular';
import { ServiceEntry } from '../../../models';
import { AuthService } from '../../../services/auth.service';
import { HomeService } from '../../../services/home.service';
import { ToastService } from '../../../services/toast.service';
import { TranslationService } from '../../../services/translation.service';
import { TranslationUtil } from '../../../utils';
import { HomeServicesModalComponent } from './home-services-modal';

@Component({
    selector: 'app-home-services',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, TranslateModule, HomeServicesModalComponent],
    template: `
    <section id="services" class="animate-fade-in-up pt-10 mb-5">
        <div class="flex items-center gap-4 mb-10 relative">
            <div class="w-1 h-8 bg-red-600 rounded-full"></div>
            <h2 class="text-xl font-black dark:text-white text-zinc-900 tracking-tight">{{ 'home.services.title' | translate }}</h2>
            <button *ngIf="auth.isLoggedIn()" (click)="openEditModal()"
                class="ms-auto w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center hover:scale-110 hover:text-red-500 transition-all">
                <lucide-icon [img]="EditIcon" class="w-3.5 h-3.5"></lucide-icon>
            </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div *ngFor="let service of translatedServices"
                class="group bg-zinc-50 dark:bg-zinc-900/40 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-red-600 hover:shadow-xl hover:shadow-red-600/10 hover:-translate-y-1 transition-all duration-500">
                <div class="w-12 h-12 bg-white dark:bg-zinc-800 rounded-xl flex items-center justify-center mb-5 group-hover:bg-red-600 transition-all shadow-sm">
                    <lucide-icon [img]="getServiceIcon(service.icon)" class="w-5 h-5 text-red-600 group-hover:text-white transition-colors"></lucide-icon>
                </div>
                <h3 class="text-base font-bold mb-2 dark:text-white text-zinc-900 group-hover:text-red-600 transition-colors">{{ service.title }}</h3>
                <p class="text-zinc-500 text-sm leading-relaxed">{{ service.description }}</p>
            </div>
        </div>
    </section>

    <!-- Use Modal Component -->
    <app-home-services-modal
        [isOpen]="showEditModal"
        [services]="services"
        [isSaving]="isSaving"
        [isDeleting]="isDeleting"
        (closed)="closeEditModal()"
        (saved)="saveServices($event)"
        (deleted)="deleteService($event)">
    </app-home-services-modal>
  `
})
export class HomeServicesComponent {
    public readonly auth = inject(AuthService);
    private readonly homeService = inject(HomeService);
    private readonly toast = inject(ToastService);
    private readonly translationService = inject(TranslationService);

    @Input() services: ServiceEntry[] = [];
    @Output() servicesUpdated = new EventEmitter<ServiceEntry[]>();

    EditIcon = Pencil;

    showEditModal = false;
    isSaving = false;
    isDeleting = false;

    get translatedServices(): ServiceEntry[] {
        const currentLang = this.translationService.currentLang$();
        return TranslationUtil.translateArray(this.services, ['title', 'description'], currentLang);
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

    openEditModal(): void {
        this.showEditModal = true;
    }

    closeEditModal(): void {
        this.showEditModal = false;
    }

    saveServices(editList: ServiceEntry[]): void {
        if (editList.length === 0) {
            this.services = [];
            this.servicesUpdated.emit(this.services);
            this.showEditModal = false;
            return;
        }

        this.isSaving = true;
        const requests = editList.map(item => {
            const isExisting = this.services.some(s => s.id === item.id);
            return isExisting
                ? this.homeService.updateService(item.id, item)
                : this.homeService.createService(item);
        });

        forkJoin(requests).subscribe({
            next: (savedServices) => {
                this.services = [...savedServices];
                this.servicesUpdated.emit(this.services);
                this.isSaving = false;
                this.showEditModal = false;
                this.toast.success('Services saved successfully');
            },
            error: (err: any) => {
                this.isSaving = false;
                this.toast.error('Some services could not be saved');
                console.error('Service Save Error:', err);
            }
        });
    }

    deleteService(serviceId: string): void {
        this.isDeleting = true;
        this.homeService.deleteService(serviceId).subscribe({
            next: () => {
                this.services = this.services.filter(s => s.id !== serviceId);
                this.servicesUpdated.emit(this.services);
                this.isDeleting = false;
                this.toast.success('Service deleted successfully');
            },
            error: (err: any) => {
                this.isDeleting = false;
                this.toast.error('Failed to delete service: ' + (err.error?.message || err.statusText || 'Server error'));
            }
        });
    }
}
