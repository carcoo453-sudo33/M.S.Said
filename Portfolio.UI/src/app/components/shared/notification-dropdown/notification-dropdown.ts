import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Bell, Check, CheckCheck, Trash2, X, Mail, MessageCircle, CornerDownRight, MessageSquare, Eye, BookOpen } from 'lucide-angular';
import { NotificationService } from '../../../services/notification.service';
import { ContactService } from '../../../services/contact.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-notification-dropdown',
  standalone: true,
  imports: [CommonModule, TranslateModule, LucideAngularModule],
  template: `
    <div class="relative">
      <!-- Notification Bell Icon -->
      <button
        (click)="toggleDropdown()"
        class="relative w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all border border-zinc-200 dark:border-zinc-800">
        <lucide-icon [img]="BellIcon" class="w-5 h-5"></lucide-icon>
        
        <!-- Unread Badge -->
        <span *ngIf="notificationService.unreadCount() > 0"
          class="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">
          {{ notificationService.unreadCount() > 99 ? '99+' : notificationService.unreadCount() }}
        </span>
      </button>

      <!-- Dropdown Menu -->
      <div *ngIf="isOpen()"
        class="absolute mt-2 w-96 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden z-50 animate-notification-fade-in-up ltr:right-0 rtl:left-0">
        
        <!-- Header -->
        <div class="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h3 class="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-white">
              {{ 'notifications.title' | translate }}
            </h3>
            <p class="text-xs text-zinc-500 mt-0.5">
              {{ notificationService.unreadCount() }} {{ 'notifications.unread' | translate }}
            </p>
          </div>
          
          <div class="flex items-center gap-2">
            <button *ngIf="notificationService.unreadCount() > 0"
              (click)="markAllAsRead()"
              class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-green-600 transition-all"
              [title]="'notifications.markAllRead' | translate">
              <lucide-icon [img]="CheckCheckIcon" class="w-4 h-4"></lucide-icon>
            </button>
            
            <button
              (click)="closeDropdown()"
              class="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-red-600 transition-all">
              <lucide-icon [img]="XIcon" class="w-4 h-4"></lucide-icon>
            </button>
          </div>
        </div>

        <!-- Notifications List -->
        <div class="max-h-96 overflow-y-auto notification-scrollbar">
          <!-- Loading State -->
          <div *ngIf="notificationService.isLoading()" class="p-8 text-center">
            <div class="animate-spin w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full mx-auto"></div>
            <p class="text-xs text-zinc-500 mt-3">{{ 'notifications.loading' | translate }}</p>
          </div>

          <!-- Empty State -->
          <div *ngIf="!notificationService.isLoading() && notificationService.notifications().length === 0"
            class="p-8 text-center">
            <lucide-icon [img]="BellIcon" class="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-3"></lucide-icon>
            <p class="text-sm font-bold text-zinc-500">{{ 'notifications.empty' | translate }}</p>
          </div>

          <!-- Notification Items -->
          <div *ngFor="let notification of notificationService.notifications()"
            (click)="handleNotificationClick(notification)"
            class="p-4 border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all group cursor-pointer"
            [class.bg-blue-50]="!notification.isRead"
            [class.dark:bg-blue-950/20]="!notification.isRead">
            
            <div class="flex items-start gap-3">
              <!-- Icon -->
              <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                [class]="getIconClass(notification.type)">
                <lucide-icon [img]="getIcon(notification.type)" class="w-5 h-5"></lucide-icon>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <h4 class="text-sm font-bold text-zinc-900 dark:text-white line-clamp-1">
                    {{ notification.title }}
                  </h4>
                  <span *ngIf="!notification.isRead"
                    class="w-2 h-2 bg-blue-600 rounded-full shrink-0 mt-1.5"></span>
                </div>
                
                <p class="text-xs text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-2">
                  {{ notification.message }}
                </p>
                
                <div class="flex items-center justify-between mt-2">
                  <span class="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    {{ notificationService.getTimeAgo(notification.createdAt) }}
                  </span>
                  
                  <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button *ngIf="!notification.isRead"
                      (click)="markAsRead(notification.id!); $event.stopPropagation()"
                      class="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-green-600 transition-all"
                      [title]="'notifications.markRead' | translate">
                      <lucide-icon [img]="CheckIcon" class="w-3.5 h-3.5"></lucide-icon>
                    </button>
                    
                    <button
                      (click)="deleteNotification(notification.id!); $event.stopPropagation()"
                      class="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-red-600 transition-all"
                      [title]="'notifications.delete' | translate">
                      <lucide-icon [img]="TrashIcon" class="w-3.5 h-3.5"></lucide-icon>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div *ngIf="notificationService.notifications().length > 0"
          class="p-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <button
            (click)="clearAll()"
            class="text-xs font-bold uppercase tracking-widest text-red-600 hover:text-red-700 transition-all">
            {{ 'notifications.clearAll' | translate }}
          </button>
          
          <span class="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            {{ notificationService.notifications().length }} {{ 'notifications.total' | translate }}
          </span>
        </div>
      </div>
    </div>

    <!-- Backdrop -->
    <div *ngIf="isOpen()"
      (click)="closeDropdown()"
      class="fixed inset-0 z-40"></div>

    <!-- Message Detail Modal -->
    <div *ngIf="selectedMessage()" class="modal-overlay" (click)="closeMessageModal()">
      <div class="modal-content max-w-3xl mt-20 max-h-[90vh]" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="sticky top-0 bg-gradient-to-r from-red-600 to-red-700 border-b border-red-700 p-6 flex items-center justify-between z-10">
          <div>
            <h2 class="text-xl font-black uppercase tracking-tight text-white">
              Contact Message
            </h2>
            <p class="text-xs text-red-100 mt-1 uppercase tracking-widest">
              {{ notificationService.getTimeAgo(selectedMessage()!.createdAt) }}
            </p>
          </div>
          <button
            (click)="closeMessageModal()"
            class="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all">
            <lucide-icon [img]="XIcon" class="w-5 h-5"></lucide-icon>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          <!-- Sender Info -->
          <div class="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p class="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">From</p>
                <p class="text-lg font-bold text-zinc-900 dark:text-white">{{ selectedMessage()!.senderName }}</p>
              </div>
              <div>
                <p class="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Email</p>
                <a [href]="'mailto:' + selectedMessage()!.senderEmail"
                  class="text-lg font-bold text-red-600 hover:text-red-700 transition-colors break-all">
                  {{ selectedMessage()!.senderEmail }}
                </a>
              </div>
            </div>
            
            <div class="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
              <p class="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Subject</p>
              <p class="text-base font-bold text-zinc-900 dark:text-white">{{ selectedMessage()!.title.replace('New Contact Message from ' + selectedMessage()!.senderName, selectedMessage()!.message) }}</p>
            </div>
          </div>

          <!-- Message Content -->
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3">Message</p>
            <div class="bg-white dark:bg-zinc-950 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
              <p class="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">{{ getFullMessage() }}</p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="sticky bottom-0 p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-between gap-4">
          <button
            (click)="closeMessageModal()"
            class="px-6 py-3 rounded-xl bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold text-sm uppercase tracking-widest hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-all">
            Close
          </button>
          <a [href]="'mailto:' + selectedMessage()!.senderEmail"
            class="px-6 py-3 rounded-xl bg-red-600 text-white font-bold text-sm uppercase tracking-widest hover:bg-red-700 transition-all flex items-center gap-2">
            <lucide-icon [img]="MailIcon" class="w-4 h-4"></lucide-icon>
            Reply
          </a>
        </div>
      </div>
    </div>
  `
})
export class NotificationDropdownComponent implements OnInit {
  public notificationService = inject(NotificationService);
  private contactService = inject(ContactService);
  private toast = inject(ToastService);

