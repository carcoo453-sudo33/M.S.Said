export interface Notification {
  id?: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  icon?: string;
  isRead: boolean;
  createdAt: Date;
  relatedEntityId?: string;
  relatedEntityType?: string;
  senderName?: string;
  senderEmail?: string;
}

export interface NotificationStats {
  totalCount: number;
  unreadCount: number;
}
