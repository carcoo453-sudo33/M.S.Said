import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Zap } from 'lucide-angular';
import { ContactMessage } from '../../../models';

@Component({
    selector: 'app-contact-form',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    template: `
    <div class="animate-fade-in-up" style="animation-delay: 0.2s">
        <div
            class="bg-zinc-50/50 dark:bg-zinc-900/40 p-12 md:p-20 rounded-[4rem] border border-zinc-100 dark:border-zinc-800 backdrop-blur-xl relative overflow-hidden group shadow-sm hover:shadow-2xl transition-all duration-1000">
            <div
                class="absolute inset-0 bg-gradient-to-br from-red-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity">
            </div>

            <form (ngSubmit)="onSubmit()" #contactForm="ngForm" class="space-y-10 relative z-10">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div class="space-y-4">
                        <label
                            class="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.5em] ml-6 italic">Name</label>
                        <input type="text" name="name" [(ngModel)]="model.name" required placeholder="User Name"
                            class="w-full bg-white dark:bg-zinc-950/60 border border-zinc-100 dark:border-zinc-800 rounded-3xl px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] dark:text-white text-zinc-900 placeholder-zinc-300 dark:placeholder-zinc-700 focus:outline-none focus:border-red-600 transition-all shadow-sm">
                    </div>
                    <div class="space-y-4">
                        <label
                            class="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.5em] ml-6 italic">Email</label>
                        <input type="email" name="email" [(ngModel)]="model.email" required
                            placeholder="Endpoint@Email.com"
                            class="w-full bg-white dark:bg-zinc-950/60 border border-zinc-100 dark:border-zinc-800 rounded-3xl px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] dark:text-white text-zinc-900 placeholder-zinc-300 dark:placeholder-zinc-700 focus:outline-none focus:border-red-600 transition-all shadow-sm">
                    </div>
                </div>

                <div class="space-y-4">
                    <label
                        class="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.5em] ml-6 italic">Subject</label>
                    <input type="text" name="subject" [(ngModel)]="model.subject" required
                        placeholder="Strategic Request"
                        class="w-full bg-white dark:bg-zinc-950/60 border border-zinc-100 dark:border-zinc-800 rounded-3xl px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] dark:text-white text-zinc-900 placeholder-zinc-300 dark:placeholder-zinc-700 focus:outline-none focus:border-red-600 transition-all shadow-sm">
                </div>

                <div class="space-y-4">
                    <label
                        class="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.5em] ml-6 italic">Message</label>
                    <textarea name="body" [(ngModel)]="model.message" required rows="6"
                        placeholder="Initiate core briefing here..."
                        class="w-full bg-white dark:bg-zinc-950/60 border border-zinc-100 dark:border-zinc-800 rounded-[3rem] px-8 py-8 text-[10px] font-black uppercase tracking-[0.3em] dark:text-white text-zinc-900 placeholder-zinc-300 dark:placeholder-zinc-700 focus:outline-none focus:border-red-600 transition-all resize-none shadow-sm"></textarea>
                </div>

                <button type="submit" [disabled]="!contactForm.form.valid || loading"
                    class="w-full bg-zinc-900 dark:bg-white text-white dark:text-black font-black py-7 rounded-3xl uppercase tracking-[0.4em] text-[10px] transition-all hover:scale-[1.02] active:scale-95 shadow-2xl disabled:opacity-40 flex items-center justify-center gap-4">
                    <span *ngIf="!loading">Execute Transmission</span>
                    <span *ngIf="loading" class="flex items-center justify-center gap-4">
                        <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        Syncing...
                    </span>
                </button>

                <div *ngIf="success"
                    class="flex items-center gap-4 text-green-500 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 py-6 px-8 rounded-3xl animate-fade-in-up">
                    <lucide-icon [img]="ZapIcon" class="w-5 h-5"></lucide-icon>
                    <p class="font-black text-[10px] uppercase tracking-[0.2em]">Transmission Successful.
                        Awaiting Response.</p>
                </div>
            </form>
        </div>
    </div>
  `
})
export class ContactFormComponent {
    @Input() model: ContactMessage = { name: '', email: '', subject: '', message: '' };
    @Input() loading = false;
    @Input() success = false;
    @Output() submit = new EventEmitter<void>();

    ZapIcon = Zap;

    onSubmit() {
        this.submit.emit();
    }
}
