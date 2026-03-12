import { CommentReply } from './comment-reply.model';

export interface Comment {
    id: string;
    author: string;
    avatarUrl: string;
    date: string;
    content: string;
    likes: number;
    replies: CommentReply[];
}