  isOpen = signal(false);
  selectedMessage = signal<any>(null);
  fullMessageContent = signal<string>('');

  // Icons
  BellIcon = Bell;
  CheckIcon = Check;
  CheckCheckIcon = CheckCheck;
  TrashIcon = Trash2;
  XIcon = X;
  MailIcon = Mail;
  MessageCircleIcon = MessageCircle;
  CornerDownRightIcon = CornerDownRight;
  MessageSquareIcon = MessageSquare;
  EyeIcon = Eye;
  BookOpenIcon = BookOpen;

  ngOnInit() {
    // Load initial stats
    this.notificationService.loadStats();
  }

  toggleDropdown() {
    if (!this.isOpen()) {
      // Load notifications when opening
      this.notificationService.getNotifications().subscribe();
    }
    this.isOpen.set(!this.isOpen());
  }

  closeDropdown() {
    this.isOpen.set(false);
  }

  markAsRead(id: string) {
    this.notificationService.markAsRead(id).subscribe({
      error: (err) => console.error('Failed to mark notification as read:', err)
    });
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead().subscribe({
      error: (err) => console.error('Failed to mark all as read:', err)
    });
  }

  deleteNotification(id: string) {
    this.notificationService.deleteNotification(id).subscribe({
      error: (err) => console.error('Failed to delete notification:', err)
    });
  }

  clearAll() {
    // Show confirmation toast and proceed with clearing
    this.notificationService.clearAll().subscribe({
      next: () => {
        this.toast.success('All notifications cleared');
      },
      error: (err) => {
        console.error('Failed to clear notifications:', err);
        this.toast.error('Failed to clear notifications');
      }
    });
  }

  getIcon(type: string): any {
    switch (type) {
      case 'ContactForm':
        return this.MailIcon;
      case 'Comment':
        return this.MessageCircleIcon;
      case 'Reply':
        return this.CornerDownRightIcon;
      case 'WhatsApp':
        return this.MessageSquareIcon;
      case 'ProjectView':
        return this.EyeIcon;
      case 'BlogView':
        return this.BookOpenIcon;
      default:
        return this.BellIcon;
    }
  }

  getIconClass(type: string): string {
    switch (type) {
      case 'ContactForm':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600';
      case 'Comment':
        return 'bg-green-100 dark:bg-green-900/30 text-green-600';
      case 'Reply':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600';
      case 'WhatsApp':
        return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600';
      case 'ProjectView':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-600';
      case 'BlogView':
        return 'bg-pink-100 dark:bg-pink-900/30 text-pink-600';
      default:
        return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600';
    }
  }

  handleNotificationClick(notification: any) {
    // Mark as read
    if (!notification.isRead) {
      this.markAsRead(notification.id!);
    }

    // If it's a contact form notification, fetch and show the full message
    if (notification.type === 'ContactForm' && notification.relatedEntityId) {
      this.contactService.getMessageById(notification.relatedEntityId).subscribe({
        next: (message) => {
          this.selectedMessage.set({
            ...notification,
            fullMessage: message.message
          });
          this.fullMessageContent.set(message.message);
        },
        error: (err) => {
          console.error('Failed to fetch message:', err);
          // Show notification details anyway
          this.selectedMessage.set(notification);
        }
      });
    }
  }

  closeMessageModal() {
    this.selectedMessage.set(null);
    this.fullMessageContent.set('');
  }

  getFullMessage(): string {
    return this.fullMessageContent() || this.selectedMessage()?.message || '';
  }
}
